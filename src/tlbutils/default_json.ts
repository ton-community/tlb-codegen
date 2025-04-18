import { isBigIntExpr } from '../generators/typescript/utils';

import {
	isBigIntForJson,
	TLBCode,
	TLBConstructor,
	TLBField,
	TLBFieldType,
	TLBMathExpr,
	TLBParameter,
	TLBType,
	TLBVarExpr,
	TLBVariable,
	// @ts-ignore
} from '../..';

import { beginCell } from '@ton/core';
// import { importTonDependencies } from '../pages/Main/utils';

import { evaluateExpression, getSubStructName } from './utils';

/// Note: This function tries to generate a default JSON object.
/// However it does not check the conditions. So it may return an invalid JSON object.
/// In order to try to make it valid, you should store this object using corresponding
/// store function and then load it back using corresponding load function.
export async function getDefaulHumanJsonUnsafe(
	tlbCode: TLBCode,
	tlbType: TLBType
) {
	let jsonGen = new DefaultJsonGenerator(tlbCode);
	// const { beginCell } = await importTonDependencies();
	jsonGen.beginCell = beginCell;

	if (tlbType.constructors[0].parameters.length > 0) {
		return;
	}
	let res = jsonGen.addTlbType(tlbType);
	return res;
}

export type JsonContext = {
	constructorsReached: Set<String>;
	constructorsCalculated: Map<String, number>;
};
export class DefaultJsonGenerator {
	tlbCode: TLBCode;
	beginCell: any;

	constructor(tlbCode: TLBCode) {
		this.tlbCode = tlbCode;
	}

	addBitLenFunction(): void {}

	addTlbType(tlbType: TLBType): any {
		let ctx: JsonContext = {
			constructorsReached: new Set<String>(),
			constructorsCalculated: new Map<String, number>(),
		};

		let x = this.getTLBTypeNameResult(tlbType.name, ctx, []);

		return x;
	}

	getTLBTypeNameResult(
		tlbTypeName: string,
		ctx: JsonContext,
		parameters: TLBMathExpr[]
	): any | undefined {
		let tlbType = this.tlbCode.types.get(tlbTypeName);
		if (tlbType) {
			return this.getTLBTypeResult(tlbType, ctx, parameters);
		}
	}

	getTLBConstructorResult(
		tlbType: TLBType,
		constructor: TLBConstructor,
		ctx: JsonContext,
		parameters: TLBMathExpr[],
		constructorIdx: number
	): any | undefined {
		ctx.constructorsReached.add(tlbType.name);
		let x: any = {};

		let hasParams = false;
		constructor.parameters.forEach((parameter: TLBParameter) => {
			if (parameter.variable.type == 'Type') {
				hasParams = true;
			}
		});

		let y = new Map<string, TLBMathExpr>();
		if (parameters.length != constructor.parameters.length && hasParams) {
			return undefined;
		}
		for (let i = 0; i < parameters.length; i++) {
			y.set(constructor.parameters[i].variable.name, parameters[i]);
		}

		x.kind = getSubStructName(tlbType, constructor);

		constructor.variables.forEach((variable: TLBVariable) => {
			if (variable.type == '#' && !variable.isField) {
				if (y.has(variable.name)) {
					x[variable.name] = y.get(variable.name);
				} else {
					x[variable.name] = 1;
				}
			}
		});

		let ok = true;

		constructor.fields.forEach((field: TLBField) => {
			let handleFieldResult = this.handleField(field, x, ctx, y);
			if (!handleFieldResult) {
				ok = false;
			}
		});

		if (!ok) {
			return undefined;
		}

		constructor.variables.forEach((variable: TLBVariable) => {
			if (variable.type == '#') {
				if (y.has(variable.name)) {
					let t = y.get(variable.name);
					if (t) {
						x[variable.name] = evaluateExpression(t, y);
					}
				} else if (!variable.isField) {
					x[variable.name] = 1;
				}
			}
		});

		ctx.constructorsCalculated.set(tlbType.name, constructorIdx);
		return x;
	}

	getTLBTypeResult(
		tlbType: TLBType,
		ctx: JsonContext,
		parameters: TLBMathExpr[]
	): any | undefined {
		if (ctx.constructorsReached.has(tlbType.name)) {
			let i = ctx.constructorsCalculated.get(tlbType.name);
			if (i != undefined) {
				return this.getTLBConstructorResult(
					tlbType,
					tlbType.constructors[i],
					ctx,
					parameters,
					i
				);
			}
			return undefined;
		}

		for (let i = 0; i < tlbType.constructors.length; i++) {
			let constructor = tlbType.constructors[i];
			let expr = this.getTLBConstructorResult(
				tlbType,
				constructor,
				ctx,
				parameters,
				i
			);
			if (expr) {
				return expr;
			}
		}
		return undefined;
	}

	handleField(
		field: TLBField,
		x: any,
		ctx: JsonContext,
		y: Map<string, TLBMathExpr>
	): boolean {
		if (field.subFields.length > 0) {
			let ok = true;
			field.subFields.forEach((fieldDef: TLBField) => {
				let fieldResult = this.handleField(fieldDef, x, ctx, y);
				if (!fieldResult) {
					ok = false;
				}
			});
			return ok;
		}
		if (field.subFields.length == 0) {
			let res = this.handleType(field, field.fieldType, ctx, y);
			if (res !== undefined) {
				x[field.name] = res;
			} else {
				return false;
			}
		}
		return true;
	}

