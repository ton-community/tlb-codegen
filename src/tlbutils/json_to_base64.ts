import {
	isBigIntExprForJson,
	isBigIntForJson,
	TLBCode,
	TLBConstructor,
	TLBField,
	TLBFieldType,
	TLBType,
	TLBVariable,
	// @ts-ignore
} from '../..';

import { Address, Cell, Dictionary, beginCell } from '@ton/core';

import { evaluateExpression, getSubStructName } from './utils';

let constructorsIndex: Map<string, TLBConstructor> = new Map<
	string,
	TLBConstructor
>();

export async function humanJsonToBase64(
	typeName: string,
	tlbCode: TLBCode,
	json: any,
	method: any
) {
	let s = new X();
	// const { Address, Cell, Dictionary, beginCell } =
		// await importTonDependencies();
	s.Address = Address;
	s.Cell = Cell;
	s.Dictionary = Dictionary;
	s.beginCell = beginCell;
	s = s.jsonToType(typeName, tlbCode, json);

	let builder = beginCell();
	method(s)(builder);
	return builder.asCell().toBoc().toString('base64');
}

class X {
	Address: any;
	Cell: any;
	Dictionary: any;
	beginCell: any;

	constructor() {}
	fillConstructorIndex(tlbCode: TLBCode) {
		if (constructorsIndex.size == 0) {
			tlbCode.types.forEach((tlbType: TLBType) => {
				tlbType.constructors.forEach((constructor: TLBConstructor) => {
					constructorsIndex.set(
						getSubStructName(tlbType, constructor),
						constructor
					);
				});
			});
		}
	}

	jsonToType(kindName: string, tlbCode: TLBCode, json: any) {
		this.fillConstructorIndex(tlbCode);

		let constructor = constructorsIndex.get(kindName);
		if (constructor) {
			return this.getTLBTypeResult(kindName, constructor, tlbCode, json, []);
		}
	}

	getTLBTypeNameResult(
		kindName: string,
		tlbCode: TLBCode,
		json: any,
		parameters: TLBFieldType[]
	) {
		let constructor = constructorsIndex.get(kindName);
		if (constructor) {
			return this.getTLBTypeResult(
				kindName,
				constructor,
				tlbCode,
				json,
				parameters
			);
		}
	}

	getTLBTypeResult(
		kindName: string,
		constructor: TLBConstructor,
		tlbCode: TLBCode,
		json: any,
		parameters: TLBFieldType[]
	) {
		return this.getTLBConstructorResult(
			kindName,
			constructor,
			tlbCode,
			json,
			parameters
		);
	}

	getTLBConstructorResult(
		kindName: string,
		constructor: TLBConstructor,
		tlbCode: TLBCode,
		json: any,
		parameters: TLBFieldType[]
	) {
		let result: any = {};
		result.kind = kindName;

		constructor.variables.forEach((variable: TLBVariable) => {
			if (variable.type == '#' && !variable.isField) {
				result[variable.name] = json[variable.name];
			}
		});

		let y = new Map<string, TLBFieldType>();
		for (let i = 0; i < parameters.length; i++) {
			y.set(constructor.parameters[i].variable.name, parameters[i]);
		}

		constructor.fields.forEach((field: TLBField) => {
			let json_to_pass = json.hasOwnProperty(field.name)
				? json[field.name]
				: json;
			Object.assign(result, this.handleField(field, tlbCode, json_to_pass, y));
		});
		return result;
	}

	handleField(
		field: TLBField,
		tlbCode: TLBCode,
		json: any,
		y: Map<string, TLBFieldType>
	) {
		if (field.subFields.length == 0) {
			let res: any = {};
			res[field.name] = this.handleType(
				field,
				field.fieldType,
				tlbCode,
				json,
				y
			);
			return res;
		} else {
			let res: any = {};
			field.subFields.forEach((fieldDef: TLBField) => {
				let json_to_pass =
					json[fieldDef.name] != undefined ? json[fieldDef.name] : json;
				Object.assign(
					res,
					this.handleField(fieldDef, tlbCode, json_to_pass, y)
				);
			});
			return res;
		}
	}

