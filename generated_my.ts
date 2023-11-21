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
export type Y = {
  	kind: 'Y';
	y: number;
  };
export function loadY(slice: Slice): Y {
  	let y: number = slice.loadUint(5);
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
  	let y: Y = loadY(slice);
	let c: number = slice.loadUint(32);
	return {
  		kind: 'C',
		y: y,
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
  	let y: Y = loadY(slice);
	let c: number = slice.loadUint(32);
	return {
  		kind: 'D',
		y: y,
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
export type TheJust = {
  	kind: 'TheJust';
	x: Maybe<D>;
  };
export function loadTheJust(slice: Slice): TheJust {
  	let x: Maybe<D> = loadMaybe<D>(slice, loadD);
	return {
  		kind: 'TheJust',
		x: x
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
export type Both<X,Y> = {
  	kind: 'Both';
	first: X;
	second: Y;
  };
export function loadBoth<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): Both<X,Y> {
  	let first: X = loadX(slice);
	let second: Y = loadY(slice);
	return {
  		kind: 'Both',
		first: first,
		second: second
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
export type Example1 = {
  	kind: 'Example1';
	x: number;
	value: number;
  };
export function loadExample1(slice: Slice, x: number): Example1 {
  	let value: number = slice.loadUint(x);
	return {
  		kind: 'Example1',
		x: x,
		value: value
  	};
  }
export function storeExample1(example1: Example1): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(example1.value, example1.x);
  	};
  }
export type Example = {
  	kind: 'Example';
	x: number;
	value: number;
  };
export function loadExample(slice: Slice, arg0: number): Example {
  	let value: number = slice.loadUint((arg0 - 2));
	return {
  		kind: 'Example',
		x: (arg0 - 2),
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
  	let t: Example = loadExample(slice, 4);
	return {
  		kind: 'BitInteger',
		t: t
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
  	let a: BitInteger = loadBitInteger(slice);
	return {
  		kind: 'NFG',
		a: a
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
	let a: BitInteger = loadBitInteger(slice1);
	return {
  		kind: 'NFT',
		a: a
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
  	let d: number = slice.loadInt(11);
	let g: BitString = slice.loadBits(2);
	let arg: Arg = loadArg(slice);
	let x: Slice = slice;
	return {
  		kind: 'IntEx2',
		d: d,
		g: g,
		arg: arg,
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
  	let h: number = slice.loadInt((e * 8));
	let f: number = slice.loadUint((7 * e));
	let i: BitString = slice.loadBits((5 + e));
	let j: number = slice.loadInt(5);
	let k: number = slice.loadUint(e);
	let tc: Slice = slice;
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
  		builder.storeInt(intEx.h, (intEx.e * 8));
		builder.storeUint(intEx.f, (7 * intEx.e));
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
  	let a: IntEx2<number> = loadIntEx2<number>(slice, () => {
  		return slice.loadInt((1 + x));
  	});
	return {
  		kind: 'IntexArg2',
		x: x,
		a: a
  	};
  }
export function storeIntexArg2(intexArg2: IntexArg2): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeIntEx2<number>(intexArg2.a, (arg: number) => {
  			return (builder: Builder) => {
  				builder.storeInt(arg, (1 + intexArg2.x));
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
  	let a: IntEx = loadIntEx(slice, 7);
	return {
  		kind: 'IntexArg',
		x: x,
		a: a
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
export type Hashmap<X> = {
  	kind: 'Hashmap';
	n: number;
	l: number;
	m: number;
	label: HmLabel;
	node: HashmapNode<X>;
  };
export function loadHashmap<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): Hashmap<X> {
  	let label: HmLabel = loadHmLabel(slice, n);
	let node: HashmapNode<X> = loadHashmapNode<X>(slice, m, loadX);
	return {
  		kind: 'Hashmap',
		m: (n - l),
		n: n,
		label: label,
		node: node
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
  	if ((n == 0)) {
  		let value: X = loadX(slice);
		return {
  			kind: 'HashmapNode_hmn_leaf',
			value: value
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let left: Hashmap<X> = loadHashmap<X>(slice1, n, loadX);
		let slice2 = slice.loadRef().beginParse();
		let right: Hashmap<X> = loadHashmap<X>(slice2, n, loadX);
		return {
  			kind: 'HashmapNode_hmn_fork',
			n: (arg0 - 1),
			left: left,
			right: right
  		};
  	};
	throw new Error('');
  }
export function storeHashmapNode<X>(hashmapNode: HashmapNode<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((hashmapNode.kind == 'HashmapNode_hmn_leaf')) {
  		return (builder: Builder) => {
  			storeX(hashmapNode.value)(builder);
  		};
  	};
	if ((hashmapNode.kind == 'HashmapNode_hmn_fork')) {
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
export function hmLabel_hml_short_get_n(len: Unary): number {
  	if ((len.kind == 'Unary_unary_zero')) {
  		return 0;
  	};
	if ((len.kind == 'Unary_unary_succ')) {
  		let n = len.n;
		return (n + 1);
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
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let len: Unary = loadUnary(slice);
		return {
  			kind: 'HmLabel_hml_short',
			m: m,
			n: hmLabel_hml_short_get_n(len),
			len: len
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		return {
  			kind: 'HmLabel_hml_long',
			m: m
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		let v: BitString = slice.loadBits(1);
		return {
  			kind: 'HmLabel_hml_same',
			m: m,
			v: v
  		};
  	};
	throw new Error('');
  }
export function storeHmLabel(hmLabel: HmLabel): (builder: Builder) => void {
  	if ((hmLabel.kind == 'HmLabel_hml_short')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeUnary(hmLabel.len)(builder);
  		};
  	};
	if ((hmLabel.kind == 'HmLabel_hml_long')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10, 2);
  		};
  	};
	if ((hmLabel.kind == 'HmLabel_hml_same')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
			builder.storeBits(hmLabel.v);
  		};
  	};
	throw new Error('');
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
		return {
  			kind: 'Unary_unary_succ',
			n: unary_unary_succ_get_n(x),
			x: x
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
export type ConstT = ConstT_a | ConstT_b;
export type ConstT_a = {
  	kind: 'ConstT_a';
	x: number;
  };
export type ConstT_b = {
  	kind: 'ConstT_b';
	X: number;
	y: number;
  };
export function loadConstT(slice: Slice, X: number): ConstT {
  	if (((slice.preloadUint(1) == 0b0) && (X == 1))) {
  		slice.loadUint(1);
		let x: number = slice.loadUint(32);
		return {
  			kind: 'ConstT_a',
			x: x
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let y: number = slice.loadUint(2);
		return {
  			kind: 'ConstT_b',
			X: X,
			y: y
  		};
  	};
	throw new Error('');
  }
export function storeConstT(constT: ConstT): (builder: Builder) => void {
  	if ((constT.kind == 'ConstT_a')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			builder.storeUint(constT.x, 32);
  		};
  	};
	if ((constT.kind == 'ConstT_b')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			builder.storeUint(constT.y, 2);
  		};
  	};
	throw new Error('');
  }
export type ParamConst = ParamConst_с | ParamConst_a | ParamConst_b | ParamConst_d;
export type ParamConst_с = {
  	kind: 'ParamConst_с';
  };
export type ParamConst_a = {
  	kind: 'ParamConst_a';
  };
export type ParamConst_b = {
  	kind: 'ParamConst_b';
  };
export type ParamConst_d = {
  	kind: 'ParamConst_d';
	test: number;
  };
export function loadParamConst(slice: Slice, arg0: number, arg1: number): ParamConst {
  	if (((arg0 == 1) && (arg1 == 1))) {
  		return {
  			kind: 'ParamConst_с'
  		};
  	};
	if (((slice.preloadUint(2) == 0b01) && ((arg0 == 2) && (arg1 == 1)))) {
  		slice.loadUint(2);
		return {
  			kind: 'ParamConst_a'
  		};
  	};
	if (((slice.preloadUint(2) == 0b01) && ((arg0 == 3) && (arg1 == 3)))) {
  		slice.loadUint(2);
		return {
  			kind: 'ParamConst_b'
  		};
  	};
	if (((arg0 == 4) && (arg1 == 2))) {
  		let test: number = slice.loadUint(32);
		return {
  			kind: 'ParamConst_d',
			test: test
  		};
  	};
	throw new Error('');
  }
export function storeParamConst(paramConst: ParamConst): (builder: Builder) => void {
  	if ((paramConst.kind == 'ParamConst_с')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((paramConst.kind == 'ParamConst_a')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
  		};
  	};
	if ((paramConst.kind == 'ParamConst_b')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
  		};
  	};
	if ((paramConst.kind == 'ParamConst_d')) {
  		return (builder: Builder) => {
  			builder.storeUint(paramConst.test, 32);
  		};
  	};
	throw new Error('');
  }
export function paramDifNames_b_get_n(x: ParamDifNames): number {
  	if ((x.kind == 'ParamDifNames_a')) {
  		return 0;
  	};
	if ((x.kind == 'ParamDifNames_b')) {
  		let n = x.n;
		return (n + 1);
  	};
	if ((x.kind == 'ParamDifNames_c')) {
  		let m = x.m;
		return (m * 2);
  	};
	throw new Error('');
  }
export function paramDifNames_c_get_m(x: ParamDifNames): number {
  	if ((x.kind == 'ParamDifNames_a')) {
  		return 0;
  	};
	if ((x.kind == 'ParamDifNames_b')) {
  		let n = x.n;
		return (n + 1);
  	};
	if ((x.kind == 'ParamDifNames_c')) {
  		let m = x.m;
		return (m * 2);
  	};
	throw new Error('');
  }
export type ParamDifNames = ParamDifNames_a | ParamDifNames_b | ParamDifNames_c;
export type ParamDifNames_a = {
  	kind: 'ParamDifNames_a';
  };
export type ParamDifNames_b = {
  	kind: 'ParamDifNames_b';
	n: number;
	x: ParamDifNames;
  };
export type ParamDifNames_c = {
  	kind: 'ParamDifNames_c';
	m: number;
	x: ParamDifNames;
  };
export function loadParamDifNames(slice: Slice, arg0: number): ParamDifNames {
  	if (((slice.preloadUint(1) == 0b0) && (arg0 == 1))) {
  		slice.loadUint(1);
		return {
  			kind: 'ParamDifNames_a'
  		};
  	};
	if (((slice.preloadUint(1) == 0b1) && (arg0 == 2))) {
  		slice.loadUint(1);
		let x: ParamDifNames = loadParamDifNames(slice, 2);
		return {
  			kind: 'ParamDifNames_b',
			n: paramDifNames_b_get_n(x),
			x: x
  		};
  	};
	if (((slice.preloadUint(1) == 0b0) && (arg0 == 3))) {
  		slice.loadUint(1);
		let x: ParamDifNames = loadParamDifNames(slice, 3);
		return {
  			kind: 'ParamDifNames_c',
			m: paramDifNames_c_get_m(x),
			x: x
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
			storeParamDifNames(paramDifNames.x)(builder);
  		};
  	};
	if ((paramDifNames.kind == 'ParamDifNames_c')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeParamDifNames(paramDifNames.x)(builder);
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
	t: number;
	z: number;
  };
export function loadSame<X>(slice: Slice, loadX: (slice: Slice) => X): Same<X> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let x: number = slice.loadUint(32);
		return {
  			kind: 'Same_g',
			Y: x,
			x: x
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let t: number = slice.loadUint(32);
		let z: number = slice.loadUint(32);
		return {
  			kind: 'Same_t',
			Y: (t / 2),
			t: t,
			z: z
  		};
  	};
	throw new Error('');
  }
export function storeSame<X>(same: Same<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((same.kind == 'Same_g')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			builder.storeUint(same.x, 32);
  		};
  	};
	if ((same.kind == 'Same_t')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			builder.storeUint(same.t, 32);
			builder.storeUint(same.z, 32);
  		};
  	};
	throw new Error('');
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
	y: OneComb;
  };
export function loadManyComb(slice: Slice): ManyComb {
  	let y: OneComb = loadOneComb(slice, () => {
  		return slice.loadUint();
  	});
	return {
  		kind: 'ManyComb',
		y: y
  	};
  }
export function storeManyComb(manyComb: ManyComb): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeOneComb(manyComb.y, (arg: number) => {
  			return (builder: Builder) => {
  				builder.storeUint(arg, );
  			};
  		})(builder);
  	};
  }
