import fs from 'fs'
import path from 'path'
import util from 'util'

import { parse } from '../src'
import { ast } from '../src'
import { BuiltinZeroArgs, FieldNamedDef, Program, Declaration, BuiltinOneArgExpr, NumberExpr, NameExpr, CombinatorExpr, FieldBuiltinDef, MathExpr, SimpleExpr, NegateExpr, CellRefExpr, FieldDefinition, FieldAnonymousDef, CondExpr } from '../src/ast/nodes'

import { parse as parseBabel } from "@babel/parser";
import generate from "@babel/generator";
// import { expressionStatement } from '@babel/types'
import { ExportNamedDeclaration, ExpressionStatement as BabelExpressionStatement, Identifier as BabelIdentifier, ObjectProperty as BabelObjectProperty, TSPropertySignature, TSTypeReference, anyTypeAnnotation, arrowFunctionExpression, blockStatement, callExpression, exportNamedDeclaration, expressionStatement, functionDeclaration, identifier, importDeclaration, importSpecifier, memberExpression, numericLiteral, objectExpression, objectProperty, returnStatement, stringLiteral, tsPropertySignature, tsTypeAliasDeclaration, tsTypeAnnotation, tsTypeLiteral, tsTypeReference, tsUnionType, typeAnnotation, MemberExpression as BabelMemberExpression, typeParameter, tsLiteralType} from '@babel/types'

const fixturesDir = path.resolve(__dirname, 'fixtures')

function typedIdentifier(id: string, typeId: string): BabelIdentifier {
  let param = identifier(id)
  param.typeAnnotation = tsTypeAnnotation(tsTypeReference(identifier(typeId)))
  return param;
}

interface ASTNode {
  type: Node["type"];
}

interface Identifier extends ASTNode {
  type: "Identifier",
  name: String
}

interface TypeWithParameters extends ASTNode {
  type: "TypeWithParameters",
  name: Identifier,
  typeParameters: TypeParametersExpression
}

interface NumericLiteral extends ASTNode {
  type: "NumericLiteral",
  value: number
}

interface BinaryNumericLiteral extends ASTNode {
  type: "BinaryNumericLiteral",
  value: number
}

interface StringLiteral extends ASTNode {
  type: "StringLiteral",
  value: string
}

interface ImportDeclaration extends ASTNode {
  type: "ImportDeclaration",
  importValue: Identifier,
  from: StringLiteral
}

interface FunctionDeclaration extends ASTNode {
  type: "FunctionDeclaration",
  name: Identifier,
  typeParameters: TypeParametersExpression,
  returnType: TypeExpression | null,
  parameters: Array<TypedIdentifier>;
  body: Array<Statement>;
}

interface TypedIdentifier extends ASTNode {
  type: "TypedIdentifier",
  name: Identifier,
  typeId: TypeExpression | Literal
}

interface TypeParametersExpression extends ASTNode {
  type: "TypeParametersExpression",
  typeParameters: Array<Identifier>
}

interface StructDeclaration extends ASTNode {
  type: "StructDeclaration",
  name: Identifier,
  fields: Array<TypedIdentifier>,
  typeParametersExpression: TypeParametersExpression
}

interface UnionTypeDeclaration extends ASTNode {
  type: "UnionTypeDeclaration",
  name: TypeExpression,
  unionMembers: Array<TypeExpression>
}

interface ObjectProperty extends ASTNode {
  type: "ObjectProperty",
  key: Expression,
  value: Expression
}

interface ObjectExpression extends ASTNode {
  type: "ObjectExpression",
  objectValues: Array<ObjectProperty>;
}

interface FunctionCall extends ASTNode {
  type: "FunctionCall",
  functionId: Expression,
  parameters: Array<Expression>,
  typeParameters: TypeParametersExpression | undefined
}

interface MemberExpression extends ASTNode {
  type: "MemberExpression",
  thisObject: Expression,
  memberName: Identifier
}

interface ArrowFunctionType extends ASTNode {
  type: "ArrowFunctionType",
  parameters: Array<TypedIdentifier>,
  returnType: TypeExpression | null
}

interface ArrowFunctionExpression extends ASTNode {
  type: "ArrowFunctionExpression",
  parameters: Array<TypedIdentifier>,
  body: Array<Statement>
}


interface ReturnStatement extends ASTNode {
  type: "ReturnStatement",
  returnValue: Expression
}

interface ExpressionStatement extends ASTNode {
  type: "ExpressionStatement",
  expression: Expression
}

interface IfStatement extends ASTNode {
  type: "IfStatement",
  condition: Expression,
  body: Array<Statement>,
  elseBody: Array<Statement> | undefined
}

interface DeclareVariable extends ASTNode {
  type: "DeclareVariable",
  name: Identifier,
  init: Expression | undefined,
  typeName: TypeExpression | undefined
}

interface BinaryExpression extends ASTNode {
  type: "BinaryExpression",
  binarySign: string,
  left: Expression,
  right: Expression
}