	handleType(
		field: TLBField,
		fieldType: TLBFieldType,
		ctx: JsonContext,
		y: Map<string, TLBMathExpr>
	): any | undefined {
		let res: any | undefined = undefined;

		if (fieldType.kind == 'TLBNumberType') {
			if (isBigIntForJson(fieldType)) {
				res = '0';
			} else {
				res = 0;
			}
		} else if (fieldType.kind == 'TLBBitsType') {
			let bitsNumber = evaluateExpression(fieldType.bits, y);
			if (bitsNumber) {
				res = '0b' + '0'.repeat(bitsNumber);
			} else {
				throw new Error(
					`Number of bits should be known and not zero in field ${field.name}`
				);
			}
		} else if (fieldType.kind == 'TLBCellType') {
			res = this.beginCell().endCell().toBoc().toString('base64');
		} else if (fieldType.kind == 'TLBBoolType') {
			if (fieldType.value) {
				res = { kind: 'Bool', value: true };
			} else {
				res = { kind: 'Bool', value: false };
			}
		} else if (fieldType.kind == 'TLBCoinsType') {
			res = '0';
		} else if (fieldType.kind == 'TLBVarIntegerType') {
			res = '0';
		} else if (fieldType.kind == 'TLBAddressType') {
			if (fieldType.addrType == 'Internal') {
				res =
					'0:0000000000000000000000000000000000000000000000000000000000000000';
			} else if (fieldType.addrType == 'External') {
				res = null;
			} else if (fieldType.addrType == 'Any') {
				res = null;
			}
		} else if (fieldType.kind == 'TLBExprMathType') {
			if (isBigIntExpr(fieldType)) {
				res = '0';
			} else {
				res = 0;
			}
		} else if (fieldType.kind == 'TLBNegatedType') {
			res = 0;
		} else if (fieldType.kind == 'TLBNamedType') {
			if (y.has(fieldType.name)) {
				res = y.get(fieldType.name);
			} else {
				let parameters: any[] = this.getParameters(fieldType.arguments, ctx, y);
				res = this.getTLBTypeNameResult(fieldType.name, ctx, parameters);

				let i = ctx.constructorsCalculated.get(fieldType.name);
				if (i != undefined) {
					let constructor = this.tlbCode.types.get(fieldType.name)!
						.constructors[i];
					for (let i = 0; i < constructor.parameters.length; i++) {
						if (constructor.parameters[i].variable.isConst) {
							let theExpr = constructor.parameters[i].variable.initialExpr;
							if (theExpr) {
								let argument = fieldType.arguments[i];
								if (argument.kind == 'TLBExprMathType') {
									if (argument.initialExpr instanceof TLBVarExpr) {
										y.set(argument.initialExpr.x, theExpr);
									}
								}
							}
						}
					}
				}
			}
		} else if (fieldType.kind == 'TLBCondType') {
			res = null;
		} else if (fieldType.kind == 'TLBTupleType') {
			res = [];
		} else if (fieldType.kind == 'TLBMultipleType') {
			let x = this.handleType(field, fieldType.value, ctx, y);
			res = [];
			let t = evaluateExpression(fieldType.times, y);
			if (t) {
				for (let i = 0; i < t; i++) {
					res.push(x);
				}
			}
		} else if (fieldType.kind == 'TLBCellInsideType') {
			throw 'Not implemented TLBCellInsideType';
			// TODO
			res = 'tlbcellsinsidetype';
		} else if (fieldType.kind == 'TLBHashmapType') {
			res = {};
		} else if (fieldType.kind == 'TLBExoticType') {
			res = this.beginCell().endCell().toBoc().toString('base64');
		} else {
			throw 'No such kind';
		}

		return res;
	}

	private getParameters(
		args: TLBFieldType[],
		ctx: JsonContext,
		y: Map<string, TLBMathExpr>
	): any[] {
		let parameters: any[] = [];
		args.forEach((argument) => {
			if (argument.kind == 'TLBNamedType') {
				let currentParameters = this.getParameters(argument.arguments, ctx, y);
				let tmp = this.getTLBTypeNameResult(
					argument.name,
					ctx,
					currentParameters
				);
				if (tmp) {
					parameters.push(tmp);
				} else {
					let t = y.get(argument.name);
					if (t) {
						parameters.push(t);
					} else {
						throw 'wrong';
					}
				}
			} else if (argument.kind == 'TLBCellType') {
				parameters.push(this.beginCell().endCell().toBoc().toString('base64'));
			} else if (argument.kind == 'TLBCellInsideType') {
				let currentParameters = this.getParameters([argument.value], ctx, y);
				parameters = parameters.concat(currentParameters);
			} else {
				let param: number | undefined = 2;
				if (argument.kind == 'TLBExprMathType') {
					param = evaluateExpression(argument.expr, y);
				}
				parameters.push(param);
			}
		});
		return parameters;
	}
}
