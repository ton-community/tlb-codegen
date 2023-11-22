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
export function loadExprArg(slice: Slice, arg0: number): ExprArg {
  	let value: number = slice.loadUint((arg0 - 2));
	return {
  		kind: 'ExprArg',
		x: (arg0 - 2),
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
  	let t: ExprArg = loadExprArg(slice, 6);
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
export type ComplexTypedField = {
  	kind: 'ComplexTypedField';
	a: ExprArgUser;
  };
export function loadComplexTypedField(slice: Slice): ComplexTypedField {
  	let a: ExprArgUser = loadExprArgUser(slice);
	return {
  		kind: 'ComplexTypedField',
		a: a
  	};
  }
export function storeComplexTypedField(complexTypedField: ComplexTypedField): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeExprArgUser(complexTypedField.a)(builder);
  	};
  }
export type CellTypedField = {
  	kind: 'CellTypedField';
	a: ExprArgUser;
  };
export function loadCellTypedField(slice: Slice): CellTypedField {
  	let slice1 = slice.loadRef().beginParse();
	let a: ExprArgUser = loadExprArgUser(slice1);
	return {
  		kind: 'CellTypedField',
		a: a
  	};
  }
export function storeCellTypedField(cellTypedField: CellTypedField): (builder: Builder) => void {
  	return (builder: Builder) => {
  		let cell1 = beginCell();
		storeExprArgUser(cellTypedField.a)(cell1);
		builder.storeRef(cell1);
  	};
  }
export type CellsSimple = {
  	kind: 'CellsSimple';
	t: number;
	q: number;
	a: number;
	e: number;
	b: number;
	d: number;
	c: number;
  };
export function loadCellsSimple(slice: Slice): CellsSimple {
  	let t: number = slice.loadUint(32);
	let slice1 = slice.loadRef().beginParse();
	let q: number = slice1.loadUint(32);
	let slice2 = slice.loadRef().beginParse();
	let a: number = slice2.loadUint(32);
	let slice21 = slice2.loadRef().beginParse();
	let e: number = slice21.loadUint(32);
	let slice22 = slice2.loadRef().beginParse();
	let b: number = slice22.loadUint(32);
	let d: number = slice22.loadUint(32);
	let slice221 = slice22.loadRef().beginParse();
	let c: number = slice221.loadUint(32);
	return {
  		kind: 'CellsSimple',
		t: t,
		q: q,
		a: a,
		e: e,
		b: b,
		d: d,
		c: c
  	};
  }
export function storeCellsSimple(cellsSimple: CellsSimple): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(cellsSimple.t, 32);
		let cell1 = beginCell();
		cell1.storeUint(cellsSimple.q, 32);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		cell2.storeUint(cellsSimple.a, 32);
		let cell21 = beginCell();
		cell21.storeUint(cellsSimple.e, 32);
		cell2.storeRef(cell21);
		let cell22 = beginCell();
		cell22.storeUint(cellsSimple.b, 32);
		cell22.storeUint(cellsSimple.d, 32);
		let cell221 = beginCell();
		cell221.storeUint(cellsSimple.c, 32);
		cell22.storeRef(cell221);
		cell2.storeRef(cell22);
		builder.storeRef(cell2);
  	};
  }
export type IntBits<Arg> = {
  	kind: 'IntBits';
	d: number;
	g: BitString;
	arg: Arg;
	x: Slice;
  };
export function loadIntBits<Arg>(slice: Slice, loadArg: (slice: Slice) => Arg): IntBits<Arg> {
  	let d: number = slice.loadInt(11);
	let g: BitString = slice.loadBits(2);
	let arg: Arg = loadArg(slice);
	let x: Slice = slice;
	return {
  		kind: 'IntBits',
		d: d,
		g: g,
		arg: arg,
		x: x
  	};
  }
export function storeIntBits<Arg>(intBits: IntBits<Arg>, storeArg: (arg: Arg) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeInt(intBits.d, 11);
		builder.storeBits(intBits.g);
		storeArg(intBits.arg)(builder);
		builder.storeSlice(intBits.x);
  	};
  }
export type IntBitsInside = {
  	kind: 'IntBitsInside';
	x: number;
	a: IntBits<number>;
  };
export function loadIntBitsInside(slice: Slice, x: number): IntBitsInside {
  	let a: IntBits<number> = loadIntBits<number>(slice, () => {
  		return slice.loadInt((1 + x));
  	});
	return {
  		kind: 'IntBitsInside',
		x: x,
		a: a
  	};
  }
export function storeIntBitsInside(intBitsInside: IntBitsInside): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeIntBits<number>(intBitsInside.a, (arg: number) => {
  			return (builder: Builder) => {
  				builder.storeInt(arg, (1 + intBitsInside.x));
  			};
  		})(builder);
  	};
  }
export type IntBitsOutside = {
  	kind: 'IntBitsOutside';
	x: IntBitsInside;
  };
export function loadIntBitsOutside(slice: Slice): IntBitsOutside {
  	let x: IntBitsInside = loadIntBitsInside(slice, 6);
	return {
  		kind: 'IntBitsOutside',
		x: x
  	};
  }
export function storeIntBitsOutside(intBitsOutside: IntBitsOutside): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeIntBitsInside(intBitsOutside.x)(builder);
  	};
  }