type TypeExpression = Identifier | TypeWithParameters | ArrowFunctionType;
type Statement = ReturnStatement | ExpressionStatement | IfStatement;
type Literal = NumericLiteral | BinaryNumericLiteral | StringLiteral;
type Expression = Identifier | TypeExpression | Literal | ObjectExpression | FunctionCall | MemberExpression | ArrowFunctionExpression | BinaryExpression | ArrowFunctionType | TypeParametersExpression | DeclareVariable;
type GenDeclaration = ImportDeclaration | StructDeclaration | UnionTypeDeclaration | FunctionDeclaration;

type Node = Identifier | GenDeclaration | TypedIdentifier | Expression | ObjectProperty | Statement;

function tIdentifier(name: String): Identifier {
  return {type: "Identifier", name: name};
}

function tStringLiteral(value: string): StringLiteral {
  return {type: "StringLiteral", value: value}
}

function tImportDeclaration(importValue: Identifier, from: StringLiteral): ImportDeclaration {
  return {type: "ImportDeclaration", importValue: importValue, from: from};
}

function tFunctionDeclaration(name: Identifier, typeParameters: TypeParametersExpression, returnType: TypeExpression | null, parameters: Array<TypedIdentifier>, body: Array<Statement>): FunctionDeclaration {
  return {type: "FunctionDeclaration", name: name, typeParameters: typeParameters, returnType: returnType, parameters: parameters, body: body};
}

function tTypedIdentifier(name: Identifier, typeId: TypeExpression | StringLiteral): TypedIdentifier {
  return {type: "TypedIdentifier", name: name, typeId: typeId};
}

function tTypeWithParameters(name: Identifier, typeParameters: TypeParametersExpression): TypeWithParameters {
  return {type: "TypeWithParameters", name: name, typeParameters: typeParameters}
}

function tStructDeclaration(name: Identifier, fields: Array<TypedIdentifier>, typeParameters: TypeParametersExpression): StructDeclaration {
  return {type: "StructDeclaration", name: name, fields: fields, typeParametersExpression: typeParameters};
}

function tObjectProperty(key: Expression, value: Expression): ObjectProperty {
  return {type: "ObjectProperty", key: key, value: value}
}

function tObjectExpression(objectValues: Array<ObjectProperty>): ObjectExpression {
  return {type: "ObjectExpression", objectValues: objectValues}
}

function tReturnStatement(returnValue: Expression): ReturnStatement {
  return {type: "ReturnStatement", returnValue: returnValue}
}

function tFunctionCall(functionId: Expression, parameters: Array<Expression>, typeParameters?: TypeParametersExpression): FunctionCall {
  return {type: "FunctionCall", functionId: functionId, parameters: parameters, typeParameters: typeParameters}
}

function tMemberExpression(thisObject: Expression, memberName: Identifier): MemberExpression {
  return {type: "MemberExpression", thisObject: thisObject, memberName: memberName}
}

function tNumericLiteral(value: number): NumericLiteral {
  return {type: "NumericLiteral", value: value}
}

function tBinaryNumericLiteral(value: number): BinaryNumericLiteral {
  return {type: "BinaryNumericLiteral", value: value}
}

function tTypeParametersExpression(typeParameters: Array<Identifier>): TypeParametersExpression {
  return {type: "TypeParametersExpression", typeParameters: typeParameters}
}

function tArrowFunctionExpression(parameters: Array<TypedIdentifier>, body: Array<Statement>): ArrowFunctionExpression {
  return {type: "ArrowFunctionExpression", parameters: parameters, body: body}
}

function tUnionTypeDeclaration(name: TypeExpression, unionMembers: Array<TypeExpression>): UnionTypeDeclaration {
  return {type: "UnionTypeDeclaration", name: name, unionMembers: unionMembers}
}

function tExpressionStatement(expression: Expression): ExpressionStatement {
  return {type: "ExpressionStatement", expression: expression}
}

function tIfStatement(condition: Expression, body: Array<Statement>, elseBody?: Array<Statement>): IfStatement {
  return {type: "IfStatement", condition: condition, body: body, elseBody: elseBody}
}

function tBinaryExpression(left: Expression, binarySign: string, right: Expression): BinaryExpression {
  return {type: "BinaryExpression", binarySign: binarySign, left: left, right: right}
}


function tArrowFunctionType(parameters: Array<TypedIdentifier>, returnType: TypeExpression): ArrowFunctionType {
  return {type: "ArrowFunctionType", parameters: parameters, returnType: returnType};
}

function tDeclareVariable(name: Identifier, init?: Expression, typeName?: TypeExpression): DeclareVariable {
  return {type: "DeclareVariable", name: name, init: init, typeName: typeName}
}

function toCodeArray(nodeArray: Array<Node>, delimeter: string, prefix: string, printContext: PrintContext, suffix: string) {
  let parameters: string = '';

  for (let i = 0; i < nodeArray.length; i++) {
    let currentParam = nodeArray[i];
    if (currentParam != undefined) {
      parameters += prefix + toCode(currentParam, printContext) + suffix;
    }
    if (i + 1 < nodeArray.length) {
      parameters += delimeter;
    }
  }

  return parameters;
}

