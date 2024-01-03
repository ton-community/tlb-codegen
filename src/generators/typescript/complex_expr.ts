import { TLBConstructor, TLBConstructorTag } from "../../ast";
import { ConstructorContext } from "./generator";
import { Expression, Statement, id, tArrowFunctionExpression, tBinaryExpression, tExpressionStatement, tFunctionCall, tMemberExpression, tNumericLiteral, tReturnStatement, tTypedIdentifier } from "./tsgen";

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