	get_parameters(args: TLBFieldType[], y: Map<string, TLBFieldType>) {
		let res: TLBFieldType[] = [];
		args.forEach((arg) => {
			if (arg.kind == 'TLBNamedType' && y.has(arg.name)) {
				res.push(y.get(arg.name)!);
			} else {
				res.push(arg);
			}
		});
		return res;
	}

	handleType(
		field: TLBField,
		fieldType: TLBFieldType,
		tlbCode: TLBCode,
		json: any,
		y: Map<string, TLBFieldType>
	) {
		let res: any = json;

		if (fieldType.kind == 'TLBNumberType') {
			if (isBigIntForJson(fieldType)) {
				res = BigInt(json);
			} else {
				res = json;
			}
		} else if (fieldType.kind == 'TLBBitsType') {
			let builder = this.beginCell();
			for (let i = 2; i < json.length; i++) {
				let bit = parseInt(json[i]);
				builder.storeBit(bit);
			}
			res = builder
				.endCell()
				.beginParse()
				.loadBits(json.length - 2);
		} else if (fieldType.kind == 'TLBCellType') {
			res = this.Cell.fromBase64(json.toString());
		} else if (fieldType.kind == 'TLBBoolType') {
			res = json;
		} else if (fieldType.kind == 'TLBCoinsType') {
			res = BigInt(json);
		} else if (fieldType.kind == 'TLBVarIntegerType') {
			res = BigInt(json);
		} else if (fieldType.kind == 'TLBAddressType') {
			if (json == null) {
				res = null;
			} else {
				res = this.Address.parse(json);
			}
		} else if (fieldType.kind == 'TLBExprMathType') {
			if (isBigIntExprForJson(fieldType)) {
				res = BigInt(json);
			} else {
				res = json;
			}
		} else if (fieldType.kind == 'TLBNegatedType') {
			res = json;
		} else if (fieldType.kind == 'TLBNamedType') {
			if (y.has(fieldType.name)) {
				let paramType = y.get(fieldType.name)!;
				res = this.handleType(field, paramType, tlbCode, json, y);
			} else if (json['kind']) {
				let parameters = this.get_parameters(fieldType.arguments, y);
				res = this.getTLBTypeNameResult(
					json['kind'],
					tlbCode,
					json,
					parameters
				);
			}
		} else if (fieldType.kind == 'TLBCondType') {
			if (json == null) {
				res = undefined;
			} else {
				res = this.handleType(field, fieldType.value, tlbCode, json, y);
			}
		} else if (fieldType.kind == 'TLBTupleType') {
			res = [];
			for (let i = 0; i < json.length; i++) {
				res.push(this.handleType(field, fieldType.value[i], tlbCode, json[i], y));
			}
		} else if (fieldType.kind == 'TLBMultipleType') {
			res = [];
			for (let i = 0; i < json.length; i++) {
				res.push(this.handleType(field, fieldType.value, tlbCode, json[i], y));
			}
		} else if (fieldType.kind == 'TLBCellInsideType') {
			res = this.handleType(field, fieldType.value, tlbCode, json, y);
		} else if (fieldType.kind == 'TLBHashmapType') {
			if (isBigIntExprForJson(fieldType.key)) {
				res = this.Dictionary.empty(
					this.Dictionary.Keys.BigInt(evaluateExpression(fieldType.key, y))
				);
			} else {
				res = this.Dictionary.empty();
			}
			for (let key of Object.keys(json)) {
				let intkey = BigInt(key);
				let value = undefined;
				if (fieldType.extra) {
					let extra = this.handleType(
						field,
						fieldType.extra,
						tlbCode,
						json[key]['extra'],
						y
					);
					value = this.handleType(
						field,
						fieldType.value,
						tlbCode,
						json[key]['value'],
						y
					);
					value = { extra: extra, value: value };
				} else {
					value = this.handleType(
						field,
						fieldType.value,
						tlbCode,
						json[key],
						y
					);
				}
				if (isBigIntExprForJson(fieldType.key)) {
					res.set(BigInt(intkey), value);
				} else {
					res.set(Number(intkey), value);
				}
			}
		} else if (fieldType.kind == 'TLBExoticType') {
			res = this.Cell.fromBase64(json.toString());
		}

		return res;
	}
}