export type IntBitsParametrized = {
  	kind: 'IntBitsParametrized';
	e: number;
	h: number;
	f: number;
	i: BitString;
	j: number;
	k: number;
	tc: Slice;
  };
export function loadIntBitsParametrized(slice: Slice, e: number): IntBitsParametrized {
  	let h: number = slice.loadInt((e * 8));
	let f: number = slice.loadUint((7 * e));
	let i: BitString = slice.loadBits((5 + e));
	let j: number = slice.loadInt(5);
	let k: number = slice.loadUint(e);
	let tc: Slice = slice;
	return {
  		kind: 'IntBitsParametrized',
		e: e,
		h: h,
		f: f,
		i: i,
		j: j,
		k: k,
		tc: tc
  	};
  }
export function storeIntBitsParametrized(intBitsParametrized: IntBitsParametrized): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeInt(intBitsParametrized.h, (intBitsParametrized.e * 8));
		builder.storeUint(intBitsParametrized.f, (7 * intBitsParametrized.e));
		builder.storeBits(intBitsParametrized.i);
		builder.storeInt(intBitsParametrized.j, 5);
		builder.storeUint(intBitsParametrized.k, intBitsParametrized.e);
		builder.storeSlice(intBitsParametrized.tc);
  	};
  }
export type IntBitsParametrizedInside = {
  	kind: 'IntBitsParametrizedInside';
	x: number;
	a: IntBitsParametrized;
  };
export function loadIntBitsParametrizedInside(slice: Slice, x: number): IntBitsParametrizedInside {
  	let a: IntBitsParametrized = loadIntBitsParametrized(slice, x);
	return {
  		kind: 'IntBitsParametrizedInside',
		x: x,
		a: a
  	};
  }
export function storeIntBitsParametrizedInside(intBitsParametrizedInside: IntBitsParametrizedInside): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeIntBitsParametrized(intBitsParametrizedInside.a)(builder);
  	};
  }
export type IntBitsParametrizedOutside = {
  	kind: 'IntBitsParametrizedOutside';
	x: IntBitsParametrizedInside;
  };
export function loadIntBitsParametrizedOutside(slice: Slice): IntBitsParametrizedOutside {
  	let x: IntBitsParametrizedInside = loadIntBitsParametrizedInside(slice, 5);
	return {
  		kind: 'IntBitsParametrizedOutside',
		x: x
  	};
  }
export function storeIntBitsParametrizedOutside(intBitsParametrizedOutside: IntBitsParametrizedOutside): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeIntBitsParametrizedInside(intBitsParametrizedOutside.x)(builder);
  	};
  }
export type LessThan = {
  	kind: 'LessThan';
	x: number;
	y: number;
  };
export function loadLessThan(slice: Slice): LessThan {
  	let x: number = slice.loadUint(2);
	let y: number = slice.loadUint(3);
	return {
  		kind: 'LessThan',
		x: x,
		y: y
  	};
  }
export function storeLessThan(lessThan: LessThan): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(lessThan.x, 2);
		builder.storeUint(lessThan.y, 3);
  	};
  }
export type OneComb<A> = {
  	kind: 'OneComb';
	t: number;
	x: A;
  };
export function loadOneComb<A>(slice: Slice, loadA: (slice: Slice) => A): OneComb<A> {
  	let t: number = slice.loadUint(32);
	let x: A = loadA(slice);
	return {
  		kind: 'OneComb',
		t: t,
		x: x
  	};
  }
export function storeOneComb<A>(oneComb: OneComb<A>, storeA: (a: A) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(oneComb.t, 32);
		storeA(oneComb.x)(builder);
  	};
  }

  export type ManyComb = {
		kind: 'ManyComb';
	  y: OneComb<OneComb<OneComb<number>>>;
	};
  export function loadManyComb(slice: Slice): ManyComb {
	console.log(slice)
	  let afterLastArg = () => {return slice.loadUint(3);};
	  console.log(afterLastArg)
	  let lastArg = () => loadOneComb(slice, afterLastArg)
	  console.log(lastArg)
	  let prelastArg = () => loadOneComb(slice, lastArg);
	  let preprelastArg = loadOneComb(slice, prelastArg);
	  let y = preprelastArg;
	  return {
			kind: 'ManyComb',
		  	y: y
		};
	}
  export function storeManyComb(manyComb: ManyComb): (builder: Builder) => void {
		return (builder: Builder) => {
		  let storeTheInt = (arg: number) => {
			  return (builder: Builder) => {
				  builder.storeUint(arg, 3);
			  };
		  }
		  let storeTheLast = () => {
			  return (builder: Builder) => {
				  storeOneComb<number>(manyComb.y.x.x, storeTheInt)(builder);
			  };
		  }
		  let storePreLast = () => {
			  return (builder: Builder) => {
				  storeOneComb<OneComb<number>>(manyComb.y.x, storeTheLast)(builder);
			  };
		  }
		  let storePrePreLast = () => {
			  return (builder: Builder) => {
				  storeOneComb<OneComb<OneComb<number>>>(manyComb.y, storePreLast)(builder);
			  };
		  }
		  storePrePreLast()(builder);
		};
	}
  