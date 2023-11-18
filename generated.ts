import { Builder } from 'ton'
import { Slice } from 'ton'
import { beginCell } from 'ton'
import { BitString } from 'ton'
export type Bit = {
	kind: 'Bit';
};
export function loadBit(slice: Slice): Bit {
	return {
		kind: 'Bit'
	};
}
export function storeBit(bit: Bit): (builder: Builder) => void {
	return (builder: Builder) => {

	};
}
export type X = {
	kind: 'X';
	a: number;
	b: number;
};
export function loadX(slice: Slice): X {
	let a: number;
	a = slice.loadUint(32);
	let b: number;
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
	if (slice.preloadUint(1) == 0b0) {
		let a: number;
		a = slice.loadUint(32);
		let b: number;
		b = slice.loadUint(7);
		let c: number;
		c = slice.loadUint(32);
		return {
			kind: 'Bool_bool_false',
			a: a,
			b: b,
			c: c
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		b = slice.loadUint(32);
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
	let y: number;
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
	let c: number;
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
	let c: number;
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
};
export type Maybe_just<TheType> = {
	kind: 'Maybe_just';
	value: TheType;
};
export function loadMaybe<TheType>(slice: Slice, loadTheType: (slice: Slice) => TheType): Maybe<TheType> {
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'Maybe_nothing'
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			kind: 'Maybe_just',
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
	value: X;
};
export type Either_right<X,Y> = {
	kind: 'Either_right';
	value: Y;
};
export function loadEither<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): Either<X,Y> {
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'Either_left',
			value: loadX(slice)
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			kind: 'Either_right',
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
	first: X;
	second: Y;
};
export function loadBoth<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): Both<X,Y> {
	return {
		kind: 'Both',
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
export type Example = {
	kind: 'Example';
	x: number;
};
export function loadExample(slice: Slice, x: number): Example {
	return {
		kind: 'Example',
		x: x - 2
	};
}
export function storeExample(example: Example): (builder: Builder) => void {
	return (builder: Builder) => {

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
	let t: number;
	t = slice.loadUint(32);
	let slice1 = slice.loadRef().beginParse();
	let q: number;
	q = slice1.loadUint(32);
	let slice2 = slice.loadRef().beginParse();
	let a: number;
	a = slice2.loadUint(32);
	let slice21 = slice2.loadRef().beginParse();
	let e: number;
	e = slice21.loadUint(32);
	let slice22 = slice2.loadRef().beginParse();
	let b: number;
	b = slice22.loadUint(32);
	let d: number;
	d = slice22.loadUint(32);
	let slice221 = slice22.loadRef().beginParse();
	let c: number;
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
export type IntEx2<Arg> = {
	kind: 'IntEx2';
	d: number;
	g: BitString;
	arg: Arg;
	x: Slice;
};
export function loadIntEx2<Arg>(slice: Slice, loadArg: (slice: Slice) => Arg): IntEx2<Arg> {
	let d: number;
	d = slice.loadInt(11);
	let g: BitString;
	g = slice.loadBits(2);
	let x: Slice;
	x = slice;
	return {
		kind: 'IntEx2',
		d: d,
		g: g,
		arg: loadArg(slice),
		x: x
	};
}
export function storeIntEx2<Arg>(intEx2: IntEx2<Arg>, storeArg: (arg: Arg) => (builder: Builder) => void): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeInt(intEx2.d, 11);
		builder.storeBits(intEx2.g);
		storeArg(intEx2.arg)(builder);
		builder.storeSlice(intEx2.x);
	};
}
export type IntEx = {
	kind: 'IntEx';
	e: number;
	h: number;
	f: number;
	i: BitString;
	j: number;
	k: number;
	tc: Slice;
};
export function loadIntEx(slice: Slice, e: number): IntEx {
	let h: number;
	h = slice.loadInt(e * 8);
	let f: number;
	f = slice.loadUint(7 * e);
	let i: BitString;
	i = slice.loadBits(5 + e);
	let j: number;
	j = slice.loadInt(5);
	let k: number;
	k = slice.loadUint(e);
	let tc: Slice;
	tc = slice;
	return {
		kind: 'IntEx',
		e: e,
		h: h,
		f: f,
		i: i,
		j: j,
		k: k,
		tc: tc
	};
}
export function storeIntEx(intEx: IntEx): (builder: Builder) => void {
	return (builder: Builder) => {
		builder.storeInt(intEx.h, intEx.e * 8);
		builder.storeUint(intEx.f, 7 * intEx.e);
		builder.storeBits(intEx.i);
		builder.storeInt(intEx.j, 5);
		builder.storeUint(intEx.k, intEx.e);
		builder.storeSlice(intEx.tc);
	};
}
export type IntexArg2 = {
	kind: 'IntexArg2';
	x: number;
	a: IntEx2<number>;
};
export function loadIntexArg2(slice: Slice, x: number): IntexArg2 {
	return {
		kind: 'IntexArg2',
		x: x,
		a: loadIntEx2<number>(slice, () => {
			return slice.loadInt(1 + x);
		})
	};
}
export function storeIntexArg2(intexArg2: IntexArg2): (builder: Builder) => void {
	return (builder: Builder) => {
		storeIntEx2<number>(intexArg2.a, (arg: number) => {
			return (builder: Builder) => {
				builder.storeInt(arg, 1 + intexArg2.x);
			};
		})(builder);
	};
}
export type IntexArg = {
	kind: 'IntexArg';
	x: number;
	a: IntEx;
};
export function loadIntexArg(slice: Slice, x: number): IntexArg {
	return {
		kind: 'IntexArg',
		x: x,
		a: loadIntEx(slice, 7)
	};
}
export function storeIntexArg(intexArg: IntexArg): (builder: Builder) => void {
	return (builder: Builder) => {
		storeIntEx(intexArg.a)(builder);
	};
}
export type LessThan = {
	kind: 'LessThan';
	x: number;
	y: number;
};
export function loadLessThan(slice: Slice): LessThan {
	let x: number;
	x = slice.loadUint(2);
	let y: number;
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
	l: number;
	m: number;
	label: HmLabel;
	node: HashmapNode<X>;
};
export function loadHashmap<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): Hashmap<X> {
	return {
		kind: 'Hashmap',
		n: n,
		label: loadHmLabel(slice, n),
		node: loadHashmapNode<X>(slice, m, loadX)
	};
}
export function storeHashmap<X>(hashmap: Hashmap<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
	return (builder: Builder) => {
		storeHmLabel(hashmap.label)(builder);
		storeHashmapNode<X>(hashmap.node, storeX)(builder);
	};
}
export type HashmapNode<X> = HashmapNode_hmn_leaf<X> | HashmapNode_hmn_fork<X>;
export type HashmapNode_hmn_leaf<X> = {
	kind: 'HashmapNode_hmn_leaf';
	value: X;
};
export type HashmapNode_hmn_fork<X> = {
	kind: 'HashmapNode_hmn_fork';
	n: number;
	left: Hashmap<X>;
	right: Hashmap<X>;
};
export function loadHashmapNode<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): HashmapNode<X> {
	if (n == 0) {
		return {
			kind: 'HashmapNode_hmn_leaf',
			value: loadX(slice)
		};
	};
	if (true) {
		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
			kind: 'HashmapNode_hmn_fork',
			n: n - 1,
			left: loadHashmap<X>(slice1, n, loadX),
			right: loadHashmap<X>(slice2, n, loadX)
		};
	};
	throw new Error('');
}
export function storeHashmapNode<X>(hashmapNode: HashmapNode<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
	if (hashmapNode.kind == 'HashmapNode_hmn_leaf') {
		return (builder: Builder) => {
			storeX(hashmapNode.value)(builder);
		};
	};
	if (hashmapNode.kind == 'HashmapNode_hmn_fork') {
		return (builder: Builder) => {
			let cell1 = beginCell();
			storeHashmap<X>(hashmapNode.left, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeHashmap<X>(hashmapNode.right, storeX)(cell2);
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
	v: BitString;
};
export function loadHmLabel(slice: Slice, m: number): HmLabel {
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
		let v: BitString;
		v = slice.loadBits(1);
		return {
			kind: 'HmLabel_hml_same',
			m: m,
			v: v
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
			builder.storeBits(hmLabel.v);
		};
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
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'Unary_unary_zero'
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			kind: 'Unary_unary_succ',
			n: n - 1,
			x: loadUnary(slice)
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
export type Same<X> = Same_g<X> | Same_t<X>;
export type Same_g<X> = {
	kind: 'Same_g';
	Y: number;
	x: number;
};
export type Same_t<X> = {
	kind: 'Same_t';
	Y: number;
	y: number;
	z: number;
};
export function loadSame<X>(slice: Slice, loadX: (slice: Slice) => X): Same<X> {
	if (slice.preloadUint(1) == 0b0) {
		let x: number;
		x = slice.loadUint(32);
		return {
			kind: 'Same_g',
			x: x
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		let y: number;
		y = slice.loadUint(32);
		let z: number;
		z = slice.loadUint(32);
		return {
			kind: 'Same_t',
			Y: Y - 1,
			y: y,
			z: z
		};
	};
	throw new Error('');
}
export function storeSame<X>(same: Same<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
	if (same.kind == 'Same_g') {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
			builder.storeUint(same.x, 32);
		};
	};
	if (same.kind == 'Same_t') {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			builder.storeUint(same.y, 32);
			builder.storeUint(same.z, 32);
		};
	};
	throw new Error('');
}
export type Const = Const_a | Const_b;
export type Const_a = {
	kind: 'Const_a';
	x: number;
};
export type Const_b = {
	kind: 'Const_b';
	X: number;
	y: number;
};
export function loadConst(slice: Slice, n: number): Const {
	if (slice.preloadUint(1) == 0b0) {
		let x: number;
		x = slice.loadUint(32);
		return {
			kind: 'Const_a',
			x: x
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		let y: number;
		y = slice.loadUint(2);
		return {
			kind: 'Const_b',
			X: X,
			y: y
		};
	};
	throw new Error('');
}
export function storeConst(const: Const): (builder: Builder) => void {
	if (const.kind == 'Const_a') {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
			builder.storeUint(const.x, 32);
		};
	};
	if (const.kind == 'Const_b') {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			builder.storeUint(const.y, 2);
		};
	};
	throw new Error('');
}
