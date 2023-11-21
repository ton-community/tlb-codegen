import { Builder } from 'ton'
import { Slice } from 'ton'
import { beginCell } from 'ton'
import { BitString } from 'ton'
export type Simple = {
  	kind: 'Simple';
	a: number;
	b: number;
  };
export function loadSimple(slice: Slice): Simple {
  	let a: number = slice.loadUint(32);
	let b: number = slice.loadUint(32);
	return {
  		kind: 'Simple',
		a: a,
		b: b
  	};
  }
export function storeSimple(simple: Simple): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(simple.a, 32);
		builder.storeUint(simple.b, 32);
  	};
  }
export type TwoConstructors = TwoConstructors_bool_false | TwoConstructors_bool_true;
export type TwoConstructors_bool_false = {
  	kind: 'TwoConstructors_bool_false';
	a: number;
	b: number;
	c: number;
  };
export type TwoConstructors_bool_true = {
  	kind: 'TwoConstructors_bool_true';
	b: number;
  };
export function loadTwoConstructors(slice: Slice): TwoConstructors {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let a: number = slice.loadUint(32);
		let b: number = slice.loadUint(7);
		let c: number = slice.loadUint(32);
		return {
  			kind: 'TwoConstructors_bool_false',
			a: a,
			b: b,
			c: c
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let b: number = slice.loadUint(32);
		return {
  			kind: 'TwoConstructors_bool_true',
			b: b
  		};
  	};
	throw new Error('');
  }
export function storeTwoConstructors(twoConstructors: TwoConstructors): (builder: Builder) => void {
  	if ((twoConstructors.kind == 'TwoConstructors_bool_false')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			builder.storeUint(twoConstructors.a, 32);
			builder.storeUint(twoConstructors.b, 7);
			builder.storeUint(twoConstructors.c, 32);
  		};
  	};
	if ((twoConstructors.kind == 'TwoConstructors_bool_true')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			builder.storeUint(twoConstructors.b, 32);
  		};
  	};
	throw new Error('');
  }
export type FixedIntParam = {
  	kind: 'FixedIntParam';
	y: number;
  };
export function loadFixedIntParam(slice: Slice): FixedIntParam {
  	let y: number = slice.loadUint(5);
	return {
  		kind: 'FixedIntParam',
		y: y
  	};
  }
export function storeFixedIntParam(fixedIntParam: FixedIntParam): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(fixedIntParam.y, 5);
  	};
  }
export type TypedParam = {
  	kind: 'TypedParam';
	y: FixedIntParam;
	c: number;
  };
export function loadTypedParam(slice: Slice): TypedParam {
  	let c: number = slice.loadUint(32);
	return {
  		kind: 'TypedParam',
		y: loadFixedIntParam(slice),
		c: c
  	};
  }
export function storeTypedParam(typedParam: TypedParam): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeFixedIntParam(typedParam.y)(builder);
		builder.storeUint(typedParam.c, 32);
  	};
  }
export type SharpConstructor = {
  	kind: 'SharpConstructor';
	y: FixedIntParam;
	c: number;
  };
export function loadSharpConstructor(slice: Slice): SharpConstructor {
  	let c: number = slice.loadUint(32);
	return {
  		kind: 'SharpConstructor',
		y: loadFixedIntParam(slice),
		c: c
  	};
  }
export function storeSharpConstructor(sharpConstructor: SharpConstructor): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeFixedIntParam(sharpConstructor.y)(builder);
		builder.storeUint(sharpConstructor.c, 32);
  	};
  }
