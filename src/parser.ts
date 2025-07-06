/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */

import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import path from 'path';
import {
  ParsedFunction,
  Parameter,
  ParsedFile,
  ParseOptions,
  ParsedClass,
  ParsedMethod,
  ExportMetadata,
} from './types';

const DEFAULT_PARSE_OPTIONS: ParseOptions = {
  sourceType: 'module',
  plugins: ['typescript', 'jsx', 'decorators-legacy', 'classProperties'],
};

export function parseFile(filePath: string, content: string): ParsedFile {
  if (!content.trim()) {
    throw new Error(`File is empty: ${filePath}`);
  }

  try {
    const ast = parse(content, DEFAULT_PARSE_OPTIONS);
    const functions = extractExportedFunctions(ast);
    const classes = extractExportedClasses(ast);
    const exportMetadata = generateExportMetadata(functions, classes, ast);

    return {
      fileName: path.basename(filePath),
      filePath: path.resolve(filePath),
      functions,
      classes,
      exportMetadata,
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
        const func = parseFunctionDeclaration(
          path.node.declaration,
          false,
          path
        );
        if (func) {
          functions.push(func);
        }
      }
      // Handle export const arrowFunction = () => {}
      if (t.isVariableDeclaration(path.node.declaration)) {
        path.node.declaration.declarations.forEach(declarator => {
          if (
            t.isIdentifier(declarator.id) &&
            (t.isArrowFunctionExpression(declarator.init) ||
              t.isFunctionExpression(declarator.init))
          ) {
            const func = parseArrowFunction(
              declarator.id.name,
              declarator.init
            );
            if (func) {
              functions.push(func);
            }
          }
        });
      }
    },

    ExportDefaultDeclaration(path) {
      if (t.isFunctionDeclaration(path.node.declaration)) {
        const func = parseFunctionDeclaration(
          path.node.declaration,
          true,
          path
        );
        if (func) {
          functions.push(func);
        }
      }
    },
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
    },
  });

  return classes;
}

function parseFunctionDeclaration(
  node: t.FunctionDeclaration,
  isDefault: boolean,
  path?: NodePath
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
    jsDoc,
  };
}

function parseArrowFunction(
  name: string,
  node: t.ArrowFunctionExpression | t.FunctionExpression
): ParsedFunction | null {
  const params = parseParameters(node.params);
  const returnType = parseArrowReturnType(node);
  const signature = `export const ${name} = (${params
    .map(p => {
      const optional = p.optional ? '?' : '';
      const type = p.type ? `: ${p.type}` : '';
      return `${p.name}${optional}${type}`;
    })
    .join(', ')})${returnType ? `: ${returnType}` : ''} => {}`;

  return {
    name,
    signature,
    isDefault: false,
    params,
    returnType,
  };
}

function parseParameters(
  params: (t.Identifier | t.Pattern | t.RestElement | t.TSParameterProperty)[]
): Parameter[] {
  return params.map(param => {
    if (t.isIdentifier(param)) {
      return {
        name: param.name,
        type: param.typeAnnotation
          ? getTypeAnnotation(param.typeAnnotation)
          : undefined,
        optional: param.optional || false,
      };
    }

    if (t.isAssignmentPattern(param) && t.isIdentifier(param.left)) {
      return {
        name: param.left.name,
        type: param.left.typeAnnotation
          ? getTypeAnnotation(param.left.typeAnnotation)
          : undefined,
        optional: true,
      };
    }

    return {
      name: 'param',
      optional: false,
    };
  });
}

function getTypeAnnotation(
  typeAnnotation: t.TypeAnnotation | t.TSTypeAnnotation | t.Noop
): string {
  if (t.isTSTypeAnnotation(typeAnnotation)) {
    return getTypeString(typeAnnotation.typeAnnotation);
  }
  return 'unknown';
}

