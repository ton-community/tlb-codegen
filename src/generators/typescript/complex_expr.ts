import { TLBConstructorTag } from "../../ast";
import { getCurrentSlice } from "../../utils";
import { Expression, GenDeclaration, Statement, id, tArrowFunctionExpression, tBinaryExpression, tDeclareVariable, tExpressionStatement, tForCycle, tFunctionCall, tFunctionDeclaration, tIfStatement, tMemberExpression, tNumericLiteral, tReturnStatement, tStringLiteral, tTypeParametersExpression, tTypedIdentifier } from "./tsgen";

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

