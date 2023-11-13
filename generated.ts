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
export type Maybe<TheType> = {
	value: TheType;
};
export function loadMaybe<TheType>(slice: Slice, loadTheType: (slice: Slice) => TheType): Maybe<TheType> {
	return {
		value: loadTheType(slice)
	};
}
export function storeMaybe<TheType>(maybe: Maybe<TheType>, storeTheType: (theType: TheType) => (builder: Builder) => void): Builder {
	return (builder: Builder) => {
		storeTheType(maybe.value)(builder);
	};
}
export type TheJust = {
	x: Maybe;
};
export function loadTheJust(slice: Slice): TheJust {
	return {
		x: loadMaybe(slice)
	};
}
export function storeTheJust(theJust: TheJust): Builder {
	return (builder: Builder) => {
		storeMaybe(theJust.x)(builder);
	};
}
