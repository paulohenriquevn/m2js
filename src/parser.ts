import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { ParsedFunction, Parameter, ParsedFile, ParseOptions } from './types';

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
    
    return {
      fileName: filePath,
      functions
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
        const func = parseFunctionDeclaration(path.node.declaration, false);
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
        const func = parseFunctionDeclaration(path.node.declaration, true);
        if (func) {
          functions.push(func);
        }
      }
    }
  });

  return functions;
}

function parseFunctionDeclaration(
  node: t.FunctionDeclaration, 
  isDefault: boolean
): ParsedFunction | null {
  if (!node.id && !isDefault) {
    return null;
  }

  const name = isDefault ? 'default' : node.id?.name || 'anonymous';
  const params = parseParameters(node.params);
  const returnType = parseReturnType(node);
  const signature = generateSignature(name, params, returnType, isDefault);

  return {
    name,
    signature,
    isDefault,
    params,
    returnType
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