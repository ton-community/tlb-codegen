import {
	TLBBinaryOp,
	TLBConstructor,
	TLBMathExpr,
	TLBNumberExpr,
	TLBType,
	TLBVarExpr,
	// @ts-ignore
} from '../..';

export function getSubStructName(
	tlbType: TLBType,
	constructor: TLBConstructor
): string {
	if (tlbType.constructors.length > 1) {
		return tlbType.name + '_' + constructor.name;
	} else {
		return tlbType.name;
	}
}

export function evaluateExpression(
	expr: TLBMathExpr,
	y: Map<string, TLBMathExpr> = new Map<string, TLBMathExpr>()
): number | undefined {
	if (typeof expr == 'number') {
		return expr;
	} else if (expr instanceof TLBNumberExpr) {
		return expr.n;
	} else if (expr instanceof TLBVarExpr) {
		let sub = y.get(expr.x);
		if (sub) {
			return evaluateExpression(sub);
		}
	} else if (expr instanceof TLBBinaryOp) {
		let left = evaluateExpression(expr.left, y);
		let right = evaluateExpression(expr.right, y);
		if (left && right) {
			switch (expr.operation) {
				case '+':
					return left + right;
				case '*':
					return left * right;
			}
		}
	}
	return undefined;
}
