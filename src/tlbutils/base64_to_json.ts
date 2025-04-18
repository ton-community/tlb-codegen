import { Address, BitString, Slice, Dictionary, Cell } from '@ton/core';

// import { importTonDependencies } from '../pages/Main/utils';

export async function base64ToHumanJson(base64: String, loadFunction: any) {
	// const { Cell } = await importTonDependencies();

	let cell = Cell.fromBase64(base64.toString());
	let loadedType = loadFunction(cell.beginParse());
	return await typeToHumanJson(loadedType);
}

async function typeToHumanJson(obj: any) {
	// const { Address, BitString, Slice, Dictionary, Cell } =
		// await importTonDependencies();

	let result: any = {};
	if (obj == undefined) {
		return null;
	}
	if (obj.kind) {
		result['kind'] = obj.kind;
	}
	if (
		typeof obj === 'number' ||
		typeof obj === 'bigint' ||
		typeof obj === 'string' ||
		typeof obj === 'boolean'
	) {
		result = obj;
	} else if (obj instanceof Address) {
		result = obj.toRawString();
	} else if (obj instanceof BitString) {
		result = '0b';
		for (let i = 0; i < obj.length; i++) {
			result += obj.at(i) ? '1' : '0';
		}
	} else if (obj instanceof Cell) {
		result = obj.toBoc().toString('base64');
	} else if (obj instanceof Slice) {
		result = obj.asCell().toBoc().toString('base64');
	} else if (Object.prototype.toString.call(obj) === '[object Array]') {
		result = [];
		for (let i = 0; i < obj.length; i++) {
			result.push(await typeToHumanJson(obj[i]));
		}
	} else if (obj instanceof Dictionary) {
		result = {};

		let keys = obj.keys();

		for (let i = 0; i < keys.length; i++) {
			result[keys[i]] = await typeToHumanJson(obj.get(keys[i]));
		}
	} else {
		let keys = Object.keys(obj);
		for (let i = 0; i < keys.length; i++) {
			result[keys[i]] = await typeToHumanJson(obj[keys[i]]);
		}
	}
	return result;
}
