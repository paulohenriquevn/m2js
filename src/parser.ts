import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { ParsedFunction, Parameter, ParsedFile, ParseOptions, ParsedClass, ParsedMethod } from './types';

const DEFAULT_PARSE_OPTIONS: ParseOptions = {
  sourceType: 'module',
  plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties']
};

export function parseFile(filePath: string, content: string): ParsedFile {
  if (!content.trim()) {
    throw new Error(`File is empty: ${filePath}`);
  }

  try {
    const ast = parse(content, DEFAULT_PARSE_OPTIONS);
    const functions = extractExportedFunctions(ast);
    const classes = extractExportedClasses(ast);
    
    return {
      fileName: filePath,
      functions,
      classes
    };
  } catch (error) {
    throw new Error(`Parse error in ${filePath}: ${(error as Error).message}`);
  }
}

function extractExportedFunctions(ast: t.File): ParsedFunction[] {
  const functions: ParsedFunction[] = [];

  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (t.isFunctionDeclaration(path.node.declaration)) {
        const func = parseFunctionDeclaration(path.node.declaration, false, path);
        if (func) {
          functions.push(func);
        }
      }
      // Handle export const arrowFunction = () => {}
      if (t.isVariableDeclaration(path.node.declaration)) {
        path.node.declaration.declarations.forEach(declarator => {
          if (t.isIdentifier(declarator.id) && 
              (t.isArrowFunctionExpression(declarator.init) || t.isFunctionExpression(declarator.init))) {
            const func = parseArrowFunction(declarator.id.name, declarator.init);
            if (func) {
              functions.push(func);
            }
          }
        });
      }
    },
    
    ExportDefaultDeclaration(path) {
      if (t.isFunctionDeclaration(path.node.declaration)) {
        const func = parseFunctionDeclaration(path.node.declaration, true, path);
        if (func) {
          functions.push(func);
        }
      }
    }
  });

  return functions;
}

function extractExportedClasses(ast: t.File): ParsedClass[] {
  const classes: ParsedClass[] = [];

  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (t.isClassDeclaration(path.node.declaration)) {
        const cls = parseClassDeclaration(path.node.declaration, path);
        if (cls) {
          classes.push(cls);
        }
      }
    },
    
    ExportDefaultDeclaration(path) {
      if (t.isClassDeclaration(path.node.declaration)) {
        const cls = parseClassDeclaration(path.node.declaration, path, true);
        if (cls) {
          classes.push(cls);
        }
      }
    }
  });

  return classes;
}

function parseFunctionDeclaration(
  node: t.FunctionDeclaration, 
  isDefault: boolean,
  path?: any
): ParsedFunction | null {
  if (!node.id && !isDefault) {
    return null;
  }

  const name = isDefault ? 'default' : node.id?.name || 'anonymous';
  const params = parseParameters(node.params);
  const returnType = parseReturnType(node);
  const signature = generateSignature(name, params, returnType, isDefault);
  const jsDoc = path ? extractJSDoc(path) : undefined;

  return {
    name,
    signature,
    isDefault,
    params,
    returnType,
    jsDoc
  };
}

function parseArrowFunction(
  name: string,
  node: t.ArrowFunctionExpression | t.FunctionExpression
): ParsedFunction | null {
  const params = parseParameters(node.params);
  const returnType = parseArrowReturnType(node);
  const signature = `export const ${name} = (${params.map(p => {
    const optional = p.optional ? '?' : '';
    const type = p.type ? `: ${p.type}` : '';
    return `${p.name}${optional}${type}`;
  }).join(', ')})${returnType ? `: ${returnType}` : ''} => {}`;

  return {
    name,
    signature,
    isDefault: false,
    params,
    returnType
  };
}

function parseParameters(params: (t.Identifier | t.Pattern | t.RestElement | t.TSParameterProperty)[]): Parameter[] {
  return params.map(param => {
    if (t.isIdentifier(param)) {
      return {
        name: param.name,
        type: param.typeAnnotation ? getTypeAnnotation(param.typeAnnotation) : undefined,
        optional: param.optional || false
      };
    }
    
    if (t.isAssignmentPattern(param) && t.isIdentifier(param.left)) {
      return {
        name: param.left.name,
        type: param.left.typeAnnotation ? getTypeAnnotation(param.left.typeAnnotation) : undefined,
        optional: true
      };
    }

    return {
      name: 'param',
      optional: false
    };
  });
}

function getTypeAnnotation(typeAnnotation: t.TypeAnnotation | t.TSTypeAnnotation | t.Noop): string {
  if (t.isTSTypeAnnotation(typeAnnotation)) {
    return getTypeString(typeAnnotation.typeAnnotation);
  }
  return 'unknown';
}

