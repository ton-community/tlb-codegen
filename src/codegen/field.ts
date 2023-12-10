import { BuiltinZeroArgs, FieldCurlyExprDef, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr, CompareExpr, Expression as ParserExpression, FieldExprDef } from '../../src/ast/nodes'
import { tIdentifier, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tBinaryNumericLiteral, tDeclareVariable, tExpressionStatement, tFunctionCall, tFunctionDeclaration, tIfStatement, tImportDeclaration, tMemberExpression, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructDeclaration, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, GenDeclaration, tUnionTypeDeclaration, toCode, toCodeArray, TypeWithParameters, ArrowFunctionExpression, FunctionDeclaration } from './tsgen'
import { TLBMathExpr, TLBVarExpr, TLBNumberExpr, TLBBinaryOp, TLBCode, TLBType, TLBConstructor, TLBParameter, TLBVariable } from './ast'
import { Expression, Statement, Identifier, BinaryExpression, ASTNode, TypeExpression, TypeParametersExpression, ObjectProperty, TypedIdentifier } from './tsgen'
import { fillConstructors, firstLower, getTypeParametersExpression, getCurrentSlice, bitLen, convertToAST, convertToMathExpr, getCondition, splitForTypeValue, deriveMathExpression } from './util'
import { constructorNodes } from '../parsing'
import { handleCombinator } from './combinator'
import { addLoadProperty, getNegationDerivationFunctionBody, getParamVarExpr, sliceLoad } from './helpers'

export function handleField(field: FieldDefinition, slicePrefix: Array<number>, tlbCode: TLBCode, constructor: TLBConstructor, constructorLoadStatements: Statement[], subStructStoreStatements: Statement[], subStructProperties: TypedIdentifier[], subStructLoadProperties: ObjectProperty[], variableCombinatorName: string, variableSubStructName: string, jsCodeDeclarations: GenDeclaration[], fieldIndex: string) {
  let currentSlice = getCurrentSlice(slicePrefix, 'slice');
  let currentCell = getCurrentSlice(slicePrefix, 'cell');

  if (field instanceof FieldAnonymousDef) {
    slicePrefix[slicePrefix.length - 1]++;
    slicePrefix.push(0)

    constructorLoadStatements.push(sliceLoad(slicePrefix, currentSlice))
    subStructStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))

    field.fields.forEach(field => {
      handleField(field, slicePrefix, tlbCode, constructor, constructorLoadStatements, subStructStoreStatements, subStructProperties, subStructLoadProperties, variableCombinatorName, variableSubStructName, jsCodeDeclarations, fieldIndex)
    });

    subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tIdentifier(getCurrentSlice(slicePrefix, 'cell'))])))

    slicePrefix.pop();
  }

  if (field instanceof FieldBuiltinDef && field.type != 'Type') {
    subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier('number')));
    let parameter = constructor.parametersMap.get(field.name)
    if (parameter && !parameter.variable.const && !parameter.variable.negated) {
      subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), getParamVarExpr(parameter, constructor)))
    }
  }

  if (field instanceof FieldNamedDef || field instanceof FieldExprDef) {
    let fieldName = (field instanceof FieldNamedDef) ? field.name : 'anon' + fieldIndex;

    if (field.expr instanceof CellRefExpr) {
      slicePrefix[slicePrefix.length - 1]++;
      slicePrefix.push(0)

      constructorLoadStatements.push(sliceLoad(slicePrefix, currentSlice))
      subStructStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))
      handleField(new FieldNamedDef(fieldName, field.expr.expr), slicePrefix, tlbCode, constructor, constructorLoadStatements, subStructStoreStatements, subStructProperties, subStructLoadProperties, variableCombinatorName, variableSubStructName, jsCodeDeclarations, fieldIndex)
      subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tIdentifier(getCurrentSlice(slicePrefix, 'cell'))])))
      slicePrefix.pop();
    }

    if (field.expr instanceof CombinatorExpr || field.expr instanceof NameExpr || field.expr instanceof BuiltinZeroArgs || field.expr instanceof BuiltinOneArgExpr || field.expr instanceof MathExpr || field.expr instanceof CondExpr) {
      let tmpTypeName: string;
      if (field.expr instanceof MathExpr || field.expr instanceof CondExpr) {
        tmpTypeName = ''
      } else {
        tmpTypeName = field.expr.name;
      }

      let fieldInfo = handleCombinator(field.expr, fieldName, true, false, variableCombinatorName, variableSubStructName, currentSlice, currentCell, constructor, jsCodeDeclarations, tmpTypeName, 0, tlbCode, subStructLoadProperties);
      if (fieldInfo.loadExpr) {
        addLoadProperty(fieldName, fieldInfo.loadExpr, fieldInfo.typeParamExpr, constructorLoadStatements, subStructLoadProperties);
      }
      if (fieldInfo.typeParamExpr) {
        subStructProperties.push(tTypedIdentifier(tIdentifier(fieldName), fieldInfo.typeParamExpr));
      }
      if (fieldInfo.storeExpr) {
        subStructStoreStatements.push(fieldInfo.storeExpr)
      }
      fieldInfo.negatedVariablesLoads.forEach(element => {
        addLoadProperty(element.name, element.expression, undefined, constructorLoadStatements, subStructLoadProperties)
      });
    }
  }
}