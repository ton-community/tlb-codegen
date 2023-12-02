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
export type Either<X,Y> = Either_left<X,Y> | Either_right<X,Y>;
export type Either_left<X,Y> = {
  	kind: 'Either_left';
	value: X;
  };
export type Either_right<X,Y> = {
  	kind: 'Either_right';
	value: Y;
  };
export function loadEither<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): Either<X,Y> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let value: X = loadX(slice);
		return {
  			kind: 'Either_left',
			value: value
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let value: Y = loadY(slice);
		return {
  			kind: 'Either_right',
			value: value
  		};
  	};
	throw new Error('');
  }
export function storeEither<X,Y>(either: Either<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((either.kind == 'Either_left')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeX(either.value)(builder);
  		};
  	};
	if ((either.kind == 'Either_right')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeY(either.value)(builder);
  		};
  	};
	throw new Error('');
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
export function loadIntBitsInside(slice: Slice, arg0: number): IntBitsInside {
  	let a: IntBits<number> = loadIntBits<number>(slice, (slice: Slice) => {
  		return slice.loadInt((1 + (arg0 / 2)));
  	});
	return {
  		kind: 'IntBitsInside',
		x: (arg0 / 2),
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
  	let y: OneComb<OneComb<OneComb<number>>> = loadOneComb<OneComb<OneComb<number>>>(slice, (slice: Slice) => {
  		return loadOneComb<OneComb<number>>(slice, (slice: Slice) => {
  			return loadOneComb<number>(slice, (slice: Slice) => {
  				return slice.loadInt(3);
  			});
  		});
  	});
	return {
  		kind: 'ManyComb',
		y: y
  	};
  }
export function storeManyComb(manyComb: ManyComb): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeOneComb<OneComb<OneComb<number>>>(manyComb.y, (arg: OneComb<OneComb<number>>) => {
  			return (builder: Builder) => {
  				storeOneComb<OneComb<number>>(arg, (arg: OneComb<number>) => {
  					return (builder: Builder) => {
  						storeOneComb<number>(arg, (arg: number) => {
  							return (builder: Builder) => {
  								builder.storeInt(arg, 3);
  							};
  						})(builder);
  					};
  				})(builder);
  			};
  		})(builder);
  	};
  }
export function unary_unary_succ_get_n(x: Unary): number {
  	if ((x.kind == 'Unary_unary_zero')) {
  		return 0;
  	};
	if ((x.kind == 'Unary_unary_succ')) {
  		let n = x.n;
		return (n + 1);
  	};
	throw new Error('');
  }
export type Unary = Unary_unary_zero | Unary_unary_succ;
export type Unary_unary_zero = {
  	kind: 'Unary_unary_zero';
  };
export type Unary_unary_succ = {
  	kind: 'Unary_unary_succ';
	n: number;
	x: Unary;
  };
export function loadUnary(slice: Slice): Unary {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'Unary_unary_zero'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let x: Unary = loadUnary(slice);
		let n = unary_unary_succ_get_n(x);
		return {
  			kind: 'Unary_unary_succ',
			x: x,
			n: n
  		};
  	};
	throw new Error('');
  }
export function storeUnary(unary: Unary): (builder: Builder) => void {
  	if ((unary.kind == 'Unary_unary_zero')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((unary.kind == 'Unary_unary_succ')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeUnary(unary.x)(builder);
  		};
  	};
	throw new Error('');
  }
export type ParamConst = ParamConst_a | ParamConst_b | ParamConst_c | ParamConst_d;
export type ParamConst_a = {
  	kind: 'ParamConst_a';
	n: number;
  };
export type ParamConst_b = {
  	kind: 'ParamConst_b';
	m: number;
	k: number;
  };
export type ParamConst_c = {
  	kind: 'ParamConst_c';
	n: number;
	m: number;
	k: number;
  };
export type ParamConst_d = {
  	kind: 'ParamConst_d';
	n: number;
	m: number;
	k: number;
	l: number;
  };
export function loadParamConst(slice: Slice, arg0: number, arg1: number): ParamConst {
  	if (((arg0 == 1) && (arg1 == 1))) {
  		let n: number = slice.loadUint(32);
		return {
  			kind: 'ParamConst_a',
			n: n
  		};
  	};
	if (((slice.preloadUint(2) == 0b01) && ((arg0 == 2) && (arg1 == 1)))) {
  		slice.loadUint(2);
		let m: number = slice.loadUint(32);
		let k: number = slice.loadUint(32);
		return {
  			kind: 'ParamConst_b',
			m: m,
			k: k
  		};
  	};
	if (((slice.preloadUint(2) == 0b01) && ((arg0 == 3) && (arg1 == 3)))) {
  		slice.loadUint(2);
		let n: number = slice.loadUint(32);
		let m: number = slice.loadUint(32);
		let k: number = slice.loadUint(32);
		return {
  			kind: 'ParamConst_c',
			n: n,
			m: m,
			k: k
  		};
  	};
	if (((arg0 == 4) && (arg1 == 2))) {
  		let n: number = slice.loadUint(32);
		let m: number = slice.loadUint(32);
		let k: number = slice.loadUint(32);
		let l: number = slice.loadUint(32);
		return {
  			kind: 'ParamConst_d',
			n: n,
			m: m,
			k: k,
			l: l
  		};
  	};
	throw new Error('');
  }
