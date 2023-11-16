import { Builder } from "ton"
import { Slice } from "ton"
import { beginCell } from "ton"
import { BitString } from "ton"
export type X = {
	a: number;
	b: number;
};
export function loadX(slice: Slice): X {
	let a = slice.loadUint(32);
	let b = slice.loadUint(32);
	return {
		a: a,
		b: b
	};
}
export function storeX(x: X): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeUint(x.a, 32);
		builder.storeUint(x.b, 32);
	};
}
export type Bool = Bool_bool_false | Bool_bool_true;
export type Bool_bool_false = {
	a: number;
	b: number;
	c: number;
};
export type Bool_bool_true = {
	b: number;
};
export function loadBool(slice: Slice): Bool {
	let a = slice.loadUint(32);
	let b = slice.loadUint(7);
	let c = slice.loadUint(32);
	if (slice.preloadUint(1) == 0b0) {
		return {
			a: a,
			b: b,
			c: c
		};
	};
	let b = slice.loadUint(32);
	if (slice.preloadUint(1) == 0b1) {
		return {
			b: b
		};
	};
}
export function storeBool(bool: Bool): (builder: Builder) => void {
	if (bool instanceof Bool_bool_false) {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
			builder.storeUint(bool.a, 32);
			builder.storeUint(bool.b, 7);
			builder.storeUint(bool.c, 32);
		};
	};
	if (bool instanceof Bool_bool_true) {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			builder.storeUint(bool.b, 32);
		};
	};
}
export type Y = {
	y: number;
};
export function loadY(slice: Slice): Y {
	let y = slice.loadUint(5);
	return {
		y: y
	};
}
export function storeY(y: Y): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeUint(y.y, 5);
	};
}
export type C = {
	y: Y;
	c: number;
};
export function loadC(slice: Slice): C {
	let c = slice.loadUint(32);
	return {
		y: loadY(slice),
		c: c
	};
}
export function storeC(c: C): (builder: Builder) => void {
	return (builder: Builder) => {
		storeY(c.y)(builder);
		builder.storeUint(c.c, 32);
	};
}
export type D = {
	y: Y;
	c: number;
};
export function loadD(slice: Slice): D {
	let c = slice.loadUint(32);
	return {
		y: loadY(slice),
		c: c
	};
}
export function storeD(d: D): (builder: Builder) => void {
	return (builder: Builder) => {
		storeY(d.y)(builder);
		builder.storeUint(d.c, 32);
	};
}
export type Maybe<TheType> = Maybe_nothing<TheType> | Maybe_just<TheType>;
export type Maybe_nothing<TheType> = {
	TheType: number;
};
export type Maybe_just<TheType> = {
	TheType: number;
	value: TheType;
};
export function loadMaybe<TheType>(slice: Slice, loadTheType: (slice: Slice) => TheType, TheType: number): Maybe<TheType> {
	if (slice.preloadUint(1) == 0b0) {
		return {
			TheType: TheType
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			TheType: TheType,
			value: loadTheType(slice)
		};
	};
}
export function storeMaybe<TheType>(maybe: Maybe<TheType>, storeTheType: (theType: TheType) => (builder: Builder) => void): (builder: Builder) => void {
	if (maybe instanceof Maybe_nothing) {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
		};
	};
	if (maybe instanceof Maybe_just) {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			storeTheType(maybe.value)(builder);
		};
	};
}
export type TheJust = {
	x: Maybe<D>;
};
export function loadTheJust(slice: Slice): TheJust {
	return {
		x: loadMaybe<D>(slice, loadD)
	};
}
export function storeTheJust(theJust: TheJust): (builder: Builder) => void {
	return (builder: Builder) => {
		storeMaybe<D>(theJust.x, storeD)(builder);
	};
}
export type Either<X,Y> = Either_left<X,Y> | Either_right<X,Y>;
export type Either_left<X,Y> = {
	X: number;
	Y: number;
	value: X;
};
export type Either_right<X,Y> = {
	X: number;
	Y: number;
	value: Y;
};
export function loadEither<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y, X: number, Y: number): Either<X,Y> {
	if (slice.preloadUint(1) == 0b0) {
		return {
			X: X,
			Y: Y,
			value: loadX(slice)
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			X: X,
			Y: Y,
			value: loadY(slice)
		};
	};
}
export function storeEither<X,Y>(either: Either<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
	if (either instanceof Either_left) {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
			storeX(either.value)(builder);
		};
	};
	if (either instanceof Either_right) {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			storeY(either.value)(builder);
		};
	};
}
export type Both<X,Y> = {
	X: number;
	Y: number;
	first: X;
	second: Y;
};
export function loadBoth<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y, X: number, Y: number): Both<X,Y> {
	return {
		X: X,
		Y: Y,
		first: loadX(slice),
		second: loadY(slice)
	};
}
export function storeBoth<X,Y>(both: Both<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
	return (builder: Builder) => {
		storeX(both.first)(builder);
		storeY(both.second)(builder);
	};
}
export type Unit = {

};
export function loadUnit(slice: Slice): Unit {
	return {

	};
}
export function storeUnit(unit: Unit): (builder: Builder) => void {
	return (builder: Builder) => {

	};
}
export type True = {

};
export function loadTrue(slice: Slice): True {
	return {

	};
}
export function storeTrue(true: True): (builder: Builder) => void {
	return (builder: Builder) => {

	};
}
export type Example = {
	x: number;
	value: number;
};
export function loadExample(slice: Slice, x: number): Example {
	let value = slice.loadUint(x - 2);
	return {
		x: x - 2,
		value: value
	};
}
export function storeExample(example: Example): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeUint(example.value, example.x);
	};
}
export type BitInteger = {
	t: Example;
};
export function loadBitInteger(slice: Slice): BitInteger {
	return {
		t: loadExample(slice, 4)
	};
}
export function storeBitInteger(bitInteger: BitInteger): (builder: Builder) => void {
	return (builder: Builder) => {
		storeExample(bitInteger.t)(builder);
	};
}
export type Unary = Unary_unary_zero | Unary_unary_succ;
export type Unary_unary_zero = {

};
export type Unary_unary_succ = {
	n: number;
	x: Unary;
};
export function loadUnary(slice: Slice, n: number): Unary {
	if (slice.preloadUint(1) == 0b0) {
		return {

		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			n: n - 1,
			x: loadUnary(slice, n - 1)
		};
	};
}
export function storeUnary(unary: Unary): (builder: Builder) => void {
	if (unary instanceof Unary_unary_zero) {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
		};
	};
	if (unary instanceof Unary_unary_succ) {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			storeUnary(unary.x)(builder);
		};
	};
}
export type NFG = {
	a: BitInteger;
};
export function loadNFG(slice: Slice): NFG {
	return {
		a: loadBitInteger(slice)
	};
}
export function storeNFG(nFG: NFG): (builder: Builder) => void {
	return (builder: Builder) => {
		storeBitInteger(nFG.a)(builder);
	};
}
export type NFT = {
	a: BitInteger;
};
export function loadNFT(slice: Slice): NFT {
	let slice1 = slice.loadRef().beginParse();
	return {
		a: loadBitInteger(slice1)
	};
}
export function storeNFT(nFT: NFT): (builder: Builder) => void {
	return (builder: Builder) => {
		let cell1 = beginCell();
		storeBitInteger(nFT.a)(cell1);
		builder.storeRef(cell1);
	};
}
export type A = {
	t: number;
	q: number;
	a: number;
	e: number;
	b: number;
	d: number;
	c: number;
};
export function loadA(slice: Slice): A {
	let t = slice.loadUint(32);
	let slice1 = slice.loadRef().beginParse();
	let q = slice1.loadUint(32);
	let slice2 = slice.loadRef().beginParse();
	let a = slice2.loadUint(32);
	let slice21 = slice2.loadRef().beginParse();
	let e = slice21.loadUint(32);
	let slice22 = slice2.loadRef().beginParse();
	let b = slice22.loadUint(32);
	let d = slice22.loadUint(32);
	let slice221 = slice22.loadRef().beginParse();
	let c = slice221.loadUint(32);
	return {
		t: t,
		q: q,
		a: a,
		e: e,
		b: b,
		d: d,
		c: c
	};
}
export function storeA(a: A): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeUint(a.t, 32);
		let cell1 = beginCell();
		cell1.storeUint(a.q, 32);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		cell2.storeUint(a.a, 32);
		let cell21 = beginCell();
		cell21.storeUint(a.e, 32);
		cell2.storeRef(cell21);
		let cell22 = beginCell();
		cell22.storeUint(a.b, 32);
		cell22.storeUint(a.d, 32);
		let cell221 = beginCell();
		cell221.storeUint(a.c, 32);
		cell22.storeRef(cell221);
		cell2.storeRef(cell22);
		builder.storeRef(cell2);
	};
}
export type IntEx<Arg> = {
	a: number;
	b: BitString;
	c: number;
	d: number;
	e: number;
	g: BitString;
	h: number;
	f: number;
	i: BitString;
	j: number;
	k: number;
	tc: Slice;
	Arg: number;
	arg: Arg;
	x: Slice;
};
export function loadIntEx<Arg>(slice: Slice, loadArg: (slice: Slice) => Arg, Arg: number): IntEx<Arg> {
	let a = slice.loadUint(257);
	let slice1 = slice.loadRef().beginParse();
	let b = slice1.loadBits(1023);
	let c = slice.loadUint(256);
	let d = slice.loadInt(73);
	let e = slice.loadUint(89);
	let g = slice.loadBits(10);
	let h = slice.loadInt(e * e * 8);
	let f = slice.loadUint(7 * e);
	let i = slice.loadBits(5 + e);
	let j = slice.loadInt(5);
	let k = slice.loadUint(e);
	let tc = slice;
	let x = slice;
	return {
		a: a,
		b: b,
		c: c,
		d: d,
		e: e,
		g: g,
		h: h,
		f: f,
		i: i,
		j: j,
		k: k,
		tc: tc,
		Arg: Arg,
		arg: loadArg(slice),
		x: x
	};
}
export function storeIntEx<Arg>(intEx: IntEx<Arg>, storeArg: (arg: Arg) => (builder: Builder) => void): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeUint(intEx.a, 257);
		let cell1 = beginCell();
		cell1.storeBits(intEx.b);
		builder.storeRef(cell1);
		builder.storeUint(intEx.c, 256);
		builder.storeInt(intEx.d, 73);
		builder.storeUint(intEx.e, 89);
		builder.storeBits(intEx.g);
		builder.storeInt(intEx.h, intEx.e * intEx.e * 8);
		builder.storeUint(intEx.f, 7 * intEx.e);
		builder.storeBits(intEx.i);
		builder.storeInt(intEx.j, 5);
		builder.storeUint(intEx.k, intEx.e);
		builder.storeSlice(intEx.tc);
		storeArg(intEx.arg)(builder);
		builder.storeSlice(intEx.x);
	};
}
export type IntexArg = {
	x: number;
	a: IntEx<number>;
};
export function loadIntexArg(slice: Slice): IntexArg {
	let x = slice.loadUint(32);
	return {
		x: x,
		a: loadIntEx<number>(slice, () => {
			return slice.loadInt(5 * x);
		})
	};
}
export function storeIntexArg(intexArg: IntexArg): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeUint(intexArg.x, 32);
		storeIntEx<number>(intexArg.a, (arg: number) => {
			return (builder: Builder) => {
				builder.storeInt(arg, 5 * intexArg.x);
			};
		})(builder);
	};
}
export type LessThan = {
	x: number;
	y: number;
};
export function loadLessThan(slice: Slice): LessThan {
	let x = slice.loadUint(2);
	let y = slice.loadUint(3);
	return {
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