type PrintContext = {
  tabs: number;
}

function addTab(printContext: PrintContext): PrintContext {
  return {
    ...printContext,
    tabs: printContext.tabs + 1,
  }
}

function toCode(node: Node, printContext: PrintContext) : string {
  let result: string = '';
  let currentTabs = '\t'.repeat(printContext.tabs);

  if (node.type == "Identifier") {
    result += node.name;
  }

  if (node.type == "NumericLiteral") {
    result += node.value.toString()
  }

  if (node.type == "ImportDeclaration") {
    result += currentTabs + `import { ${toCode(node.importValue, printContext)} } from ${toCode(node.from, printContext)}`;
  }

  if (node.type == "FunctionDeclaration") {
    result += currentTabs + `export function ${toCode(node.name, printContext)}${toCode(node.typeParameters, printContext)}(${toCodeArray(node.parameters, ', ', '', printContext, '')})${node.returnType ? ': ' + toCode(node.returnType, printContext) : ''} {
${toCodeArray(node.body, '\n', '', addTab(printContext), ';')}
${currentTabs}}`
  }

  if (node.type == "ArrowFunctionExpression") {
    result += `(${toCodeArray(node.parameters, ', ', '', printContext, '')}) => {
${toCodeArray(node.body, '\n', '', addTab(printContext), ';')}
${currentTabs}}`
  }

  if (node.type == "ArrowFunctionType") {
    result += `(${toCodeArray(node.parameters, ', ', '', printContext, '')}) => ${node.returnType ? toCode(node.returnType, printContext) : ''}`
  }

  if (node.type == "TypeWithParameters") {
    result += `${toCode(node.name, printContext)}${toCode(node.typeParameters, printContext)}`
  }

  if (node.type == "TypedIdentifier") {
    result += toCode(node.name, printContext) + ': ' + toCode(node.typeId, printContext);
  }

  if (node.type == "ObjectProperty") {
    result += currentTabs + toCode(node.key, printContext) + ': ' + toCode(node.value, printContext);
  }

  if (node.type == "DeclareVariable") {
    result += `let ${toCode(node.name, printContext)}${node.typeName ? ': ' + toCode(node.typeName, printContext) : ''}${node.init ? ' = ' + toCode(node.init, printContext) : ''}`
  }

  if (node.type == "ObjectExpression") {
    result += `{
${toCodeArray(node.objectValues, ',\n', '', addTab(printContext), '')}
${currentTabs}}`
  }

  if (node.type == "ReturnStatement") {
    result += currentTabs + `return ${toCode(node.returnValue, printContext)}`
  }

  if (node.type == "ExpressionStatement") {
    result += currentTabs + toCode(node.expression, printContext)
  }

  if (node.type == "TypeParametersExpression") {
    if (node.typeParameters.length > 0) {
      result += '<';
      result += toCodeArray(node.typeParameters, ',', '', printContext, '');
      result += '>';
    }
  }

  if (node.type == "StructDeclaration") {
    result += currentTabs + `export type ${toCode(node.name, printContext)}${toCode(node.typeParametersExpression, printContext)} = {
${toCodeArray(node.fields, '\n', '\t', printContext, ';')}
${currentTabs}};`
  }

  if (node.type == "UnionTypeDeclaration") {
    result += currentTabs + `export type ${toCode(node.name, printContext)} = ${toCodeArray(node.unionMembers, ' | ', '', printContext, '')};`
  }

  if (node.type == "FunctionCall") {
    result += `${toCode(node.functionId, printContext)}${node.typeParameters ? toCode(node.typeParameters, printContext) : ''}(${toCodeArray(node.parameters, ', ', '', printContext, '')})`
  }

  if (node.type == "StringLiteral") {
    result += `'${node.value}'`
  }

  if (node.type == "MemberExpression") {
    result += toCode(node.thisObject, printContext) + '.' + toCode(node.memberName, printContext);
  }

  if (node.type == "IfStatement") {
    result += `${currentTabs}if (${toCode(node.condition, printContext)}) {
${toCodeArray(node.body, '\n', '', addTab(printContext), ';')}
${currentTabs}}`
  }

  if (node.type == "BinaryExpression") {
    result += `${toCode(node.left, printContext)} ${node.binarySign} ${toCode(node.right, printContext)}`
  }

  return result;
}

class MyBinaryOp {
  constructor(
    readonly left: MyMathExpr,
    readonly right: MyMathExpr,
    readonly operation: string,
    readonly hasX: boolean) {
  }
}

class MyNumberExpr {
  constructor(
    readonly n: number,
    readonly hasX: false
  ) {

  }
}

class MyVarExpr {
  constructor(
    readonly x: string,
    readonly hasX: true
  ) {

  }
}

type MyMathExpr = MyBinaryOp | MyNumberExpr | MyVarExpr;

