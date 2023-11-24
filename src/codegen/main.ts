import { BuiltinZeroArgs, FieldCurlyExprDef, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr, CompareExpr, Expression as ParserExpression } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnionTypeDeclaration, toCode, GenDeclaration, toCodeArray, TypeWithParameters, ArrowFunctionExpression } from './tsgen'
import { TLBMathExpr, TLBVarExpr, TLBNumberExpr, TLBBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue, deriveMathExpression } from './util'
import { constructorNodes } from '../parsing'
import { handleCombinator } from './combinator'
import { FunctionDeclaration } from '@babel/types'
import { handleField } from './field'
import { getParamVarExpr, getSubStructName } from './helpers'

export type ConstructorTag = {
  bitLen: number,
  binary: string
}

export function getConstructorTag(tag: string | null): ConstructorTag | null {
  if (tag == undefined) {
    return null;
  }
  if (tag[0] == '$') {

  }
  return {
    bitLen: tag?.length - 1,
    binary: '0b' + tag.slice(1)
  }
}

export function generate(tree: Program) {
  let jsCodeDeclarations: GenDeclaration[] = []
  jsCodeDeclarations.push(tImportDeclaration(tIdentifier('Builder'), tStringLiteral('ton'))) // importDeclaration([importSpecifier(identifier('Builder'), identifier('Builder'))], stringLiteral('../boc/Builder')))
  jsCodeDeclarations.push(tImportDeclaration(tIdentifier('Slice'), tStringLiteral('ton')))  // importDeclaration([importSpecifier(identifier('Slice'), identifier('Slice'))], stringLiteral('../boc/Slice')))
  jsCodeDeclarations.push(tImportDeclaration(tIdentifier('beginCell'), tStringLiteral('ton')))
  jsCodeDeclarations.push(tImportDeclaration(tIdentifier('BitString'), tStringLiteral('ton')))


  let tlbCode: TLBCode = { types: new Map<string, TLBType>() }

  fillConstructors(tree.declarations, tlbCode);

  tlbCode.types.forEach((tlbType: TLBType, combinatorName: string) => {
    let variableCombinatorName = combinatorName.charAt(0).toLowerCase() + combinatorName.slice(1)
    if (combinatorName == undefined) {
      return;
    }
    let subStructsUnion: TypeExpression[] = []
    let subStructDeclarations: GenDeclaration[] = []

    let loadStatements: Statement[] = []
    let storeStatements: Statement[] = []

    let structTypeParametersExpr: TypeParametersExpression = tTypeParametersExpression([]);

    tlbType.constructors.forEach(constructor => {

      let constructorLoadStatements: Statement[] = []
      let declaration = constructor.declaration;
      let subStructName: string = getSubStructName(tlbType, constructor);

      let variableSubStructName = firstLower(subStructName)

      let subStructProperties: TypedIdentifier[] = [tTypedIdentifier(tIdentifier('kind'), tStringLiteral(subStructName))]
      let subStructLoadProperties: ObjectProperty[] = [tObjectProperty(tIdentifier('kind'), tStringLiteral(subStructName))]
      let subStructStoreStatements: Statement[] = []

      let tag = getConstructorTag(declaration?.constructorDef.tag);
      if (tag == undefined) {
        return;
      }

      structTypeParametersExpr = getTypeParametersExpression(constructor.parameters);

      let slicePrefix: number[] = [0];

      constructor.variables.forEach((variable) => {
        if (variable.negated) {
          if (variable.deriveExpr) {
            subStructLoadProperties.push(tObjectProperty(tIdentifier(variable.name), convertToAST(variable.deriveExpr, constructor)));
          }
        }
      })

      declaration?.fields.forEach(element => { handleField(element, slicePrefix, tlbCode, constructor, constructorLoadStatements, subStructStoreStatements, subStructProperties, subStructLoadProperties, variableCombinatorName, variableSubStructName, jsCodeDeclarations) })

      subStructsUnion.push(tTypeWithParameters(tIdentifier(subStructName), structTypeParametersExpr));

      let structX = tStructDeclaration(tIdentifier(subStructName), subStructProperties, structTypeParametersExpr);

      constructorLoadStatements.push(tReturnStatement(tObjectExpression(subStructLoadProperties)));
      if (tlbType.constructors.length > 1) {
        let conditions: Array<BinaryExpression> = []
        if (tag.binary[tag.binary.length - 1] != '_') {
          conditions.push(tBinaryExpression(tFunctionCall(tMemberExpression(tIdentifier('slice'), tIdentifier('preloadUint')), [tNumericLiteral(tag.bitLen)]), '==', tIdentifier(tag.binary)))
          let loadBitsStatement: Statement[] = [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('slice'), tIdentifier('loadUint')), [tNumericLiteral(tag.bitLen)]))]
          constructorLoadStatements = loadBitsStatement.concat(constructorLoadStatements);
        }
        constructor.parameters.forEach(param => {
          if (param.variable.const && !param.variable.negated) {
            let argName = param.variable.name;
            if (param.argName) {
              argName = param.argName
            }
            conditions.push(tBinaryExpression(tIdentifier(argName), '==', getParamVarExpr(param, constructor)))
          }
        });
        loadStatements.push(tIfStatement(getCondition(conditions), constructorLoadStatements))
      } else {
        loadStatements = loadStatements.concat(constructorLoadStatements);
      }

      if (tlbType.constructors.length > 1 && tag.binary[tag.binary.length - 1] != '_') {
        let preStoreStatement: Statement[] = [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('storeUint')), [tIdentifier(tag.binary), tNumericLiteral(tag.bitLen)]))];
        subStructStoreStatements = preStoreStatement.concat(subStructStoreStatements)
      }
      let storeStatement: Statement = tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], subStructStoreStatements));
      if (tlbType.constructors.length > 1) {
        storeStatement = tIfStatement(tBinaryExpression(tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier('kind')), '==', tStringLiteral(subStructName)), [storeStatement])
      }
      storeStatements.push(storeStatement);

      subStructDeclarations.push(structX)
    });


    // loadTheType: (slice: Slice) => TheType

    if (tlbType.constructors.length > 1) {
      loadStatements.push(tExpressionStatement(tIdentifier("throw new Error('')")))
      storeStatements.push(tExpressionStatement(tIdentifier("throw new Error('')")))
    }

    let loadFunctionParameters = [tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))]
    let storeFunctionParameters = [tTypedIdentifier(tIdentifier(variableCombinatorName), tTypeWithParameters(tIdentifier(combinatorName), structTypeParametersExpr))]

    let anyConstructor = tlbType.constructors[0];
    if (anyConstructor) {
      anyConstructor.parameters.forEach(element => {
        if (element.variable.type == 'Type') {
          loadFunctionParameters.push(tTypedIdentifier(tIdentifier('load' + element.variable.name), tArrowFunctionType([tTypedIdentifier(tIdentifier('slice'), tIdentifier('Slice'))], tIdentifier(element.variable.name))))

          storeFunctionParameters.push(
            tTypedIdentifier(tIdentifier('store' + element.variable.name),
              tArrowFunctionType(
                [tTypedIdentifier(tIdentifier(firstLower(element.variable.name)), tIdentifier(element.variable.name))],
                tArrowFunctionType([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], tIdentifier('void')))))
        }
        if (element.variable.type == '#' && !element.variable.negated) {
          if (element.argName) {
            loadFunctionParameters.push(tTypedIdentifier(tIdentifier(element.argName), tIdentifier('number')))
          } else {
            loadFunctionParameters.push(tTypedIdentifier(tIdentifier(element.variable.name), tIdentifier('number')))
          }
        }
      });
    }

    let loadFunction = tFunctionDeclaration(tIdentifier('load' + combinatorName), structTypeParametersExpr, tTypeWithParameters(tIdentifier(combinatorName), structTypeParametersExpr), loadFunctionParameters, loadStatements);

    let storeFunction = tFunctionDeclaration(tIdentifier('store' + combinatorName), structTypeParametersExpr, tIdentifier('(builder: Builder) => void'), storeFunctionParameters, storeStatements)

    if (tlbType.constructors.length > 1) {
      let unionTypeDecl = tUnionTypeDeclaration(tTypeWithParameters(tIdentifier(combinatorName), structTypeParametersExpr), subStructsUnion)
      jsCodeDeclarations.push(unionTypeDecl)
    }
    subStructDeclarations.forEach(element => {
      jsCodeDeclarations.push(element)
    });

    jsCodeDeclarations.push(loadFunction)
    jsCodeDeclarations.push(storeFunction)
  });

  let generatedCode = ''

  jsCodeDeclarations.forEach(element => {
    generatedCode += toCode(element, { tabs: 0 }) + '\n';
  });
  return generatedCode;
}