import { Builder } from "../boc/Builder"
import { Slice } from "../boc/Slice"
export type X = {
	a: number;
	b: number;
};
export function loadX(slice: Slice): X {
	return {
		a: slice.loadUint(32),
		b: slice.loadUint(32)
	};
}
export function storeX(x: X): Builder {
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
	if (slice.preloadUint(1) == 0b0) {
		return {
			a: slice.loadUint(32),
			b: slice.loadUint(7),
			c: slice.loadUint(32)
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			b: slice.loadUint(32)
		};
	};
}
export function storeBool(bool: Bool): Builder {
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
	return {
		y: slice.loadUint(5)
	};
}
export function storeY(y: Y): Builder {
	return (builder: Builder) => {
		builder.storeUint(y.y, 5);
	};
}
export type C = {
	y: Y;
	c: number;
};
export function loadC(slice: Slice): C {
	return {
		y: loadY(slice),
		c: slice.loadUint(32)
	};
}
export function storeC(c: C): Builder {
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
	return {
		y: loadY(slice),
		c: slice.loadUint(32)
	};
}
export function storeD(d: D): Builder {
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
export function storeMaybe<TheType>(maybe: Maybe<TheType>, storeTheType: (theType: TheType) => (builder: Builder) => void): Builder {
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
export function storeTheJust(theJust: TheJust): Builder {
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
export function storeEither<X,Y>(either: Either<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): Builder {
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
export function storeBoth<X,Y>(both: Both<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): Builder {
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
export function storeUnit(unit: Unit): Builder {
	return (builder: Builder) => {

	};
}
export type True = {

};
export function loadTrue(slice: Slice): True {
	return {

	};
}
export function storeTrue(true: True): Builder {
	return (builder: Builder) => {

	};
}
export type Example = {
	x: number;
	value: number;
};
export function loadExample(slice: Slice, x: number): Example {
	return {
		x: x - 2,
		value: slice.loadUint(x - 2)
	};
}
export function storeExample(example: Example): Builder {
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
export function storeBitInteger(bitInteger: BitInteger): Builder {
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
export function storeUnary(unary: Unary): Builder {
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
