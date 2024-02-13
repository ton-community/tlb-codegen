import { TLBCode, TLBConstructorTag, TLBField, TLBHashmapType, TLBMathExprType } from "../../ast";
import { findNotReservedName, firstLower, getCurrentSlice } from "../../utils";
import { ConstructorContext } from "./generator";
import { BinaryExpression, Expression, GenDeclaration, Identifier, ObjectExpression, Statement, TypeExpression, TypeParametersExpression, TypedIdentifier, id, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tDeclareVariable, tExpressionStatement, tForCycle, tFunctionCall, tFunctionDeclaration, tIfStatement, tMemberExpression, tMultiStatement, tNumericLiteral, tObjectExpression, tObjectProperty, tReturnStatement, tStringLiteral, tStructExpression, tTypeParametersExpression, tTypeWithParameters, tTypedIdentifier, tUnaryOpExpression, toCode } from "./tsgen";
import { ExprForParam, convertToAST, getNegationDerivationFunctionBody, isBigIntExpr } from "./utils";

export function tEqualExpression(left: Expression, right: Expression) {
    return tBinaryExpression(left, '==', right)
}
export function storeTagExpression(tag: TLBConstructorTag): Statement {
    return tExpressionStatement(
        tFunctionCall(tMemberExpression(id("builder"), id("storeUint")), [
            id(tag.binary),
            tNumericLiteral(tag.bitLen),
        ])
    );
}export function storeFunctionStmt(statements: Statement[]): Statement {
    return tReturnStatement(
        tArrowFunctionExpression(
            [tTypedIdentifier(id("builder"), id("Builder"))],
            statements
        )
    );
}
export function checkKindStmt(variableCombinatorName: string, constructorTypeName: string, storeStatement: Statement): Statement {
    return tIfStatement(
        tEqualExpression(
            tMemberExpression(id(variableCombinatorName), id("kind")),
            tStringLiteral(constructorTypeName)
        ),
        [storeStatement]
    );
}
export function bitlenFunctionDecl(): GenDeclaration {
    return tFunctionDeclaration(
        id("bitLen"),
        tTypeParametersExpression([]),
        null,
        [tTypedIdentifier(id("n"), id("number"))],
        [tExpressionStatement(id("return n.toString(2).length"))]
    );
}
export function typedSlice() {
    return [tTypedIdentifier(id("slice"), id("Slice"))];
}

