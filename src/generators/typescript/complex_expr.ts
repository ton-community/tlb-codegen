import { TLBConstructor, TLBConstructorTag } from "../../ast";
import { Expression, Statement, id, tBinaryExpression, tExpressionStatement, tFunctionCall, tMemberExpression, tNumericLiteral } from "./tsgen";

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
}
