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
export type TypedField = {
  	kind: 'TypedField';
	y: FixedIntParam;
	c: number;
  };
export function loadTypedField(slice: Slice): TypedField {
  	let y: FixedIntParam = loadFixedIntParam(slice);
	let c: number = slice.loadUint(32);
	return {
  		kind: 'TypedField',
		y: y,
		c: c
  	};
  }
export function storeTypedField(typedField: TypedField): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeFixedIntParam(typedField.y)(builder);
		builder.storeUint(typedField.c, 32);
  	};
  }
export type SharpConstructor = {
  	kind: 'SharpConstructor';
	y: FixedIntParam;
	c: number;
  };
export function loadSharpConstructor(slice: Slice): SharpConstructor {
  	let y: FixedIntParam = loadFixedIntParam(slice);
	let c: number = slice.loadUint(32);
	return {
  		kind: 'SharpConstructor',
		y: y,
		c: c
  	};
  }
export function storeSharpConstructor(sharpConstructor: SharpConstructor): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeFixedIntParam(sharpConstructor.y)(builder);
		builder.storeUint(sharpConstructor.c, 32);
  	};
  }
export type Maybe<TheType> = Maybe_nothing<TheType> | Maybe_just<TheType>;
export type Maybe_nothing<TheType> = {
  	kind: 'Maybe_nothing';
  };
export type Maybe_just<TheType> = {
  	kind: 'Maybe_just';
	value: TheType;
  };
export function loadMaybe<TheType>(slice: Slice, loadTheType: (slice: Slice) => TheType): Maybe<TheType> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'Maybe_nothing'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let value: TheType = loadTheType(slice);
		return {
  			kind: 'Maybe_just',
			value: value
  		};
  	};
	throw new Error('');
  }
export function storeMaybe<TheType>(maybe: Maybe<TheType>, storeTheType: (theType: TheType) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((maybe.kind == 'Maybe_nothing')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((maybe.kind == 'Maybe_just')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeTheType(maybe.value)(builder);
  		};
  	};
	throw new Error('');
  }
export type TypedParam = {
  	kind: 'TypedParam';
	x: Maybe<SharpConstructor>;
  };
export function loadTypedParam(slice: Slice): TypedParam {
  	let x: Maybe<SharpConstructor> = loadMaybe<SharpConstructor>(slice, loadSharpConstructor);
	return {
  		kind: 'TypedParam',
		x: x
  	};
  }
export function storeTypedParam(typedParam: TypedParam): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeMaybe<SharpConstructor>(typedParam.x, storeSharpConstructor)(builder);
  	};
  }
export type BitLenArg = {
  	kind: 'BitLenArg';
	x: number;
	value: number;
  };
export function loadBitLenArg(slice: Slice, x: number): BitLenArg {
	console.log(slice)
  	let value: number = slice.loadUint(x);
	return {
  		kind: 'BitLenArg',
		x: x,
		value: value
  	};
  }
export function storeBitLenArg(bitLenArg: BitLenArg): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(bitLenArg.value, bitLenArg.x);
  	};
  }
export type BitLenArgUser = {
  	kind: 'BitLenArgUser';
	t: BitLenArg;
  };
export function loadBitLenArgUser(slice: Slice): BitLenArgUser {
  	let t: BitLenArg = loadBitLenArg(slice, 4);
	return {
  		kind: 'BitLenArgUser',
		t: t
  	};
  }
export function storeBitLenArgUser(bitLenArgUser: BitLenArgUser): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeBitLenArg(bitLenArgUser.t)(builder);
  	};
  }
export type ExprArg = {
  	kind: 'ExprArg';
	x: number;
	value: number;
  };
export function loadExprArg(slice: Slice, x: number): ExprArg {
  	let value: number = slice.loadUint((2 + x));
	return {
  		kind: 'ExprArg',
		x: (2 + x),
		value: value
  	};
  }
export function storeExprArg(exprArg: ExprArg): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(exprArg.value, exprArg.x);
  	};
  }
export type ExprArgUser = {
  	kind: 'ExprArgUser';
	t: ExprArg;
  };
export function loadExprArgUser(slice: Slice): ExprArgUser {
  	let t: ExprArg = loadExprArg(slice, 4);
	return {
  		kind: 'ExprArgUser',
		t: t
  	};
  }
export function storeExprArgUser(exprArgUser: ExprArgUser): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeExprArg(exprArgUser.t)(builder);
  	};
  }
