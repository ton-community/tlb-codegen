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
			builder.storeUint(bool.a, 32);
			builder.storeUint(bool.b, 7);
			builder.storeUint(bool.c, 32);
		};
	};
	if (bool instanceof Bool_bool_true) {
		return (builder: Builder) => {
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

};
export type Maybe_just<TheType> = {
	value: TheType;
};
export function loadMaybe<TheType>(slice: Slice, loadTheType: (slice: Slice) => TheType): Maybe<TheType> {
	if (slice.preloadUint(1) == 0b0) {
		return {

		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			value: loadTheType(slice)
		};
	};
}
export function storeMaybe<TheType>(maybe: Maybe<TheType>, storeTheType: (theType: TheType) => (builder: Builder) => void): Builder {
	if (maybe instanceof Maybe_nothing) {
		return (builder: Builder) => {

		};
	};
	if (maybe instanceof Maybe_just) {
		return (builder: Builder) => {
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
	value: X;
};
export type Either_right<X,Y> = {
	value: Y;
};
export function loadEither<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): Either<X,Y> {
	if (slice.preloadUint(1) == 0b0) {
		return {
			value: loadX(slice)
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			value: loadY(slice)
		};
	};
}
export function storeEither<X,Y>(either: Either<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): Builder {
	if (either instanceof Either_left) {
		return (builder: Builder) => {
			storeX(either.value)(builder);
		};
	};
	if (either instanceof Either_right) {
		return (builder: Builder) => {
			storeY(either.value)(builder);
		};
	};
}
export type Both<X,Y> = {
	first: X;
	second: Y;
};
export function loadBoth<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): Both<X,Y> {
	return {
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