function convertToMathExpr(mathExpr: SimpleExpr | NameExpr | NumberExpr): MyMathExpr {
  if (mathExpr instanceof NameExpr) {
    return new MyVarExpr(mathExpr.name, true);
  }
  if (mathExpr instanceof NumberExpr) {
    return new MyNumberExpr(mathExpr.num, false);
  }
  if (mathExpr instanceof MathExpr) {
    let left = convertToMathExpr(mathExpr.left)
    let right = convertToMathExpr(mathExpr.right)
    return new MyBinaryOp(left, right, mathExpr.op, left.hasX || right.hasX)
  }
  return {n: 0, hasX: false};
}

function convertToAST(mathExpr: MyMathExpr, objectId?: Identifier): Expression {
  if (mathExpr instanceof MyVarExpr) {
    if (objectId != undefined) {
      return tMemberExpression(objectId, tIdentifier(mathExpr.x));
    }
    return tIdentifier(mathExpr.x);
  }
  if (mathExpr instanceof MyNumberExpr) {
    return tNumericLiteral(mathExpr.n)
  }
  if (mathExpr instanceof MyBinaryOp) {
    return tBinaryExpression(convertToAST(mathExpr.left, objectId), mathExpr.operation, convertToAST(mathExpr.right, objectId));
  }
  return tIdentifier('');
}

function reorganizeExpression(mathExpr: MyMathExpr): MyMathExpr {
  if (mathExpr instanceof MyVarExpr || mathExpr instanceof MyNumberExpr) {
    return mathExpr
  }
  if (mathExpr instanceof MyBinaryOp) {
    let op = '';
    if (mathExpr.operation == '*') {
      op = '/';
    } else if (mathExpr.operation == '+') {
      op = '-'
    }
    let left = undefined;
    let right = undefined;
    if (mathExpr.left.hasX) {
      left = mathExpr.left;
      right = mathExpr.right
    } else {
      right = mathExpr.left
      left = mathExpr.right
    }
    return new MyBinaryOp(
      reorganizeExpression(left),
      reorganizeExpression(right),
      op,
      mathExpr.hasX
    )
  }
  return {n: 0, hasX: false}
}

function getXname(myMathExpr: MyMathExpr): string {
  if (myMathExpr instanceof MyVarExpr) {
    return myMathExpr.x;
  }
  if (myMathExpr instanceof MyBinaryOp) {
    if (myMathExpr.left.hasX) {
      return getXname(myMathExpr.left);
    } else {
      return getXname(myMathExpr.right);
    }
  }
  return '';
}

function deriveMathExpression(mathExpr: MathExpr) {
  let myMathExpr = convertToMathExpr(mathExpr);
  myMathExpr = reorganizeExpression(myMathExpr);
  let derived = convertToAST(myMathExpr)
  return {
    name: getXname(myMathExpr),
    derived: derived,
  }
}


function firstLower(structName: String) {
  return structName.charAt(0).toLowerCase() + structName.slice(1)
}

function splitForTypeValue(name: string, typeName: string) {
  if (!name.startsWith(typeName)) {
    return undefined;
  }
  let num = parseInt(name.slice(typeName.length))
  if (num == undefined) {
    return undefined
  }
  if (name != typeName + num.toString()) {
    return undefined
  }
  return num
}

function getCurrentSlice(slicePrefix: number[], name:string): string {
  let result = name;
  slicePrefix = slicePrefix.slice(0, slicePrefix.length - 1);
  slicePrefix.forEach(element => {
    result += element.toString();
  });
  if (result == 'cell') {
    return 'builder';
  }
  return result;
}

function bitLen(n: number) {
  return n.toString(2).length;
}

// export type TLBVariable = {
//   name: string,

// }

// export type TLBField = {
//   name: string
//   expression: 
// }

export type TLBVariableType = 'Type' | '#';

export type TLBVariable = {
  const: boolean
  negated: boolean
  type: TLBVariableType
  name: string
}

export type TLBParameter = {
  variable: TLBVariable,
  expression: Expression
}

export type TLBConstructor = {
  parameters: Array<TLBParameter>
  parametersMap: Map<string, TLBParameter>
  name: string
  implicitFields: Map<string, string>
  declaration: Declaration
}

export type TLBType = {
  name: string
  constructors: Array<TLBConstructor>
}

export type TLBCode = {
  types: Map<string, TLBType>
}

function getTypeParametersExpression(parameters: Array<TLBParameter>) {
  let structTypeParameters: Array<Identifier> = []
  parameters.forEach(element => {
    if (element.variable.type == 'Type') {
      structTypeParameters.push(tIdentifier(element.variable.name))
    }
  });
  let structTypeParametersExpr = tTypeParametersExpression(structTypeParameters);
  return structTypeParametersExpr;
}

function getCondition(conditions: Array<BinaryExpression>): Expression {
  let cnd = conditions[0];
  if (cnd) {
    if (conditions.length > 1) {
      return tBinaryExpression(cnd, '&&', getCondition(conditions.slice(1))); 
    } else {
      return cnd
    }
  } else {
    return tIdentifier('true');
  }
}