function getTypeString(type: t.TSType): string {
  if (t.isTSStringKeyword(type)) return 'string';
  if (t.isTSNumberKeyword(type)) return 'number';
  if (t.isTSBooleanKeyword(type)) return 'boolean';
  if (t.isTSArrayType(type)) return `${getTypeString(type.elementType)}[]`;
  if (t.isTSTypeReference(type) && t.isIdentifier(type.typeName)) {
    return type.typeName.name;
  }
  return 'unknown';
}

function parseReturnType(node: t.FunctionDeclaration): string | undefined {
  if (node.returnType && t.isTSTypeAnnotation(node.returnType)) {
    return getTypeString(node.returnType.typeAnnotation);
  }
  return undefined;
}

function parseArrowReturnType(node: t.ArrowFunctionExpression | t.FunctionExpression): string | undefined {
  if (node.returnType && t.isTSTypeAnnotation(node.returnType)) {
    return getTypeString(node.returnType.typeAnnotation);
  }
  return undefined;
}

function generateSignature(
  name: string, 
  params: Parameter[], 
  returnType?: string, 
  isDefault = false
): string {
  const paramStr = params.map(p => {
    const optional = p.optional ? '?' : '';
    const type = p.type ? `: ${p.type}` : '';
    return `${p.name}${optional}${type}`;
  }).join(', ');

  const returnStr = returnType ? `: ${returnType}` : '';
  const exportKeyword = isDefault ? 'export default function' : 'export function';
  const funcName = isDefault ? '' : ` ${name}`;
  
  return `${exportKeyword}${funcName}(${paramStr})${returnStr}`;
}

function parseClassDeclaration(
  node: t.ClassDeclaration,
  path: any,
  isDefault = false
): ParsedClass | null {
  if (!node.id && !isDefault) {
    return null;
  }

  const name = isDefault ? 'default' : node.id?.name || 'anonymous';
  const methods = parseClassMethods(node.body.body);
  const jsDoc = extractJSDoc(path);

  return {
    name,
    methods,
    jsDoc
  };
}

function parseClassMethods(body: t.ClassMethod[] | any[]): ParsedMethod[] {
  const methods: ParsedMethod[] = [];

  body.forEach(member => {
    if (t.isClassMethod(member) && member.kind === 'method') {
      const method = parseClassMethod(member);
      if (method) {
        methods.push(method);
      }
    }
  });

  return methods;
}

function parseClassMethod(node: t.ClassMethod): ParsedMethod | null {
  if (!t.isIdentifier(node.key)) {
    return null;
  }

  const name = node.key.name;
  const isPrivate = node.accessibility === 'private' || name.startsWith('_');
  const params = parseParameters(node.params);
  const returnType = parseMethodReturnType(node);
  const signature = generateMethodSignature(name, params, returnType);

  return {
    name,
    signature,
    params,
    returnType,
    isPrivate,
    jsDoc: undefined // JSDoc for methods will be extracted separately if needed
  };
}

function parseMethodReturnType(node: t.ClassMethod): string | undefined {
  if (node.returnType && t.isTSTypeAnnotation(node.returnType)) {
    return getTypeString(node.returnType.typeAnnotation);
  }
  return undefined;
}

function generateMethodSignature(
  name: string,
  params: Parameter[],
  returnType?: string
): string {
  const paramStr = params.map(p => {
    const optional = p.optional ? '?' : '';
    const type = p.type ? `: ${p.type}` : '';
    return `${p.name}${optional}${type}`;
  }).join(', ');

  const returnStr = returnType ? `: ${returnType}` : '';
  return `${name}(${paramStr})${returnStr}`;
}

function extractJSDoc(path: any): string | undefined {
  // For ExportNamedDeclaration, check the declaration's leading comments first
  if (path.node.declaration && path.node.declaration.leadingComments) {
    // Get the last JSDoc comment (the one immediately before the declaration)
    const jsDocComments = path.node.declaration.leadingComments.filter((comment: any) => 
      comment.type === 'CommentBlock' && comment.value.startsWith('*')
    );
    
    if (jsDocComments.length > 0) {
      const lastJsDoc = jsDocComments[jsDocComments.length - 1];
      return `/**${lastJsDoc.value}*/`;
    }
  }
  
  // If no declaration comments, check the export node itself
  if (path.node.leadingComments) {
    const jsDocComments = path.node.leadingComments.filter((comment: any) => 
      comment.type === 'CommentBlock' && comment.value.startsWith('*')
    );
    
    if (jsDocComments.length > 0) {
      const lastJsDoc = jsDocComments[jsDocComments.length - 1];
      return `/**${lastJsDoc.value}*/`;
    }
  }
  
  return undefined;
}