import { TLBConstructorTag } from "../../ast";
import { firstLower, getCurrentSlice } from "../../utils";
import { BinaryExpression, Expression, GenDeclaration, Statement, TypedIdentifier, id, tArrowFunctionExpression, tArrowFunctionType, tBinaryExpression, tDeclareVariable, tExpressionStatement, tForCycle, tFunctionCall, tFunctionDeclaration, tIfStatement, tMemberExpression, tNumericLiteral, tReturnStatement, tStringLiteral, tTypeParametersExpression, tTypedIdentifier } from "./tsgen";

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
        [tExpressionStatement(id("return n.toString(2).length;"))]
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
        []
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