export function storeParamConst(paramConst: ParamConst): (builder: Builder) => void {
  	if ((paramConst.kind == 'ParamConst_a')) {
  		return (builder: Builder) => {
  			builder.storeUint(paramConst.n, 32);
  		};
  	};
	if ((paramConst.kind == 'ParamConst_b')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
			builder.storeUint(paramConst.m, 32);
			builder.storeUint(paramConst.k, 32);
  		};
  	};
	if ((paramConst.kind == 'ParamConst_c')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
			builder.storeUint(paramConst.n, 32);
			builder.storeUint(paramConst.m, 32);
			builder.storeUint(paramConst.k, 32);
  		};
  	};
	if ((paramConst.kind == 'ParamConst_d')) {
  		return (builder: Builder) => {
  			builder.storeUint(paramConst.n, 32);
			builder.storeUint(paramConst.m, 32);
			builder.storeUint(paramConst.k, 32);
			builder.storeUint(paramConst.l, 32);
  		};
  	};
	throw new Error('');
  }
export function paramDifNames_c_get_n(x: ParamDifNames): number {
  	if ((x.kind == 'ParamDifNames_a')) {
  		return 1;
  	};
	if ((x.kind == 'ParamDifNames_b')) {
  		return 1;
  	};
	if ((x.kind == 'ParamDifNames_c')) {
  		let n = x.n;
		return (n + 1);
  	};
	if ((x.kind == 'ParamDifNames_d')) {
  		let m = x.m;
		return (m * 2);
  	};
	throw new Error('');
  }
export function paramDifNames_d_get_m(x: ParamDifNames): number {
  	if ((x.kind == 'ParamDifNames_a')) {
  		return 1;
  	};
	if ((x.kind == 'ParamDifNames_b')) {
  		return 1;
  	};
	if ((x.kind == 'ParamDifNames_c')) {
  		let n = x.n;
		return (n + 1);
  	};
	if ((x.kind == 'ParamDifNames_d')) {
  		let m = x.m;
		return (m * 2);
  	};
	throw new Error('');
  }
export type ParamDifNames = ParamDifNames_a | ParamDifNames_b | ParamDifNames_c | ParamDifNames_d;
export type ParamDifNames_a = {
  	kind: 'ParamDifNames_a';
  };
export type ParamDifNames_b = {
  	kind: 'ParamDifNames_b';
  };
export type ParamDifNames_c = {
  	kind: 'ParamDifNames_c';
	n: number;
	x: ParamDifNames;
  };
export type ParamDifNames_d = {
  	kind: 'ParamDifNames_d';
	m: number;
	x: ParamDifNames;
  };
export function loadParamDifNames(slice: Slice, arg0: number): ParamDifNames {
  	if (((slice.preloadUint(1) == 0b0) && (arg0 == 2))) {
  		slice.loadUint(1);
		return {
  			kind: 'ParamDifNames_a'
  		};
  	};
	if (((slice.preloadUint(1) == 0b1) && (arg0 == 3))) {
  		slice.loadUint(1);
		return {
  			kind: 'ParamDifNames_b'
  		};
  	};
	if (((slice.preloadUint(1) == 0b1) && (arg0 == 2))) {
  		slice.loadUint(1);
		let x: ParamDifNames = loadParamDifNames(slice, 2);
		let n = paramDifNames_c_get_n(x);
		return {
  			kind: 'ParamDifNames_c',
			x: x,
			n: n
  		};
  	};
	if (((slice.preloadUint(1) == 0b0) && (arg0 == 3))) {
  		slice.loadUint(1);
		let x: ParamDifNames = loadParamDifNames(slice, 3);
		let m = paramDifNames_d_get_m(x);
		return {
  			kind: 'ParamDifNames_d',
			x: x,
			m: m
  		};
  	};
	throw new Error('');
  }
export function storeParamDifNames(paramDifNames: ParamDifNames): (builder: Builder) => void {
  	if ((paramDifNames.kind == 'ParamDifNames_a')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((paramDifNames.kind == 'ParamDifNames_b')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
  		};
  	};
	if ((paramDifNames.kind == 'ParamDifNames_c')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeParamDifNames(paramDifNames.x)(builder);
  		};
  	};
	if ((paramDifNames.kind == 'ParamDifNames_d')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeParamDifNames(paramDifNames.x)(builder);
  		};
  	};
	throw new Error('');
  }