function getTypeString(type: t.TSType): string {
  // Primitive types
  if (t.isTSStringKeyword(type)) return 'string';
  if (t.isTSNumberKeyword(type)) return 'number';
  if (t.isTSBooleanKeyword(type)) return 'boolean';
  if (t.isTSVoidKeyword(type)) return 'void';
  if (t.isTSUndefinedKeyword(type)) return 'undefined';
  if (t.isTSNullKeyword(type)) return 'null';
  if (t.isTSAnyKeyword(type)) return 'any';
  
  // Array types
  if (t.isTSArrayType(type)) {
    return `${getTypeString(type.elementType)}[]`;
  }
  
  // Promise and generic types
  if (t.isTSTypeReference(type)) {
    if (t.isIdentifier(type.typeName)) {
      const typeName = type.typeName.name;
      
      if (type.typeParameters && type.typeParameters.params.length > 0) {
        const params = type.typeParameters.params
          .map(param => getTypeString(param))
          .join(', ');
        return `${typeName}<${params}>`;
      }
      
      return typeName;
    }
    
    if (t.isTSQualifiedName(type.typeName)) {
      return getQualifiedTypeName(type.typeName);
    }
  }
  
  // Union types (e.g., 'light' | 'dark')
  if (t.isTSUnionType(type)) {
    const types = type.types.map(t => getTypeString(t)).join(' | ');
    return types;
  }
  
  // Intersection types (e.g., User & { id: string })
  if (t.isTSIntersectionType(type)) {
    const types = type.types.map(t => getTypeString(t)).join(' & ');
    return types;
  }
  
  // Literal types
  if (t.isTSLiteralType(type)) {
    if (t.isStringLiteral(type.literal)) {
      return `'${type.literal.value}'`;
    }
    if (t.isNumericLiteral(type.literal)) {
      return type.literal.value.toString();
    }
    if (t.isBooleanLiteral(type.literal)) {
      return type.literal.value.toString();
    }
  }
  
  // Object types
  if (t.isTSTypeLiteral(type)) {
    if (type.members.length === 0) {
      return '{}';
    }
    // For complex objects, just return a simplified representation
    return '{ ... }';
  }
  
  // Function types
  if (t.isTSFunctionType(type)) {
    const params = type.parameters
      .map(param => {
        if (t.isIdentifier(param) && param.typeAnnotation) {
          const paramType = t.isTSTypeAnnotation(param.typeAnnotation) 
            ? getTypeString(param.typeAnnotation.typeAnnotation)
            : 'unknown';
          return `${param.name}: ${paramType}`;
        }
        return 'param: unknown';
      })
      .join(', ');
    
    const returnType = type.typeAnnotation 
      ? getTypeString(type.typeAnnotation.typeAnnotation)
      : 'unknown';
    
    return `(${params}) => ${returnType}`;
  }
  
  // Tuple types
  if (t.isTSTupleType(type)) {
    const elements = type.elementTypes.map(el => {
      if (t.isTSNamedTupleMember(el)) {
        return `${el.label.name}: ${getTypeString(el.elementType)}`;
      }
      return getTypeString(el);
    }).join(', ');
    return `[${elements}]`;
  }
  
  // Conditional types and other complex types
  if (t.isTSConditionalType(type)) {
    return 'ConditionalType';
  }
  
  if (t.isTSMappedType(type)) {
    return 'MappedType';
  }
  
  return 'unknown';
}

/**
 * Helper function to extract qualified type names (e.g., React.Component)
 */
function getQualifiedTypeName(qualifiedName: t.TSQualifiedName): string {
  if (t.isIdentifier(qualifiedName.left) && t.isIdentifier(qualifiedName.right)) {
    return `${qualifiedName.left.name}.${qualifiedName.right.name}`;
  }
  if (t.isTSQualifiedName(qualifiedName.left) && t.isIdentifier(qualifiedName.right)) {
    return `${getQualifiedTypeName(qualifiedName.left)}.${qualifiedName.right.name}`;
  }
  return 'QualifiedType';
}

function parseReturnType(node: t.FunctionDeclaration): string | undefined {
  if (node.returnType && t.isTSTypeAnnotation(node.returnType)) {
    return getTypeString(node.returnType.typeAnnotation);
  }
  return undefined;
}