function fillConstructors(declarations: Declaration[], tlbCode: TLBCode) {
  declarations.forEach(declaration => {
    let tlbType: TLBType | undefined = tlbCode.types.get(declaration.combinator.name);
    if (tlbType == undefined) {
      tlbType = {name: declaration.combinator.name, constructors: []}
    }
    tlbType.constructors.push({declaration: declaration, parameters: [], parametersMap: new Map<string, TLBParameter>(), implicitFields: new Map<string, string>(), name: declaration.constructorDef.name});
    tlbCode.types.set(tlbType.name, tlbType);
  })

  tlbCode.types.forEach((tlbType: TLBType, combinatorName: string) => {
    tlbType.constructors.forEach(constructor => {

      constructor.declaration?.fields.forEach(field => {
        if (field instanceof FieldBuiltinDef) {
          constructor.implicitFields.set(field.name, field.type);
        }
      })

      constructor.declaration.combinator.args.forEach(element => {
        let parameter: TLBParameter | undefined = undefined;
        if (element instanceof NameExpr) {
          if (constructor.implicitFields.has(element.name)) {
            let variable: TLBVariable;
            if (constructor.implicitFields.get(element.name) == 'Type') {
              variable = {negated: false, const: false, type: 'Type', name: element.name}
            }
            else {
              variable = {negated: false, const: false, type: '#', name: element.name}
            }
            parameter = {variable: variable, expression: tIdentifier(element.name)};
          } 
          else {
            throw new Error('Field not known before using (should be tagged as implicit): ' + element)
          }
        } else if (element instanceof MathExpr) {
          let derivedExpr = deriveMathExpression(element);
          parameter = {variable: {negated: false, const: false, type: '#', name: derivedExpr.name}, expression: derivedExpr.derived};
        } else if (element instanceof NegateExpr && element.expr instanceof MathExpr) {
          let derivedExpr = deriveMathExpression(element.expr);
          parameter = {variable: {negated: true, const: false, type: '#', name: derivedExpr.name}, expression: derivedExpr.derived};
        } else if (element instanceof NumberExpr) {
          parameter = {variable: {negated: false, const: true, type: '#', name: 'n'}, expression: tNumericLiteral(element.num)}
        } else {
          // throw new Error('Cannot identify combinator arg: ' + element)
        }
        if (parameter) {
          constructor.parameters.push(parameter);
          constructor.parametersMap.set(parameter.variable.name, parameter);
        }
      });
    });
  });
}