export function paramDifNamesUser_get_k(x: ParamDifNames): number {
  	if ((x.kind == 'ParamDifNames_a')) {
  		return 1;
  	};
	if ((x.kind == 'ParamDifNames_b')) {
  		return 1;
  	};
	if ((x.kind == 'ParamDifNames_c')) {
  		let n = x.n;
		return (n + 1);
  	};
	if ((x.kind == 'ParamDifNames_d')) {
  		let m = x.m;
		return (m * 2);
  	};
	throw new Error('');
  }
export type ParamDifNamesUser = {
  	kind: 'ParamDifNamesUser';
	k: number;
	x: ParamDifNames;
  };
export function loadParamDifNamesUser(slice: Slice): ParamDifNamesUser {
  	let x: ParamDifNames = loadParamDifNames(slice, 2);
	let k = paramDifNamesUser_get_k(x);
	return {
  		kind: 'ParamDifNamesUser',
		x: x,
		k: k
  	};
  }
export function storeParamDifNamesUser(paramDifNamesUser: ParamDifNamesUser): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeParamDifNames(paramDifNamesUser.x)(builder);
  	};
  }
export type NegationFromImplicit = {
  	kind: 'NegationFromImplicit';
	y: number;
	t: number;
	z: number;
  };
export function loadNegationFromImplicit(slice: Slice): NegationFromImplicit {
  	let t: number = slice.loadUint(32);
	let z: number = slice.loadUint(32);
	return {
  		kind: 'NegationFromImplicit',
		y: (t / 2),
		t: t,
		z: z
  	};
  }
export function storeNegationFromImplicit(negationFromImplicit: NegationFromImplicit): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(negationFromImplicit.t, 32);
		builder.storeUint(negationFromImplicit.z, 32);
  	};
  }
export function unaryUserCheckOrder_get_l(label: Unary): number {
  	if ((label.kind == 'Unary_unary_zero')) {
  		return 0;
  	};
	if ((label.kind == 'Unary_unary_succ')) {
  		let n = label.n;
		return (n + 1);
  	};
	throw new Error('');
  }
export type UnaryUserCheckOrder = {
  	kind: 'UnaryUserCheckOrder';
	l: number;
	m: number;
	label: Unary;
  };
export function loadUnaryUserCheckOrder(slice: Slice): UnaryUserCheckOrder {
  	let label: Unary = loadUnary(slice);
	let l = unaryUserCheckOrder_get_l(label);
	return {
  		kind: 'UnaryUserCheckOrder',
		m: (7 - l),
		label: label,
		l: l
  	};
  }
export function storeUnaryUserCheckOrder(unaryUserCheckOrder: UnaryUserCheckOrder): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeUnary(unaryUserCheckOrder.label)(builder);
  	};
  }
export type CombArgCellRef<X> = {
  	kind: 'CombArgCellRef';
	info: number;
	init: Maybe<Either<X,X>>;
	body: Either<X,X>;
  };
export function loadCombArgCellRef<X>(slice: Slice, loadX: (slice: Slice) => X): CombArgCellRef<X> {
  	let info: number = slice.loadInt(32);
	let init: Maybe<Either<X,X>> = loadMaybe<Either<X,X>>(slice, (slice: Slice) => {
  		return loadEither<X,X>(slice, loadX, loadX);
  	});
	let body: Either<X,X> = loadEither<X,X>(slice, loadX, loadX);
	return {
  		kind: 'CombArgCellRef',
		info: info,
		init: init,
		body: body
  	};
  }
export function storeCombArgCellRef<X>(combArgCellRef: CombArgCellRef<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeInt(combArgCellRef.info, 32);
		storeMaybe<Either<X,X>>(combArgCellRef.init, (arg: Either<X,X>) => {
  			return (builder: Builder) => {
  				storeEither<X,X>(arg, storeX, storeX)(builder);
  			};
  		})(builder);
		storeEither<X,X>(combArgCellRef.body, storeX, storeX)(builder);
  	};
  }
export type CombArgCellRefUser = {
  	kind: 'CombArgCellRefUser';
	x: CombArgCellRef<number>;
  };
export function loadCombArgCellRefUser(slice: Slice): CombArgCellRefUser {
  	let x: CombArgCellRef<number> = loadCombArgCellRef<number>(slice, (slice: Slice) => {
  		return slice.loadInt(12);
  	});
	return {
  		kind: 'CombArgCellRefUser',
		x: x
  	};
  }
export function storeCombArgCellRefUser(combArgCellRefUser: CombArgCellRefUser): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeCombArgCellRef<number>(combArgCellRefUser.x, (arg: number) => {
  			return (builder: Builder) => {
  				builder.storeInt(arg, 12);
  			};
  		})(builder);
  	};
  }
