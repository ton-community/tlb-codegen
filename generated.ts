import { Builder } from 'ton'
import { Slice } from 'ton'
import { beginCell } from 'ton'
import { BitString } from 'ton'
export type X = {
	kind: 'X';
	a: number;
	b: number;
};
export function loadX(slice: Slice): X {
	let a;
	a = slice.loadUint(32);
	let b;
	b = slice.loadUint(32);
	return {
		kind: 'X',
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
	kind: 'Bool_bool_false';
	a: number;
	b: number;
	c: number;
};
export type Bool_bool_true = {
	kind: 'Bool_bool_true';
	b: number;
};
export function loadBool(slice: Slice): Bool {
	let a;
	a = slice.loadUint(32);
	let b;
	b = slice.loadUint(7);
	let c;
	c = slice.loadUint(32);
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'Bool_bool_false',
			a: a,
			b: b,
			c: c
		};
	};
	b = slice.loadUint(32);
	if (slice.preloadUint(1) == 0b1) {
		return {
			kind: 'Bool_bool_true',
			b: b
		};
	};
	throw new Error('');
}
export function storeBool(bool: Bool): (builder: Builder) => void {
	if (bool.kind == 'Bool_bool_false') {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
			builder.storeUint(bool.a, 32);
			builder.storeUint(bool.b, 7);
			builder.storeUint(bool.c, 32);
		};
	};
	if (bool.kind == 'Bool_bool_true') {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			builder.storeUint(bool.b, 32);
		};
	};
	throw new Error('');
}
export type Y = {
	kind: 'Y';
	y: number;
};
export function loadY(slice: Slice): Y {
	let y;
	y = slice.loadUint(5);
	return {
		kind: 'Y',
		y: y
	};
}
export function storeY(y: Y): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeUint(y.y, 5);
	};
}
export type C = {
	kind: 'C';
	y: Y;
	c: number;
};
export function loadC(slice: Slice): C {
	let c;
	c = slice.loadUint(32);
	return {
		kind: 'C',
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
	kind: 'D';
	y: Y;
	c: number;
};
export function loadD(slice: Slice): D {
	let c;
	c = slice.loadUint(32);
	return {
		kind: 'D',
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
	kind: 'Maybe_nothing';
	TheType: number;
};
export type Maybe_just<TheType> = {
	kind: 'Maybe_just';
	TheType: number;
	value: TheType;
};
export function loadMaybe<TheType>(slice: Slice, loadTheType: (slice: Slice) => TheType, TheType: number): Maybe<TheType> {
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'Maybe_nothing',
			TheType: TheType
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			kind: 'Maybe_just',
			TheType: TheType,
			value: loadTheType(slice)
		};
	};
	throw new Error('');
}
export function storeMaybe<TheType>(maybe: Maybe<TheType>, storeTheType: (theType: TheType) => (builder: Builder) => void): (builder: Builder) => void {
	if (maybe.kind == 'Maybe_nothing') {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
		};
	};
	if (maybe.kind == 'Maybe_just') {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			storeTheType(maybe.value)(builder);
		};
	};
	throw new Error('');
}
export type TheJust = {
	kind: 'TheJust';
	x: Maybe<D>;
};
export function loadTheJust(slice: Slice): TheJust {
	return {
		kind: 'TheJust',
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
	kind: 'Either_left';
	X: number;
	Y: number;
	value: X;
};
export type Either_right<X,Y> = {
	kind: 'Either_right';
	X: number;
	Y: number;
	value: Y;
};
export function loadEither<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y, X: number, Y: number): Either<X,Y> {
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'Either_left',
			X: X,
			Y: Y,
			value: loadX(slice)
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			kind: 'Either_right',
			X: X,
			Y: Y,
			value: loadY(slice)
		};
	};
	throw new Error('');
}
export function storeEither<X,Y>(either: Either<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
	if (either.kind == 'Either_left') {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
			storeX(either.value)(builder);
		};
	};
	if (either.kind == 'Either_right') {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			storeY(either.value)(builder);
		};
	};
	throw new Error('');
}
export type Both<X,Y> = {
	kind: 'Both';
	X: number;
	Y: number;
	first: X;
	second: Y;
};
export function loadBoth<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y, X: number, Y: number): Both<X,Y> {
	return {
		kind: 'Both',
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
	kind: 'Unit';
};
export function loadUnit(slice: Slice): Unit {
	return {
		kind: 'Unit'
	};
}
export function storeUnit(unit: Unit): (builder: Builder) => void {
	return (builder: Builder) => {

	};
}
export type True = {
	kind: 'True';
};
export function loadTrue(slice: Slice): True {
	return {
		kind: 'True'
	};
}
export function storeTrue(true: True): (builder: Builder) => void {
	return (builder: Builder) => {

	};
}
export type Example = {
	kind: 'Example';
	x: number;
	value: number;
};
export function loadExample(slice: Slice, x: number): Example {
	let value;
	value = slice.loadUint(x - 2);
	return {
		kind: 'Example',
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
	kind: 'BitInteger';
	t: Example;
};
export function loadBitInteger(slice: Slice): BitInteger {
	return {
		kind: 'BitInteger',
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
	kind: 'Unary_unary_zero';
};
export type Unary_unary_succ = {
	kind: 'Unary_unary_succ';
	n: number;
	x: Unary;
};
export function loadUnary(slice: Slice, n: number): Unary {
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'Unary_unary_zero'
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			kind: 'Unary_unary_succ',
			n: n - 1,
			x: loadUnary(slice, n - 1)
		};
	};
	throw new Error('');
}
export function storeUnary(unary: Unary): (builder: Builder) => void {
	if (unary.kind == 'Unary_unary_zero') {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
		};
	};
	if (unary.kind == 'Unary_unary_succ') {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			storeUnary(unary.x)(builder);
		};
	};
	throw new Error('');
}
export type NFG = {
	kind: 'NFG';
	a: BitInteger;
};
export function loadNFG(slice: Slice): NFG {
	return {
		kind: 'NFG',
		a: loadBitInteger(slice)
	};
}
export function storeNFG(nFG: NFG): (builder: Builder) => void {
	return (builder: Builder) => {
		storeBitInteger(nFG.a)(builder);
	};
}
export type NFT = {
	kind: 'NFT';
	a: BitInteger;
};
export function loadNFT(slice: Slice): NFT {
	let slice1 = slice.loadRef().beginParse();
	return {
		kind: 'NFT',
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
	kind: 'A';
	t: number;
	q: number;
	a: number;
	e: number;
	b: number;
	d: number;
	c: number;
};
export function loadA(slice: Slice): A {
	let t;
	t = slice.loadUint(32);
	let slice1 = slice.loadRef().beginParse();
	let q;
	q = slice1.loadUint(32);
	let slice2 = slice.loadRef().beginParse();
	let a;
	a = slice2.loadUint(32);
	let slice21 = slice2.loadRef().beginParse();
	let e;
	e = slice21.loadUint(32);
	let slice22 = slice2.loadRef().beginParse();
	let b;
	b = slice22.loadUint(32);
	let d;
	d = slice22.loadUint(32);
	let slice221 = slice22.loadRef().beginParse();
	let c;
	c = slice221.loadUint(32);
	return {
		kind: 'A',
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
	kind: 'IntEx';
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
	let a;
	a = slice.loadUint(257);
	let slice1 = slice.loadRef().beginParse();
	let b;
	b = slice1.loadBits(1023);
	let c;
	c = slice.loadUint(256);
	let d;
	d = slice.loadInt(73);
	let e;
	e = slice.loadUint(89);
	let g;
	g = slice.loadBits(10);
	let h;
	h = slice.loadInt(e * e * 8);
	let f;
	f = slice.loadUint(7 * e);
	let i;
	i = slice.loadBits(5 + e);
	let j;
	j = slice.loadInt(5);
	let k;
	k = slice.loadUint(e);
	let tc;
	tc = slice;
	let x;
	x = slice;
	return {
		kind: 'IntEx',
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
	kind: 'IntexArg';
	x: number;
	a: IntEx<number>;
};
export function loadIntexArg(slice: Slice): IntexArg {
	let x;
	x = slice.loadUint(32);
	return {
		kind: 'IntexArg',
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
	kind: 'LessThan';
	x: number;
	y: number;
};
export function loadLessThan(slice: Slice): LessThan {
	let x;
	x = slice.loadUint(2);
	let y;
	y = slice.loadUint(3);
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
export type Hashmap<X> = {
	kind: 'Hashmap';
	n: number;
	X: number;
	l: number;
	m: number;
	label: HmLabel<n>;
	node: HashmapNode<m,X>;
};
export function loadHashmap<X>(slice: Slice, loadX: (slice: Slice) => X, n: number, X: number, l: number, m: number): Hashmap<X> {
	return {
		kind: 'Hashmap',
		n: n,
		X: X,
		label: loadHmLabel<n>(slice, loadn),
		node: loadHashmapNode<m,X>(slice, loadm, loadX)
	};
}
export function storeHashmap<X>(hashmap: Hashmap<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
	return (builder: Builder) => {
		storeHmLabel<n>(hashmap.label, storen)(builder);
		storeHashmapNode<m,X>(hashmap.node, storem, storeX)(builder);
	};
}
export type HashmapNode<X> = HashmapNode_hmn_leaf<X> | HashmapNode_hmn_fork<X>;
export type HashmapNode_hmn_leaf<X> = {
	kind: 'HashmapNode_hmn_leaf';
	X: number;
	value: X;
};
export type HashmapNode_hmn_fork<X> = {
	kind: 'HashmapNode_hmn_fork';
	n: number;
	X: number;
	left: Hashmap<n,X>;
	right: Hashmap<n,X>;
};
export function loadHashmapNode<X>(slice: Slice, loadX: (slice: Slice) => X, X: number, n: number): HashmapNode<X> {
	if (slice.preloadUint(1) == 0b_) {
		return {
			kind: 'HashmapNode_hmn_leaf',
			X: X,
			value: loadX(slice)
		};
	};
	let slice1 = slice.loadRef().beginParse();
	let slice2 = slice.loadRef().beginParse();
	if (slice.preloadUint(1) == 0b_) {
		return {
			kind: 'HashmapNode_hmn_fork',
			X: X,
			left: loadHashmap<n,X>(slice1, loadn, loadX),
			right: loadHashmap<n,X>(slice2, loadn, loadX)
		};
	};
	throw new Error('');
}
export function storeHashmapNode<X>(hashmapNode: HashmapNode<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
	if (hashmapNode.kind == 'HashmapNode_hmn_leaf') {
		return (builder: Builder) => {
			builder.storeUint(0b_, 1);
			storeX(hashmapNode.value)(builder);
		};
	};
	if (hashmapNode.kind == 'HashmapNode_hmn_fork') {
		return (builder: Builder) => {
			builder.storeUint(0b_, 1);
			let cell1 = beginCell();
			storeHashmap<n,X>(hashmapNode.left, storen, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeHashmap<n,X>(hashmapNode.right, storen, storeX)(cell2);
			builder.storeRef(cell2);
		};
	};
	throw new Error('');
}
export type HmLabel = HmLabel_hml_short | HmLabel_hml_long | HmLabel_hml_same;
export type HmLabel_hml_short = {
	kind: 'HmLabel_hml_short';
	m: number;
	n: number;
	len: Unary;
};
export type HmLabel_hml_long = {
	kind: 'HmLabel_hml_long';
	m: number;
};
export type HmLabel_hml_same = {
	kind: 'HmLabel_hml_same';
	m: number;
	v: Bit;
};
export function loadHmLabel(slice: Slice, m: number, n: number): HmLabel {
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'HmLabel_hml_short',
			m: m,
			len: loadUnary(slice)
		};
	};
	if (slice.preloadUint(2) == 0b10) {
		return {
			kind: 'HmLabel_hml_long',
			m: m
		};
	};
	if (slice.preloadUint(2) == 0b11) {
		return {
			kind: 'HmLabel_hml_same',
			m: m,
			v: loadBit(slice)
		};
	};
	throw new Error('');
}
export function storeHmLabel(hmLabel: HmLabel): (builder: Builder) => void {
	if (hmLabel.kind == 'HmLabel_hml_short') {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
			storeUnary(hmLabel.len)(builder);
		};
	};
	if (hmLabel.kind == 'HmLabel_hml_long') {
		return (builder: Builder) => {
			builder.storeUint(0b10, 2);
		};
	};
	if (hmLabel.kind == 'HmLabel_hml_same') {
		return (builder: Builder) => {
			builder.storeUint(0b11, 2);
			storeBit(hmLabel.v)(builder);
		};
	};
	throw new Error('');
}