describe('parsing into intermediate representation using grammar', () => {
  test('block.tlb can be parsed', () => { 

    const babelTestCode = `
    export type X = {}
    export type Y = {}
    
    export type Z = X | Y;`;

    const babelTestAst = parseBabel(babelTestCode, {sourceType: 'module', plugins: ['typescript']});
    // exportNamedDeclaration(functionDeclaration(identifier('loadX')))
    // console.log(util.inspect(babelTestAst.program.body[2], false, null, true /* enable colors */))

    
  
    expect.hasAssertions()

    const input = fs.readFileSync(
      path.resolve(fixturesDir, 'tlb', 'my.tlb'),
      'utf-8',
    )
    const parsed = parse(input)

    expect(parsed.shortMessage).toBe(undefined)
    expect(parsed.succeeded()).toBe(true)

    const tree = ast(input)

    let jsCodeDeclarations = []
    jsCodeDeclarations.push(tImportDeclaration(tIdentifier('Builder'), tStringLiteral('ton'))) // importDeclaration([importSpecifier(identifier('Builder'), identifier('Builder'))], stringLiteral('../boc/Builder')))
    jsCodeDeclarations.push(tImportDeclaration(tIdentifier('Slice'), tStringLiteral('ton')))  // importDeclaration([importSpecifier(identifier('Slice'), identifier('Slice'))], stringLiteral('../boc/Slice')))
    jsCodeDeclarations.push(tImportDeclaration(tIdentifier('beginCell'), tStringLiteral('ton')))
    jsCodeDeclarations.push(tImportDeclaration(tIdentifier('BitString'), tStringLiteral('ton')))


    let tlbCode: TLBCode = {types: new Map<string, TLBType>()}

    fillConstructors(tree.declarations, tlbCode);

    tlbCode.types.forEach((tlbType: TLBType, combinatorName: string) => {
        let variableCombinatorName = combinatorName.charAt(0).toLowerCase() + combinatorName.slice(1)
        if (combinatorName == undefined) {
          return;
        }
        let subStructsUnion: TypeExpression[] = []
        let subStructDeclarations: ASTNode[]  = []

        let loadStatements: Statement[] = []
        let storeStatements: Statement[] = []

        let structTypeParametersExpr: TypeParametersExpression = tTypeParametersExpression([]);

        let variablesDeclared = new Set<string>;          

        tlbType.constructors.forEach(constructor => {
          let constructorLoadStatements: Statement[] = []
          let declaration = constructor.declaration;
          let subStructName: string;
          if (tlbType.constructors.length > 1) {
            subStructName = tlbType.name + '_' + declaration.constructorDef.name;
          } else {
            subStructName = tlbType.name;
          }
          let variableSubStructName = firstLower(subStructName)
    
          let subStructProperties: TypedIdentifier[] = [tTypedIdentifier(tIdentifier('kind'), tStringLiteral(subStructName))]
          let subStructLoadProperties: ObjectProperty[] = [tObjectProperty(tIdentifier('kind'), tStringLiteral(subStructName))]
          let subStructStoreStatements: Statement[] = []    
          
          let tag = declaration?.constructorDef.tag;
          if (tag == undefined) {
            return;
          }
          if (tag[0] == '$') {

          }
          let tagBitLen = tag?.length - 1;
          let tagBinary = '0b' + tag.slice(1);

          if (structTypeParametersExpr.typeParameters.length == 0) {
            structTypeParametersExpr = getTypeParametersExpression(constructor.parameters);
          }

          let slicePrefix: number[] = [0];

          function handleField(field: FieldDefinition) {
            let currentSlice = getCurrentSlice(slicePrefix, 'slice');
            let currentCell = getCurrentSlice(slicePrefix, 'cell');

            if (field instanceof FieldAnonymousDef) {
              slicePrefix[slicePrefix.length - 1]++;  
              slicePrefix.push(0)
   
              constructorLoadStatements.push(
                tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'slice')), 
                  tFunctionCall(tMemberExpression(
                    tFunctionCall(tMemberExpression(
                      tIdentifier(currentSlice), tIdentifier('loadRef')
                    ), []),
                    tIdentifier('beginParse')
                  ), []), )))

              subStructStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))

              field.fields.forEach(element => {
                handleField(element);
              });

              subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tIdentifier(getCurrentSlice(slicePrefix, 'cell'))])))

              slicePrefix.pop();
            }

            if (field instanceof FieldBuiltinDef && field.type != 'Type') {
              subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier('number')));
              let parameter = constructor.parametersMap.get(field.name)
              if (parameter) {
                subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), parameter.expression)) 
              }
            }

            if (field instanceof FieldNamedDef) {
              let argLoadExpr: Expression | undefined;
              let argStoreExpr: Expression | undefined;

              if (field.expr instanceof BuiltinZeroArgs) {
                if (field.expr.name == '#') {
                  argLoadExpr = argStoreExpr = tNumericLiteral(32);
                }
              }
              if (field.expr instanceof BuiltinOneArgExpr) {
                if (field.expr.name == '##') {
                  if (field.expr.arg instanceof NumberExpr) {
                    argLoadExpr = argStoreExpr = tNumericLiteral(field.expr.arg.num);
                  }
                  if (field.expr.arg instanceof NameExpr) {
                    argStoreExpr = tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.expr.arg.name));
                    let parameter = constructor.parametersMap.get(field.name)
                    if (parameter) {
                      argLoadExpr = parameter.expression;
                    }
                  }
                }
                if (field.expr.name == '#<') {
                  if (field.expr.arg instanceof NumberExpr) {
                    argLoadExpr = argStoreExpr = tNumericLiteral(bitLen(field.expr.arg.num - 1));
                  }
                }
                if (field.expr.name == '#<=') {
                  if (field.expr.arg instanceof NumberExpr) {
                    argLoadExpr = argStoreExpr = tNumericLiteral(bitLen(field.expr.arg.num));
                  }
                }
              }

              if (field.expr instanceof CellRefExpr) {
                slicePrefix[slicePrefix.length - 1]++;  
                slicePrefix.push(0)
    
                constructorLoadStatements.push(
                  tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'slice')), 
                    tFunctionCall(tMemberExpression(
                      tFunctionCall(tMemberExpression(
                        tIdentifier(currentSlice), tIdentifier('loadRef')
                      ), []),
                      tIdentifier('beginParse')
                    ), []), )))

                subStructStoreStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(getCurrentSlice(slicePrefix, 'cell')), tFunctionCall(tIdentifier('beginCell'), []))))

                handleField(new FieldNamedDef(field.name, field.expr.expr))

                subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('storeRef')), [tIdentifier(getCurrentSlice(slicePrefix, 'cell'))])))

                slicePrefix.pop();              
              }


              let fieldType = 'number';
              let fieldLoadStoreSuffix = 'Uint';

              if (field.expr instanceof CombinatorExpr) {
                let typeParameterArray: Array<Identifier> = []
                let loadFunctionsArray: Array<Expression> = []
                let storeFunctionsArray: Array<Expression> = []

                if (field.expr.args.length > 0 && (field.expr.args[0] instanceof MathExpr || field.expr.args[0] instanceof NumberExpr ||  field.expr.args[0] instanceof NameExpr)) {
                  if (field.expr.name == 'int') {
                      fieldLoadStoreSuffix = 'Int'
                      let myMathExpr = convertToMathExpr(field.expr.args[0])
                      argLoadExpr = convertToAST(myMathExpr);
                      argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                  }
                  if (field.expr.name == 'uint') {
                      let myMathExpr = convertToMathExpr(field.expr.args[0])
                      argLoadExpr = convertToAST(myMathExpr);
                      argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                  }
                  if (field.expr.name == 'bits') {
                    fieldType = 'BitString'
                    fieldLoadStoreSuffix = 'Bits'
                    let myMathExpr = convertToMathExpr(field.expr.args[0])
                    argLoadExpr = convertToAST(myMathExpr);
                    argStoreExpr = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                  }
                }

                if (argLoadExpr == undefined) {
                  field.expr.args.forEach(element => {
                    if (element instanceof NameExpr) {
                      if (constructor.implicitFields.get(element.name)?.startsWith('#')) {
                        loadFunctionsArray.push(tIdentifier(element.name))
                      } else {
                        typeParameterArray.push(tIdentifier(element.name))
                        loadFunctionsArray.push(tIdentifier('load' + element.name))
                        storeFunctionsArray.push(tIdentifier('store' + element.name))
                      }
                    }
                    if (element instanceof NumberExpr) {
                      loadFunctionsArray.push(tNumericLiteral(element.num))
                    }
                    if (element instanceof NegateExpr && element.expr instanceof NameExpr) {
                      let parameter = constructor.parametersMap.get(field.name)
                      if (parameter) {
                        loadFunctionsArray.push(parameter.expression)
                      }
                    }
                    if (element instanceof CombinatorExpr) {
                      let theFieldType = 'number'
                      let theFieldLoadStoreName = 'Uint';
                      let theBitsLoad: Expression = tIdentifier('');
                      let theBitsStore: Expression = tIdentifier('');
                      if (element.args.length > 0 && (element.args[0] instanceof MathExpr || element.args[0] instanceof NumberExpr ||  element.args[0] instanceof NameExpr)) {
                        // (slice: Slice) => {return slice.loadUint(22);}
                        if (element.name == 'int') {
                          theFieldLoadStoreName = 'Int'
                          let myMathExpr = convertToMathExpr(element.args[0])
                          theBitsLoad = convertToAST(myMathExpr);
                          theBitsStore = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                        }
                        if (element.name == 'uint') {
                            let myMathExpr = convertToMathExpr(element.args[0])
                            theBitsLoad = convertToAST(myMathExpr);
                            theBitsStore = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                        }
                        if (element.name == 'bits') {
                          theFieldType = 'BitString'
                          theFieldLoadStoreName = 'Bits'
                          let myMathExpr = convertToMathExpr(element.args[0])
                          theBitsLoad = convertToAST(myMathExpr);
                          theBitsStore = convertToAST(myMathExpr, tIdentifier(variableSubStructName))
                        }
                        typeParameterArray.push(tIdentifier(theFieldType))
                      }
                      // here
                      loadFunctionsArray.push(tArrowFunctionExpression([], [tReturnStatement(tFunctionCall(tMemberExpression(tIdentifier(currentSlice), tIdentifier('load' + theFieldLoadStoreName)), [theBitsLoad]))]))
                      //(arg: number) => {return (builder: Builder) => {builder.storeUint(arg, 22);}}
                      storeFunctionsArray.push(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('arg'), tIdentifier(theFieldType))], [tReturnStatement(tArrowFunctionExpression([tTypedIdentifier(tIdentifier('builder'), tIdentifier('Builder'))], [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('store' + theFieldLoadStoreName)), [tIdentifier('arg'), theBitsStore]))]))]))
                    }
                  });
  
                  let currentTypeParameters = tTypeParametersExpression(typeParameterArray);
  
                  let insideLoadParameters: Array<Expression> = [tIdentifier(currentSlice)];
                  let insideStoreParameters: Array<Expression> = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))];
  
                  subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tTypeWithParameters(tIdentifier(field.expr.name), currentTypeParameters)));
                  subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), tFunctionCall(tIdentifier('load' + field.expr.name), insideLoadParameters.concat(loadFunctionsArray), currentTypeParameters))) 
                  subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + field.expr.name), insideStoreParameters.concat(storeFunctionsArray), currentTypeParameters), [tIdentifier(currentCell)])))   
  
                }
              }
              if (field.expr instanceof NameExpr) {
                let expName = field.expr.name;
                if (expName == 'Int') {
                  argLoadExpr = argStoreExpr = tNumericLiteral(257);
                }
                if (expName == 'Bits') {
                  fieldType = 'BitString';
                  fieldLoadStoreSuffix = 'Bits';
                  argLoadExpr = argStoreExpr = tNumericLiteral(1023);
                }
                if (expName == 'Bit') {
                  fieldType = 'BitString';
                  fieldLoadStoreSuffix = 'Bits';
                  argLoadExpr = argStoreExpr = tNumericLiteral(1);
                }
                if (expName == 'Uint') {
                  argLoadExpr = argStoreExpr = tNumericLiteral(256);
                }
                if (expName == 'Any' || expName == 'Cell') {
                  fieldType = 'Slice'
                  fieldLoadStoreSuffix = 'Slice'
                  argLoadExpr = tIdentifier(currentSlice);
                  argStoreExpr = tIdentifier(currentSlice);
                }
                let theNum = splitForTypeValue(expName, 'int') 
                if (theNum != undefined) {
                  fieldLoadStoreSuffix = 'Int';
                  argLoadExpr = argStoreExpr = tNumericLiteral(theNum);
                }
                theNum = splitForTypeValue(expName, 'uint') 
                if (theNum != undefined) {
                  fieldLoadStoreSuffix = 'Uint';
                  argLoadExpr = argStoreExpr = tNumericLiteral(theNum);
                }
                theNum = splitForTypeValue(expName, 'bits') 
                if (theNum != undefined) {
                  fieldLoadStoreSuffix = 'Bits';
                  fieldType = 'BitString';
                  argLoadExpr = argStoreExpr = tNumericLiteral(theNum);
                }
                if (argLoadExpr == undefined) {
                  subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier(field.expr.name)));
                  subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), tFunctionCall(tIdentifier('load' + field.expr.name), [tIdentifier(currentSlice)]))) 
                  subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tFunctionCall(tIdentifier('store' + field.expr.name), [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))]), [tIdentifier(currentCell)])))   
                }
              }
              if (argLoadExpr != undefined && argStoreExpr != undefined) {
                let loadSt: Expression = tFunctionCall(tMemberExpression(tIdentifier(currentSlice), tIdentifier('load' + fieldLoadStoreSuffix)), [argLoadExpr]);
                if (fieldType == 'Slice') {
                  loadSt = tIdentifier(currentSlice)
                }
                if (!variablesDeclared.has(field.name)) {
                  variablesDeclared.add(field.name);
                  constructorLoadStatements.push(tExpressionStatement(tDeclareVariable(tIdentifier(field.name), undefined, tIdentifier(fieldType))))
                }
                constructorLoadStatements.push(tExpressionStatement(tBinaryExpression(tIdentifier(field.name), '=', loadSt)))
                subStructProperties.push(tTypedIdentifier(tIdentifier(field.name), tIdentifier(fieldType))) 
                subStructLoadProperties.push(tObjectProperty(tIdentifier(field.name), tIdentifier(field.name))) 
                let storeParams: Expression[] = [tMemberExpression(tIdentifier(variableCombinatorName), tIdentifier(field.name))];
                if (fieldType != 'BitString' && fieldType != 'Slice') {
                  storeParams.push(argStoreExpr);
                }
                subStructStoreStatements.push(tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier(currentCell), tIdentifier('store' + fieldLoadStoreSuffix)), storeParams)))   
              }
            }
          }

          declaration?.fields.forEach(element => { handleField(element); })

          subStructsUnion.push(tTypeWithParameters(tIdentifier(subStructName), structTypeParametersExpr));
          
          let structX = tStructDeclaration(tIdentifier(subStructName), subStructProperties, structTypeParametersExpr);

          constructorLoadStatements.push(tReturnStatement(tObjectExpression(subStructLoadProperties)));
          if (tlbType.constructors.length > 1) {
            let conditions: Array<BinaryExpression> = []
            if (tagBinary[tagBinary.length - 1] != '_') {
              conditions.push(tBinaryExpression(tFunctionCall(tMemberExpression(tIdentifier('slice'), tIdentifier('preloadUint')), [tNumericLiteral(tagBitLen)]), '==', tIdentifier(tagBinary)))
            } else {
              constructor.parameters.forEach(element => {
                if (element.variable.const) {
                  conditions.push(tBinaryExpression(tIdentifier(element.variable.name), '==', element.expression))
                }
              });
            }
            loadStatements.push(tIfStatement(getCondition(conditions), constructorLoadStatements))
          } else {
            loadStatements = loadStatements.concat(constructorLoadStatements);
          }

          if (tlbType.constructors.length > 1 && tagBinary[tagBinary.length - 1] != '_') {
            let preStoreStatement: Statement[] = [tExpressionStatement(tFunctionCall(tMemberExpression(tIdentifier('builder'), tIdentifier('storeUint')), [tIdentifier(tagBinary), tNumericLiteral(tagBitLen)]))];
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
              loadFunctionParameters.push(tTypedIdentifier(tIdentifier(element.variable.name), tIdentifier('number')))
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

    let generatedCodeBabel = ''
    
    jsCodeDeclarations.forEach(element => {
      generatedCodeBabel += toCode(element, {tabs: 0}) + '\n';
    });

    fs.writeFile('generated.ts', generatedCodeBabel, () => {});


    expect(tree).toBeInstanceOf(Program)
  })
})


/*
  storeY(y)(builder)
*/