import { BuiltinZeroArgs, FieldCurlyExprDef, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr, CompareExpr, Expression as ParserExpression } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnionTypeDeclaration, toCode, GenDeclaration, toCodeArray, TypeWithParameters, ArrowFunctionExpression, tUnionTypeExpression, tUnaryOpExpression } from './tsgen'
import { TLBMathExpr, TLBVarExpr, TLBNumberExpr, TLBBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable, TLBConstructorTag } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue, deriveMathExpression, getStringDeclaration } from './util'
import { constructorNodes } from '../parsing'
import { handleCombinator } from './combinator'
import { FunctionDeclaration } from '@babel/types'
import { handleField } from './field'
import { getParamVarExpr, getSubStructName, goodVariableName } from './helpers'

export function generate(tree: Program, input: string) {
  let jsCodeDeclarations: GenDeclaration[] = []
  jsCodeDeclarations.push(tImportDeclaration(tIdentifier('Builder'), tStringLiteral('ton'))) // importDeclaration([importSpecifier(identifier('Builder'), identifier('Builder'))], stringLiteral('../boc/Builder')))
  jsCodeDeclarations.push(tImportDeclaration(tIdentifier('Slice'), tStringLiteral('ton')))  // importDeclaration([importSpecifier(identifier('Slice'), identifier('Slice'))], stringLiteral('../boc/Slice')))
  jsCodeDeclarations.push(tImportDeclaration(tIdentifier('beginCell'), tStringLiteral('ton')))
  jsCodeDeclarations.push(tImportDeclaration(tIdentifier('BitString'), tStringLiteral('ton')))

  jsCodeDeclarations.push(tFunctionDeclaration(tIdentifier('bitLen'), tTypeParametersExpression([]), null, [tTypedIdentifier(tIdentifier('n'), tIdentifier('number'))], [
    tExpressionStatement(tIdentifier('return n.toString(2).length;'))
  ]))


  let tlbCode: TLBCode = { types: new Map<string, TLBType>() }

  let splittedInput = input.split('\n')
  fillConstructors(tree.declarations, tlbCode, splittedInput);

  tlbCode.types.forEach((tlbType: TLBType, combinatorName: string) => {
    let variableCombinatorName = goodVariableName(firstLower(combinatorName), '0')
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

      let variableSubStructName = goodVariableName(firstLower(subStructName), '_' + constructor.name)

      let subStructProperties: TypedIdentifier[] = [tTypedIdentifier(tIdentifier('kind'), tStringLiteral(subStructName))]
      let subStructLoadProperties: ObjectProperty[] = [tObjectProperty(tIdentifier('kind'), tStringLiteral(subStructName))]
      let subStructStoreStatements: Statement[] = []

      if (constructor.tag == undefined) {
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

      let fieldIndex = 0;
      declaration?.fields.forEach(element => { handleField(element, slicePrefix, tlbCode, constructor, constructorLoadStatements, subStructStoreStatements, subStructProperties, subStructLoadProperties, variableCombinatorName, variableSubStructName, jsCodeDeclarations, fieldIndex.toString()); fieldIndex++; })

      subStructsUnion.push(tTypeWithParameters(tIdentifier(subStructName), structTypeParametersExpr));

      let structX = tStructDeclaration(tIdentifier(subStructName), subStructProperties, structTypeParametersExpr);

      constructor.constraints.forEach(constraint => {
        constructorLoadStatements.push(tIfStatement(tUnaryOpExpression('!', convertToAST(constraint, constructor, true)), [tExpressionStatement(tIdentifier("throw new Error('')"))]));
        subStructStoreStatements.push(tIfStatement(tUnaryOpExpression('!', convertToAST(constraint, constructor, true, tIdentifier(variableCombinatorName))), [tExpressionStatement(tIdentifier("throw new Error('')"))]))
      });

      constructorLoadStatements.push(tReturnStatement(tObjectExpression(subStructLoadProperties)));
      if (constructor.tag.bitLen != 0 || tlbType.constructors.length > 1) {
        let conditions: Array<BinaryExpression> = []
        if (constructor.tag.bitLen != 0) {
          conditions.push(tBinaryExpression(tMemberExpression(tIdentifier('slice'), tIdentifier('remainingBits')), '>=', tNumericLiteral(constructor.tag.bitLen)))
          conditions.push(tBinaryExpression(tFunctionCall(tMemberExpression(tIdentifier('slice'), tIdentifier('preloadUint')), [tNumericLiteral(constructor.tag.bitLen)]), '==', tIdentifier(constructor.tag.binary)))
          let loadBitsStatement: Statement[] = [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('slice'), tIdentifier('loadUint')), [tNumericLiteral(constructor.tag.bitLen)]))]
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

      if (constructor.tag.bitLen != 0) {
        let preStoreStatement: Statement[] = [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('storeUint')), [tIdentifier(constructor.tag.binary), tNumericLiteral(constructor.tag.bitLen)]))];
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

    if (tlbType.constructors.length > 1 || tlbType.constructors.at(0)?.tag.bitLen != 0)
      loadStatements.push(tExpressionStatement(tIdentifier("throw new Error('')")))
    if (tlbType.constructors.length > 1) {
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
                [tTypedIdentifier(tIdentifier(goodVariableName(firstLower(element.variable.name), '0')), tIdentifier(element.variable.name))],
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
      let unionTypeDecl = tUnionTypeDeclaration(tTypeWithParameters(tIdentifier(combinatorName), structTypeParametersExpr), tUnionTypeExpression(subStructsUnion))
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