export function sliceLoad(slicePrefix: number[], currentSlice: string) {
  return tExpressionStatement(
    tDeclareVariable(
      id(getCurrentSlice(slicePrefix, "slice")),
      tFunctionCall(
        tMemberExpression(
          tFunctionCall(tMemberExpression(id(currentSlice), id("loadRef")), []),
          id("beginParse")
        ),
        [id('true')]
      )
    )
  );
}
export function simpleCycle(varName: string, finish: Expression): Statement {
  return tForCycle(
    tDeclareVariable(id(varName), tNumericLiteral(0)),
    tBinaryExpression(id(varName), "<", finish),
    tNumericLiteral(5),
    []
  );
}
export function storeFunctionParam(varName: string): TypedIdentifier {
    return tTypedIdentifier(
        id("store" + varName),
        tArrowFunctionType(
            [
                tTypedIdentifier(
                    id(firstLower(varName)),
                    id(varName)
                ),
            ],
            tArrowFunctionType(
                [tTypedIdentifier(id("builder"), id("Builder"))],
                id("void")
            )
        )
    );
}
export function loadFunctionParam(varName: string): TypedIdentifier {
    return tTypedIdentifier(
        id("load" + varName),
        tArrowFunctionType(typedSlice(), id(varName))
    );
}
export function skipTagStmt(bitLen: number): Statement {
  return tExpressionStatement(
    tFunctionCall(tMemberExpression(id("slice"), id("loadUint")), [
      tNumericLiteral(bitLen),
    ])
  );
}
export function checkTagExpr(tag: TLBConstructorTag): BinaryExpression {
  return tEqualExpression(
    tFunctionCall(tMemberExpression(id("slice"), id("preloadUint")), [
      tNumericLiteral(tag.bitLen),
    ]),
    id(tag.binary)
  );
}
export function checkHasBitsForTag(bitLen: number): BinaryExpression {
  return tBinaryExpression(
    tMemberExpression(id("slice"), id("remainingBits")),
    ">=",
    tNumericLiteral(bitLen)
  );
}
export function storeFunctionExpr(typeParamExpr: TypeExpression, storeExpr2: Statement): Expression | undefined {
  return tArrowFunctionExpression(
    [tTypedIdentifier(id("arg"), typeParamExpr)],
    [
      tReturnStatement(
        tArrowFunctionExpression(
          [tTypedIdentifier(id("builder"), id("Builder"))],
          [storeExpr2]
        )
      ),
    ]
  );
}
export function coverFuncCall(loadExpr: Expression): Expression {
  return loadExpr.type == "FunctionCall" ? tArrowFunctionExpression(typedSlice(), [
    tReturnStatement(loadExpr),
  ]) : loadExpr;
}
export function storeExprForParam(theCell: string, exprForParam: ExprForParam, insideStoreParameters: Expression[]): Statement {
  return tExpressionStatement(
    tFunctionCall(
      tMemberExpression(
        id(theCell),
        id("store" + exprForParam.fieldStoreSuffix)
      ),
      insideStoreParameters
    )
  );
}
export function returnSliceFunc(): Expression {
  return tArrowFunctionExpression(typedSlice(), [
    tReturnStatement(tFunctionCall(tMemberExpression(id("slice"), id("asCell")), [])),
  ]);
}
export function loadExprForParam(currentSlice: string, exprForParam: ExprForParam): Expression {
  return tFunctionCall(
    tMemberExpression(
      id(currentSlice),
      id("load" + exprForParam.fieldLoadSuffix)
    ),
    exprForParam.argLoadExpr ? [exprForParam.argLoadExpr] : []
  );
}
export function storeCombinator(
  typeName: string,
  insideStoreParameters: Expression[],
  storeFunctionsArray: Expression[],
  currentTypeParameters: TypeParametersExpression,
  theCell: string
): Statement {
  return tExpressionStatement(
    tFunctionCall(
      tFunctionCall(
        id("store" + typeName),
        insideStoreParameters.concat(storeFunctionsArray),
        currentTypeParameters
      ),
      [id(theCell)]
    )
  );
}
export function storeInNewCell(currentCell: string, storeExpr: Statement): Statement {
  return tMultiStatement([
    tExpressionStatement(
      tDeclareVariable(id(currentCell), tFunctionCall(id("beginCell"), []))
    ),
    storeExpr,
    tExpressionStatement(
      tFunctionCall(tMemberExpression(id("builder"), id("storeRef")), [
        id(currentCell),
      ])
    ),
  ]);
}
export function loadFromNewSlice(loadExpr: Expression): Expression {
  return tArrowFunctionExpression(typedSlice(), [
    sliceLoad([1, 0], "slice"),
    tReturnStatement(loadExpr),
  ]);
}
export function arrayedType(typeParamExpr: TypeExpression): TypeExpression {
  return tTypeWithParameters(
    id("Array"),
    tTypeParametersExpression([typeParamExpr])
  );
}
export function storeTupleStmt(
  currentParam: Expression,
  storeExpr: Statement,
  typeParamExpr: TypeExpression
): Statement {
  return tExpressionStatement(
    tFunctionCall(tMemberExpression(currentParam, id("forEach")), [
      tArrowFunctionExpression(
        [tTypedIdentifier(id("arg"), typeParamExpr)],
        [storeExpr]
      ),
    ])
  );
}
export function loadTupleExpr(
  arrayLength: Expression,
  loadExpr: Expression
): Expression {
  return tFunctionCall(
    tMemberExpression(
      tFunctionCall(tMemberExpression(id("Array"), id("from")), [
        tFunctionCall(
          tMemberExpression(
            tFunctionCall(id("Array"), [arrayLength]),
            id("keys")
          ),
          []
        ),
      ]),
      id("map")
    ),
    [
      tArrowFunctionExpression(
        [tTypedIdentifier(id("arg"), id("number"))],
        [tReturnStatement(loadExpr)]
      ),
    ]
  );
}
export function storeExprCond(
  currentParam: Expression,
  storeExpr: Statement
): Statement {
  return tIfStatement(tBinaryExpression(currentParam, "!=", id("undefined")), [
    storeExpr,
  ]);
}
export function storeExpressionNamedType(
  typeName: string,
  insideStoreParameters: Expression[],
  currentCell: string
): Statement {
  return tExpressionStatement(
    tFunctionCall(
      tFunctionCall(id("store" + typeName), insideStoreParameters),
      [id(currentCell)]
    )
  );
}
export function storeRefObjectStmt(
  currentCell: string,
  ctx: ConstructorContext,
  field: TLBField
): Statement {
  return tExpressionStatement(
    tFunctionCall(tMemberExpression(id(currentCell), id("storeRef")), [
      tMemberExpression(id(ctx.typeName), id(field.name)),
    ])
  );
}
export function loadRefStmt(slicePrefix: number[], currentSlice: string): Statement {
  return tExpressionStatement(
    tDeclareVariable(
      id(getCurrentSlice(slicePrefix, "cell")),
      tFunctionCall(tMemberExpression(id(currentSlice), id("loadRef")), [])
    )
  );
}
export function storeRefStmt(slicePrefix: number[], currentCell: string): Statement {
  return tExpressionStatement(
    tFunctionCall(tMemberExpression(id(currentCell), id("storeRef")), [
      id(getCurrentSlice(slicePrefix, "cell")),
    ])
  );
}
export function newCellStmt(slicePrefix: number[]): Statement {
  return tExpressionStatement(
    tDeclareVariable(
      id(getCurrentSlice(slicePrefix, "cell")),
      tFunctionCall(id("beginCell"), [])
    )
  );
}
export function checkConstraintStmt(
  constraintAST: Expression,
  exceptionCommentLastPart: string
): Statement {
  return tIfStatement(tUnaryOpExpression("!", constraintAST), [
    tExpressionStatement(
      id(
        "throw new Error('Condition " +
        toCode(constraintAST).code +
        exceptionCommentLastPart +
        "')"
      )
    ),
  ]);
}
export function inSeparateRef(slicePrefix: Array<number>, callback: any) {
  slicePrefix[slicePrefix.length - 1]++;
  slicePrefix.push(0);
  callback();
  slicePrefix.pop();
}
export function negationDerivationFuncDecl(
  tlbCode: TLBCode,
  getParameterFunctionId: Identifier,
  fieldName: string,
  fieldTypeName: string,
  argIndex: number
): GenDeclaration {
  return tFunctionDeclaration(
    getParameterFunctionId,
    tTypeParametersExpression([]),
    id("number"),
    [tTypedIdentifier(id(findNotReservedName(fieldName)), id(fieldTypeName))],
    getNegationDerivationFunctionBody(
      tlbCode,
      fieldTypeName,
      argIndex,
      fieldName
    )
  );
}
export function dictStoreStmt(currentCell: string, storeParametersInside: Expression[], keyForStore: Expression, valueStore: ObjectExpression): Statement | undefined {
  return tExpressionStatement(tFunctionCall(tMemberExpression(id(currentCell), id('storeDict')), storeParametersInside.concat([keyForStore, valueStore])));
}
export function dictTypeParamExpr(fieldType: TLBHashmapType, typeParamExpr: TypeExpression): TypeExpression | undefined {
  return tTypeWithParameters(id('Dictionary'), tTypeParametersExpression([(isBigIntExpr(fieldType.key) ? id('bigint') : id('number')), typeParamExpr]));
}
export function dictValueStore(typeParamExpr: TypeExpression, storeFunctionExpr: Expression, extraStoreFunctionExpr?: Expression) {
  let subStatements = [tExpressionStatement(tFunctionCall(tFunctionCall(storeFunctionExpr, [id(extraStoreFunctionExpr? 'arg.value' : 'arg')]), [id('builder')]))]
  if (extraStoreFunctionExpr) {
    subStatements = [tExpressionStatement(tFunctionCall(tFunctionCall(extraStoreFunctionExpr, [id('arg.extra')]), [id('builder')]))].concat(subStatements)
  }
  return tObjectExpression([
    tObjectProperty(id('serialize'),
      tArrowFunctionExpression([tTypedIdentifier(id('arg'), typeParamExpr), tTypedIdentifier(id('builder'), id('Builder'))], subStatements)
    ),
    tObjectProperty(id('parse'),
      id("() => { throw new Error('Not implemented') }")
    )
  ]);
}
export function dictLoadExpr(keyForLoad: Expression, loadFunctionExpr: Expression, currentSlice: string): Expression | undefined {
  return tFunctionCall(tMemberExpression(id('Dictionary'), id('load')), [keyForLoad, dictValueLoad(loadFunctionExpr), id(currentSlice)]);
}
function dictValueLoad(loadFunctionExpr: Expression) {
  return tObjectExpression([
    tObjectProperty(id('serialize'),
      id("() => { throw new Error('Not implemented') }")
    ),
    tObjectProperty(id('parse'),
      loadFunctionExpr
    )
  ]);
}
export function dictKeyExpr(keyType: TLBMathExprType, ctx: ConstructorContext, objectId?: string): Expression {
  let param: Expression;
  if (objectId) {
    param = convertToAST(keyType.expr, ctx.constructor, id(objectId));
  } else {
    param = convertToAST(keyType.expr, ctx.constructor);
  }
  return tFunctionCall(tMemberExpression(id('Dictionary.Keys'), (isBigIntExpr(keyType) ? id('BigUint') : id('Uint'))), [param]);
}export function dictAugParse(extraLoadExpr: Expression, loadExpr: Expression): Expression {
  return tArrowFunctionExpression([tTypedIdentifier(id('slice'), id('Slice'))], [
    tReturnStatement(tObjectExpression([
      tObjectProperty(id('extra'), extraLoadExpr),
      tObjectProperty(id('value'), loadExpr),
    ]))
  ]);
}
export function dictAugTypeExpr(typeExpr: TypeExpression, extraTypeExpr: TypeExpression): TypeExpression {
  return tStructExpression([tTypedIdentifier(id('value'), typeExpr), tTypedIdentifier(id('extra'), extraTypeExpr)]);
}