function parseArrowReturnType(
  node: t.ArrowFunctionExpression | t.FunctionExpression
): string | undefined {
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
  const paramStr = params
    .map(p => {
      const optional = p.optional ? '?' : '';
      const type = p.type ? `: ${p.type}` : '';
      return `${p.name}${optional}${type}`;
    })
    .join(', ');

  const returnStr = returnType ? `: ${returnType}` : '';
  const exportKeyword = isDefault
    ? 'export default function'
    : 'export function';
  const funcName = isDefault ? '' : ` ${name}`;

  return `${exportKeyword}${funcName}(${paramStr})${returnStr}`;
}

function parseClassDeclaration(
  node: t.ClassDeclaration,
  path: NodePath,
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
    jsDoc,
  };
}

function parseClassMethods(body: (t.ClassMethod | t.Node)[]): ParsedMethod[] {
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
    jsDoc: undefined, // JSDoc for methods will be extracted separately if needed
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
  const paramStr = params
    .map(p => {
      const optional = p.optional ? '?' : '';
      const type = p.type ? `: ${p.type}` : '';
      return `${p.name}${optional}${type}`;
    })
    .join(', ');

  const returnStr = returnType ? `: ${returnType}` : '';
  return `${name}(${paramStr})${returnStr}`;
}

function extractJSDoc(path: NodePath): string | undefined {
  // For ExportNamedDeclaration, check the declaration's leading comments first
  if (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (path.node as any).declaration &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (path.node as any).declaration.leadingComments
  ) {
    // Get the last JSDoc comment (the one immediately before the declaration)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsDocComments = (path.node as any).declaration.leadingComments.filter(
      (comment: t.Comment) =>
        comment.type === 'CommentBlock' && comment.value.startsWith('*')
    );

    if (jsDocComments.length > 0) {
      const lastJsDoc = jsDocComments[jsDocComments.length - 1];
      // Clean up the JSDoc value - remove leading * if present
      const cleanValue = lastJsDoc.value.startsWith('*') 
        ? lastJsDoc.value.substring(1) 
        : lastJsDoc.value;
      return `/**${cleanValue}*/`;
    }
  }

  // If no declaration comments, check the export node itself
  if (path.node.leadingComments) {
    const jsDocComments = path.node.leadingComments.filter(
      (comment: t.Comment) =>
        comment.type === 'CommentBlock' && comment.value.startsWith('*')
    );

    if (jsDocComments.length > 0) {
      const lastJsDoc = jsDocComments[jsDocComments.length - 1];
      // Clean up the JSDoc value - remove leading * if present
      const cleanValue = lastJsDoc.value.startsWith('*') 
        ? lastJsDoc.value.substring(1) 
        : lastJsDoc.value;
      return `/**${cleanValue}*/`;
    }
  }

  return undefined;
}

function generateExportMetadata(
  functions: ParsedFunction[],
  classes: ParsedClass[],
  ast: t.File
): ExportMetadata {
  let hasDefaultExport = false;
  let defaultExportType: 'function' | 'class' | undefined;
  let defaultExportName: string | undefined;

  // Check for default exports in functions
  const defaultFunction = functions.find(f => f.isDefault);
  if (defaultFunction) {
    hasDefaultExport = true;
    defaultExportType = 'function';
    defaultExportName =
      defaultFunction.name === 'default' ? 'function' : defaultFunction.name;
  }

  // Check for default exports in classes
  const defaultClass = classes.find(c => c.name === 'default');
  if (defaultClass) {
    hasDefaultExport = true;
    defaultExportType = 'class';
    defaultExportName = 'class';
  }

  // If no default found in our parsed data, traverse AST to check for other default exports
  if (!hasDefaultExport) {
    traverse(ast, {
      ExportDefaultDeclaration(path) {
        hasDefaultExport = true;
        if (t.isFunctionDeclaration(path.node.declaration)) {
          defaultExportType = 'function';
          defaultExportName = path.node.declaration.id?.name || 'function';
        } else if (t.isClassDeclaration(path.node.declaration)) {
          defaultExportType = 'class';
          defaultExportName = path.node.declaration.id?.name || 'class';
        }
      },
    });
  }

  return {
    totalFunctions: functions.length,
    totalClasses: classes.length,
    hasDefaultExport,
    defaultExportType,
    defaultExportName,
  };
}
