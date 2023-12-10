import { Builder } from 'ton'
import { Slice } from 'ton'
import { beginCell } from 'ton'
import { BitString } from 'ton'
export function bitLen(n: number) {
  	return n.toString(2).length;;
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
  	return ((builder: Builder) => {
  
  	});
  }
export type True = {
  	kind: 'True';
  };
export function loadTrue(slice: Slice): True {
  	return {
  		kind: 'True'
  	};
  }
export function storeTrue(true0: True): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type Bool = Bool_bool_false | Bool_bool_true;
export type Bool_bool_false = {
  	kind: 'Bool_bool_false';
  };
export type Bool_bool_true = {
  	kind: 'Bool_bool_true';
  };
export function loadBool(slice: Slice): Bool {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'Bool_bool_false'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		return {
  			kind: 'Bool_bool_true'
  		};
  	};
	throw new Error('');
  }
export function storeBool(bool: Bool): (builder: Builder) => void {
  	if ((bool.kind == 'Bool_bool_false')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((bool.kind == 'Bool_bool_true')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
  		});
  	};
	throw new Error('');
  }
export type BoolFalse = {
  	kind: 'BoolFalse';
  };
export function loadBoolFalse(slice: Slice): BoolFalse {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'BoolFalse'
  		};
  	};
	throw new Error('');
  }
export function storeBoolFalse(boolFalse: BoolFalse): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0b0, 1);
  	});
  }
export type BoolTrue = {
  	kind: 'BoolTrue';
  };
export function loadBoolTrue(slice: Slice): BoolTrue {
  	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		return {
  			kind: 'BoolTrue'
  		};
  	};
	throw new Error('');
  }
export function storeBoolTrue(boolTrue: BoolTrue): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0b1, 1);
  	});
  }
export type Maybe<X> = Maybe_nothing<X> | Maybe_just<X>;
export type Maybe_nothing<X> = {
  	kind: 'Maybe_nothing';
  };
export type Maybe_just<X> = {
  	kind: 'Maybe_just';
	value: X;
  };
export function loadMaybe<X>(slice: Slice, loadX: (slice: Slice) => X): Maybe<X> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'Maybe_nothing'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let value: X = loadX(slice);
		return {
  			kind: 'Maybe_just',
			value: value
  		};
  	};
	throw new Error('');
  }
export function storeMaybe<X>(maybe: Maybe<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((maybe.kind == 'Maybe_nothing')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((maybe.kind == 'Maybe_just')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeX(maybe.value)(builder);
  		});
  	};
	throw new Error('');
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
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeX(either.value)(builder);
  		});
  	};
	if ((either.kind == 'Either_right')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeY(either.value)(builder);
  		});
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
  	return ((builder: Builder) => {
  		storeX(both.first)(builder);
		storeY(both.second)(builder);
  	});
  }
export type Bit = {
  	kind: 'Bit';
  };
export function loadBit(slice: Slice): Bit {
  	return {
  		kind: 'Bit'
  	};
  }
export function storeBit(bit: Bit): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export function hashmap_get_l(label: HmLabel): number {
  	if ((label.kind == 'HmLabel_hml_short')) {
  		let n = label.n;
		return n;
  	};
	if ((label.kind == 'HmLabel_hml_long')) {
  		let n = label.n;
		return n;
  	};
	if ((label.kind == 'HmLabel_hml_same')) {
  		let n = label.n;
		return n;
  	};
	throw new Error('');
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
	let l = hashmap_get_l(label);
	let node: HashmapNode<X> = loadHashmapNode<X>(slice, (n - l), loadX);
	return {
  		kind: 'Hashmap',
		m: (n - l),
		n: n,
		label: label,
		l: l,
		node: node
  	};
  }
export function storeHashmap<X>(hashmap: Hashmap<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeHmLabel(hashmap.label)(builder);
		storeHashmapNode<X>(hashmap.node, storeX)(builder);
  	});
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
export function loadHashmapNode<X>(slice: Slice, arg0: number, loadX: (slice: Slice) => X): HashmapNode<X> {
  	if ((arg0 == 0)) {
  		let value: X = loadX(slice);
		return {
  			kind: 'HashmapNode_hmn_leaf',
			value: value
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let left: Hashmap<X> = loadHashmap<X>(slice1, (arg0 - 1), loadX);
		let slice2 = slice.loadRef().beginParse();
		let right: Hashmap<X> = loadHashmap<X>(slice2, (arg0 - 1), loadX);
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
  		return ((builder: Builder) => {
  			storeX(hashmapNode.value)(builder);
  		});
  	};
	if ((hashmapNode.kind == 'HashmapNode_hmn_fork')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeHashmap<X>(hashmapNode.left, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeHashmap<X>(hashmapNode.right, storeX)(cell2);
			builder.storeRef(cell2);
  		});
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
	s: Array<BitString>;
  };
export type HmLabel_hml_long = {
  	kind: 'HmLabel_hml_long';
	m: number;
	n: number;
	s: Array<BitString>;
  };
export type HmLabel_hml_same = {
  	kind: 'HmLabel_hml_same';
	m: number;
	v: BitString;
	n: number;
  };
export function loadHmLabel(slice: Slice, m: number): HmLabel {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let len: Unary = loadUnary(slice);
		let n = hmLabel_hml_short_get_n(len);
		let s: Array<BitString> = Array.from(Array(n).keys()).map(((arg: number) => {
  			return slice.loadBits(1);
  		}));
		if ((!(n <= m))) {
  			throw new Error('');
  		};
		return {
  			kind: 'HmLabel_hml_short',
			m: m,
			len: len,
			n: n,
			s: s
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		let n: number = slice.loadUint(bitLen(m));
		let s: Array<BitString> = Array.from(Array(n).keys()).map(((arg: number) => {
  			return slice.loadBits(1);
  		}));
		return {
  			kind: 'HmLabel_hml_long',
			m: m,
			n: n,
			s: s
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		let v: BitString = slice.loadBits(1);
		let n: number = slice.loadUint(bitLen(m));
		return {
  			kind: 'HmLabel_hml_same',
			m: m,
			v: v,
			n: n
  		};
  	};
	throw new Error('');
  }
export function storeHmLabel(hmLabel: HmLabel): (builder: Builder) => void {
  	if ((hmLabel.kind == 'HmLabel_hml_short')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeUnary(hmLabel.len)(builder);
			hmLabel.s.forEach(((arg: BitString) => {
  				builder.storeBits(arg);
  			}));
			if ((!(hmLabel.n <= hmLabel.m))) {
  				throw new Error('');
  			};
  		});
  	};
	if ((hmLabel.kind == 'HmLabel_hml_long')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10, 2);
			builder.storeUint(hmLabel.n, bitLen(hmLabel.m));
			hmLabel.s.forEach(((arg: BitString) => {
  				builder.storeBits(arg);
  			}));
  		});
  	};
	if ((hmLabel.kind == 'HmLabel_hml_same')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b11, 2);
			builder.storeBits(hmLabel.v);
			builder.storeUint(hmLabel.n, bitLen(hmLabel.m));
  		});
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
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((unary.kind == 'Unary_unary_succ')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeUnary(unary.x)(builder);
  		});
  	};
	throw new Error('');
  }
export type HashmapE<X> = HashmapE_hme_empty<X> | HashmapE_hme_root<X>;
export type HashmapE_hme_empty<X> = {
  	kind: 'HashmapE_hme_empty';
	n: number;
  };
export type HashmapE_hme_root<X> = {
  	kind: 'HashmapE_hme_root';
	n: number;
	root: Hashmap<X>;
  };
export function loadHashmapE<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): HashmapE<X> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'HashmapE_hme_empty',
			n: n
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let slice1 = slice.loadRef().beginParse();
		let root: Hashmap<X> = loadHashmap<X>(slice1, n, loadX);
		return {
  			kind: 'HashmapE_hme_root',
			n: n,
			root: root
  		};
  	};
	throw new Error('');
  }
export function storeHashmapE<X>(hashmapE: HashmapE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((hashmapE.kind == 'HashmapE_hme_empty')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((hashmapE.kind == 'HashmapE_hme_root')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeHashmap<X>(hashmapE.root, storeX)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	throw new Error('');
  }
export type BitstringSet = {
  	kind: 'BitstringSet';
	n: number;
	_: Hashmap<True>;
  };
export function loadBitstringSet(slice: Slice, n: number): BitstringSet {
  	let _: Hashmap<True> = loadHashmap<True>(slice, n, loadTrue);
	return {
  		kind: 'BitstringSet',
		n: n,
		_: _
  	};
  }
export function storeBitstringSet(bitstringSet: BitstringSet): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeHashmap<True>(bitstringSet._, storeTrue)(builder);
  	});
  }
export function hashmapAug_get_l(label: HmLabel): number {
  	if ((label.kind == 'HmLabel_hml_short')) {
  		let n = label.n;
		return n;
  	};
	if ((label.kind == 'HmLabel_hml_long')) {
  		let n = label.n;
		return n;
  	};
	if ((label.kind == 'HmLabel_hml_same')) {
  		let n = label.n;
		return n;
  	};
	throw new Error('');
  }
export type HashmapAug<X,Y> = {
  	kind: 'HashmapAug';
	n: number;
	l: number;
	m: number;
	label: HmLabel;
	node: HashmapAugNode<X,Y>;
  };
export function loadHashmapAug<X,Y>(slice: Slice, n: number, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): HashmapAug<X,Y> {
  	let label: HmLabel = loadHmLabel(slice, n);
	let l = hashmapAug_get_l(label);
	let node: HashmapAugNode<X,Y> = loadHashmapAugNode<X,Y>(slice, (n - l), loadX, loadY);
	return {
  		kind: 'HashmapAug',
		m: (n - l),
		n: n,
		label: label,
		l: l,
		node: node
  	};
  }
export function storeHashmapAug<X,Y>(hashmapAug: HashmapAug<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeHmLabel(hashmapAug.label)(builder);
		storeHashmapAugNode<X,Y>(hashmapAug.node, storeX, storeY)(builder);
  	});
  }
export type HashmapAugNode<X,Y> = HashmapAugNode_ahmn_leaf<X,Y> | HashmapAugNode_ahmn_fork<X,Y>;
export type HashmapAugNode_ahmn_leaf<X,Y> = {
  	kind: 'HashmapAugNode_ahmn_leaf';
	extra: Y;
	value: X;
  };
export type HashmapAugNode_ahmn_fork<X,Y> = {
  	kind: 'HashmapAugNode_ahmn_fork';
	n: number;
	left: HashmapAug<X,Y>;
	right: HashmapAug<X,Y>;
	extra: Y;
  };
export function loadHashmapAugNode<X,Y>(slice: Slice, arg0: number, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): HashmapAugNode<X,Y> {
  	if ((arg0 == 0)) {
  		let extra: Y = loadY(slice);
		let value: X = loadX(slice);
		return {
  			kind: 'HashmapAugNode_ahmn_leaf',
			extra: extra,
			value: value
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let left: HashmapAug<X,Y> = loadHashmapAug<X,Y>(slice1, (arg0 - 1), loadX, loadY);
		let slice2 = slice.loadRef().beginParse();
		let right: HashmapAug<X,Y> = loadHashmapAug<X,Y>(slice2, (arg0 - 1), loadX, loadY);
		let extra: Y = loadY(slice);
		return {
  			kind: 'HashmapAugNode_ahmn_fork',
			n: (arg0 - 1),
			left: left,
			right: right,
			extra: extra
  		};
  	};
	throw new Error('');
  }
export function storeHashmapAugNode<X,Y>(hashmapAugNode: HashmapAugNode<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((hashmapAugNode.kind == 'HashmapAugNode_ahmn_leaf')) {
  		return ((builder: Builder) => {
  			storeY(hashmapAugNode.extra)(builder);
			storeX(hashmapAugNode.value)(builder);
  		});
  	};
	if ((hashmapAugNode.kind == 'HashmapAugNode_ahmn_fork')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeHashmapAug<X,Y>(hashmapAugNode.left, storeX, storeY)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeHashmapAug<X,Y>(hashmapAugNode.right, storeX, storeY)(cell2);
			builder.storeRef(cell2);
			storeY(hashmapAugNode.extra)(builder);
  		});
  	};
	throw new Error('');
  }
export type HashmapAugE<X,Y> = HashmapAugE_ahme_empty<X,Y> | HashmapAugE_ahme_root<X,Y>;
export type HashmapAugE_ahme_empty<X,Y> = {
  	kind: 'HashmapAugE_ahme_empty';
	n: number;
	extra: Y;
  };
export type HashmapAugE_ahme_root<X,Y> = {
  	kind: 'HashmapAugE_ahme_root';
	n: number;
	root: HashmapAug<X,Y>;
	extra: Y;
  };
export function loadHashmapAugE<X,Y>(slice: Slice, n: number, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): HashmapAugE<X,Y> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let extra: Y = loadY(slice);
		return {
  			kind: 'HashmapAugE_ahme_empty',
			n: n,
			extra: extra
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let slice1 = slice.loadRef().beginParse();
		let root: HashmapAug<X,Y> = loadHashmapAug<X,Y>(slice1, n, loadX, loadY);
		let extra: Y = loadY(slice);
		return {
  			kind: 'HashmapAugE_ahme_root',
			n: n,
			root: root,
			extra: extra
  		};
  	};
	throw new Error('');
  }
export function storeHashmapAugE<X,Y>(hashmapAugE: HashmapAugE<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((hashmapAugE.kind == 'HashmapAugE_ahme_empty')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeY(hashmapAugE.extra)(builder);
  		});
  	};
	if ((hashmapAugE.kind == 'HashmapAugE_ahme_root')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeHashmapAug<X,Y>(hashmapAugE.root, storeX, storeY)(cell1);
			builder.storeRef(cell1);
			storeY(hashmapAugE.extra)(builder);
  		});
  	};
	throw new Error('');
  }
export function varHashmap_get_l(label: HmLabel): number {
  	if ((label.kind == 'HmLabel_hml_short')) {
  		let n = label.n;
		return n;
  	};
	if ((label.kind == 'HmLabel_hml_long')) {
  		let n = label.n;
		return n;
  	};
	if ((label.kind == 'HmLabel_hml_same')) {
  		let n = label.n;
		return n;
  	};
	throw new Error('');
  }
export type VarHashmap<X> = {
  	kind: 'VarHashmap';
	n: number;
	l: number;
	m: number;
	label: HmLabel;
	node: VarHashmapNode<X>;
  };
export function loadVarHashmap<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): VarHashmap<X> {
  	let label: HmLabel = loadHmLabel(slice, n);
	let l = varHashmap_get_l(label);
	let node: VarHashmapNode<X> = loadVarHashmapNode<X>(slice, (n - l), loadX);
	return {
  		kind: 'VarHashmap',
		m: (n - l),
		n: n,
		label: label,
		l: l,
		node: node
  	};
  }
export function storeVarHashmap<X>(varHashmap: VarHashmap<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeHmLabel(varHashmap.label)(builder);
		storeVarHashmapNode<X>(varHashmap.node, storeX)(builder);
  	});
  }
export type VarHashmapNode<X> = VarHashmapNode_vhmn_leaf<X> | VarHashmapNode_vhmn_fork<X> | VarHashmapNode_vhmn_cont<X>;
export type VarHashmapNode_vhmn_leaf<X> = {
  	kind: 'VarHashmapNode_vhmn_leaf';
	n: number;
	value: X;
  };
export type VarHashmapNode_vhmn_fork<X> = {
  	kind: 'VarHashmapNode_vhmn_fork';
	n: number;
	left: VarHashmap<X>;
	right: VarHashmap<X>;
	value: Maybe<X>;
  };
export type VarHashmapNode_vhmn_cont<X> = {
  	kind: 'VarHashmapNode_vhmn_cont';
	n: number;
	branch: BitString;
	child: VarHashmap<X>;
	value: X;
  };
export function loadVarHashmapNode<X>(slice: Slice, arg0: number, loadX: (slice: Slice) => X): VarHashmapNode<X> {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		let value: X = loadX(slice);
		return {
  			kind: 'VarHashmapNode_vhmn_leaf',
			n: arg0,
			value: value
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		slice.loadUint(2);
		let slice1 = slice.loadRef().beginParse();
		let left: VarHashmap<X> = loadVarHashmap<X>(slice1, (arg0 - 1), loadX);
		let slice2 = slice.loadRef().beginParse();
		let right: VarHashmap<X> = loadVarHashmap<X>(slice2, (arg0 - 1), loadX);
		let value: Maybe<X> = loadMaybe<X>(slice, loadX);
		return {
  			kind: 'VarHashmapNode_vhmn_fork',
			n: (arg0 - 1),
			left: left,
			right: right,
			value: value
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let branch: BitString = slice.loadBits(1);
		let slice1 = slice.loadRef().beginParse();
		let child: VarHashmap<X> = loadVarHashmap<X>(slice1, (arg0 - 1), loadX);
		let value: X = loadX(slice);
		return {
  			kind: 'VarHashmapNode_vhmn_cont',
			n: (arg0 - 1),
			branch: branch,
			child: child,
			value: value
  		};
  	};
	throw new Error('');
  }
export function storeVarHashmapNode<X>(varHashmapNode: VarHashmapNode<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((varHashmapNode.kind == 'VarHashmapNode_vhmn_leaf')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b00, 2);
			storeX(varHashmapNode.value)(builder);
  		});
  	};
	if ((varHashmapNode.kind == 'VarHashmapNode_vhmn_fork')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b01, 2);
			let cell1 = beginCell();
			storeVarHashmap<X>(varHashmapNode.left, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeVarHashmap<X>(varHashmapNode.right, storeX)(cell2);
			builder.storeRef(cell2);
			storeMaybe<X>(varHashmapNode.value, storeX)(builder);
  		});
  	};
	if ((varHashmapNode.kind == 'VarHashmapNode_vhmn_cont')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			builder.storeBits(varHashmapNode.branch);
			let cell1 = beginCell();
			storeVarHashmap<X>(varHashmapNode.child, storeX)(cell1);
			builder.storeRef(cell1);
			storeX(varHashmapNode.value)(builder);
  		});
  	};
	throw new Error('');
  }
export type VarHashmapE<X> = VarHashmapE_vhme_empty<X> | VarHashmapE_vhme_root<X>;
export type VarHashmapE_vhme_empty<X> = {
  	kind: 'VarHashmapE_vhme_empty';
	n: number;
  };
export type VarHashmapE_vhme_root<X> = {
  	kind: 'VarHashmapE_vhme_root';
	n: number;
	root: VarHashmap<X>;
  };
export function loadVarHashmapE<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): VarHashmapE<X> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'VarHashmapE_vhme_empty',
			n: n
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let slice1 = slice.loadRef().beginParse();
		let root: VarHashmap<X> = loadVarHashmap<X>(slice1, n, loadX);
		return {
  			kind: 'VarHashmapE_vhme_root',
			n: n,
			root: root
  		};
  	};
	throw new Error('');
  }
export function storeVarHashmapE<X>(varHashmapE: VarHashmapE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((varHashmapE.kind == 'VarHashmapE_vhme_empty')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((varHashmapE.kind == 'VarHashmapE_vhme_root')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeVarHashmap<X>(varHashmapE.root, storeX)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	throw new Error('');
  }
export function pfxHashmap_get_l(label: HmLabel): number {
  	if ((label.kind == 'HmLabel_hml_short')) {
  		let n = label.n;
		return n;
  	};
	if ((label.kind == 'HmLabel_hml_long')) {
  		let n = label.n;
		return n;
  	};
	if ((label.kind == 'HmLabel_hml_same')) {
  		let n = label.n;
		return n;
  	};
	throw new Error('');
  }
export type PfxHashmap<X> = {
  	kind: 'PfxHashmap';
	n: number;
	l: number;
	m: number;
	label: HmLabel;
	node: PfxHashmapNode<X>;
  };
export function loadPfxHashmap<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): PfxHashmap<X> {
  	let label: HmLabel = loadHmLabel(slice, n);
	let l = pfxHashmap_get_l(label);
	let node: PfxHashmapNode<X> = loadPfxHashmapNode<X>(slice, (n - l), loadX);
	return {
  		kind: 'PfxHashmap',
		m: (n - l),
		n: n,
		label: label,
		l: l,
		node: node
  	};
  }
export function storePfxHashmap<X>(pfxHashmap: PfxHashmap<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeHmLabel(pfxHashmap.label)(builder);
		storePfxHashmapNode<X>(pfxHashmap.node, storeX)(builder);
  	});
  }
export type PfxHashmapNode<X> = PfxHashmapNode_phmn_leaf<X> | PfxHashmapNode_phmn_fork<X>;
export type PfxHashmapNode_phmn_leaf<X> = {
  	kind: 'PfxHashmapNode_phmn_leaf';
	n: number;
	value: X;
  };
export type PfxHashmapNode_phmn_fork<X> = {
  	kind: 'PfxHashmapNode_phmn_fork';
	n: number;
	left: PfxHashmap<X>;
	right: PfxHashmap<X>;
  };
export function loadPfxHashmapNode<X>(slice: Slice, arg0: number, loadX: (slice: Slice) => X): PfxHashmapNode<X> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let value: X = loadX(slice);
		return {
  			kind: 'PfxHashmapNode_phmn_leaf',
			n: arg0,
			value: value
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let slice1 = slice.loadRef().beginParse();
		let left: PfxHashmap<X> = loadPfxHashmap<X>(slice1, (arg0 - 1), loadX);
		let slice2 = slice.loadRef().beginParse();
		let right: PfxHashmap<X> = loadPfxHashmap<X>(slice2, (arg0 - 1), loadX);
		return {
  			kind: 'PfxHashmapNode_phmn_fork',
			n: (arg0 - 1),
			left: left,
			right: right
  		};
  	};
	throw new Error('');
  }
export function storePfxHashmapNode<X>(pfxHashmapNode: PfxHashmapNode<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((pfxHashmapNode.kind == 'PfxHashmapNode_phmn_leaf')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeX(pfxHashmapNode.value)(builder);
  		});
  	};
	if ((pfxHashmapNode.kind == 'PfxHashmapNode_phmn_fork')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storePfxHashmap<X>(pfxHashmapNode.left, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storePfxHashmap<X>(pfxHashmapNode.right, storeX)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	throw new Error('');
  }
export type PfxHashmapE<X> = PfxHashmapE_phme_empty<X> | PfxHashmapE_phme_root<X>;
export type PfxHashmapE_phme_empty<X> = {
  	kind: 'PfxHashmapE_phme_empty';
	n: number;
  };
export type PfxHashmapE_phme_root<X> = {
  	kind: 'PfxHashmapE_phme_root';
	n: number;
	root: PfxHashmap<X>;
  };
export function loadPfxHashmapE<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): PfxHashmapE<X> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'PfxHashmapE_phme_empty',
			n: n
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let slice1 = slice.loadRef().beginParse();
		let root: PfxHashmap<X> = loadPfxHashmap<X>(slice1, n, loadX);
		return {
  			kind: 'PfxHashmapE_phme_root',
			n: n,
			root: root
  		};
  	};
	throw new Error('');
  }
export function storePfxHashmapE<X>(pfxHashmapE: PfxHashmapE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((pfxHashmapE.kind == 'PfxHashmapE_phme_empty')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((pfxHashmapE.kind == 'PfxHashmapE_phme_root')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storePfxHashmap<X>(pfxHashmapE.root, storeX)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	throw new Error('');
  }
export type MsgAddressExt = MsgAddressExt_addr_none | MsgAddressExt_addr_extern;
export type MsgAddressExt_addr_none = {
  	kind: 'MsgAddressExt_addr_none';
  };
export type MsgAddressExt_addr_extern = {
  	kind: 'MsgAddressExt_addr_extern';
	len: number;
	external_address: BitString;
  };
export function loadMsgAddressExt(slice: Slice): MsgAddressExt {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		return {
  			kind: 'MsgAddressExt_addr_none'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		slice.loadUint(2);
		let len: number = slice.loadUint(9);
		let external_address: BitString = slice.loadBits(len);
		return {
  			kind: 'MsgAddressExt_addr_extern',
			len: len,
			external_address: external_address
  		};
  	};
	throw new Error('');
  }
export function storeMsgAddressExt(msgAddressExt: MsgAddressExt): (builder: Builder) => void {
  	if ((msgAddressExt.kind == 'MsgAddressExt_addr_none')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		});
  	};
	if ((msgAddressExt.kind == 'MsgAddressExt_addr_extern')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b01, 2);
			builder.storeUint(msgAddressExt.len, 9);
			builder.storeBits(msgAddressExt.external_address);
  		});
  	};
	throw new Error('');
  }
export type Anycast = {
  	kind: 'Anycast';
	depth: number;
	rewrite_pfx: BitString;
  };
export function loadAnycast(slice: Slice): Anycast {
  	let depth: number = slice.loadUint(bitLen(30));
	let rewrite_pfx: BitString = slice.loadBits(depth);
	if ((!(depth >= 1))) {
  		throw new Error('');
  	};
	return {
  		kind: 'Anycast',
		depth: depth,
		rewrite_pfx: rewrite_pfx
  	};
  }
export function storeAnycast(anycast: Anycast): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(anycast.depth, bitLen(30));
		builder.storeBits(anycast.rewrite_pfx);
		if ((!(anycast.depth >= 1))) {
  			throw new Error('');
  		};
  	});
  }
export type MsgAddressInt = MsgAddressInt_addr_std | MsgAddressInt_addr_var;
export type MsgAddressInt_addr_std = {
  	kind: 'MsgAddressInt_addr_std';
	anycast: Maybe<Anycast>;
	workchain_id: number;
	address: BitString;
  };
export type MsgAddressInt_addr_var = {
  	kind: 'MsgAddressInt_addr_var';
	anycast: Maybe<Anycast>;
	addr_len: number;
	workchain_id: number;
	address: BitString;
  };
export function loadMsgAddressInt(slice: Slice): MsgAddressInt {
  	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		let anycast: Maybe<Anycast> = loadMaybe<Anycast>(slice, loadAnycast);
		let workchain_id: number = slice.loadInt(8);
		let address: BitString = slice.loadBits(256);
		return {
  			kind: 'MsgAddressInt_addr_std',
			anycast: anycast,
			workchain_id: workchain_id,
			address: address
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		let anycast: Maybe<Anycast> = loadMaybe<Anycast>(slice, loadAnycast);
		let addr_len: number = slice.loadUint(9);
		let workchain_id: number = slice.loadInt(32);
		let address: BitString = slice.loadBits(addr_len);
		return {
  			kind: 'MsgAddressInt_addr_var',
			anycast: anycast,
			addr_len: addr_len,
			workchain_id: workchain_id,
			address: address
  		};
  	};
	throw new Error('');
  }
export function storeMsgAddressInt(msgAddressInt: MsgAddressInt): (builder: Builder) => void {
  	if ((msgAddressInt.kind == 'MsgAddressInt_addr_std')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10, 2);
			storeMaybe<Anycast>(msgAddressInt.anycast, storeAnycast)(builder);
			builder.storeInt(msgAddressInt.workchain_id, 8);
			builder.storeBits(msgAddressInt.address);
  		});
  	};
	if ((msgAddressInt.kind == 'MsgAddressInt_addr_var')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b11, 2);
			storeMaybe<Anycast>(msgAddressInt.anycast, storeAnycast)(builder);
			builder.storeUint(msgAddressInt.addr_len, 9);
			builder.storeInt(msgAddressInt.workchain_id, 32);
			builder.storeBits(msgAddressInt.address);
  		});
  	};
	throw new Error('');
  }
export type MsgAddress = MsgAddress__ | MsgAddress__1;
export type MsgAddress__ = {
  	kind: 'MsgAddress__';
	_: MsgAddressInt;
  };
export type MsgAddress__1 = {
  	kind: 'MsgAddress__1';
	_: MsgAddressExt;
  };
export function loadMsgAddress(slice: Slice): MsgAddress {
  	if (true) {
  		let _: MsgAddressInt = loadMsgAddressInt(slice);
		return {
  			kind: 'MsgAddress__',
			_: _
  		};
  	};
	if (true) {
  		let _: MsgAddressExt = loadMsgAddressExt(slice);
		return {
  			kind: 'MsgAddress__1',
			_: _
  		};
  	};
	throw new Error('');
  }
export function storeMsgAddress(msgAddress: MsgAddress): (builder: Builder) => void {
  	if ((msgAddress.kind == 'MsgAddress__')) {
  		return ((builder: Builder) => {
  			storeMsgAddressInt(msgAddress._)(builder);
  		});
  	};
	if ((msgAddress.kind == 'MsgAddress__1')) {
  		return ((builder: Builder) => {
  			storeMsgAddressExt(msgAddress._)(builder);
  		});
  	};
	throw new Error('');
  }
export type VarUInteger = {
  	kind: 'VarUInteger';
	n: number;
	len: number;
	value: number;
  };
export function loadVarUInteger(slice: Slice, n: number): VarUInteger {
  	let len: number = slice.loadUint(bitLen((n - 1)));
	let value: number = slice.loadUint((len * 8));
	return {
  		kind: 'VarUInteger',
		n: n,
		len: len,
		value: value
  	};
  }
export function storeVarUInteger(varUInteger: VarUInteger): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(varUInteger.len, bitLen((varUInteger.n - 1)));
		builder.storeUint(varUInteger.value, (varUInteger.len * 8));
  	});
  }
export type VarInteger = {
  	kind: 'VarInteger';
	n: number;
	len: number;
	value: number;
  };
export function loadVarInteger(slice: Slice, n: number): VarInteger {
  	let len: number = slice.loadUint(bitLen((n - 1)));
	let value: number = slice.loadInt((len * 8));
	return {
  		kind: 'VarInteger',
		n: n,
		len: len,
		value: value
  	};
  }
export function storeVarInteger(varInteger: VarInteger): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(varInteger.len, bitLen((varInteger.n - 1)));
		builder.storeInt(varInteger.value, (varInteger.len * 8));
  	});
  }
export type Grams = {
  	kind: 'Grams';
	amount: VarUInteger;
  };
export function loadGrams(slice: Slice): Grams {
  	let amount: VarUInteger = loadVarUInteger(slice, 16);
	return {
  		kind: 'Grams',
		amount: amount
  	};
  }
export function storeGrams(grams: Grams): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeVarUInteger(grams.amount)(builder);
  	});
  }
export type ExtraCurrencyCollection = {
  	kind: 'ExtraCurrencyCollection';
	dict: HashmapE<VarUInteger>;
  };
export function loadExtraCurrencyCollection(slice: Slice): ExtraCurrencyCollection {
  	let dict: HashmapE<VarUInteger> = loadHashmapE<VarUInteger>(slice, 32, ((slice: Slice) => {
  		return loadVarUInteger(slice, 32);
  	}));
	return {
  		kind: 'ExtraCurrencyCollection',
		dict: dict
  	};
  }
export function storeExtraCurrencyCollection(extraCurrencyCollection: ExtraCurrencyCollection): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeHashmapE<VarUInteger>(extraCurrencyCollection.dict, ((arg: VarUInteger) => {
  			return ((builder: Builder) => {
  				storeVarUInteger(arg)(builder);
  			});
  		}))(builder);
  	});
  }
export type CurrencyCollection = {
  	kind: 'CurrencyCollection';
	grams: Grams;
	other: ExtraCurrencyCollection;
  };
export function loadCurrencyCollection(slice: Slice): CurrencyCollection {
  	let grams: Grams = loadGrams(slice);
	let other: ExtraCurrencyCollection = loadExtraCurrencyCollection(slice);
	return {
  		kind: 'CurrencyCollection',
		grams: grams,
		other: other
  	};
  }
export function storeCurrencyCollection(currencyCollection: CurrencyCollection): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeGrams(currencyCollection.grams)(builder);
		storeExtraCurrencyCollection(currencyCollection.other)(builder);
  	});
  }
export type CommonMsgInfo = CommonMsgInfo_int_msg_info | CommonMsgInfo_ext_in_msg_info | CommonMsgInfo_ext_out_msg_info;
export type CommonMsgInfo_int_msg_info = {
  	kind: 'CommonMsgInfo_int_msg_info';
	ihr_disabled: Bool;
	bounce: Bool;
	bounced: Bool;
	src: MsgAddressInt;
	dest: MsgAddressInt;
	value: CurrencyCollection;
	ihr_fee: Grams;
	fwd_fee: Grams;
	created_lt: number;
	created_at: number;
  };
export type CommonMsgInfo_ext_in_msg_info = {
  	kind: 'CommonMsgInfo_ext_in_msg_info';
	src: MsgAddressExt;
	dest: MsgAddressInt;
	import_fee: Grams;
  };
export type CommonMsgInfo_ext_out_msg_info = {
  	kind: 'CommonMsgInfo_ext_out_msg_info';
	src: MsgAddressInt;
	dest: MsgAddressExt;
	created_lt: number;
	created_at: number;
  };
export function loadCommonMsgInfo(slice: Slice): CommonMsgInfo {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let ihr_disabled: Bool = loadBool(slice);
		let bounce: Bool = loadBool(slice);
		let bounced: Bool = loadBool(slice);
		let src: MsgAddressInt = loadMsgAddressInt(slice);
		let dest: MsgAddressInt = loadMsgAddressInt(slice);
		let value: CurrencyCollection = loadCurrencyCollection(slice);
		let ihr_fee: Grams = loadGrams(slice);
		let fwd_fee: Grams = loadGrams(slice);
		let created_lt: number = slice.loadUint(64);
		let created_at: number = slice.loadUint(32);
		return {
  			kind: 'CommonMsgInfo_int_msg_info',
			ihr_disabled: ihr_disabled,
			bounce: bounce,
			bounced: bounced,
			src: src,
			dest: dest,
			value: value,
			ihr_fee: ihr_fee,
			fwd_fee: fwd_fee,
			created_lt: created_lt,
			created_at: created_at
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		let src: MsgAddressExt = loadMsgAddressExt(slice);
		let dest: MsgAddressInt = loadMsgAddressInt(slice);
		let import_fee: Grams = loadGrams(slice);
		return {
  			kind: 'CommonMsgInfo_ext_in_msg_info',
			src: src,
			dest: dest,
			import_fee: import_fee
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		let src: MsgAddressInt = loadMsgAddressInt(slice);
		let dest: MsgAddressExt = loadMsgAddressExt(slice);
		let created_lt: number = slice.loadUint(64);
		let created_at: number = slice.loadUint(32);
		return {
  			kind: 'CommonMsgInfo_ext_out_msg_info',
			src: src,
			dest: dest,
			created_lt: created_lt,
			created_at: created_at
  		};
  	};
	throw new Error('');
  }
export function storeCommonMsgInfo(commonMsgInfo: CommonMsgInfo): (builder: Builder) => void {
  	if ((commonMsgInfo.kind == 'CommonMsgInfo_int_msg_info')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeBool(commonMsgInfo.ihr_disabled)(builder);
			storeBool(commonMsgInfo.bounce)(builder);
			storeBool(commonMsgInfo.bounced)(builder);
			storeMsgAddressInt(commonMsgInfo.src)(builder);
			storeMsgAddressInt(commonMsgInfo.dest)(builder);
			storeCurrencyCollection(commonMsgInfo.value)(builder);
			storeGrams(commonMsgInfo.ihr_fee)(builder);
			storeGrams(commonMsgInfo.fwd_fee)(builder);
			builder.storeUint(commonMsgInfo.created_lt, 64);
			builder.storeUint(commonMsgInfo.created_at, 32);
  		});
  	};
	if ((commonMsgInfo.kind == 'CommonMsgInfo_ext_in_msg_info')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10, 2);
			storeMsgAddressExt(commonMsgInfo.src)(builder);
			storeMsgAddressInt(commonMsgInfo.dest)(builder);
			storeGrams(commonMsgInfo.import_fee)(builder);
  		});
  	};
	if ((commonMsgInfo.kind == 'CommonMsgInfo_ext_out_msg_info')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b11, 2);
			storeMsgAddressInt(commonMsgInfo.src)(builder);
			storeMsgAddressExt(commonMsgInfo.dest)(builder);
			builder.storeUint(commonMsgInfo.created_lt, 64);
			builder.storeUint(commonMsgInfo.created_at, 32);
  		});
  	};
	throw new Error('');
  }
export type CommonMsgInfoRelaxed = CommonMsgInfoRelaxed_int_msg_info | CommonMsgInfoRelaxed_ext_out_msg_info;
export type CommonMsgInfoRelaxed_int_msg_info = {
  	kind: 'CommonMsgInfoRelaxed_int_msg_info';
	ihr_disabled: Bool;
	bounce: Bool;
	bounced: Bool;
	src: MsgAddress;
	dest: MsgAddressInt;
	value: CurrencyCollection;
	ihr_fee: Grams;
	fwd_fee: Grams;
	created_lt: number;
	created_at: number;
  };
export type CommonMsgInfoRelaxed_ext_out_msg_info = {
  	kind: 'CommonMsgInfoRelaxed_ext_out_msg_info';
	src: MsgAddress;
	dest: MsgAddressExt;
	created_lt: number;
	created_at: number;
  };
export function loadCommonMsgInfoRelaxed(slice: Slice): CommonMsgInfoRelaxed {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let ihr_disabled: Bool = loadBool(slice);
		let bounce: Bool = loadBool(slice);
		let bounced: Bool = loadBool(slice);
		let src: MsgAddress = loadMsgAddress(slice);
		let dest: MsgAddressInt = loadMsgAddressInt(slice);
		let value: CurrencyCollection = loadCurrencyCollection(slice);
		let ihr_fee: Grams = loadGrams(slice);
		let fwd_fee: Grams = loadGrams(slice);
		let created_lt: number = slice.loadUint(64);
		let created_at: number = slice.loadUint(32);
		return {
  			kind: 'CommonMsgInfoRelaxed_int_msg_info',
			ihr_disabled: ihr_disabled,
			bounce: bounce,
			bounced: bounced,
			src: src,
			dest: dest,
			value: value,
			ihr_fee: ihr_fee,
			fwd_fee: fwd_fee,
			created_lt: created_lt,
			created_at: created_at
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		let src: MsgAddress = loadMsgAddress(slice);
		let dest: MsgAddressExt = loadMsgAddressExt(slice);
		let created_lt: number = slice.loadUint(64);
		let created_at: number = slice.loadUint(32);
		return {
  			kind: 'CommonMsgInfoRelaxed_ext_out_msg_info',
			src: src,
			dest: dest,
			created_lt: created_lt,
			created_at: created_at
  		};
  	};
	throw new Error('');
  }
export function storeCommonMsgInfoRelaxed(commonMsgInfoRelaxed: CommonMsgInfoRelaxed): (builder: Builder) => void {
  	if ((commonMsgInfoRelaxed.kind == 'CommonMsgInfoRelaxed_int_msg_info')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeBool(commonMsgInfoRelaxed.ihr_disabled)(builder);
			storeBool(commonMsgInfoRelaxed.bounce)(builder);
			storeBool(commonMsgInfoRelaxed.bounced)(builder);
			storeMsgAddress(commonMsgInfoRelaxed.src)(builder);
			storeMsgAddressInt(commonMsgInfoRelaxed.dest)(builder);
			storeCurrencyCollection(commonMsgInfoRelaxed.value)(builder);
			storeGrams(commonMsgInfoRelaxed.ihr_fee)(builder);
			storeGrams(commonMsgInfoRelaxed.fwd_fee)(builder);
			builder.storeUint(commonMsgInfoRelaxed.created_lt, 64);
			builder.storeUint(commonMsgInfoRelaxed.created_at, 32);
  		});
  	};
	if ((commonMsgInfoRelaxed.kind == 'CommonMsgInfoRelaxed_ext_out_msg_info')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b11, 2);
			storeMsgAddress(commonMsgInfoRelaxed.src)(builder);
			storeMsgAddressExt(commonMsgInfoRelaxed.dest)(builder);
			builder.storeUint(commonMsgInfoRelaxed.created_lt, 64);
			builder.storeUint(commonMsgInfoRelaxed.created_at, 32);
  		});
  	};
	throw new Error('');
  }
export type TickTock = {
  	kind: 'TickTock';
	tick: Bool;
	tock: Bool;
  };
export function loadTickTock(slice: Slice): TickTock {
  	let tick: Bool = loadBool(slice);
	let tock: Bool = loadBool(slice);
	return {
  		kind: 'TickTock',
		tick: tick,
		tock: tock
  	};
  }
export function storeTickTock(tickTock: TickTock): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeBool(tickTock.tick)(builder);
		storeBool(tickTock.tock)(builder);
  	});
  }
export type StateInit = {
  	kind: 'StateInit';
	split_depth: Maybe<number>;
	special: Maybe<TickTock>;
	code: Maybe<Slice>;
	data: Maybe<Slice>;
	library: HashmapE<SimpleLib>;
  };
export function loadStateInit(slice: Slice): StateInit {
  	let split_depth: Maybe<number> = loadMaybe<number>(slice, ((slice: Slice) => {
  		return slice.loadUint(5);
  	}));
	let special: Maybe<TickTock> = loadMaybe<TickTock>(slice, loadTickTock);
	let code: Maybe<Slice> = loadMaybe<Slice>(slice, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return slice1;
  	}));
	let data: Maybe<Slice> = loadMaybe<Slice>(slice, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return slice1;
  	}));
	let library: HashmapE<SimpleLib> = loadHashmapE<SimpleLib>(slice, 256, loadSimpleLib);
	return {
  		kind: 'StateInit',
		split_depth: split_depth,
		special: special,
		code: code,
		data: data,
		library: library
  	};
  }
export function storeStateInit(stateInit: StateInit): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeMaybe<number>(stateInit.split_depth, ((arg: number) => {
  			return ((builder: Builder) => {
  				builder.storeUint(arg, 5);
  			});
  		}))(builder);
		storeMaybe<TickTock>(stateInit.special, storeTickTock)(builder);
		storeMaybe<Slice>(stateInit.code, ((arg: Slice) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				cell1.storeSlice(arg)
				builder.storeRef(cell1);
  			});
  		}))(builder);
		storeMaybe<Slice>(stateInit.data, ((arg: Slice) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				cell1.storeSlice(arg)
				builder.storeRef(cell1);
  			});
  		}))(builder);
		storeHashmapE<SimpleLib>(stateInit.library, storeSimpleLib)(builder);
  	});
  }
export type SimpleLib = {
  	kind: 'SimpleLib';
	public: Bool;
	root: Slice;
  };
export function loadSimpleLib(slice: Slice): SimpleLib {
  	let public: Bool = loadBool(slice);
	let slice1 = slice.loadRef().beginParse();
	let root: Slice = slice1;
	return {
  		kind: 'SimpleLib',
		public: public,
		root: root
  	};
  }
export function storeSimpleLib(simpleLib: SimpleLib): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeBool(simpleLib.public)(builder);
		let cell1 = beginCell();
		cell1.storeSlice(simpleLib.root);
		builder.storeRef(cell1);
  	});
  }
export type Message<X> = {
  	kind: 'Message';
	info: CommonMsgInfo;
	init: Maybe<Either<StateInit,StateInit>>;
	body: Either<X,X>;
  };
export function loadMessage<X>(slice: Slice, loadX: (slice: Slice) => X): Message<X> {
  	let info: CommonMsgInfo = loadCommonMsgInfo(slice);
	let init: Maybe<Either<StateInit,StateInit>> = loadMaybe<Either<StateInit,StateInit>>(slice, ((slice: Slice) => {
  		return loadEither<StateInit,StateInit>(slice, loadStateInit, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadStateInit(slice1);
  		}));
  	}));
	let body: Either<X,X> = loadEither<X,X>(slice, loadX, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return loadX(slice1);
  	}));
	return {
  		kind: 'Message',
		info: info,
		init: init,
		body: body
  	};
  }
export function storeMessage<X>(message: Message<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeCommonMsgInfo(message.info)(builder);
		storeMaybe<Either<StateInit,StateInit>>(message.init, ((arg: Either<StateInit,StateInit>) => {
  			return ((builder: Builder) => {
  				storeEither<StateInit,StateInit>(arg, storeStateInit, ((arg: StateInit) => {
  					return ((builder: Builder) => {
  						let cell1 = beginCell()
						storeStateInit(arg)(cell1)
						builder.storeRef(cell1);
  					});
  				}))(builder);
  			});
  		}))(builder);
		storeEither<X,X>(message.body, storeX, ((arg: X) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeX(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(builder);
  	});
  }
export type MessageRelaxed<X> = {
  	kind: 'MessageRelaxed';
	info: CommonMsgInfoRelaxed;
	init: Maybe<Either<StateInit,StateInit>>;
	body: Either<X,X>;
  };
export function loadMessageRelaxed<X>(slice: Slice, loadX: (slice: Slice) => X): MessageRelaxed<X> {
  	let info: CommonMsgInfoRelaxed = loadCommonMsgInfoRelaxed(slice);
	let init: Maybe<Either<StateInit,StateInit>> = loadMaybe<Either<StateInit,StateInit>>(slice, ((slice: Slice) => {
  		return loadEither<StateInit,StateInit>(slice, loadStateInit, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadStateInit(slice1);
  		}));
  	}));
	let body: Either<X,X> = loadEither<X,X>(slice, loadX, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return loadX(slice1);
  	}));
	return {
  		kind: 'MessageRelaxed',
		info: info,
		init: init,
		body: body
  	};
  }
export function storeMessageRelaxed<X>(messageRelaxed: MessageRelaxed<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeCommonMsgInfoRelaxed(messageRelaxed.info)(builder);
		storeMaybe<Either<StateInit,StateInit>>(messageRelaxed.init, ((arg: Either<StateInit,StateInit>) => {
  			return ((builder: Builder) => {
  				storeEither<StateInit,StateInit>(arg, storeStateInit, ((arg: StateInit) => {
  					return ((builder: Builder) => {
  						let cell1 = beginCell()
						storeStateInit(arg)(cell1)
						builder.storeRef(cell1);
  					});
  				}))(builder);
  			});
  		}))(builder);
		storeEither<X,X>(messageRelaxed.body, storeX, ((arg: X) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeX(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(builder);
  	});
  }
export type MessageAny = {
  	kind: 'MessageAny';
  };
export function loadMessageAny(slice: Slice): MessageAny {
  	return {
  		kind: 'MessageAny'
  	};
  }
export function storeMessageAny(messageAny: MessageAny): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type IntermediateAddress = IntermediateAddress_interm_addr_regular | IntermediateAddress_interm_addr_simple | IntermediateAddress_interm_addr_ext;
export type IntermediateAddress_interm_addr_regular = {
  	kind: 'IntermediateAddress_interm_addr_regular';
	use_dest_bits: number;
  };
export type IntermediateAddress_interm_addr_simple = {
  	kind: 'IntermediateAddress_interm_addr_simple';
	workchain_id: number;
	addr_pfx: number;
  };
export type IntermediateAddress_interm_addr_ext = {
  	kind: 'IntermediateAddress_interm_addr_ext';
	workchain_id: number;
	addr_pfx: number;
  };
export function loadIntermediateAddress(slice: Slice): IntermediateAddress {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let use_dest_bits: number = slice.loadUint(bitLen(96));
		return {
  			kind: 'IntermediateAddress_interm_addr_regular',
			use_dest_bits: use_dest_bits
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		let workchain_id: number = slice.loadInt(8);
		let addr_pfx: number = slice.loadUint(64);
		return {
  			kind: 'IntermediateAddress_interm_addr_simple',
			workchain_id: workchain_id,
			addr_pfx: addr_pfx
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		let workchain_id: number = slice.loadInt(32);
		let addr_pfx: number = slice.loadUint(64);
		return {
  			kind: 'IntermediateAddress_interm_addr_ext',
			workchain_id: workchain_id,
			addr_pfx: addr_pfx
  		};
  	};
	throw new Error('');
  }
export function storeIntermediateAddress(intermediateAddress: IntermediateAddress): (builder: Builder) => void {
  	if ((intermediateAddress.kind == 'IntermediateAddress_interm_addr_regular')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			builder.storeUint(intermediateAddress.use_dest_bits, bitLen(96));
  		});
  	};
	if ((intermediateAddress.kind == 'IntermediateAddress_interm_addr_simple')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10, 2);
			builder.storeInt(intermediateAddress.workchain_id, 8);
			builder.storeUint(intermediateAddress.addr_pfx, 64);
  		});
  	};
	if ((intermediateAddress.kind == 'IntermediateAddress_interm_addr_ext')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b11, 2);
			builder.storeInt(intermediateAddress.workchain_id, 32);
			builder.storeUint(intermediateAddress.addr_pfx, 64);
  		});
  	};
	throw new Error('');
  }
export type MsgEnvelope = {
  	kind: 'MsgEnvelope';
	cur_addr: IntermediateAddress;
	next_addr: IntermediateAddress;
	fwd_fee_remaining: Grams;
	msg: Message<Slice>;
  };
export function loadMsgEnvelope(slice: Slice): MsgEnvelope {
  	if ((slice.preloadUint(4) == 0x4)) {
  		slice.loadUint(4);
		let cur_addr: IntermediateAddress = loadIntermediateAddress(slice);
		let next_addr: IntermediateAddress = loadIntermediateAddress(slice);
		let fwd_fee_remaining: Grams = loadGrams(slice);
		let slice1 = slice.loadRef().beginParse();
		let msg: Message<Slice> = loadMessage<Slice>(slice1, ((slice: Slice) => {
  			return slice;
  		}));
		return {
  			kind: 'MsgEnvelope',
			cur_addr: cur_addr,
			next_addr: next_addr,
			fwd_fee_remaining: fwd_fee_remaining,
			msg: msg
  		};
  	};
	throw new Error('');
  }
export function storeMsgEnvelope(msgEnvelope: MsgEnvelope): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x4, 4);
		storeIntermediateAddress(msgEnvelope.cur_addr)(builder);
		storeIntermediateAddress(msgEnvelope.next_addr)(builder);
		storeGrams(msgEnvelope.fwd_fee_remaining)(builder);
		let cell1 = beginCell();
		storeMessage<Slice>(msgEnvelope.msg, ((arg: Slice) => {
  			return ((builder: Builder) => {
  				cell1.storeSlice(arg);
  			});
  		}))(cell1);
		builder.storeRef(cell1);
  	});
  }
export type InMsg = InMsg_msg_import_ext | InMsg_msg_import_ihr | InMsg_msg_import_imm | InMsg_msg_import_fin | InMsg_msg_import_tr | InMsg_msg_discard_fin | InMsg_msg_discard_tr;
export type InMsg_msg_import_ext = {
  	kind: 'InMsg_msg_import_ext';
	msg: Message<Slice>;
	transaction: Transaction;
  };
export type InMsg_msg_import_ihr = {
  	kind: 'InMsg_msg_import_ihr';
	msg: Message<Slice>;
	transaction: Transaction;
	ihr_fee: Grams;
	proof_created: Slice;
  };
export type InMsg_msg_import_imm = {
  	kind: 'InMsg_msg_import_imm';
	in_msg: MsgEnvelope;
	transaction: Transaction;
	fwd_fee: Grams;
  };
export type InMsg_msg_import_fin = {
  	kind: 'InMsg_msg_import_fin';
	in_msg: MsgEnvelope;
	transaction: Transaction;
	fwd_fee: Grams;
  };
export type InMsg_msg_import_tr = {
  	kind: 'InMsg_msg_import_tr';
	in_msg: MsgEnvelope;
	out_msg: MsgEnvelope;
	transit_fee: Grams;
  };
export type InMsg_msg_discard_fin = {
  	kind: 'InMsg_msg_discard_fin';
	in_msg: MsgEnvelope;
	transaction_id: number;
	fwd_fee: Grams;
  };
export type InMsg_msg_discard_tr = {
  	kind: 'InMsg_msg_discard_tr';
	in_msg: MsgEnvelope;
	transaction_id: number;
	fwd_fee: Grams;
	proof_delivered: Slice;
  };
export function loadInMsg(slice: Slice): InMsg {
  	if ((slice.preloadUint(3) == 0b000)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let msg: Message<Slice> = loadMessage<Slice>(slice1, ((slice: Slice) => {
  			return slice;
  		}));
		let slice2 = slice.loadRef().beginParse();
		let transaction: Transaction = loadTransaction(slice2);
		return {
  			kind: 'InMsg_msg_import_ext',
			msg: msg,
			transaction: transaction
  		};
  	};
	if ((slice.preloadUint(3) == 0b010)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let msg: Message<Slice> = loadMessage<Slice>(slice1, ((slice: Slice) => {
  			return slice;
  		}));
		let slice2 = slice.loadRef().beginParse();
		let transaction: Transaction = loadTransaction(slice2);
		let ihr_fee: Grams = loadGrams(slice);
		let slice3 = slice.loadRef().beginParse();
		let proof_created: Slice = slice3;
		return {
  			kind: 'InMsg_msg_import_ihr',
			msg: msg,
			transaction: transaction,
			ihr_fee: ihr_fee,
			proof_created: proof_created
  		};
  	};
	if ((slice.preloadUint(3) == 0b011)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let in_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let slice2 = slice.loadRef().beginParse();
		let transaction: Transaction = loadTransaction(slice2);
		let fwd_fee: Grams = loadGrams(slice);
		return {
  			kind: 'InMsg_msg_import_imm',
			in_msg: in_msg,
			transaction: transaction,
			fwd_fee: fwd_fee
  		};
  	};
	if ((slice.preloadUint(3) == 0b100)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let in_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let slice2 = slice.loadRef().beginParse();
		let transaction: Transaction = loadTransaction(slice2);
		let fwd_fee: Grams = loadGrams(slice);
		return {
  			kind: 'InMsg_msg_import_fin',
			in_msg: in_msg,
			transaction: transaction,
			fwd_fee: fwd_fee
  		};
  	};
	if ((slice.preloadUint(3) == 0b101)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let in_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let slice2 = slice.loadRef().beginParse();
		let out_msg: MsgEnvelope = loadMsgEnvelope(slice2);
		let transit_fee: Grams = loadGrams(slice);
		return {
  			kind: 'InMsg_msg_import_tr',
			in_msg: in_msg,
			out_msg: out_msg,
			transit_fee: transit_fee
  		};
  	};
	if ((slice.preloadUint(3) == 0b110)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let in_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let transaction_id: number = slice.loadUint(64);
		let fwd_fee: Grams = loadGrams(slice);
		return {
  			kind: 'InMsg_msg_discard_fin',
			in_msg: in_msg,
			transaction_id: transaction_id,
			fwd_fee: fwd_fee
  		};
  	};
	if ((slice.preloadUint(3) == 0b111)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let in_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let transaction_id: number = slice.loadUint(64);
		let fwd_fee: Grams = loadGrams(slice);
		let slice2 = slice.loadRef().beginParse();
		let proof_delivered: Slice = slice2;
		return {
  			kind: 'InMsg_msg_discard_tr',
			in_msg: in_msg,
			transaction_id: transaction_id,
			fwd_fee: fwd_fee,
			proof_delivered: proof_delivered
  		};
  	};
	throw new Error('');
  }
export function storeInMsg(inMsg: InMsg): (builder: Builder) => void {
  	if ((inMsg.kind == 'InMsg_msg_import_ext')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b000, 3);
			let cell1 = beginCell();
			storeMessage<Slice>(inMsg.msg, ((arg: Slice) => {
  				return ((builder: Builder) => {
  					cell1.storeSlice(arg);
  				});
  			}))(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(inMsg.transaction)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	if ((inMsg.kind == 'InMsg_msg_import_ihr')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b010, 3);
			let cell1 = beginCell();
			storeMessage<Slice>(inMsg.msg, ((arg: Slice) => {
  				return ((builder: Builder) => {
  					cell1.storeSlice(arg);
  				});
  			}))(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(inMsg.transaction)(cell2);
			builder.storeRef(cell2);
			storeGrams(inMsg.ihr_fee)(builder);
			let cell3 = beginCell();
			cell3.storeSlice(inMsg.proof_created);
			builder.storeRef(cell3);
  		});
  	};
	if ((inMsg.kind == 'InMsg_msg_import_imm')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b011, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(inMsg.transaction)(cell2);
			builder.storeRef(cell2);
			storeGrams(inMsg.fwd_fee)(builder);
  		});
  	};
	if ((inMsg.kind == 'InMsg_msg_import_fin')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b100, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(inMsg.transaction)(cell2);
			builder.storeRef(cell2);
			storeGrams(inMsg.fwd_fee)(builder);
  		});
  	};
	if ((inMsg.kind == 'InMsg_msg_import_tr')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b101, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeMsgEnvelope(inMsg.out_msg)(cell2);
			builder.storeRef(cell2);
			storeGrams(inMsg.transit_fee)(builder);
  		});
  	};
	if ((inMsg.kind == 'InMsg_msg_discard_fin')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b110, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			builder.storeUint(inMsg.transaction_id, 64);
			storeGrams(inMsg.fwd_fee)(builder);
  		});
  	};
	if ((inMsg.kind == 'InMsg_msg_discard_tr')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b111, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			builder.storeUint(inMsg.transaction_id, 64);
			storeGrams(inMsg.fwd_fee)(builder);
			let cell2 = beginCell();
			cell2.storeSlice(inMsg.proof_delivered);
			builder.storeRef(cell2);
  		});
  	};
	throw new Error('');
  }
export type ImportFees = {
  	kind: 'ImportFees';
	fees_collected: Grams;
	value_imported: CurrencyCollection;
  };
export function loadImportFees(slice: Slice): ImportFees {
  	let fees_collected: Grams = loadGrams(slice);
	let value_imported: CurrencyCollection = loadCurrencyCollection(slice);
	return {
  		kind: 'ImportFees',
		fees_collected: fees_collected,
		value_imported: value_imported
  	};
  }
export function storeImportFees(importFees: ImportFees): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeGrams(importFees.fees_collected)(builder);
		storeCurrencyCollection(importFees.value_imported)(builder);
  	});
  }
export type InMsgDescr = {
  	kind: 'InMsgDescr';
  };
export function loadInMsgDescr(slice: Slice): InMsgDescr {
  	return {
  		kind: 'InMsgDescr'
  	};
  }
export function storeInMsgDescr(inMsgDescr: InMsgDescr): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type OutMsg = OutMsg_msg_export_ext | OutMsg_msg_export_imm | OutMsg_msg_export_new | OutMsg_msg_export_tr | OutMsg_msg_export_deq | OutMsg_msg_export_deq_short | OutMsg_msg_export_tr_req | OutMsg_msg_export_deq_imm;
export type OutMsg_msg_export_ext = {
  	kind: 'OutMsg_msg_export_ext';
	msg: Message<Slice>;
	transaction: Transaction;
  };
export type OutMsg_msg_export_imm = {
  	kind: 'OutMsg_msg_export_imm';
	out_msg: MsgEnvelope;
	transaction: Transaction;
	reimport: InMsg;
  };
export type OutMsg_msg_export_new = {
  	kind: 'OutMsg_msg_export_new';
	out_msg: MsgEnvelope;
	transaction: Transaction;
  };
export type OutMsg_msg_export_tr = {
  	kind: 'OutMsg_msg_export_tr';
	out_msg: MsgEnvelope;
	imported: InMsg;
  };
export type OutMsg_msg_export_deq = {
  	kind: 'OutMsg_msg_export_deq';
	out_msg: MsgEnvelope;
	import_block_lt: number;
  };
export type OutMsg_msg_export_deq_short = {
  	kind: 'OutMsg_msg_export_deq_short';
	msg_env_hash: BitString;
	next_workchain: number;
	next_addr_pfx: number;
	import_block_lt: number;
  };
export type OutMsg_msg_export_tr_req = {
  	kind: 'OutMsg_msg_export_tr_req';
	out_msg: MsgEnvelope;
	imported: InMsg;
  };
export type OutMsg_msg_export_deq_imm = {
  	kind: 'OutMsg_msg_export_deq_imm';
	out_msg: MsgEnvelope;
	reimport: InMsg;
  };
export function loadOutMsg(slice: Slice): OutMsg {
  	if ((slice.preloadUint(3) == 0b000)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let msg: Message<Slice> = loadMessage<Slice>(slice1, ((slice: Slice) => {
  			return slice;
  		}));
		let slice2 = slice.loadRef().beginParse();
		let transaction: Transaction = loadTransaction(slice2);
		return {
  			kind: 'OutMsg_msg_export_ext',
			msg: msg,
			transaction: transaction
  		};
  	};
	if ((slice.preloadUint(3) == 0b010)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let out_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let slice2 = slice.loadRef().beginParse();
		let transaction: Transaction = loadTransaction(slice2);
		let slice3 = slice.loadRef().beginParse();
		let reimport: InMsg = loadInMsg(slice3);
		return {
  			kind: 'OutMsg_msg_export_imm',
			out_msg: out_msg,
			transaction: transaction,
			reimport: reimport
  		};
  	};
	if ((slice.preloadUint(3) == 0b001)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let out_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let slice2 = slice.loadRef().beginParse();
		let transaction: Transaction = loadTransaction(slice2);
		return {
  			kind: 'OutMsg_msg_export_new',
			out_msg: out_msg,
			transaction: transaction
  		};
  	};
	if ((slice.preloadUint(3) == 0b011)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let out_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let slice2 = slice.loadRef().beginParse();
		let imported: InMsg = loadInMsg(slice2);
		return {
  			kind: 'OutMsg_msg_export_tr',
			out_msg: out_msg,
			imported: imported
  		};
  	};
	if ((slice.preloadUint(4) == 0b1100)) {
  		slice.loadUint(4);
		let slice1 = slice.loadRef().beginParse();
		let out_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let import_block_lt: number = slice.loadUint(63);
		return {
  			kind: 'OutMsg_msg_export_deq',
			out_msg: out_msg,
			import_block_lt: import_block_lt
  		};
  	};
	if ((slice.preloadUint(4) == 0b1101)) {
  		slice.loadUint(4);
		let msg_env_hash: BitString = slice.loadBits(256);
		let next_workchain: number = slice.loadInt(32);
		let next_addr_pfx: number = slice.loadUint(64);
		let import_block_lt: number = slice.loadUint(64);
		return {
  			kind: 'OutMsg_msg_export_deq_short',
			msg_env_hash: msg_env_hash,
			next_workchain: next_workchain,
			next_addr_pfx: next_addr_pfx,
			import_block_lt: import_block_lt
  		};
  	};
	if ((slice.preloadUint(3) == 0b111)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let out_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let slice2 = slice.loadRef().beginParse();
		let imported: InMsg = loadInMsg(slice2);
		return {
  			kind: 'OutMsg_msg_export_tr_req',
			out_msg: out_msg,
			imported: imported
  		};
  	};
	if ((slice.preloadUint(3) == 0b100)) {
  		slice.loadUint(3);
		let slice1 = slice.loadRef().beginParse();
		let out_msg: MsgEnvelope = loadMsgEnvelope(slice1);
		let slice2 = slice.loadRef().beginParse();
		let reimport: InMsg = loadInMsg(slice2);
		return {
  			kind: 'OutMsg_msg_export_deq_imm',
			out_msg: out_msg,
			reimport: reimport
  		};
  	};
	throw new Error('');
  }
export function storeOutMsg(outMsg: OutMsg): (builder: Builder) => void {
  	if ((outMsg.kind == 'OutMsg_msg_export_ext')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b000, 3);
			let cell1 = beginCell();
			storeMessage<Slice>(outMsg.msg, ((arg: Slice) => {
  				return ((builder: Builder) => {
  					cell1.storeSlice(arg);
  				});
  			}))(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(outMsg.transaction)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_imm')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b010, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(outMsg.transaction)(cell2);
			builder.storeRef(cell2);
			let cell3 = beginCell();
			storeInMsg(outMsg.reimport)(cell3);
			builder.storeRef(cell3);
  		});
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_new')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b001, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(outMsg.transaction)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_tr')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b011, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeInMsg(outMsg.imported)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_deq')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1100, 4);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			builder.storeUint(outMsg.import_block_lt, 63);
  		});
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_deq_short')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1101, 4);
			builder.storeBits(outMsg.msg_env_hash);
			builder.storeInt(outMsg.next_workchain, 32);
			builder.storeUint(outMsg.next_addr_pfx, 64);
			builder.storeUint(outMsg.import_block_lt, 64);
  		});
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_tr_req')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b111, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeInMsg(outMsg.imported)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_deq_imm')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b100, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeInMsg(outMsg.reimport)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	throw new Error('');
  }
export type EnqueuedMsg = {
  	kind: 'EnqueuedMsg';
	enqueued_lt: number;
	out_msg: MsgEnvelope;
  };
export function loadEnqueuedMsg(slice: Slice): EnqueuedMsg {
  	let enqueued_lt: number = slice.loadUint(64);
	let slice1 = slice.loadRef().beginParse();
	let out_msg: MsgEnvelope = loadMsgEnvelope(slice1);
	return {
  		kind: 'EnqueuedMsg',
		enqueued_lt: enqueued_lt,
		out_msg: out_msg
  	};
  }
export function storeEnqueuedMsg(enqueuedMsg: EnqueuedMsg): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(enqueuedMsg.enqueued_lt, 64);
		let cell1 = beginCell();
		storeMsgEnvelope(enqueuedMsg.out_msg)(cell1);
		builder.storeRef(cell1);
  	});
  }
export type OutMsgDescr = {
  	kind: 'OutMsgDescr';
  };
export function loadOutMsgDescr(slice: Slice): OutMsgDescr {
  	return {
  		kind: 'OutMsgDescr'
  	};
  }
export function storeOutMsgDescr(outMsgDescr: OutMsgDescr): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type OutMsgQueue = {
  	kind: 'OutMsgQueue';
  };
export function loadOutMsgQueue(slice: Slice): OutMsgQueue {
  	return {
  		kind: 'OutMsgQueue'
  	};
  }
export function storeOutMsgQueue(outMsgQueue: OutMsgQueue): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type ProcessedUpto = {
  	kind: 'ProcessedUpto';
	last_msg_lt: number;
	last_msg_hash: BitString;
  };
export function loadProcessedUpto(slice: Slice): ProcessedUpto {
  	let last_msg_lt: number = slice.loadUint(64);
	let last_msg_hash: BitString = slice.loadBits(256);
	return {
  		kind: 'ProcessedUpto',
		last_msg_lt: last_msg_lt,
		last_msg_hash: last_msg_hash
  	};
  }
export function storeProcessedUpto(processedUpto: ProcessedUpto): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(processedUpto.last_msg_lt, 64);
		builder.storeBits(processedUpto.last_msg_hash);
  	});
  }
export type ProcessedInfo = {
  	kind: 'ProcessedInfo';
  };
export function loadProcessedInfo(slice: Slice): ProcessedInfo {
  	return {
  		kind: 'ProcessedInfo'
  	};
  }
export function storeProcessedInfo(processedInfo: ProcessedInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type IhrPendingSince = {
  	kind: 'IhrPendingSince';
	import_lt: number;
  };
export function loadIhrPendingSince(slice: Slice): IhrPendingSince {
  	let import_lt: number = slice.loadUint(64);
	return {
  		kind: 'IhrPendingSince',
		import_lt: import_lt
  	};
  }
export function storeIhrPendingSince(ihrPendingSince: IhrPendingSince): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(ihrPendingSince.import_lt, 64);
  	});
  }
export type IhrPendingInfo = {
  	kind: 'IhrPendingInfo';
  };
export function loadIhrPendingInfo(slice: Slice): IhrPendingInfo {
  	return {
  		kind: 'IhrPendingInfo'
  	};
  }
export function storeIhrPendingInfo(ihrPendingInfo: IhrPendingInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type OutMsgQueueInfo = {
  	kind: 'OutMsgQueueInfo';
	out_queue: OutMsgQueue;
	proc_info: ProcessedInfo;
	ihr_pending: IhrPendingInfo;
  };
export function loadOutMsgQueueInfo(slice: Slice): OutMsgQueueInfo {
  	let out_queue: OutMsgQueue = loadOutMsgQueue(slice);
	let proc_info: ProcessedInfo = loadProcessedInfo(slice);
	let ihr_pending: IhrPendingInfo = loadIhrPendingInfo(slice);
	return {
  		kind: 'OutMsgQueueInfo',
		out_queue: out_queue,
		proc_info: proc_info,
		ihr_pending: ihr_pending
  	};
  }
export function storeOutMsgQueueInfo(outMsgQueueInfo: OutMsgQueueInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeOutMsgQueue(outMsgQueueInfo.out_queue)(builder);
		storeProcessedInfo(outMsgQueueInfo.proc_info)(builder);
		storeIhrPendingInfo(outMsgQueueInfo.ihr_pending)(builder);
  	});
  }
export type StorageUsed = {
  	kind: 'StorageUsed';
	cells: VarUInteger;
	bits: VarUInteger;
	public_cells: VarUInteger;
  };
export function loadStorageUsed(slice: Slice): StorageUsed {
  	let cells: VarUInteger = loadVarUInteger(slice, 7);
	let bits: VarUInteger = loadVarUInteger(slice, 7);
	let public_cells: VarUInteger = loadVarUInteger(slice, 7);
	return {
  		kind: 'StorageUsed',
		cells: cells,
		bits: bits,
		public_cells: public_cells
  	};
  }
export function storeStorageUsed(storageUsed: StorageUsed): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeVarUInteger(storageUsed.cells)(builder);
		storeVarUInteger(storageUsed.bits)(builder);
		storeVarUInteger(storageUsed.public_cells)(builder);
  	});
  }
export type StorageUsedShort = {
  	kind: 'StorageUsedShort';
	cells: VarUInteger;
	bits: VarUInteger;
  };
export function loadStorageUsedShort(slice: Slice): StorageUsedShort {
  	let cells: VarUInteger = loadVarUInteger(slice, 7);
	let bits: VarUInteger = loadVarUInteger(slice, 7);
	return {
  		kind: 'StorageUsedShort',
		cells: cells,
		bits: bits
  	};
  }
export function storeStorageUsedShort(storageUsedShort: StorageUsedShort): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeVarUInteger(storageUsedShort.cells)(builder);
		storeVarUInteger(storageUsedShort.bits)(builder);
  	});
  }
export type StorageInfo = {
  	kind: 'StorageInfo';
	used: StorageUsed;
	last_paid: number;
	due_payment: Maybe<Grams>;
  };
export function loadStorageInfo(slice: Slice): StorageInfo {
  	let used: StorageUsed = loadStorageUsed(slice);
	let last_paid: number = slice.loadUint(32);
	let due_payment: Maybe<Grams> = loadMaybe<Grams>(slice, loadGrams);
	return {
  		kind: 'StorageInfo',
		used: used,
		last_paid: last_paid,
		due_payment: due_payment
  	};
  }
export function storeStorageInfo(storageInfo: StorageInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeStorageUsed(storageInfo.used)(builder);
		builder.storeUint(storageInfo.last_paid, 32);
		storeMaybe<Grams>(storageInfo.due_payment, storeGrams)(builder);
  	});
  }
export type Account = Account_account_none | Account_account;
export type Account_account_none = {
  	kind: 'Account_account_none';
  };
export type Account_account = {
  	kind: 'Account_account';
	addr: MsgAddressInt;
	storage_stat: StorageInfo;
	storage: AccountStorage;
  };
export function loadAccount(slice: Slice): Account {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'Account_account_none'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let addr: MsgAddressInt = loadMsgAddressInt(slice);
		let storage_stat: StorageInfo = loadStorageInfo(slice);
		let storage: AccountStorage = loadAccountStorage(slice);
		return {
  			kind: 'Account_account',
			addr: addr,
			storage_stat: storage_stat,
			storage: storage
  		};
  	};
	throw new Error('');
  }
export function storeAccount(account: Account): (builder: Builder) => void {
  	if ((account.kind == 'Account_account_none')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((account.kind == 'Account_account')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeMsgAddressInt(account.addr)(builder);
			storeStorageInfo(account.storage_stat)(builder);
			storeAccountStorage(account.storage)(builder);
  		});
  	};
	throw new Error('');
  }
export type AccountStorage = {
  	kind: 'AccountStorage';
	last_trans_lt: number;
	balance: CurrencyCollection;
	state: AccountState;
  };
export function loadAccountStorage(slice: Slice): AccountStorage {
  	let last_trans_lt: number = slice.loadUint(64);
	let balance: CurrencyCollection = loadCurrencyCollection(slice);
	let state: AccountState = loadAccountState(slice);
	return {
  		kind: 'AccountStorage',
		last_trans_lt: last_trans_lt,
		balance: balance,
		state: state
  	};
  }
export function storeAccountStorage(accountStorage: AccountStorage): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(accountStorage.last_trans_lt, 64);
		storeCurrencyCollection(accountStorage.balance)(builder);
		storeAccountState(accountStorage.state)(builder);
  	});
  }
export type AccountState = AccountState_account_uninit | AccountState_account_active | AccountState_account_frozen;
export type AccountState_account_uninit = {
  	kind: 'AccountState_account_uninit';
  };
export type AccountState_account_active = {
  	kind: 'AccountState_account_active';
	_: StateInit;
  };
export type AccountState_account_frozen = {
  	kind: 'AccountState_account_frozen';
	state_hash: BitString;
  };
export function loadAccountState(slice: Slice): AccountState {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		return {
  			kind: 'AccountState_account_uninit'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let _: StateInit = loadStateInit(slice);
		return {
  			kind: 'AccountState_account_active',
			_: _
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		slice.loadUint(2);
		let state_hash: BitString = slice.loadBits(256);
		return {
  			kind: 'AccountState_account_frozen',
			state_hash: state_hash
  		};
  	};
	throw new Error('');
  }
export function storeAccountState(accountState: AccountState): (builder: Builder) => void {
  	if ((accountState.kind == 'AccountState_account_uninit')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		});
  	};
	if ((accountState.kind == 'AccountState_account_active')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeStateInit(accountState._)(builder);
  		});
  	};
	if ((accountState.kind == 'AccountState_account_frozen')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b01, 2);
			builder.storeBits(accountState.state_hash);
  		});
  	};
	throw new Error('');
  }
export type AccountStatus = AccountStatus_acc_state_uninit | AccountStatus_acc_state_frozen | AccountStatus_acc_state_active | AccountStatus_acc_state_nonexist;
export type AccountStatus_acc_state_uninit = {
  	kind: 'AccountStatus_acc_state_uninit';
  };
export type AccountStatus_acc_state_frozen = {
  	kind: 'AccountStatus_acc_state_frozen';
  };
export type AccountStatus_acc_state_active = {
  	kind: 'AccountStatus_acc_state_active';
  };
export type AccountStatus_acc_state_nonexist = {
  	kind: 'AccountStatus_acc_state_nonexist';
  };
export function loadAccountStatus(slice: Slice): AccountStatus {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		return {
  			kind: 'AccountStatus_acc_state_uninit'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		slice.loadUint(2);
		return {
  			kind: 'AccountStatus_acc_state_frozen'
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		return {
  			kind: 'AccountStatus_acc_state_active'
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		return {
  			kind: 'AccountStatus_acc_state_nonexist'
  		};
  	};
	throw new Error('');
  }
export function storeAccountStatus(accountStatus: AccountStatus): (builder: Builder) => void {
  	if ((accountStatus.kind == 'AccountStatus_acc_state_uninit')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		});
  	};
	if ((accountStatus.kind == 'AccountStatus_acc_state_frozen')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b01, 2);
  		});
  	};
	if ((accountStatus.kind == 'AccountStatus_acc_state_active')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10, 2);
  		});
  	};
	if ((accountStatus.kind == 'AccountStatus_acc_state_nonexist')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b11, 2);
  		});
  	};
	throw new Error('');
  }
export type ShardAccount = {
  	kind: 'ShardAccount';
	account: Account;
	last_trans_hash: BitString;
	last_trans_lt: number;
  };
export function loadShardAccount(slice: Slice): ShardAccount {
  	let slice1 = slice.loadRef().beginParse();
	let account: Account = loadAccount(slice1);
	let last_trans_hash: BitString = slice.loadBits(256);
	let last_trans_lt: number = slice.loadUint(64);
	return {
  		kind: 'ShardAccount',
		account: account,
		last_trans_hash: last_trans_hash,
		last_trans_lt: last_trans_lt
  	};
  }
export function storeShardAccount(shardAccount: ShardAccount): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		let cell1 = beginCell();
		storeAccount(shardAccount.account)(cell1);
		builder.storeRef(cell1);
		builder.storeBits(shardAccount.last_trans_hash);
		builder.storeUint(shardAccount.last_trans_lt, 64);
  	});
  }
export type DepthBalanceInfo = {
  	kind: 'DepthBalanceInfo';
	split_depth: number;
	balance: CurrencyCollection;
  };
export function loadDepthBalanceInfo(slice: Slice): DepthBalanceInfo {
  	let split_depth: number = slice.loadUint(bitLen(30));
	let balance: CurrencyCollection = loadCurrencyCollection(slice);
	return {
  		kind: 'DepthBalanceInfo',
		split_depth: split_depth,
		balance: balance
  	};
  }
export function storeDepthBalanceInfo(depthBalanceInfo: DepthBalanceInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(depthBalanceInfo.split_depth, bitLen(30));
		storeCurrencyCollection(depthBalanceInfo.balance)(builder);
  	});
  }
export type ShardAccounts = {
  	kind: 'ShardAccounts';
  };
export function loadShardAccounts(slice: Slice): ShardAccounts {
  	return {
  		kind: 'ShardAccounts'
  	};
  }
export function storeShardAccounts(shardAccounts: ShardAccounts): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type Transaction = {
  	kind: 'Transaction';
	account_addr: BitString;
	lt: number;
	prev_trans_hash: BitString;
	prev_trans_lt: number;
	now: number;
	outmsg_cnt: number;
	orig_status: AccountStatus;
	end_status: AccountStatus;
	in_msg: Maybe<Message<Slice>>;
	out_msgs: HashmapE<Message<Slice>>;
	total_fees: CurrencyCollection;
	state_update: HASH_UPDATE<Account>;
	description: TransactionDescr;
  };
export function loadTransaction(slice: Slice): Transaction {
  	if ((slice.preloadUint(4) == 0b0111)) {
  		slice.loadUint(4);
		let account_addr: BitString = slice.loadBits(256);
		let lt: number = slice.loadUint(64);
		let prev_trans_hash: BitString = slice.loadBits(256);
		let prev_trans_lt: number = slice.loadUint(64);
		let now: number = slice.loadUint(32);
		let outmsg_cnt: number = slice.loadUint(15);
		let orig_status: AccountStatus = loadAccountStatus(slice);
		let end_status: AccountStatus = loadAccountStatus(slice);
		let slice1 = slice.loadRef().beginParse();
		let in_msg: Maybe<Message<Slice>> = loadMaybe<Message<Slice>>(slice1, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadMessage<Slice>(slice1, ((slice: Slice) => {
  				return slice;
  			}));
  		}));
		let out_msgs: HashmapE<Message<Slice>> = loadHashmapE<Message<Slice>>(slice1, 15, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadMessage<Slice>(slice1, ((slice: Slice) => {
  				return slice;
  			}));
  		}));
		let total_fees: CurrencyCollection = loadCurrencyCollection(slice);
		let slice2 = slice.loadRef().beginParse();
		let state_update: HASH_UPDATE<Account> = loadHASH_UPDATE<Account>(slice2, loadAccount);
		let slice3 = slice.loadRef().beginParse();
		let description: TransactionDescr = loadTransactionDescr(slice3);
		return {
  			kind: 'Transaction',
			account_addr: account_addr,
			lt: lt,
			prev_trans_hash: prev_trans_hash,
			prev_trans_lt: prev_trans_lt,
			now: now,
			outmsg_cnt: outmsg_cnt,
			orig_status: orig_status,
			end_status: end_status,
			in_msg: in_msg,
			out_msgs: out_msgs,
			total_fees: total_fees,
			state_update: state_update,
			description: description
  		};
  	};
	throw new Error('');
  }
export function storeTransaction(transaction: Transaction): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0b0111, 4);
		builder.storeBits(transaction.account_addr);
		builder.storeUint(transaction.lt, 64);
		builder.storeBits(transaction.prev_trans_hash);
		builder.storeUint(transaction.prev_trans_lt, 64);
		builder.storeUint(transaction.now, 32);
		builder.storeUint(transaction.outmsg_cnt, 15);
		storeAccountStatus(transaction.orig_status)(builder);
		storeAccountStatus(transaction.end_status)(builder);
		let cell1 = beginCell();
		storeMaybe<Message<Slice>>(transaction.in_msg, ((arg: Message<Slice>) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeMessage<Slice>(arg, ((arg: Slice) => {
  					return ((builder: Builder) => {
  						cell1.storeSlice(arg);
  					});
  				}))(cell1)
				builder.storeRef(cell1);
  			});
  		}))(cell1);
		storeHashmapE<Message<Slice>>(transaction.out_msgs, ((arg: Message<Slice>) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeMessage<Slice>(arg, ((arg: Slice) => {
  					return ((builder: Builder) => {
  						cell1.storeSlice(arg);
  					});
  				}))(cell1)
				builder.storeRef(cell1);
  			});
  		}))(cell1);
		builder.storeRef(cell1);
		storeCurrencyCollection(transaction.total_fees)(builder);
		let cell2 = beginCell();
		storeHASH_UPDATE<Account>(transaction.state_update, storeAccount)(cell2);
		builder.storeRef(cell2);
		let cell3 = beginCell();
		storeTransactionDescr(transaction.description)(cell3);
		builder.storeRef(cell3);
  	});
  }
export type MERKLE_UPDATE<X> = {
  	kind: 'MERKLE_UPDATE';
	old_hash: BitString;
	new_hash: BitString;
	old: X;
	new: X;
  };
export function loadMERKLE_UPDATE<X>(slice: Slice, loadX: (slice: Slice) => X): MERKLE_UPDATE<X> {
  	if ((slice.preloadUint(8) == 0x02)) {
  		slice.loadUint(8);
		let old_hash: BitString = slice.loadBits(256);
		let new_hash: BitString = slice.loadBits(256);
		let slice1 = slice.loadRef().beginParse();
		let old: X = loadX(slice1);
		let slice2 = slice.loadRef().beginParse();
		let new: X = loadX(slice2);
		return {
  			kind: 'MERKLE_UPDATE',
			old_hash: old_hash,
			new_hash: new_hash,
			old: old,
			new: new
  		};
  	};
	throw new Error('');
  }
export function storeMERKLE_UPDATE<X>(mERKLE_UPDATE: MERKLE_UPDATE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x02, 8);
		builder.storeBits(mERKLE_UPDATE.old_hash);
		builder.storeBits(mERKLE_UPDATE.new_hash);
		let cell1 = beginCell();
		storeX(mERKLE_UPDATE.old)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeX(mERKLE_UPDATE.new)(cell2);
		builder.storeRef(cell2);
  	});
  }
export type HASH_UPDATE<X> = {
  	kind: 'HASH_UPDATE';
	old_hash: BitString;
	new_hash: BitString;
  };
export function loadHASH_UPDATE<X>(slice: Slice, loadX: (slice: Slice) => X): HASH_UPDATE<X> {
  	if ((slice.preloadUint(8) == 0x72)) {
  		slice.loadUint(8);
		let old_hash: BitString = slice.loadBits(256);
		let new_hash: BitString = slice.loadBits(256);
		return {
  			kind: 'HASH_UPDATE',
			old_hash: old_hash,
			new_hash: new_hash
  		};
  	};
	throw new Error('');
  }
export function storeHASH_UPDATE<X>(hASH_UPDATE: HASH_UPDATE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x72, 8);
		builder.storeBits(hASH_UPDATE.old_hash);
		builder.storeBits(hASH_UPDATE.new_hash);
  	});
  }
export type MERKLE_PROOF<X> = {
  	kind: 'MERKLE_PROOF';
	virtual_hash: BitString;
	depth: number;
	virtual_root: X;
  };
export function loadMERKLE_PROOF<X>(slice: Slice, loadX: (slice: Slice) => X): MERKLE_PROOF<X> {
  	if ((slice.preloadUint(8) == 0x03)) {
  		slice.loadUint(8);
		let virtual_hash: BitString = slice.loadBits(256);
		let depth: number = slice.loadUint(16);
		let slice1 = slice.loadRef().beginParse();
		let virtual_root: X = loadX(slice1);
		return {
  			kind: 'MERKLE_PROOF',
			virtual_hash: virtual_hash,
			depth: depth,
			virtual_root: virtual_root
  		};
  	};
	throw new Error('');
  }
export function storeMERKLE_PROOF<X>(mERKLE_PROOF: MERKLE_PROOF<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x03, 8);
		builder.storeBits(mERKLE_PROOF.virtual_hash);
		builder.storeUint(mERKLE_PROOF.depth, 16);
		let cell1 = beginCell();
		storeX(mERKLE_PROOF.virtual_root)(cell1);
		builder.storeRef(cell1);
  	});
  }
export type AccountBlock = {
  	kind: 'AccountBlock';
	account_addr: BitString;
	transactions: HashmapAug<Transaction,CurrencyCollection>;
	state_update: HASH_UPDATE<Account>;
  };
export function loadAccountBlock(slice: Slice): AccountBlock {
  	if ((slice.preloadUint(4) == 0x5)) {
  		slice.loadUint(4);
		let account_addr: BitString = slice.loadBits(256);
		let transactions: HashmapAug<Transaction,CurrencyCollection> = loadHashmapAug<Transaction,CurrencyCollection>(slice, 64, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadTransaction(slice1);
  		}), loadCurrencyCollection);
		let slice1 = slice.loadRef().beginParse();
		let state_update: HASH_UPDATE<Account> = loadHASH_UPDATE<Account>(slice1, loadAccount);
		return {
  			kind: 'AccountBlock',
			account_addr: account_addr,
			transactions: transactions,
			state_update: state_update
  		};
  	};
	throw new Error('');
  }
export function storeAccountBlock(accountBlock: AccountBlock): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x5, 4);
		builder.storeBits(accountBlock.account_addr);
		storeHashmapAug<Transaction,CurrencyCollection>(accountBlock.transactions, ((arg: Transaction) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeTransaction(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}), storeCurrencyCollection)(builder);
		let cell1 = beginCell();
		storeHASH_UPDATE<Account>(accountBlock.state_update, storeAccount)(cell1);
		builder.storeRef(cell1);
  	});
  }
export type ShardAccountBlocks = {
  	kind: 'ShardAccountBlocks';
  };
export function loadShardAccountBlocks(slice: Slice): ShardAccountBlocks {
  	return {
  		kind: 'ShardAccountBlocks'
  	};
  }
export function storeShardAccountBlocks(shardAccountBlocks: ShardAccountBlocks): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type TrStoragePhase = {
  	kind: 'TrStoragePhase';
	storage_fees_collected: Grams;
	storage_fees_due: Maybe<Grams>;
	status_change: AccStatusChange;
  };
export function loadTrStoragePhase(slice: Slice): TrStoragePhase {
  	let storage_fees_collected: Grams = loadGrams(slice);
	let storage_fees_due: Maybe<Grams> = loadMaybe<Grams>(slice, loadGrams);
	let status_change: AccStatusChange = loadAccStatusChange(slice);
	return {
  		kind: 'TrStoragePhase',
		storage_fees_collected: storage_fees_collected,
		storage_fees_due: storage_fees_due,
		status_change: status_change
  	};
  }
export function storeTrStoragePhase(trStoragePhase: TrStoragePhase): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeGrams(trStoragePhase.storage_fees_collected)(builder);
		storeMaybe<Grams>(trStoragePhase.storage_fees_due, storeGrams)(builder);
		storeAccStatusChange(trStoragePhase.status_change)(builder);
  	});
  }
export type AccStatusChange = AccStatusChange_acst_unchanged | AccStatusChange_acst_frozen | AccStatusChange_acst_deleted;
export type AccStatusChange_acst_unchanged = {
  	kind: 'AccStatusChange_acst_unchanged';
  };
export type AccStatusChange_acst_frozen = {
  	kind: 'AccStatusChange_acst_frozen';
  };
export type AccStatusChange_acst_deleted = {
  	kind: 'AccStatusChange_acst_deleted';
  };
export function loadAccStatusChange(slice: Slice): AccStatusChange {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'AccStatusChange_acst_unchanged'
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		return {
  			kind: 'AccStatusChange_acst_frozen'
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		return {
  			kind: 'AccStatusChange_acst_deleted'
  		};
  	};
	throw new Error('');
  }
export function storeAccStatusChange(accStatusChange: AccStatusChange): (builder: Builder) => void {
  	if ((accStatusChange.kind == 'AccStatusChange_acst_unchanged')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((accStatusChange.kind == 'AccStatusChange_acst_frozen')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10, 2);
  		});
  	};
	if ((accStatusChange.kind == 'AccStatusChange_acst_deleted')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b11, 2);
  		});
  	};
	throw new Error('');
  }
export type TrCreditPhase = {
  	kind: 'TrCreditPhase';
	due_fees_collected: Maybe<Grams>;
	credit: CurrencyCollection;
  };
export function loadTrCreditPhase(slice: Slice): TrCreditPhase {
  	let due_fees_collected: Maybe<Grams> = loadMaybe<Grams>(slice, loadGrams);
	let credit: CurrencyCollection = loadCurrencyCollection(slice);
	return {
  		kind: 'TrCreditPhase',
		due_fees_collected: due_fees_collected,
		credit: credit
  	};
  }
export function storeTrCreditPhase(trCreditPhase: TrCreditPhase): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeMaybe<Grams>(trCreditPhase.due_fees_collected, storeGrams)(builder);
		storeCurrencyCollection(trCreditPhase.credit)(builder);
  	});
  }
export type TrComputePhase = TrComputePhase_tr_phase_compute_skipped | TrComputePhase_tr_phase_compute_vm;
export type TrComputePhase_tr_phase_compute_skipped = {
  	kind: 'TrComputePhase_tr_phase_compute_skipped';
	reason: ComputeSkipReason;
  };
export type TrComputePhase_tr_phase_compute_vm = {
  	kind: 'TrComputePhase_tr_phase_compute_vm';
	success: Bool;
	msg_state_used: Bool;
	account_activated: Bool;
	gas_fees: Grams;
	gas_used: VarUInteger;
	gas_limit: VarUInteger;
	gas_credit: Maybe<VarUInteger>;
	mode: number;
	exit_code: number;
	exit_arg: Maybe<number>;
	vm_steps: number;
	vm_init_state_hash: BitString;
	vm_final_state_hash: BitString;
  };
export function loadTrComputePhase(slice: Slice): TrComputePhase {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let reason: ComputeSkipReason = loadComputeSkipReason(slice);
		return {
  			kind: 'TrComputePhase_tr_phase_compute_skipped',
			reason: reason
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let success: Bool = loadBool(slice);
		let msg_state_used: Bool = loadBool(slice);
		let account_activated: Bool = loadBool(slice);
		let gas_fees: Grams = loadGrams(slice);
		let slice1 = slice.loadRef().beginParse();
		let gas_used: VarUInteger = loadVarUInteger(slice1, 7);
		let gas_limit: VarUInteger = loadVarUInteger(slice1, 7);
		let gas_credit: Maybe<VarUInteger> = loadMaybe<VarUInteger>(slice1, ((slice: Slice) => {
  			return loadVarUInteger(slice, 3);
  		}));
		let mode: number = slice1.loadInt(8);
		let exit_code: number = slice1.loadInt(32);
		let exit_arg: Maybe<number> = loadMaybe<number>(slice1, ((slice: Slice) => {
  			return slice1.loadInt(32);
  		}));
		let vm_steps: number = slice1.loadUint(32);
		let vm_init_state_hash: BitString = slice1.loadBits(256);
		let vm_final_state_hash: BitString = slice1.loadBits(256);
		return {
  			kind: 'TrComputePhase_tr_phase_compute_vm',
			success: success,
			msg_state_used: msg_state_used,
			account_activated: account_activated,
			gas_fees: gas_fees,
			gas_used: gas_used,
			gas_limit: gas_limit,
			gas_credit: gas_credit,
			mode: mode,
			exit_code: exit_code,
			exit_arg: exit_arg,
			vm_steps: vm_steps,
			vm_init_state_hash: vm_init_state_hash,
			vm_final_state_hash: vm_final_state_hash
  		};
  	};
	throw new Error('');
  }
export function storeTrComputePhase(trComputePhase: TrComputePhase): (builder: Builder) => void {
  	if ((trComputePhase.kind == 'TrComputePhase_tr_phase_compute_skipped')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeComputeSkipReason(trComputePhase.reason)(builder);
  		});
  	};
	if ((trComputePhase.kind == 'TrComputePhase_tr_phase_compute_vm')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeBool(trComputePhase.success)(builder);
			storeBool(trComputePhase.msg_state_used)(builder);
			storeBool(trComputePhase.account_activated)(builder);
			storeGrams(trComputePhase.gas_fees)(builder);
			let cell1 = beginCell();
			storeVarUInteger(trComputePhase.gas_used)(cell1);
			storeVarUInteger(trComputePhase.gas_limit)(cell1);
			storeMaybe<VarUInteger>(trComputePhase.gas_credit, ((arg: VarUInteger) => {
  				return ((builder: Builder) => {
  					storeVarUInteger(arg)(builder);
  				});
  			}))(cell1);
			cell1.storeInt(trComputePhase.mode, 8);
			cell1.storeInt(trComputePhase.exit_code, 32);
			storeMaybe<number>(trComputePhase.exit_arg, ((arg: number) => {
  				return ((builder: Builder) => {
  					cell1.storeInt(arg, 32);
  				});
  			}))(cell1);
			cell1.storeUint(trComputePhase.vm_steps, 32);
			cell1.storeBits(trComputePhase.vm_init_state_hash);
			cell1.storeBits(trComputePhase.vm_final_state_hash);
			builder.storeRef(cell1);
  		});
  	};
	throw new Error('');
  }
export type ComputeSkipReason = ComputeSkipReason_cskip_no_state | ComputeSkipReason_cskip_bad_state | ComputeSkipReason_cskip_no_gas;
export type ComputeSkipReason_cskip_no_state = {
  	kind: 'ComputeSkipReason_cskip_no_state';
  };
export type ComputeSkipReason_cskip_bad_state = {
  	kind: 'ComputeSkipReason_cskip_bad_state';
  };
export type ComputeSkipReason_cskip_no_gas = {
  	kind: 'ComputeSkipReason_cskip_no_gas';
  };
export function loadComputeSkipReason(slice: Slice): ComputeSkipReason {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		return {
  			kind: 'ComputeSkipReason_cskip_no_state'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		slice.loadUint(2);
		return {
  			kind: 'ComputeSkipReason_cskip_bad_state'
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		return {
  			kind: 'ComputeSkipReason_cskip_no_gas'
  		};
  	};
	throw new Error('');
  }
export function storeComputeSkipReason(computeSkipReason: ComputeSkipReason): (builder: Builder) => void {
  	if ((computeSkipReason.kind == 'ComputeSkipReason_cskip_no_state')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		});
  	};
	if ((computeSkipReason.kind == 'ComputeSkipReason_cskip_bad_state')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b01, 2);
  		});
  	};
	if ((computeSkipReason.kind == 'ComputeSkipReason_cskip_no_gas')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10, 2);
  		});
  	};
	throw new Error('');
  }
export type TrActionPhase = {
  	kind: 'TrActionPhase';
	success: Bool;
	valid: Bool;
	no_funds: Bool;
	status_change: AccStatusChange;
	total_fwd_fees: Maybe<Grams>;
	total_action_fees: Maybe<Grams>;
	result_code: number;
	result_arg: Maybe<number>;
	tot_actions: number;
	spec_actions: number;
	skipped_actions: number;
	msgs_created: number;
	action_list_hash: BitString;
	tot_msg_size: StorageUsedShort;
  };
export function loadTrActionPhase(slice: Slice): TrActionPhase {
  	let success: Bool = loadBool(slice);
	let valid: Bool = loadBool(slice);
	let no_funds: Bool = loadBool(slice);
	let status_change: AccStatusChange = loadAccStatusChange(slice);
	let total_fwd_fees: Maybe<Grams> = loadMaybe<Grams>(slice, loadGrams);
	let total_action_fees: Maybe<Grams> = loadMaybe<Grams>(slice, loadGrams);
	let result_code: number = slice.loadInt(32);
	let result_arg: Maybe<number> = loadMaybe<number>(slice, ((slice: Slice) => {
  		return slice.loadInt(32);
  	}));
	let tot_actions: number = slice.loadUint(16);
	let spec_actions: number = slice.loadUint(16);
	let skipped_actions: number = slice.loadUint(16);
	let msgs_created: number = slice.loadUint(16);
	let action_list_hash: BitString = slice.loadBits(256);
	let tot_msg_size: StorageUsedShort = loadStorageUsedShort(slice);
	return {
  		kind: 'TrActionPhase',
		success: success,
		valid: valid,
		no_funds: no_funds,
		status_change: status_change,
		total_fwd_fees: total_fwd_fees,
		total_action_fees: total_action_fees,
		result_code: result_code,
		result_arg: result_arg,
		tot_actions: tot_actions,
		spec_actions: spec_actions,
		skipped_actions: skipped_actions,
		msgs_created: msgs_created,
		action_list_hash: action_list_hash,
		tot_msg_size: tot_msg_size
  	};
  }
export function storeTrActionPhase(trActionPhase: TrActionPhase): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeBool(trActionPhase.success)(builder);
		storeBool(trActionPhase.valid)(builder);
		storeBool(trActionPhase.no_funds)(builder);
		storeAccStatusChange(trActionPhase.status_change)(builder);
		storeMaybe<Grams>(trActionPhase.total_fwd_fees, storeGrams)(builder);
		storeMaybe<Grams>(trActionPhase.total_action_fees, storeGrams)(builder);
		builder.storeInt(trActionPhase.result_code, 32);
		storeMaybe<number>(trActionPhase.result_arg, ((arg: number) => {
  			return ((builder: Builder) => {
  				builder.storeInt(arg, 32);
  			});
  		}))(builder);
		builder.storeUint(trActionPhase.tot_actions, 16);
		builder.storeUint(trActionPhase.spec_actions, 16);
		builder.storeUint(trActionPhase.skipped_actions, 16);
		builder.storeUint(trActionPhase.msgs_created, 16);
		builder.storeBits(trActionPhase.action_list_hash);
		storeStorageUsedShort(trActionPhase.tot_msg_size)(builder);
  	});
  }
export type TrBouncePhase = TrBouncePhase_tr_phase_bounce_negfunds | TrBouncePhase_tr_phase_bounce_nofunds | TrBouncePhase_tr_phase_bounce_ok;
export type TrBouncePhase_tr_phase_bounce_negfunds = {
  	kind: 'TrBouncePhase_tr_phase_bounce_negfunds';
  };
export type TrBouncePhase_tr_phase_bounce_nofunds = {
  	kind: 'TrBouncePhase_tr_phase_bounce_nofunds';
	msg_size: StorageUsedShort;
	req_fwd_fees: Grams;
  };
export type TrBouncePhase_tr_phase_bounce_ok = {
  	kind: 'TrBouncePhase_tr_phase_bounce_ok';
	msg_size: StorageUsedShort;
	msg_fees: Grams;
	fwd_fees: Grams;
  };
export function loadTrBouncePhase(slice: Slice): TrBouncePhase {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		return {
  			kind: 'TrBouncePhase_tr_phase_bounce_negfunds'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		slice.loadUint(2);
		let msg_size: StorageUsedShort = loadStorageUsedShort(slice);
		let req_fwd_fees: Grams = loadGrams(slice);
		return {
  			kind: 'TrBouncePhase_tr_phase_bounce_nofunds',
			msg_size: msg_size,
			req_fwd_fees: req_fwd_fees
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let msg_size: StorageUsedShort = loadStorageUsedShort(slice);
		let msg_fees: Grams = loadGrams(slice);
		let fwd_fees: Grams = loadGrams(slice);
		return {
  			kind: 'TrBouncePhase_tr_phase_bounce_ok',
			msg_size: msg_size,
			msg_fees: msg_fees,
			fwd_fees: fwd_fees
  		};
  	};
	throw new Error('');
  }
export function storeTrBouncePhase(trBouncePhase: TrBouncePhase): (builder: Builder) => void {
  	if ((trBouncePhase.kind == 'TrBouncePhase_tr_phase_bounce_negfunds')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		});
  	};
	if ((trBouncePhase.kind == 'TrBouncePhase_tr_phase_bounce_nofunds')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b01, 2);
			storeStorageUsedShort(trBouncePhase.msg_size)(builder);
			storeGrams(trBouncePhase.req_fwd_fees)(builder);
  		});
  	};
	if ((trBouncePhase.kind == 'TrBouncePhase_tr_phase_bounce_ok')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeStorageUsedShort(trBouncePhase.msg_size)(builder);
			storeGrams(trBouncePhase.msg_fees)(builder);
			storeGrams(trBouncePhase.fwd_fees)(builder);
  		});
  	};
	throw new Error('');
  }
export type TransactionDescr = TransactionDescr_trans_ord | TransactionDescr_trans_storage | TransactionDescr_trans_tick_tock | TransactionDescr_trans_split_prepare | TransactionDescr_trans_split_install | TransactionDescr_trans_merge_prepare | TransactionDescr_trans_merge_install;
export type TransactionDescr_trans_ord = {
  	kind: 'TransactionDescr_trans_ord';
	credit_first: Bool;
	storage_ph: Maybe<TrStoragePhase>;
	credit_ph: Maybe<TrCreditPhase>;
	compute_ph: TrComputePhase;
	action: Maybe<TrActionPhase>;
	aborted: Bool;
	bounce: Maybe<TrBouncePhase>;
	destroyed: Bool;
  };
export type TransactionDescr_trans_storage = {
  	kind: 'TransactionDescr_trans_storage';
	storage_ph: TrStoragePhase;
  };
export type TransactionDescr_trans_tick_tock = {
  	kind: 'TransactionDescr_trans_tick_tock';
	is_tock: Bool;
	storage_ph: TrStoragePhase;
	compute_ph: TrComputePhase;
	action: Maybe<TrActionPhase>;
	aborted: Bool;
	destroyed: Bool;
  };
export type TransactionDescr_trans_split_prepare = {
  	kind: 'TransactionDescr_trans_split_prepare';
	split_info: SplitMergeInfo;
	storage_ph: Maybe<TrStoragePhase>;
	compute_ph: TrComputePhase;
	action: Maybe<TrActionPhase>;
	aborted: Bool;
	destroyed: Bool;
  };
export type TransactionDescr_trans_split_install = {
  	kind: 'TransactionDescr_trans_split_install';
	split_info: SplitMergeInfo;
	prepare_transaction: Transaction;
	installed: Bool;
  };
export type TransactionDescr_trans_merge_prepare = {
  	kind: 'TransactionDescr_trans_merge_prepare';
	split_info: SplitMergeInfo;
	storage_ph: TrStoragePhase;
	aborted: Bool;
  };
export type TransactionDescr_trans_merge_install = {
  	kind: 'TransactionDescr_trans_merge_install';
	split_info: SplitMergeInfo;
	prepare_transaction: Transaction;
	storage_ph: Maybe<TrStoragePhase>;
	credit_ph: Maybe<TrCreditPhase>;
	compute_ph: TrComputePhase;
	action: Maybe<TrActionPhase>;
	aborted: Bool;
	destroyed: Bool;
  };
export function loadTransactionDescr(slice: Slice): TransactionDescr {
  	if ((slice.preloadUint(4) == 0b0000)) {
  		slice.loadUint(4);
		let credit_first: Bool = loadBool(slice);
		let storage_ph: Maybe<TrStoragePhase> = loadMaybe<TrStoragePhase>(slice, loadTrStoragePhase);
		let credit_ph: Maybe<TrCreditPhase> = loadMaybe<TrCreditPhase>(slice, loadTrCreditPhase);
		let compute_ph: TrComputePhase = loadTrComputePhase(slice);
		let action: Maybe<TrActionPhase> = loadMaybe<TrActionPhase>(slice, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadTrActionPhase(slice1);
  		}));
		let aborted: Bool = loadBool(slice);
		let bounce: Maybe<TrBouncePhase> = loadMaybe<TrBouncePhase>(slice, loadTrBouncePhase);
		let destroyed: Bool = loadBool(slice);
		return {
  			kind: 'TransactionDescr_trans_ord',
			credit_first: credit_first,
			storage_ph: storage_ph,
			credit_ph: credit_ph,
			compute_ph: compute_ph,
			action: action,
			aborted: aborted,
			bounce: bounce,
			destroyed: destroyed
  		};
  	};
	if ((slice.preloadUint(4) == 0b0001)) {
  		slice.loadUint(4);
		let storage_ph: TrStoragePhase = loadTrStoragePhase(slice);
		return {
  			kind: 'TransactionDescr_trans_storage',
			storage_ph: storage_ph
  		};
  	};
	if ((slice.preloadUint(3) == 0b001)) {
  		slice.loadUint(3);
		let is_tock: Bool = loadBool(slice);
		let storage_ph: TrStoragePhase = loadTrStoragePhase(slice);
		let compute_ph: TrComputePhase = loadTrComputePhase(slice);
		let action: Maybe<TrActionPhase> = loadMaybe<TrActionPhase>(slice, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadTrActionPhase(slice1);
  		}));
		let aborted: Bool = loadBool(slice);
		let destroyed: Bool = loadBool(slice);
		return {
  			kind: 'TransactionDescr_trans_tick_tock',
			is_tock: is_tock,
			storage_ph: storage_ph,
			compute_ph: compute_ph,
			action: action,
			aborted: aborted,
			destroyed: destroyed
  		};
  	};
	if ((slice.preloadUint(4) == 0b0100)) {
  		slice.loadUint(4);
		let split_info: SplitMergeInfo = loadSplitMergeInfo(slice);
		let storage_ph: Maybe<TrStoragePhase> = loadMaybe<TrStoragePhase>(slice, loadTrStoragePhase);
		let compute_ph: TrComputePhase = loadTrComputePhase(slice);
		let action: Maybe<TrActionPhase> = loadMaybe<TrActionPhase>(slice, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadTrActionPhase(slice1);
  		}));
		let aborted: Bool = loadBool(slice);
		let destroyed: Bool = loadBool(slice);
		return {
  			kind: 'TransactionDescr_trans_split_prepare',
			split_info: split_info,
			storage_ph: storage_ph,
			compute_ph: compute_ph,
			action: action,
			aborted: aborted,
			destroyed: destroyed
  		};
  	};
	if ((slice.preloadUint(4) == 0b0101)) {
  		slice.loadUint(4);
		let split_info: SplitMergeInfo = loadSplitMergeInfo(slice);
		let slice1 = slice.loadRef().beginParse();
		let prepare_transaction: Transaction = loadTransaction(slice1);
		let installed: Bool = loadBool(slice);
		return {
  			kind: 'TransactionDescr_trans_split_install',
			split_info: split_info,
			prepare_transaction: prepare_transaction,
			installed: installed
  		};
  	};
	if ((slice.preloadUint(4) == 0b0110)) {
  		slice.loadUint(4);
		let split_info: SplitMergeInfo = loadSplitMergeInfo(slice);
		let storage_ph: TrStoragePhase = loadTrStoragePhase(slice);
		let aborted: Bool = loadBool(slice);
		return {
  			kind: 'TransactionDescr_trans_merge_prepare',
			split_info: split_info,
			storage_ph: storage_ph,
			aborted: aborted
  		};
  	};
	if ((slice.preloadUint(4) == 0b0111)) {
  		slice.loadUint(4);
		let split_info: SplitMergeInfo = loadSplitMergeInfo(slice);
		let slice1 = slice.loadRef().beginParse();
		let prepare_transaction: Transaction = loadTransaction(slice1);
		let storage_ph: Maybe<TrStoragePhase> = loadMaybe<TrStoragePhase>(slice, loadTrStoragePhase);
		let credit_ph: Maybe<TrCreditPhase> = loadMaybe<TrCreditPhase>(slice, loadTrCreditPhase);
		let compute_ph: TrComputePhase = loadTrComputePhase(slice);
		let action: Maybe<TrActionPhase> = loadMaybe<TrActionPhase>(slice, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadTrActionPhase(slice1);
  		}));
		let aborted: Bool = loadBool(slice);
		let destroyed: Bool = loadBool(slice);
		return {
  			kind: 'TransactionDescr_trans_merge_install',
			split_info: split_info,
			prepare_transaction: prepare_transaction,
			storage_ph: storage_ph,
			credit_ph: credit_ph,
			compute_ph: compute_ph,
			action: action,
			aborted: aborted,
			destroyed: destroyed
  		};
  	};
	throw new Error('');
  }
export function storeTransactionDescr(transactionDescr: TransactionDescr): (builder: Builder) => void {
  	if ((transactionDescr.kind == 'TransactionDescr_trans_ord')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0000, 4);
			storeBool(transactionDescr.credit_first)(builder);
			storeMaybe<TrStoragePhase>(transactionDescr.storage_ph, storeTrStoragePhase)(builder);
			storeMaybe<TrCreditPhase>(transactionDescr.credit_ph, storeTrCreditPhase)(builder);
			storeTrComputePhase(transactionDescr.compute_ph)(builder);
			storeMaybe<TrActionPhase>(transactionDescr.action, ((arg: TrActionPhase) => {
  				return ((builder: Builder) => {
  					let cell1 = beginCell()
					storeTrActionPhase(arg)(cell1)
					builder.storeRef(cell1);
  				});
  			}))(builder);
			storeBool(transactionDescr.aborted)(builder);
			storeMaybe<TrBouncePhase>(transactionDescr.bounce, storeTrBouncePhase)(builder);
			storeBool(transactionDescr.destroyed)(builder);
  		});
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_storage')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0001, 4);
			storeTrStoragePhase(transactionDescr.storage_ph)(builder);
  		});
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_tick_tock')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b001, 3);
			storeBool(transactionDescr.is_tock)(builder);
			storeTrStoragePhase(transactionDescr.storage_ph)(builder);
			storeTrComputePhase(transactionDescr.compute_ph)(builder);
			storeMaybe<TrActionPhase>(transactionDescr.action, ((arg: TrActionPhase) => {
  				return ((builder: Builder) => {
  					let cell1 = beginCell()
					storeTrActionPhase(arg)(cell1)
					builder.storeRef(cell1);
  				});
  			}))(builder);
			storeBool(transactionDescr.aborted)(builder);
			storeBool(transactionDescr.destroyed)(builder);
  		});
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_split_prepare')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0100, 4);
			storeSplitMergeInfo(transactionDescr.split_info)(builder);
			storeMaybe<TrStoragePhase>(transactionDescr.storage_ph, storeTrStoragePhase)(builder);
			storeTrComputePhase(transactionDescr.compute_ph)(builder);
			storeMaybe<TrActionPhase>(transactionDescr.action, ((arg: TrActionPhase) => {
  				return ((builder: Builder) => {
  					let cell1 = beginCell()
					storeTrActionPhase(arg)(cell1)
					builder.storeRef(cell1);
  				});
  			}))(builder);
			storeBool(transactionDescr.aborted)(builder);
			storeBool(transactionDescr.destroyed)(builder);
  		});
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_split_install')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0101, 4);
			storeSplitMergeInfo(transactionDescr.split_info)(builder);
			let cell1 = beginCell();
			storeTransaction(transactionDescr.prepare_transaction)(cell1);
			builder.storeRef(cell1);
			storeBool(transactionDescr.installed)(builder);
  		});
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_merge_prepare')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0110, 4);
			storeSplitMergeInfo(transactionDescr.split_info)(builder);
			storeTrStoragePhase(transactionDescr.storage_ph)(builder);
			storeBool(transactionDescr.aborted)(builder);
  		});
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_merge_install')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0111, 4);
			storeSplitMergeInfo(transactionDescr.split_info)(builder);
			let cell1 = beginCell();
			storeTransaction(transactionDescr.prepare_transaction)(cell1);
			builder.storeRef(cell1);
			storeMaybe<TrStoragePhase>(transactionDescr.storage_ph, storeTrStoragePhase)(builder);
			storeMaybe<TrCreditPhase>(transactionDescr.credit_ph, storeTrCreditPhase)(builder);
			storeTrComputePhase(transactionDescr.compute_ph)(builder);
			storeMaybe<TrActionPhase>(transactionDescr.action, ((arg: TrActionPhase) => {
  				return ((builder: Builder) => {
  					let cell1 = beginCell()
					storeTrActionPhase(arg)(cell1)
					builder.storeRef(cell1);
  				});
  			}))(builder);
			storeBool(transactionDescr.aborted)(builder);
			storeBool(transactionDescr.destroyed)(builder);
  		});
  	};
	throw new Error('');
  }
export type SplitMergeInfo = {
  	kind: 'SplitMergeInfo';
	cur_shard_pfx_len: number;
	acc_split_depth: number;
	this_addr: BitString;
	sibling_addr: BitString;
  };
export function loadSplitMergeInfo(slice: Slice): SplitMergeInfo {
  	let cur_shard_pfx_len: number = slice.loadUint(6);
	let acc_split_depth: number = slice.loadUint(6);
	let this_addr: BitString = slice.loadBits(256);
	let sibling_addr: BitString = slice.loadBits(256);
	return {
  		kind: 'SplitMergeInfo',
		cur_shard_pfx_len: cur_shard_pfx_len,
		acc_split_depth: acc_split_depth,
		this_addr: this_addr,
		sibling_addr: sibling_addr
  	};
  }
export function storeSplitMergeInfo(splitMergeInfo: SplitMergeInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(splitMergeInfo.cur_shard_pfx_len, 6);
		builder.storeUint(splitMergeInfo.acc_split_depth, 6);
		builder.storeBits(splitMergeInfo.this_addr);
		builder.storeBits(splitMergeInfo.sibling_addr);
  	});
  }
export type SmartContractInfo = {
  	kind: 'SmartContractInfo';
	actions: number;
	msgs_sent: number;
	unixtime: number;
	block_lt: number;
	trans_lt: number;
	rand_seed: BitString;
	balance_remaining: CurrencyCollection;
	myself: MsgAddressInt;
  };
export function loadSmartContractInfo(slice: Slice): SmartContractInfo {
  	if ((slice.preloadUint(32) == 0x076ef1ea)) {
  		slice.loadUint(32);
		let actions: number = slice.loadUint(16);
		let msgs_sent: number = slice.loadUint(16);
		let unixtime: number = slice.loadUint(32);
		let block_lt: number = slice.loadUint(64);
		let trans_lt: number = slice.loadUint(64);
		let rand_seed: BitString = slice.loadBits(256);
		let balance_remaining: CurrencyCollection = loadCurrencyCollection(slice);
		let myself: MsgAddressInt = loadMsgAddressInt(slice);
		return {
  			kind: 'SmartContractInfo',
			actions: actions,
			msgs_sent: msgs_sent,
			unixtime: unixtime,
			block_lt: block_lt,
			trans_lt: trans_lt,
			rand_seed: rand_seed,
			balance_remaining: balance_remaining,
			myself: myself
  		};
  	};
	throw new Error('');
  }
export function storeSmartContractInfo(smartContractInfo: SmartContractInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x076ef1ea, 32);
		builder.storeUint(smartContractInfo.actions, 16);
		builder.storeUint(smartContractInfo.msgs_sent, 16);
		builder.storeUint(smartContractInfo.unixtime, 32);
		builder.storeUint(smartContractInfo.block_lt, 64);
		builder.storeUint(smartContractInfo.trans_lt, 64);
		builder.storeBits(smartContractInfo.rand_seed);
		storeCurrencyCollection(smartContractInfo.balance_remaining)(builder);
		storeMsgAddressInt(smartContractInfo.myself)(builder);
  	});
  }
export type OutList = OutList_out_list_empty | OutList_out_list;
export type OutList_out_list_empty = {
  	kind: 'OutList_out_list_empty';
  };
export type OutList_out_list = {
  	kind: 'OutList_out_list';
	n: number;
	prev: OutList;
	action: OutAction;
  };
export function loadOutList(slice: Slice, arg0: number): OutList {
  	if ((arg0 == 0)) {
  		return {
  			kind: 'OutList_out_list_empty'
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let prev: OutList = loadOutList(slice1, (arg0 - 1));
		let action: OutAction = loadOutAction(slice);
		return {
  			kind: 'OutList_out_list',
			n: (arg0 - 1),
			prev: prev,
			action: action
  		};
  	};
	throw new Error('');
  }
export function storeOutList(outList: OutList): (builder: Builder) => void {
  	if ((outList.kind == 'OutList_out_list_empty')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((outList.kind == 'OutList_out_list')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeOutList(outList.prev)(cell1);
			builder.storeRef(cell1);
			storeOutAction(outList.action)(builder);
  		});
  	};
	throw new Error('');
  }
export type OutAction = OutAction_action_send_msg | OutAction_action_set_code | OutAction_action_reserve_currency | OutAction_action_change_library;
export type OutAction_action_send_msg = {
  	kind: 'OutAction_action_send_msg';
	mode: number;
	out_msg: MessageRelaxed<Slice>;
  };
export type OutAction_action_set_code = {
  	kind: 'OutAction_action_set_code';
	new_code: Slice;
  };
export type OutAction_action_reserve_currency = {
  	kind: 'OutAction_action_reserve_currency';
	mode: number;
	currency: CurrencyCollection;
  };
export type OutAction_action_change_library = {
  	kind: 'OutAction_action_change_library';
	mode: number;
	libref: LibRef;
  };
export function loadOutAction(slice: Slice): OutAction {
  	if ((slice.preloadUint(32) == 0x0ec3c86d)) {
  		slice.loadUint(32);
		let mode: number = slice.loadUint(8);
		let slice1 = slice.loadRef().beginParse();
		let out_msg: MessageRelaxed<Slice> = loadMessageRelaxed<Slice>(slice1, ((slice: Slice) => {
  			return slice;
  		}));
		return {
  			kind: 'OutAction_action_send_msg',
			mode: mode,
			out_msg: out_msg
  		};
  	};
	if ((slice.preloadUint(32) == 0xad4de08e)) {
  		slice.loadUint(32);
		let slice1 = slice.loadRef().beginParse();
		let new_code: Slice = slice1;
		return {
  			kind: 'OutAction_action_set_code',
			new_code: new_code
  		};
  	};
	if ((slice.preloadUint(32) == 0x36e6b809)) {
  		slice.loadUint(32);
		let mode: number = slice.loadUint(8);
		let currency: CurrencyCollection = loadCurrencyCollection(slice);
		return {
  			kind: 'OutAction_action_reserve_currency',
			mode: mode,
			currency: currency
  		};
  	};
	if ((slice.preloadUint(32) == 0x26fa1dd4)) {
  		slice.loadUint(32);
		let mode: number = slice.loadUint(7);
		let libref: LibRef = loadLibRef(slice);
		if ((!(mode <= 2))) {
  			throw new Error('');
  		};
		return {
  			kind: 'OutAction_action_change_library',
			mode: mode,
			libref: libref
  		};
  	};
	throw new Error('');
  }
export function storeOutAction(outAction: OutAction): (builder: Builder) => void {
  	if ((outAction.kind == 'OutAction_action_send_msg')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x0ec3c86d, 32);
			builder.storeUint(outAction.mode, 8);
			let cell1 = beginCell();
			storeMessageRelaxed<Slice>(outAction.out_msg, ((arg: Slice) => {
  				return ((builder: Builder) => {
  					cell1.storeSlice(arg);
  				});
  			}))(cell1);
			builder.storeRef(cell1);
  		});
  	};
	if ((outAction.kind == 'OutAction_action_set_code')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xad4de08e, 32);
			let cell1 = beginCell();
			cell1.storeSlice(outAction.new_code);
			builder.storeRef(cell1);
  		});
  	};
	if ((outAction.kind == 'OutAction_action_reserve_currency')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x36e6b809, 32);
			builder.storeUint(outAction.mode, 8);
			storeCurrencyCollection(outAction.currency)(builder);
  		});
  	};
	if ((outAction.kind == 'OutAction_action_change_library')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x26fa1dd4, 32);
			builder.storeUint(outAction.mode, 7);
			storeLibRef(outAction.libref)(builder);
			if ((!(outAction.mode <= 2))) {
  				throw new Error('');
  			};
  		});
  	};
	throw new Error('');
  }
export type LibRef = LibRef_libref_hash | LibRef_libref_ref;
export type LibRef_libref_hash = {
  	kind: 'LibRef_libref_hash';
	lib_hash: BitString;
  };
export type LibRef_libref_ref = {
  	kind: 'LibRef_libref_ref';
	library: Slice;
  };
export function loadLibRef(slice: Slice): LibRef {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let lib_hash: BitString = slice.loadBits(256);
		return {
  			kind: 'LibRef_libref_hash',
			lib_hash: lib_hash
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let slice1 = slice.loadRef().beginParse();
		let library: Slice = slice1;
		return {
  			kind: 'LibRef_libref_ref',
			library: library
  		};
  	};
	throw new Error('');
  }
export function storeLibRef(libRef: LibRef): (builder: Builder) => void {
  	if ((libRef.kind == 'LibRef_libref_hash')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			builder.storeBits(libRef.lib_hash);
  		});
  	};
	if ((libRef.kind == 'LibRef_libref_ref')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			cell1.storeSlice(libRef.library);
			builder.storeRef(cell1);
  		});
  	};
	throw new Error('');
  }
export type OutListNode = {
  	kind: 'OutListNode';
	prev: Slice;
	action: OutAction;
  };
export function loadOutListNode(slice: Slice): OutListNode {
  	let slice1 = slice.loadRef().beginParse();
	let prev: Slice = slice1;
	let action: OutAction = loadOutAction(slice);
	return {
  		kind: 'OutListNode',
		prev: prev,
		action: action
  	};
  }
export function storeOutListNode(outListNode: OutListNode): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		let cell1 = beginCell();
		cell1.storeSlice(outListNode.prev);
		builder.storeRef(cell1);
		storeOutAction(outListNode.action)(builder);
  	});
  }
export type ShardIdent = {
  	kind: 'ShardIdent';
	shard_pfx_bits: number;
	workchain_id: number;
	shard_prefix: number;
  };
export function loadShardIdent(slice: Slice): ShardIdent {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		let shard_pfx_bits: number = slice.loadUint(bitLen(60));
		let workchain_id: number = slice.loadInt(32);
		let shard_prefix: number = slice.loadUint(64);
		return {
  			kind: 'ShardIdent',
			shard_pfx_bits: shard_pfx_bits,
			workchain_id: workchain_id,
			shard_prefix: shard_prefix
  		};
  	};
	throw new Error('');
  }
export function storeShardIdent(shardIdent: ShardIdent): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0b00, 2);
		builder.storeUint(shardIdent.shard_pfx_bits, bitLen(60));
		builder.storeInt(shardIdent.workchain_id, 32);
		builder.storeUint(shardIdent.shard_prefix, 64);
  	});
  }
export type ExtBlkRef = {
  	kind: 'ExtBlkRef';
	end_lt: number;
	seq_no: number;
	root_hash: BitString;
	file_hash: BitString;
  };
export function loadExtBlkRef(slice: Slice): ExtBlkRef {
  	let end_lt: number = slice.loadUint(64);
	let seq_no: number = slice.loadUint(32);
	let root_hash: BitString = slice.loadBits(256);
	let file_hash: BitString = slice.loadBits(256);
	return {
  		kind: 'ExtBlkRef',
		end_lt: end_lt,
		seq_no: seq_no,
		root_hash: root_hash,
		file_hash: file_hash
  	};
  }
export function storeExtBlkRef(extBlkRef: ExtBlkRef): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(extBlkRef.end_lt, 64);
		builder.storeUint(extBlkRef.seq_no, 32);
		builder.storeBits(extBlkRef.root_hash);
		builder.storeBits(extBlkRef.file_hash);
  	});
  }
export type BlockIdExt = {
  	kind: 'BlockIdExt';
	shard_id: ShardIdent;
	seq_no: number;
	root_hash: BitString;
	file_hash: BitString;
  };
export function loadBlockIdExt(slice: Slice): BlockIdExt {
  	let shard_id: ShardIdent = loadShardIdent(slice);
	let seq_no: number = slice.loadUint(32);
	let root_hash: BitString = slice.loadBits(256);
	let file_hash: BitString = slice.loadBits(256);
	return {
  		kind: 'BlockIdExt',
		shard_id: shard_id,
		seq_no: seq_no,
		root_hash: root_hash,
		file_hash: file_hash
  	};
  }
export function storeBlockIdExt(blockIdExt: BlockIdExt): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeShardIdent(blockIdExt.shard_id)(builder);
		builder.storeUint(blockIdExt.seq_no, 32);
		builder.storeBits(blockIdExt.root_hash);
		builder.storeBits(blockIdExt.file_hash);
  	});
  }
export type BlkMasterInfo = {
  	kind: 'BlkMasterInfo';
	master: ExtBlkRef;
  };
export function loadBlkMasterInfo(slice: Slice): BlkMasterInfo {
  	let master: ExtBlkRef = loadExtBlkRef(slice);
	return {
  		kind: 'BlkMasterInfo',
		master: master
  	};
  }
export function storeBlkMasterInfo(blkMasterInfo: BlkMasterInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeExtBlkRef(blkMasterInfo.master)(builder);
  	});
  }
export type ShardStateUnsplit = {
  	kind: 'ShardStateUnsplit';
	global_id: number;
	shard_id: ShardIdent;
	seq_no: number;
	vert_seq_no: number;
	gen_utime: number;
	gen_lt: number;
	min_ref_mc_seqno: number;
	out_msg_queue_info: OutMsgQueueInfo;
	before_split: number;
	accounts: ShardAccounts;
	overload_history: number;
	underload_history: number;
	total_balance: CurrencyCollection;
	total_validator_fees: CurrencyCollection;
	libraries: HashmapE<LibDescr>;
	master_ref: Maybe<BlkMasterInfo>;
	custom: Maybe<McStateExtra>;
  };
export function loadShardStateUnsplit(slice: Slice): ShardStateUnsplit {
  	if ((slice.preloadUint(32) == 0x9023afe2)) {
  		slice.loadUint(32);
		let global_id: number = slice.loadInt(32);
		let shard_id: ShardIdent = loadShardIdent(slice);
		let seq_no: number = slice.loadUint(32);
		let vert_seq_no: number = slice.loadUint(32);
		let gen_utime: number = slice.loadUint(32);
		let gen_lt: number = slice.loadUint(64);
		let min_ref_mc_seqno: number = slice.loadUint(32);
		let slice1 = slice.loadRef().beginParse();
		let out_msg_queue_info: OutMsgQueueInfo = loadOutMsgQueueInfo(slice1);
		let before_split: number = slice.loadUint(1);
		let slice2 = slice.loadRef().beginParse();
		let accounts: ShardAccounts = loadShardAccounts(slice2);
		let slice3 = slice.loadRef().beginParse();
		let overload_history: number = slice3.loadUint(64);
		let underload_history: number = slice3.loadUint(64);
		let total_balance: CurrencyCollection = loadCurrencyCollection(slice3);
		let total_validator_fees: CurrencyCollection = loadCurrencyCollection(slice3);
		let libraries: HashmapE<LibDescr> = loadHashmapE<LibDescr>(slice3, 256, loadLibDescr);
		let master_ref: Maybe<BlkMasterInfo> = loadMaybe<BlkMasterInfo>(slice3, loadBlkMasterInfo);
		let custom: Maybe<McStateExtra> = loadMaybe<McStateExtra>(slice, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadMcStateExtra(slice1);
  		}));
		return {
  			kind: 'ShardStateUnsplit',
			global_id: global_id,
			shard_id: shard_id,
			seq_no: seq_no,
			vert_seq_no: vert_seq_no,
			gen_utime: gen_utime,
			gen_lt: gen_lt,
			min_ref_mc_seqno: min_ref_mc_seqno,
			out_msg_queue_info: out_msg_queue_info,
			before_split: before_split,
			accounts: accounts,
			overload_history: overload_history,
			underload_history: underload_history,
			total_balance: total_balance,
			total_validator_fees: total_validator_fees,
			libraries: libraries,
			master_ref: master_ref,
			custom: custom
  		};
  	};
	throw new Error('');
  }
export function storeShardStateUnsplit(shardStateUnsplit: ShardStateUnsplit): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x9023afe2, 32);
		builder.storeInt(shardStateUnsplit.global_id, 32);
		storeShardIdent(shardStateUnsplit.shard_id)(builder);
		builder.storeUint(shardStateUnsplit.seq_no, 32);
		builder.storeUint(shardStateUnsplit.vert_seq_no, 32);
		builder.storeUint(shardStateUnsplit.gen_utime, 32);
		builder.storeUint(shardStateUnsplit.gen_lt, 64);
		builder.storeUint(shardStateUnsplit.min_ref_mc_seqno, 32);
		let cell1 = beginCell();
		storeOutMsgQueueInfo(shardStateUnsplit.out_msg_queue_info)(cell1);
		builder.storeRef(cell1);
		builder.storeUint(shardStateUnsplit.before_split, 1);
		let cell2 = beginCell();
		storeShardAccounts(shardStateUnsplit.accounts)(cell2);
		builder.storeRef(cell2);
		let cell3 = beginCell();
		cell3.storeUint(shardStateUnsplit.overload_history, 64);
		cell3.storeUint(shardStateUnsplit.underload_history, 64);
		storeCurrencyCollection(shardStateUnsplit.total_balance)(cell3);
		storeCurrencyCollection(shardStateUnsplit.total_validator_fees)(cell3);
		storeHashmapE<LibDescr>(shardStateUnsplit.libraries, storeLibDescr)(cell3);
		storeMaybe<BlkMasterInfo>(shardStateUnsplit.master_ref, storeBlkMasterInfo)(cell3);
		builder.storeRef(cell3);
		storeMaybe<McStateExtra>(shardStateUnsplit.custom, ((arg: McStateExtra) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeMcStateExtra(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(builder);
  	});
  }
export type ShardState = ShardState__ | ShardState_split_state;
export type ShardState__ = {
  	kind: 'ShardState__';
  };
export type ShardState_split_state = {
  	kind: 'ShardState_split_state';
	left: ShardStateUnsplit;
	right: ShardStateUnsplit;
  };
export function loadShardState(slice: Slice): ShardState {
  	if (true) {
  		return {
  			kind: 'ShardState__'
  		};
  	};
	if ((slice.preloadUint(32) == 0x5f327da5)) {
  		slice.loadUint(32);
		let slice1 = slice.loadRef().beginParse();
		let left: ShardStateUnsplit = loadShardStateUnsplit(slice1);
		let slice2 = slice.loadRef().beginParse();
		let right: ShardStateUnsplit = loadShardStateUnsplit(slice2);
		return {
  			kind: 'ShardState_split_state',
			left: left,
			right: right
  		};
  	};
	throw new Error('');
  }
export function storeShardState(shardState: ShardState): (builder: Builder) => void {
  	if ((shardState.kind == 'ShardState__')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((shardState.kind == 'ShardState_split_state')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x5f327da5, 32);
			let cell1 = beginCell();
			storeShardStateUnsplit(shardState.left)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeShardStateUnsplit(shardState.right)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	throw new Error('');
  }
export type LibDescr = {
  	kind: 'LibDescr';
	lib: Slice;
	publishers: Hashmap<True>;
  };
export function loadLibDescr(slice: Slice): LibDescr {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		let slice1 = slice.loadRef().beginParse();
		let lib: Slice = slice1;
		let publishers: Hashmap<True> = loadHashmap<True>(slice, 256, loadTrue);
		return {
  			kind: 'LibDescr',
			lib: lib,
			publishers: publishers
  		};
  	};
	throw new Error('');
  }
export function storeLibDescr(libDescr: LibDescr): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0b00, 2);
		let cell1 = beginCell();
		cell1.storeSlice(libDescr.lib);
		builder.storeRef(cell1);
		storeHashmap<True>(libDescr.publishers, storeTrue)(builder);
  	});
  }
export type BlockInfo = {
  	kind: 'BlockInfo';
	version: number;
	not_master: number;
	after_merge: number;
	before_split: number;
	after_split: number;
	want_split: Bool;
	want_merge: Bool;
	key_block: Bool;
	vert_seqno_incr: number;
	flags: number;
	seq_no: number;
	vert_seq_no: number;
	prev_seq_no: number;
	shard: ShardIdent;
	gen_utime: number;
	start_lt: number;
	end_lt: number;
	gen_validator_list_hash_short: number;
	gen_catchain_seqno: number;
	min_ref_mc_seqno: number;
	prev_key_block_seqno: number;
	gen_software: GlobalVersion | undefined;
	master_ref: BlkMasterInfo | undefined;
	prev_ref: BlkPrevInfo;
	prev_vert_ref: BlkPrevInfo | undefined;
  };
export function loadBlockInfo(slice: Slice): BlockInfo {
  	if ((slice.preloadUint(32) == 0x9bc7a987)) {
  		slice.loadUint(32);
		let version: number = slice.loadUint(32);
		let not_master: number = slice.loadUint(1);
		let after_merge: number = slice.loadUint(1);
		let before_split: number = slice.loadUint(1);
		let after_split: number = slice.loadUint(1);
		let want_split: Bool = loadBool(slice);
		let want_merge: Bool = loadBool(slice);
		let key_block: Bool = loadBool(slice);
		let vert_seqno_incr: number = slice.loadUint(1);
		let flags: number = slice.loadUint(8);
		let seq_no: number = slice.loadUint(32);
		let vert_seq_no: number = slice.loadUint(32);
		let shard: ShardIdent = loadShardIdent(slice);
		let gen_utime: number = slice.loadUint(32);
		let start_lt: number = slice.loadUint(64);
		let end_lt: number = slice.loadUint(64);
		let gen_validator_list_hash_short: number = slice.loadUint(32);
		let gen_catchain_seqno: number = slice.loadUint(32);
		let min_ref_mc_seqno: number = slice.loadUint(32);
		let prev_key_block_seqno: number = slice.loadUint(32);
		let gen_software: GlobalVersion | undefined = ((flags & (1 << 0)) ? loadGlobalVersion(slice) : undefined);
		let master_ref: BlkMasterInfo | undefined = (not_master ? ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadBlkMasterInfo(slice1);
  		})(slice) : undefined);
		let slice1 = slice.loadRef().beginParse();
		let prev_ref: BlkPrevInfo = loadBlkPrevInfo(slice1, after_merge);
		let prev_vert_ref: BlkPrevInfo | undefined = (vert_seqno_incr ? ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadBlkPrevInfo(slice1, 0);
  		})(slice) : undefined);
		if ((!(flags <= 1))) {
  			throw new Error('');
  		};
		if ((!(vert_seq_no >= vert_seqno_incr))) {
  			throw new Error('');
  		};
		if ((!((prev_seq_no + 1) == seq_no))) {
  			throw new Error('');
  		};
		return {
  			kind: 'BlockInfo',
			version: version,
			not_master: not_master,
			after_merge: after_merge,
			before_split: before_split,
			after_split: after_split,
			want_split: want_split,
			want_merge: want_merge,
			key_block: key_block,
			vert_seqno_incr: vert_seqno_incr,
			flags: flags,
			seq_no: seq_no,
			vert_seq_no: vert_seq_no,
			shard: shard,
			gen_utime: gen_utime,
			start_lt: start_lt,
			end_lt: end_lt,
			gen_validator_list_hash_short: gen_validator_list_hash_short,
			gen_catchain_seqno: gen_catchain_seqno,
			min_ref_mc_seqno: min_ref_mc_seqno,
			prev_key_block_seqno: prev_key_block_seqno,
			gen_software: gen_software,
			master_ref: master_ref,
			prev_ref: prev_ref,
			prev_vert_ref: prev_vert_ref
  		};
  	};
	throw new Error('');
  }
export function storeBlockInfo(blockInfo: BlockInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x9bc7a987, 32);
		builder.storeUint(blockInfo.version, 32);
		builder.storeUint(blockInfo.not_master, 1);
		builder.storeUint(blockInfo.after_merge, 1);
		builder.storeUint(blockInfo.before_split, 1);
		builder.storeUint(blockInfo.after_split, 1);
		storeBool(blockInfo.want_split)(builder);
		storeBool(blockInfo.want_merge)(builder);
		storeBool(blockInfo.key_block)(builder);
		builder.storeUint(blockInfo.vert_seqno_incr, 1);
		builder.storeUint(blockInfo.flags, 8);
		builder.storeUint(blockInfo.seq_no, 32);
		builder.storeUint(blockInfo.vert_seq_no, 32);
		storeShardIdent(blockInfo.shard)(builder);
		builder.storeUint(blockInfo.gen_utime, 32);
		builder.storeUint(blockInfo.start_lt, 64);
		builder.storeUint(blockInfo.end_lt, 64);
		builder.storeUint(blockInfo.gen_validator_list_hash_short, 32);
		builder.storeUint(blockInfo.gen_catchain_seqno, 32);
		builder.storeUint(blockInfo.min_ref_mc_seqno, 32);
		builder.storeUint(blockInfo.prev_key_block_seqno, 32);
		if ((blockInfo.gen_software != undefined)) {
  			storeGlobalVersion(blockInfo.gen_software)(builder);
  		};
		if ((blockInfo.master_ref != undefined)) {
  			let cell1 = beginCell()
			storeBlkMasterInfo(arg)(cell1)
			builder.storeRef(cell1);
  		};
		let cell1 = beginCell();
		storeBlkPrevInfo(blockInfo.prev_ref)(cell1);
		builder.storeRef(cell1);
		if ((blockInfo.prev_vert_ref != undefined)) {
  			let cell1 = beginCell()
			storeBlkPrevInfo(arg)(cell1)
			builder.storeRef(cell1);
  		};
		if ((!(blockInfo.flags <= 1))) {
  			throw new Error('');
  		};
		if ((!(blockInfo.vert_seq_no >= blockInfo.vert_seqno_incr))) {
  			throw new Error('');
  		};
		if ((!((blockInfo.prev_seq_no + 1) == blockInfo.seq_no))) {
  			throw new Error('');
  		};
  	});
  }
export type BlkPrevInfo = BlkPrevInfo_prev_blk_info | BlkPrevInfo_prev_blks_info;
export type BlkPrevInfo_prev_blk_info = {
  	kind: 'BlkPrevInfo_prev_blk_info';
	prev: ExtBlkRef;
  };
export type BlkPrevInfo_prev_blks_info = {
  	kind: 'BlkPrevInfo_prev_blks_info';
	prev1: ExtBlkRef;
	prev2: ExtBlkRef;
  };
export function loadBlkPrevInfo(slice: Slice, arg0: number): BlkPrevInfo {
  	if ((arg0 == 0)) {
  		let prev: ExtBlkRef = loadExtBlkRef(slice);
		return {
  			kind: 'BlkPrevInfo_prev_blk_info',
			prev: prev
  		};
  	};
	if ((arg0 == 1)) {
  		let slice1 = slice.loadRef().beginParse();
		let prev1: ExtBlkRef = loadExtBlkRef(slice1);
		let slice2 = slice.loadRef().beginParse();
		let prev2: ExtBlkRef = loadExtBlkRef(slice2);
		return {
  			kind: 'BlkPrevInfo_prev_blks_info',
			prev1: prev1,
			prev2: prev2
  		};
  	};
	throw new Error('');
  }
export function storeBlkPrevInfo(blkPrevInfo: BlkPrevInfo): (builder: Builder) => void {
  	if ((blkPrevInfo.kind == 'BlkPrevInfo_prev_blk_info')) {
  		return ((builder: Builder) => {
  			storeExtBlkRef(blkPrevInfo.prev)(builder);
  		});
  	};
	if ((blkPrevInfo.kind == 'BlkPrevInfo_prev_blks_info')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeExtBlkRef(blkPrevInfo.prev1)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeExtBlkRef(blkPrevInfo.prev2)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	throw new Error('');
  }
export type Block = {
  	kind: 'Block';
	global_id: number;
	info: BlockInfo;
	value_flow: ValueFlow;
	state_update: MERKLE_UPDATE<ShardState>;
	extra: BlockExtra;
  };
export function loadBlock(slice: Slice): Block {
  	if ((slice.preloadUint(32) == 0x11ef55aa)) {
  		slice.loadUint(32);
		let global_id: number = slice.loadInt(32);
		let slice1 = slice.loadRef().beginParse();
		let info: BlockInfo = loadBlockInfo(slice1);
		let slice2 = slice.loadRef().beginParse();
		let value_flow: ValueFlow = loadValueFlow(slice2);
		let slice3 = slice.loadRef().beginParse();
		let state_update: MERKLE_UPDATE<ShardState> = loadMERKLE_UPDATE<ShardState>(slice3, loadShardState);
		let slice4 = slice.loadRef().beginParse();
		let extra: BlockExtra = loadBlockExtra(slice4);
		return {
  			kind: 'Block',
			global_id: global_id,
			info: info,
			value_flow: value_flow,
			state_update: state_update,
			extra: extra
  		};
  	};
	throw new Error('');
  }
export function storeBlock(block: Block): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x11ef55aa, 32);
		builder.storeInt(block.global_id, 32);
		let cell1 = beginCell();
		storeBlockInfo(block.info)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeValueFlow(block.value_flow)(cell2);
		builder.storeRef(cell2);
		let cell3 = beginCell();
		storeMERKLE_UPDATE<ShardState>(block.state_update, storeShardState)(cell3);
		builder.storeRef(cell3);
		let cell4 = beginCell();
		storeBlockExtra(block.extra)(cell4);
		builder.storeRef(cell4);
  	});
  }
export type BlockExtra = {
  	kind: 'BlockExtra';
	in_msg_descr: InMsgDescr;
	out_msg_descr: OutMsgDescr;
	account_blocks: ShardAccountBlocks;
	rand_seed: BitString;
	created_by: BitString;
	custom: Maybe<McBlockExtra>;
  };
export function loadBlockExtra(slice: Slice): BlockExtra {
  	let slice1 = slice.loadRef().beginParse();
	let in_msg_descr: InMsgDescr = loadInMsgDescr(slice1);
	let slice2 = slice.loadRef().beginParse();
	let out_msg_descr: OutMsgDescr = loadOutMsgDescr(slice2);
	let slice3 = slice.loadRef().beginParse();
	let account_blocks: ShardAccountBlocks = loadShardAccountBlocks(slice3);
	let rand_seed: BitString = slice.loadBits(256);
	let created_by: BitString = slice.loadBits(256);
	let custom: Maybe<McBlockExtra> = loadMaybe<McBlockExtra>(slice, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return loadMcBlockExtra(slice1);
  	}));
	return {
  		kind: 'BlockExtra',
		in_msg_descr: in_msg_descr,
		out_msg_descr: out_msg_descr,
		account_blocks: account_blocks,
		rand_seed: rand_seed,
		created_by: created_by,
		custom: custom
  	};
  }
export function storeBlockExtra(blockExtra: BlockExtra): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		let cell1 = beginCell();
		storeInMsgDescr(blockExtra.in_msg_descr)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeOutMsgDescr(blockExtra.out_msg_descr)(cell2);
		builder.storeRef(cell2);
		let cell3 = beginCell();
		storeShardAccountBlocks(blockExtra.account_blocks)(cell3);
		builder.storeRef(cell3);
		builder.storeBits(blockExtra.rand_seed);
		builder.storeBits(blockExtra.created_by);
		storeMaybe<McBlockExtra>(blockExtra.custom, ((arg: McBlockExtra) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeMcBlockExtra(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(builder);
  	});
  }
export type ValueFlow = {
  	kind: 'ValueFlow';
	from_prev_blk: CurrencyCollection;
	to_next_blk: CurrencyCollection;
	imported: CurrencyCollection;
	exported: CurrencyCollection;
	fees_collected: CurrencyCollection;
	fees_imported: CurrencyCollection;
	recovered: CurrencyCollection;
	created: CurrencyCollection;
	minted: CurrencyCollection;
  };
export function loadValueFlow(slice: Slice): ValueFlow {
  	let slice1 = slice.loadRef().beginParse();
	let from_prev_blk: CurrencyCollection = loadCurrencyCollection(slice1);
	let to_next_blk: CurrencyCollection = loadCurrencyCollection(slice1);
	let imported: CurrencyCollection = loadCurrencyCollection(slice1);
	let exported: CurrencyCollection = loadCurrencyCollection(slice1);
	let fees_collected: CurrencyCollection = loadCurrencyCollection(slice);
	let slice2 = slice.loadRef().beginParse();
	let fees_imported: CurrencyCollection = loadCurrencyCollection(slice2);
	let recovered: CurrencyCollection = loadCurrencyCollection(slice2);
	let created: CurrencyCollection = loadCurrencyCollection(slice2);
	let minted: CurrencyCollection = loadCurrencyCollection(slice2);
	return {
  		kind: 'ValueFlow',
		from_prev_blk: from_prev_blk,
		to_next_blk: to_next_blk,
		imported: imported,
		exported: exported,
		fees_collected: fees_collected,
		fees_imported: fees_imported,
		recovered: recovered,
		created: created,
		minted: minted
  	};
  }
export function storeValueFlow(valueFlow: ValueFlow): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		let cell1 = beginCell();
		storeCurrencyCollection(valueFlow.from_prev_blk)(cell1);
		storeCurrencyCollection(valueFlow.to_next_blk)(cell1);
		storeCurrencyCollection(valueFlow.imported)(cell1);
		storeCurrencyCollection(valueFlow.exported)(cell1);
		builder.storeRef(cell1);
		storeCurrencyCollection(valueFlow.fees_collected)(builder);
		let cell2 = beginCell();
		storeCurrencyCollection(valueFlow.fees_imported)(cell2);
		storeCurrencyCollection(valueFlow.recovered)(cell2);
		storeCurrencyCollection(valueFlow.created)(cell2);
		storeCurrencyCollection(valueFlow.minted)(cell2);
		builder.storeRef(cell2);
  	});
  }
export type BinTree<X> = BinTree_bt_leaf<X> | BinTree_bt_fork<X>;
export type BinTree_bt_leaf<X> = {
  	kind: 'BinTree_bt_leaf';
	leaf: X;
  };
export type BinTree_bt_fork<X> = {
  	kind: 'BinTree_bt_fork';
	left: BinTree<X>;
	right: BinTree<X>;
  };
export function loadBinTree<X>(slice: Slice, loadX: (slice: Slice) => X): BinTree<X> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let leaf: X = loadX(slice);
		return {
  			kind: 'BinTree_bt_leaf',
			leaf: leaf
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let slice1 = slice.loadRef().beginParse();
		let left: BinTree<X> = loadBinTree<X>(slice1, loadX);
		let slice2 = slice.loadRef().beginParse();
		let right: BinTree<X> = loadBinTree<X>(slice2, loadX);
		return {
  			kind: 'BinTree_bt_fork',
			left: left,
			right: right
  		};
  	};
	throw new Error('');
  }
export function storeBinTree<X>(binTree: BinTree<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((binTree.kind == 'BinTree_bt_leaf')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeX(binTree.leaf)(builder);
  		});
  	};
	if ((binTree.kind == 'BinTree_bt_fork')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeBinTree<X>(binTree.left, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeBinTree<X>(binTree.right, storeX)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	throw new Error('');
  }
export type FutureSplitMerge = FutureSplitMerge_fsm_none | FutureSplitMerge_fsm_split | FutureSplitMerge_fsm_merge;
export type FutureSplitMerge_fsm_none = {
  	kind: 'FutureSplitMerge_fsm_none';
  };
export type FutureSplitMerge_fsm_split = {
  	kind: 'FutureSplitMerge_fsm_split';
	split_utime: number;
	interval: number;
  };
export type FutureSplitMerge_fsm_merge = {
  	kind: 'FutureSplitMerge_fsm_merge';
	merge_utime: number;
	interval: number;
  };
export function loadFutureSplitMerge(slice: Slice): FutureSplitMerge {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'FutureSplitMerge_fsm_none'
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		slice.loadUint(2);
		let split_utime: number = slice.loadUint(32);
		let interval: number = slice.loadUint(32);
		return {
  			kind: 'FutureSplitMerge_fsm_split',
			split_utime: split_utime,
			interval: interval
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		slice.loadUint(2);
		let merge_utime: number = slice.loadUint(32);
		let interval: number = slice.loadUint(32);
		return {
  			kind: 'FutureSplitMerge_fsm_merge',
			merge_utime: merge_utime,
			interval: interval
  		};
  	};
	throw new Error('');
  }
export function storeFutureSplitMerge(futureSplitMerge: FutureSplitMerge): (builder: Builder) => void {
  	if ((futureSplitMerge.kind == 'FutureSplitMerge_fsm_none')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((futureSplitMerge.kind == 'FutureSplitMerge_fsm_split')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10, 2);
			builder.storeUint(futureSplitMerge.split_utime, 32);
			builder.storeUint(futureSplitMerge.interval, 32);
  		});
  	};
	if ((futureSplitMerge.kind == 'FutureSplitMerge_fsm_merge')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b11, 2);
			builder.storeUint(futureSplitMerge.merge_utime, 32);
			builder.storeUint(futureSplitMerge.interval, 32);
  		});
  	};
	throw new Error('');
  }
export type ShardDescr = ShardDescr_shard_descr | ShardDescr_shard_descr_new;
export type ShardDescr_shard_descr = {
  	kind: 'ShardDescr_shard_descr';
	seq_no: number;
	reg_mc_seqno: number;
	start_lt: number;
	end_lt: number;
	root_hash: BitString;
	file_hash: BitString;
	before_split: Bool;
	before_merge: Bool;
	want_split: Bool;
	want_merge: Bool;
	nx_cc_updated: Bool;
	flags: number;
	next_catchain_seqno: number;
	next_validator_shard: number;
	min_ref_mc_seqno: number;
	gen_utime: number;
	split_merge_at: FutureSplitMerge;
	fees_collected: CurrencyCollection;
	funds_created: CurrencyCollection;
  };
export type ShardDescr_shard_descr_new = {
  	kind: 'ShardDescr_shard_descr_new';
	seq_no: number;
	reg_mc_seqno: number;
	start_lt: number;
	end_lt: number;
	root_hash: BitString;
	file_hash: BitString;
	before_split: Bool;
	before_merge: Bool;
	want_split: Bool;
	want_merge: Bool;
	nx_cc_updated: Bool;
	flags: number;
	next_catchain_seqno: number;
	next_validator_shard: number;
	min_ref_mc_seqno: number;
	gen_utime: number;
	split_merge_at: FutureSplitMerge;
	fees_collected: CurrencyCollection;
	funds_created: CurrencyCollection;
  };
export function loadShardDescr(slice: Slice): ShardDescr {
  	if ((slice.preloadUint(4) == 0xb)) {
  		slice.loadUint(4);
		let seq_no: number = slice.loadUint(32);
		let reg_mc_seqno: number = slice.loadUint(32);
		let start_lt: number = slice.loadUint(64);
		let end_lt: number = slice.loadUint(64);
		let root_hash: BitString = slice.loadBits(256);
		let file_hash: BitString = slice.loadBits(256);
		let before_split: Bool = loadBool(slice);
		let before_merge: Bool = loadBool(slice);
		let want_split: Bool = loadBool(slice);
		let want_merge: Bool = loadBool(slice);
		let nx_cc_updated: Bool = loadBool(slice);
		let flags: number = slice.loadUint(3);
		let next_catchain_seqno: number = slice.loadUint(32);
		let next_validator_shard: number = slice.loadUint(64);
		let min_ref_mc_seqno: number = slice.loadUint(32);
		let gen_utime: number = slice.loadUint(32);
		let split_merge_at: FutureSplitMerge = loadFutureSplitMerge(slice);
		let fees_collected: CurrencyCollection = loadCurrencyCollection(slice);
		let funds_created: CurrencyCollection = loadCurrencyCollection(slice);
		if ((!(flags == 0))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ShardDescr_shard_descr',
			seq_no: seq_no,
			reg_mc_seqno: reg_mc_seqno,
			start_lt: start_lt,
			end_lt: end_lt,
			root_hash: root_hash,
			file_hash: file_hash,
			before_split: before_split,
			before_merge: before_merge,
			want_split: want_split,
			want_merge: want_merge,
			nx_cc_updated: nx_cc_updated,
			flags: flags,
			next_catchain_seqno: next_catchain_seqno,
			next_validator_shard: next_validator_shard,
			min_ref_mc_seqno: min_ref_mc_seqno,
			gen_utime: gen_utime,
			split_merge_at: split_merge_at,
			fees_collected: fees_collected,
			funds_created: funds_created
  		};
  	};
	if ((slice.preloadUint(4) == 0xa)) {
  		slice.loadUint(4);
		let seq_no: number = slice.loadUint(32);
		let reg_mc_seqno: number = slice.loadUint(32);
		let start_lt: number = slice.loadUint(64);
		let end_lt: number = slice.loadUint(64);
		let root_hash: BitString = slice.loadBits(256);
		let file_hash: BitString = slice.loadBits(256);
		let before_split: Bool = loadBool(slice);
		let before_merge: Bool = loadBool(slice);
		let want_split: Bool = loadBool(slice);
		let want_merge: Bool = loadBool(slice);
		let nx_cc_updated: Bool = loadBool(slice);
		let flags: number = slice.loadUint(3);
		let next_catchain_seqno: number = slice.loadUint(32);
		let next_validator_shard: number = slice.loadUint(64);
		let min_ref_mc_seqno: number = slice.loadUint(32);
		let gen_utime: number = slice.loadUint(32);
		let split_merge_at: FutureSplitMerge = loadFutureSplitMerge(slice);
		let slice1 = slice.loadRef().beginParse();
		let fees_collected: CurrencyCollection = loadCurrencyCollection(slice1);
		let funds_created: CurrencyCollection = loadCurrencyCollection(slice1);
		if ((!(flags == 0))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ShardDescr_shard_descr_new',
			seq_no: seq_no,
			reg_mc_seqno: reg_mc_seqno,
			start_lt: start_lt,
			end_lt: end_lt,
			root_hash: root_hash,
			file_hash: file_hash,
			before_split: before_split,
			before_merge: before_merge,
			want_split: want_split,
			want_merge: want_merge,
			nx_cc_updated: nx_cc_updated,
			flags: flags,
			next_catchain_seqno: next_catchain_seqno,
			next_validator_shard: next_validator_shard,
			min_ref_mc_seqno: min_ref_mc_seqno,
			gen_utime: gen_utime,
			split_merge_at: split_merge_at,
			fees_collected: fees_collected,
			funds_created: funds_created
  		};
  	};
	throw new Error('');
  }
export function storeShardDescr(shardDescr: ShardDescr): (builder: Builder) => void {
  	if ((shardDescr.kind == 'ShardDescr_shard_descr')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xb, 4);
			builder.storeUint(shardDescr.seq_no, 32);
			builder.storeUint(shardDescr.reg_mc_seqno, 32);
			builder.storeUint(shardDescr.start_lt, 64);
			builder.storeUint(shardDescr.end_lt, 64);
			builder.storeBits(shardDescr.root_hash);
			builder.storeBits(shardDescr.file_hash);
			storeBool(shardDescr.before_split)(builder);
			storeBool(shardDescr.before_merge)(builder);
			storeBool(shardDescr.want_split)(builder);
			storeBool(shardDescr.want_merge)(builder);
			storeBool(shardDescr.nx_cc_updated)(builder);
			builder.storeUint(shardDescr.flags, 3);
			builder.storeUint(shardDescr.next_catchain_seqno, 32);
			builder.storeUint(shardDescr.next_validator_shard, 64);
			builder.storeUint(shardDescr.min_ref_mc_seqno, 32);
			builder.storeUint(shardDescr.gen_utime, 32);
			storeFutureSplitMerge(shardDescr.split_merge_at)(builder);
			storeCurrencyCollection(shardDescr.fees_collected)(builder);
			storeCurrencyCollection(shardDescr.funds_created)(builder);
			if ((!(shardDescr.flags == 0))) {
  				throw new Error('');
  			};
  		});
  	};
	if ((shardDescr.kind == 'ShardDescr_shard_descr_new')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xa, 4);
			builder.storeUint(shardDescr.seq_no, 32);
			builder.storeUint(shardDescr.reg_mc_seqno, 32);
			builder.storeUint(shardDescr.start_lt, 64);
			builder.storeUint(shardDescr.end_lt, 64);
			builder.storeBits(shardDescr.root_hash);
			builder.storeBits(shardDescr.file_hash);
			storeBool(shardDescr.before_split)(builder);
			storeBool(shardDescr.before_merge)(builder);
			storeBool(shardDescr.want_split)(builder);
			storeBool(shardDescr.want_merge)(builder);
			storeBool(shardDescr.nx_cc_updated)(builder);
			builder.storeUint(shardDescr.flags, 3);
			builder.storeUint(shardDescr.next_catchain_seqno, 32);
			builder.storeUint(shardDescr.next_validator_shard, 64);
			builder.storeUint(shardDescr.min_ref_mc_seqno, 32);
			builder.storeUint(shardDescr.gen_utime, 32);
			storeFutureSplitMerge(shardDescr.split_merge_at)(builder);
			let cell1 = beginCell();
			storeCurrencyCollection(shardDescr.fees_collected)(cell1);
			storeCurrencyCollection(shardDescr.funds_created)(cell1);
			builder.storeRef(cell1);
			if ((!(shardDescr.flags == 0))) {
  				throw new Error('');
  			};
  		});
  	};
	throw new Error('');
  }
export type ShardHashes = {
  	kind: 'ShardHashes';
  };
export function loadShardHashes(slice: Slice): ShardHashes {
  	return {
  		kind: 'ShardHashes'
  	};
  }
export function storeShardHashes(shardHashes: ShardHashes): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type BinTreeAug<X,Y> = BinTreeAug_bta_leaf<X,Y> | BinTreeAug_bta_fork<X,Y>;
export type BinTreeAug_bta_leaf<X,Y> = {
  	kind: 'BinTreeAug_bta_leaf';
	extra: Y;
	leaf: X;
  };
export type BinTreeAug_bta_fork<X,Y> = {
  	kind: 'BinTreeAug_bta_fork';
	left: BinTreeAug<X,Y>;
	right: BinTreeAug<X,Y>;
	extra: Y;
  };
export function loadBinTreeAug<X,Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): BinTreeAug<X,Y> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		let extra: Y = loadY(slice);
		let leaf: X = loadX(slice);
		return {
  			kind: 'BinTreeAug_bta_leaf',
			extra: extra,
			leaf: leaf
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let slice1 = slice.loadRef().beginParse();
		let left: BinTreeAug<X,Y> = loadBinTreeAug<X,Y>(slice1, loadX, loadY);
		let slice2 = slice.loadRef().beginParse();
		let right: BinTreeAug<X,Y> = loadBinTreeAug<X,Y>(slice2, loadX, loadY);
		let extra: Y = loadY(slice);
		return {
  			kind: 'BinTreeAug_bta_fork',
			left: left,
			right: right,
			extra: extra
  		};
  	};
	throw new Error('');
  }
export function storeBinTreeAug<X,Y>(binTreeAug: BinTreeAug<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((binTreeAug.kind == 'BinTreeAug_bta_leaf')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeY(binTreeAug.extra)(builder);
			storeX(binTreeAug.leaf)(builder);
  		});
  	};
	if ((binTreeAug.kind == 'BinTreeAug_bta_fork')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeBinTreeAug<X,Y>(binTreeAug.left, storeX, storeY)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeBinTreeAug<X,Y>(binTreeAug.right, storeX, storeY)(cell2);
			builder.storeRef(cell2);
			storeY(binTreeAug.extra)(builder);
  		});
  	};
	throw new Error('');
  }
export type ShardFeeCreated = {
  	kind: 'ShardFeeCreated';
	fees: CurrencyCollection;
	create: CurrencyCollection;
  };
export function loadShardFeeCreated(slice: Slice): ShardFeeCreated {
  	let fees: CurrencyCollection = loadCurrencyCollection(slice);
	let create: CurrencyCollection = loadCurrencyCollection(slice);
	return {
  		kind: 'ShardFeeCreated',
		fees: fees,
		create: create
  	};
  }
export function storeShardFeeCreated(shardFeeCreated: ShardFeeCreated): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeCurrencyCollection(shardFeeCreated.fees)(builder);
		storeCurrencyCollection(shardFeeCreated.create)(builder);
  	});
  }
export type ShardFees = {
  	kind: 'ShardFees';
  };
export function loadShardFees(slice: Slice): ShardFees {
  	return {
  		kind: 'ShardFees'
  	};
  }
export function storeShardFees(shardFees: ShardFees): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type ConfigParams = {
  	kind: 'ConfigParams';
	config_addr: BitString;
	config: Hashmap<Slice>;
  };
export function loadConfigParams(slice: Slice): ConfigParams {
  	let config_addr: BitString = slice.loadBits(256);
	let slice1 = slice.loadRef().beginParse();
	let config: Hashmap<Slice> = loadHashmap<Slice>(slice1, 32, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return slice1;
  	}));
	return {
  		kind: 'ConfigParams',
		config_addr: config_addr,
		config: config
  	};
  }
export function storeConfigParams(configParams: ConfigParams): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeBits(configParams.config_addr);
		let cell1 = beginCell();
		storeHashmap<Slice>(configParams.config, ((arg: Slice) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				cell1.storeSlice(arg)
				builder.storeRef(cell1);
  			});
  		}))(cell1);
		builder.storeRef(cell1);
  	});
  }
export type ValidatorInfo = {
  	kind: 'ValidatorInfo';
	validator_list_hash_short: number;
	catchain_seqno: number;
	nx_cc_updated: Bool;
  };
export function loadValidatorInfo(slice: Slice): ValidatorInfo {
  	let validator_list_hash_short: number = slice.loadUint(32);
	let catchain_seqno: number = slice.loadUint(32);
	let nx_cc_updated: Bool = loadBool(slice);
	return {
  		kind: 'ValidatorInfo',
		validator_list_hash_short: validator_list_hash_short,
		catchain_seqno: catchain_seqno,
		nx_cc_updated: nx_cc_updated
  	};
  }
export function storeValidatorInfo(validatorInfo: ValidatorInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(validatorInfo.validator_list_hash_short, 32);
		builder.storeUint(validatorInfo.catchain_seqno, 32);
		storeBool(validatorInfo.nx_cc_updated)(builder);
  	});
  }
export type ValidatorBaseInfo = {
  	kind: 'ValidatorBaseInfo';
	validator_list_hash_short: number;
	catchain_seqno: number;
  };
export function loadValidatorBaseInfo(slice: Slice): ValidatorBaseInfo {
  	let validator_list_hash_short: number = slice.loadUint(32);
	let catchain_seqno: number = slice.loadUint(32);
	return {
  		kind: 'ValidatorBaseInfo',
		validator_list_hash_short: validator_list_hash_short,
		catchain_seqno: catchain_seqno
  	};
  }
export function storeValidatorBaseInfo(validatorBaseInfo: ValidatorBaseInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(validatorBaseInfo.validator_list_hash_short, 32);
		builder.storeUint(validatorBaseInfo.catchain_seqno, 32);
  	});
  }
export type KeyMaxLt = {
  	kind: 'KeyMaxLt';
	key: Bool;
	max_end_lt: number;
  };
export function loadKeyMaxLt(slice: Slice): KeyMaxLt {
  	let key: Bool = loadBool(slice);
	let max_end_lt: number = slice.loadUint(64);
	return {
  		kind: 'KeyMaxLt',
		key: key,
		max_end_lt: max_end_lt
  	};
  }
export function storeKeyMaxLt(keyMaxLt: KeyMaxLt): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeBool(keyMaxLt.key)(builder);
		builder.storeUint(keyMaxLt.max_end_lt, 64);
  	});
  }
export type KeyExtBlkRef = {
  	kind: 'KeyExtBlkRef';
	key: Bool;
	blk_ref: ExtBlkRef;
  };
export function loadKeyExtBlkRef(slice: Slice): KeyExtBlkRef {
  	let key: Bool = loadBool(slice);
	let blk_ref: ExtBlkRef = loadExtBlkRef(slice);
	return {
  		kind: 'KeyExtBlkRef',
		key: key,
		blk_ref: blk_ref
  	};
  }
export function storeKeyExtBlkRef(keyExtBlkRef: KeyExtBlkRef): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeBool(keyExtBlkRef.key)(builder);
		storeExtBlkRef(keyExtBlkRef.blk_ref)(builder);
  	});
  }
export type OldMcBlocksInfo = {
  	kind: 'OldMcBlocksInfo';
  };
export function loadOldMcBlocksInfo(slice: Slice): OldMcBlocksInfo {
  	return {
  		kind: 'OldMcBlocksInfo'
  	};
  }
export function storeOldMcBlocksInfo(oldMcBlocksInfo: OldMcBlocksInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type Counters = {
  	kind: 'Counters';
	last_updated: number;
	total: number;
	cnt2048: number;
	cnt65536: number;
  };
export function loadCounters(slice: Slice): Counters {
  	let last_updated: number = slice.loadUint(32);
	let total: number = slice.loadUint(64);
	let cnt2048: number = slice.loadUint(64);
	let cnt65536: number = slice.loadUint(64);
	return {
  		kind: 'Counters',
		last_updated: last_updated,
		total: total,
		cnt2048: cnt2048,
		cnt65536: cnt65536
  	};
  }
export function storeCounters(counters: Counters): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(counters.last_updated, 32);
		builder.storeUint(counters.total, 64);
		builder.storeUint(counters.cnt2048, 64);
		builder.storeUint(counters.cnt65536, 64);
  	});
  }
export type CreatorStats = {
  	kind: 'CreatorStats';
	mc_blocks: Counters;
	shard_blocks: Counters;
  };
export function loadCreatorStats(slice: Slice): CreatorStats {
  	if ((slice.preloadUint(4) == 0x4)) {
  		slice.loadUint(4);
		let mc_blocks: Counters = loadCounters(slice);
		let shard_blocks: Counters = loadCounters(slice);
		return {
  			kind: 'CreatorStats',
			mc_blocks: mc_blocks,
			shard_blocks: shard_blocks
  		};
  	};
	throw new Error('');
  }
export function storeCreatorStats(creatorStats: CreatorStats): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x4, 4);
		storeCounters(creatorStats.mc_blocks)(builder);
		storeCounters(creatorStats.shard_blocks)(builder);
  	});
  }
export type BlockCreateStats = BlockCreateStats_block_create_stats | BlockCreateStats_block_create_stats_ext;
export type BlockCreateStats_block_create_stats = {
  	kind: 'BlockCreateStats_block_create_stats';
	counters: HashmapE<CreatorStats>;
  };
export type BlockCreateStats_block_create_stats_ext = {
  	kind: 'BlockCreateStats_block_create_stats_ext';
	counters: HashmapAugE<CreatorStats,number>;
  };
export function loadBlockCreateStats(slice: Slice): BlockCreateStats {
  	if ((slice.preloadUint(8) == 0x17)) {
  		slice.loadUint(8);
		let counters: HashmapE<CreatorStats> = loadHashmapE<CreatorStats>(slice, 256, loadCreatorStats);
		return {
  			kind: 'BlockCreateStats_block_create_stats',
			counters: counters
  		};
  	};
	if ((slice.preloadUint(8) == 0x34)) {
  		slice.loadUint(8);
		let counters: HashmapAugE<CreatorStats,number> = loadHashmapAugE<CreatorStats,number>(slice, 256, loadCreatorStats, ((slice: Slice) => {
  			return slice.loadUint(32);
  		}));
		return {
  			kind: 'BlockCreateStats_block_create_stats_ext',
			counters: counters
  		};
  	};
	throw new Error('');
  }
export function storeBlockCreateStats(blockCreateStats: BlockCreateStats): (builder: Builder) => void {
  	if ((blockCreateStats.kind == 'BlockCreateStats_block_create_stats')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x17, 8);
			storeHashmapE<CreatorStats>(blockCreateStats.counters, storeCreatorStats)(builder);
  		});
  	};
	if ((blockCreateStats.kind == 'BlockCreateStats_block_create_stats_ext')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x34, 8);
			storeHashmapAugE<CreatorStats,number>(blockCreateStats.counters, storeCreatorStats, ((arg: number) => {
  				return ((builder: Builder) => {
  					builder.storeUint(arg, 32);
  				});
  			}))(builder);
  		});
  	};
	throw new Error('');
  }
export type McStateExtra = {
  	kind: 'McStateExtra';
	shard_hashes: ShardHashes;
	config: ConfigParams;
	flags: number;
	validator_info: ValidatorInfo;
	prev_blocks: OldMcBlocksInfo;
	after_key_block: Bool;
	last_key_block: Maybe<ExtBlkRef>;
	block_create_stats: BlockCreateStats | undefined;
	global_balance: CurrencyCollection;
  };
export function loadMcStateExtra(slice: Slice): McStateExtra {
  	if ((slice.preloadUint(16) == 0xcc26)) {
  		slice.loadUint(16);
		let shard_hashes: ShardHashes = loadShardHashes(slice);
		let config: ConfigParams = loadConfigParams(slice);
		let slice1 = slice.loadRef().beginParse();
		let flags: number = slice1.loadUint(16);
		let validator_info: ValidatorInfo = loadValidatorInfo(slice1);
		let prev_blocks: OldMcBlocksInfo = loadOldMcBlocksInfo(slice1);
		let after_key_block: Bool = loadBool(slice1);
		let last_key_block: Maybe<ExtBlkRef> = loadMaybe<ExtBlkRef>(slice1, loadExtBlkRef);
		let block_create_stats: BlockCreateStats | undefined = ((flags & (1 << 0)) ? loadBlockCreateStats(slice1) : undefined);
		let global_balance: CurrencyCollection = loadCurrencyCollection(slice);
		return {
  			kind: 'McStateExtra',
			shard_hashes: shard_hashes,
			config: config,
			flags: flags,
			validator_info: validator_info,
			prev_blocks: prev_blocks,
			after_key_block: after_key_block,
			last_key_block: last_key_block,
			block_create_stats: block_create_stats,
			global_balance: global_balance
  		};
  	};
	throw new Error('');
  }
export function storeMcStateExtra(mcStateExtra: McStateExtra): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xcc26, 16);
		storeShardHashes(mcStateExtra.shard_hashes)(builder);
		storeConfigParams(mcStateExtra.config)(builder);
		let cell1 = beginCell();
		cell1.storeUint(mcStateExtra.flags, 16);
		storeValidatorInfo(mcStateExtra.validator_info)(cell1);
		storeOldMcBlocksInfo(mcStateExtra.prev_blocks)(cell1);
		storeBool(mcStateExtra.after_key_block)(cell1);
		storeMaybe<ExtBlkRef>(mcStateExtra.last_key_block, storeExtBlkRef)(cell1);
		if ((mcStateExtra.block_create_stats != undefined)) {
  			storeBlockCreateStats(mcStateExtra.block_create_stats)(cell1);
  		};
		builder.storeRef(cell1);
		storeCurrencyCollection(mcStateExtra.global_balance)(builder);
  	});
  }
export type SigPubKey = {
  	kind: 'SigPubKey';
	pubkey: BitString;
  };
export function loadSigPubKey(slice: Slice): SigPubKey {
  	if ((slice.preloadUint(32) == 0x8e81278a)) {
  		slice.loadUint(32);
		let pubkey: BitString = slice.loadBits(256);
		return {
  			kind: 'SigPubKey',
			pubkey: pubkey
  		};
  	};
	throw new Error('');
  }
export function storeSigPubKey(sigPubKey: SigPubKey): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x8e81278a, 32);
		builder.storeBits(sigPubKey.pubkey);
  	});
  }
export type CryptoSignatureSimple = {
  	kind: 'CryptoSignatureSimple';
	R: BitString;
	s: BitString;
  };
export function loadCryptoSignatureSimple(slice: Slice): CryptoSignatureSimple {
  	if ((slice.preloadUint(4) == 0x5)) {
  		slice.loadUint(4);
		let R: BitString = slice.loadBits(256);
		let s: BitString = slice.loadBits(256);
		return {
  			kind: 'CryptoSignatureSimple',
			R: R,
			s: s
  		};
  	};
	throw new Error('');
  }
export function storeCryptoSignatureSimple(cryptoSignatureSimple: CryptoSignatureSimple): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x5, 4);
		builder.storeBits(cryptoSignatureSimple.R);
		builder.storeBits(cryptoSignatureSimple.s);
  	});
  }
export type CryptoSignature = CryptoSignature__ | CryptoSignature_chained_signature;
export type CryptoSignature__ = {
  	kind: 'CryptoSignature__';
  };
export type CryptoSignature_chained_signature = {
  	kind: 'CryptoSignature_chained_signature';
	signed_cert: SignedCertificate;
	temp_key_signature: CryptoSignatureSimple;
  };
export function loadCryptoSignature(slice: Slice): CryptoSignature {
  	if (true) {
  		return {
  			kind: 'CryptoSignature__'
  		};
  	};
	if ((slice.preloadUint(4) == 0xf)) {
  		slice.loadUint(4);
		let slice1 = slice.loadRef().beginParse();
		let signed_cert: SignedCertificate = loadSignedCertificate(slice1);
		let temp_key_signature: CryptoSignatureSimple = loadCryptoSignatureSimple(slice);
		return {
  			kind: 'CryptoSignature_chained_signature',
			signed_cert: signed_cert,
			temp_key_signature: temp_key_signature
  		};
  	};
	throw new Error('');
  }
export function storeCryptoSignature(cryptoSignature: CryptoSignature): (builder: Builder) => void {
  	if ((cryptoSignature.kind == 'CryptoSignature__')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((cryptoSignature.kind == 'CryptoSignature_chained_signature')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xf, 4);
			let cell1 = beginCell();
			storeSignedCertificate(cryptoSignature.signed_cert)(cell1);
			builder.storeRef(cell1);
			storeCryptoSignatureSimple(cryptoSignature.temp_key_signature)(builder);
  		});
  	};
	throw new Error('');
  }
export type CryptoSignaturePair = {
  	kind: 'CryptoSignaturePair';
	node_id_short: BitString;
	sign: CryptoSignature;
  };
export function loadCryptoSignaturePair(slice: Slice): CryptoSignaturePair {
  	let node_id_short: BitString = slice.loadBits(256);
	let sign: CryptoSignature = loadCryptoSignature(slice);
	return {
  		kind: 'CryptoSignaturePair',
		node_id_short: node_id_short,
		sign: sign
  	};
  }
export function storeCryptoSignaturePair(cryptoSignaturePair: CryptoSignaturePair): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeBits(cryptoSignaturePair.node_id_short);
		storeCryptoSignature(cryptoSignaturePair.sign)(builder);
  	});
  }
export type Certificate = {
  	kind: 'Certificate';
	temp_key: SigPubKey;
	valid_since: number;
	valid_until: number;
  };
export function loadCertificate(slice: Slice): Certificate {
  	if ((slice.preloadUint(4) == 0x4)) {
  		slice.loadUint(4);
		let temp_key: SigPubKey = loadSigPubKey(slice);
		let valid_since: number = slice.loadUint(32);
		let valid_until: number = slice.loadUint(32);
		return {
  			kind: 'Certificate',
			temp_key: temp_key,
			valid_since: valid_since,
			valid_until: valid_until
  		};
  	};
	throw new Error('');
  }
export function storeCertificate(certificate: Certificate): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x4, 4);
		storeSigPubKey(certificate.temp_key)(builder);
		builder.storeUint(certificate.valid_since, 32);
		builder.storeUint(certificate.valid_until, 32);
  	});
  }
export type CertificateEnv = {
  	kind: 'CertificateEnv';
	certificate: Certificate;
  };
export function loadCertificateEnv(slice: Slice): CertificateEnv {
  	if ((slice.preloadUint(28) == 0xa419b7d)) {
  		slice.loadUint(28);
		let certificate: Certificate = loadCertificate(slice);
		return {
  			kind: 'CertificateEnv',
			certificate: certificate
  		};
  	};
	throw new Error('');
  }
export function storeCertificateEnv(certificateEnv: CertificateEnv): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xa419b7d, 28);
		storeCertificate(certificateEnv.certificate)(builder);
  	});
  }
export type SignedCertificate = {
  	kind: 'SignedCertificate';
	certificate: Certificate;
	certificate_signature: CryptoSignature;
  };
export function loadSignedCertificate(slice: Slice): SignedCertificate {
  	let certificate: Certificate = loadCertificate(slice);
	let certificate_signature: CryptoSignature = loadCryptoSignature(slice);
	return {
  		kind: 'SignedCertificate',
		certificate: certificate,
		certificate_signature: certificate_signature
  	};
  }
export function storeSignedCertificate(signedCertificate: SignedCertificate): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeCertificate(signedCertificate.certificate)(builder);
		storeCryptoSignature(signedCertificate.certificate_signature)(builder);
  	});
  }
export type McBlockExtra = {
  	kind: 'McBlockExtra';
	key_block: number;
	shard_hashes: ShardHashes;
	shard_fees: ShardFees;
	prev_blk_signatures: HashmapE<CryptoSignaturePair>;
	recover_create_msg: Maybe<InMsg>;
	mint_msg: Maybe<InMsg>;
	config: ConfigParams | undefined;
  };
export function loadMcBlockExtra(slice: Slice): McBlockExtra {
  	if ((slice.preloadUint(16) == 0xcca5)) {
  		slice.loadUint(16);
		let key_block: number = slice.loadUint(1);
		let shard_hashes: ShardHashes = loadShardHashes(slice);
		let shard_fees: ShardFees = loadShardFees(slice);
		let slice1 = slice.loadRef().beginParse();
		let prev_blk_signatures: HashmapE<CryptoSignaturePair> = loadHashmapE<CryptoSignaturePair>(slice1, 16, loadCryptoSignaturePair);
		let recover_create_msg: Maybe<InMsg> = loadMaybe<InMsg>(slice1, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadInMsg(slice1);
  		}));
		let mint_msg: Maybe<InMsg> = loadMaybe<InMsg>(slice1, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadInMsg(slice1);
  		}));
		let config: ConfigParams | undefined = (key_block ? loadConfigParams(slice) : undefined);
		return {
  			kind: 'McBlockExtra',
			key_block: key_block,
			shard_hashes: shard_hashes,
			shard_fees: shard_fees,
			prev_blk_signatures: prev_blk_signatures,
			recover_create_msg: recover_create_msg,
			mint_msg: mint_msg,
			config: config
  		};
  	};
	throw new Error('');
  }
export function storeMcBlockExtra(mcBlockExtra: McBlockExtra): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xcca5, 16);
		builder.storeUint(mcBlockExtra.key_block, 1);
		storeShardHashes(mcBlockExtra.shard_hashes)(builder);
		storeShardFees(mcBlockExtra.shard_fees)(builder);
		let cell1 = beginCell();
		storeHashmapE<CryptoSignaturePair>(mcBlockExtra.prev_blk_signatures, storeCryptoSignaturePair)(cell1);
		storeMaybe<InMsg>(mcBlockExtra.recover_create_msg, ((arg: InMsg) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeInMsg(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(cell1);
		storeMaybe<InMsg>(mcBlockExtra.mint_msg, ((arg: InMsg) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeInMsg(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(cell1);
		builder.storeRef(cell1);
		if ((mcBlockExtra.config != undefined)) {
  			storeConfigParams(mcBlockExtra.config)(builder);
  		};
  	});
  }
export type ValidatorDescr = ValidatorDescr_validator | ValidatorDescr_validator_addr;
export type ValidatorDescr_validator = {
  	kind: 'ValidatorDescr_validator';
	public_key: SigPubKey;
	weight: number;
  };
export type ValidatorDescr_validator_addr = {
  	kind: 'ValidatorDescr_validator_addr';
	public_key: SigPubKey;
	weight: number;
	adnl_addr: BitString;
  };
export function loadValidatorDescr(slice: Slice): ValidatorDescr {
  	if ((slice.preloadUint(8) == 0x53)) {
  		slice.loadUint(8);
		let public_key: SigPubKey = loadSigPubKey(slice);
		let weight: number = slice.loadUint(64);
		return {
  			kind: 'ValidatorDescr_validator',
			public_key: public_key,
			weight: weight
  		};
  	};
	if ((slice.preloadUint(8) == 0x73)) {
  		slice.loadUint(8);
		let public_key: SigPubKey = loadSigPubKey(slice);
		let weight: number = slice.loadUint(64);
		let adnl_addr: BitString = slice.loadBits(256);
		return {
  			kind: 'ValidatorDescr_validator_addr',
			public_key: public_key,
			weight: weight,
			adnl_addr: adnl_addr
  		};
  	};
	throw new Error('');
  }
export function storeValidatorDescr(validatorDescr: ValidatorDescr): (builder: Builder) => void {
  	if ((validatorDescr.kind == 'ValidatorDescr_validator')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x53, 8);
			storeSigPubKey(validatorDescr.public_key)(builder);
			builder.storeUint(validatorDescr.weight, 64);
  		});
  	};
	if ((validatorDescr.kind == 'ValidatorDescr_validator_addr')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x73, 8);
			storeSigPubKey(validatorDescr.public_key)(builder);
			builder.storeUint(validatorDescr.weight, 64);
			builder.storeBits(validatorDescr.adnl_addr);
  		});
  	};
	throw new Error('');
  }
export type ValidatorSet = ValidatorSet_validators | ValidatorSet_validators_ext;
export type ValidatorSet_validators = {
  	kind: 'ValidatorSet_validators';
	utime_since: number;
	utime_until: number;
	main: number;
	list: Hashmap<ValidatorDescr>;
  };
export type ValidatorSet_validators_ext = {
  	kind: 'ValidatorSet_validators_ext';
	utime_since: number;
	utime_until: number;
	total: number;
	main: number;
	total_weight: number;
	list: HashmapE<ValidatorDescr>;
  };
export function loadValidatorSet(slice: Slice): ValidatorSet {
  	if ((slice.preloadUint(8) == 0x11)) {
  		slice.loadUint(8);
		let utime_since: number = slice.loadUint(32);
		let utime_until: number = slice.loadUint(32);
		let main: number = slice.loadUint(16);
		let list: Hashmap<ValidatorDescr> = loadHashmap<ValidatorDescr>(slice, 16, loadValidatorDescr);
		if ((!(main <= total))) {
  			throw new Error('');
  		};
		if ((!(main >= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ValidatorSet_validators',
			utime_since: utime_since,
			utime_until: utime_until,
			main: main,
			list: list
  		};
  	};
	if ((slice.preloadUint(8) == 0x12)) {
  		slice.loadUint(8);
		let utime_since: number = slice.loadUint(32);
		let utime_until: number = slice.loadUint(32);
		let total: number = slice.loadUint(16);
		let main: number = slice.loadUint(16);
		let total_weight: number = slice.loadUint(64);
		let list: HashmapE<ValidatorDescr> = loadHashmapE<ValidatorDescr>(slice, 16, loadValidatorDescr);
		if ((!(main <= total))) {
  			throw new Error('');
  		};
		if ((!(main >= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ValidatorSet_validators_ext',
			utime_since: utime_since,
			utime_until: utime_until,
			total: total,
			main: main,
			total_weight: total_weight,
			list: list
  		};
  	};
	throw new Error('');
  }
export function storeValidatorSet(validatorSet: ValidatorSet): (builder: Builder) => void {
  	if ((validatorSet.kind == 'ValidatorSet_validators')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x11, 8);
			builder.storeUint(validatorSet.utime_since, 32);
			builder.storeUint(validatorSet.utime_until, 32);
			builder.storeUint(validatorSet.main, 16);
			storeHashmap<ValidatorDescr>(validatorSet.list, storeValidatorDescr)(builder);
			if ((!(validatorSet.main <= validatorSet.total))) {
  				throw new Error('');
  			};
			if ((!(validatorSet.main >= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	if ((validatorSet.kind == 'ValidatorSet_validators_ext')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x12, 8);
			builder.storeUint(validatorSet.utime_since, 32);
			builder.storeUint(validatorSet.utime_until, 32);
			builder.storeUint(validatorSet.total, 16);
			builder.storeUint(validatorSet.main, 16);
			builder.storeUint(validatorSet.total_weight, 64);
			storeHashmapE<ValidatorDescr>(validatorSet.list, storeValidatorDescr)(builder);
			if ((!(validatorSet.main <= validatorSet.total))) {
  				throw new Error('');
  			};
			if ((!(validatorSet.main >= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	throw new Error('');
  }
export type ConfigParam = ConfigParam__ | ConfigParam__1 | ConfigParam__2 | ConfigParam__3 | ConfigParam__4 | ConfigParam__5 | ConfigParam__6 | ConfigParam__7 | ConfigParam__8 | ConfigParam__9 | ConfigParam__10 | ConfigParam__11 | ConfigParam__12 | ConfigParam__13 | ConfigParam__14 | ConfigParam__15 | ConfigParam__16 | ConfigParam__17 | ConfigParam_config_mc_gas_prices | ConfigParam_config_gas_prices | ConfigParam_config_mc_block_limits | ConfigParam_config_block_limits | ConfigParam_config_mc_fwd_prices | ConfigParam_config_fwd_prices | ConfigParam__24 | ConfigParam__25 | ConfigParam__26 | ConfigParam__27 | ConfigParam__28 | ConfigParam__29 | ConfigParam__30 | ConfigParam__31 | ConfigParam__32 | ConfigParam__33 | ConfigParam__34 | ConfigParam__35 | ConfigParam__36 | ConfigParam__37;
export type ConfigParam__ = {
  	kind: 'ConfigParam__';
	config_addr: BitString;
  };
export type ConfigParam__1 = {
  	kind: 'ConfigParam__1';
	elector_addr: BitString;
  };
export type ConfigParam__2 = {
  	kind: 'ConfigParam__2';
	minter_addr: BitString;
  };
export type ConfigParam__3 = {
  	kind: 'ConfigParam__3';
	fee_collector_addr: BitString;
  };
export type ConfigParam__4 = {
  	kind: 'ConfigParam__4';
	dns_root_addr: BitString;
  };
export type ConfigParam__5 = {
  	kind: 'ConfigParam__5';
	mint_new_price: Grams;
	mint_add_price: Grams;
  };
export type ConfigParam__6 = {
  	kind: 'ConfigParam__6';
	to_mint: ExtraCurrencyCollection;
  };
export type ConfigParam__7 = {
  	kind: 'ConfigParam__7';
  };
export type ConfigParam__8 = {
  	kind: 'ConfigParam__8';
	mandatory_params: Hashmap<True>;
  };
export type ConfigParam__9 = {
  	kind: 'ConfigParam__9';
	critical_params: Hashmap<True>;
  };
export type ConfigParam__10 = {
  	kind: 'ConfigParam__10';
  };
export type ConfigParam__11 = {
  	kind: 'ConfigParam__11';
	workchains: HashmapE<WorkchainDescr>;
  };
export type ConfigParam__12 = {
  	kind: 'ConfigParam__12';
  };
export type ConfigParam__13 = {
  	kind: 'ConfigParam__13';
  };
export type ConfigParam__14 = {
  	kind: 'ConfigParam__14';
	validators_elected_for: number;
	elections_start_before: number;
	elections_end_before: number;
	stake_held_for: number;
  };
export type ConfigParam__15 = {
  	kind: 'ConfigParam__15';
	max_validators: number;
	max_main_validators: number;
	min_validators: number;
  };
export type ConfigParam__16 = {
  	kind: 'ConfigParam__16';
	min_stake: Grams;
	max_stake: Grams;
	min_total_stake: Grams;
	max_stake_factor: number;
  };
export type ConfigParam__17 = {
  	kind: 'ConfigParam__17';
  };
export type ConfigParam_config_mc_gas_prices = {
  	kind: 'ConfigParam_config_mc_gas_prices';
  };
export type ConfigParam_config_gas_prices = {
  	kind: 'ConfigParam_config_gas_prices';
  };
export type ConfigParam_config_mc_block_limits = {
  	kind: 'ConfigParam_config_mc_block_limits';
  };
export type ConfigParam_config_block_limits = {
  	kind: 'ConfigParam_config_block_limits';
  };
export type ConfigParam_config_mc_fwd_prices = {
  	kind: 'ConfigParam_config_mc_fwd_prices';
  };
export type ConfigParam_config_fwd_prices = {
  	kind: 'ConfigParam_config_fwd_prices';
  };
export type ConfigParam__24 = {
  	kind: 'ConfigParam__24';
  };
export type ConfigParam__25 = {
  	kind: 'ConfigParam__25';
  };
export type ConfigParam__26 = {
  	kind: 'ConfigParam__26';
	fundamental_smc_addr: HashmapE<True>;
  };
export type ConfigParam__27 = {
  	kind: 'ConfigParam__27';
	prev_validators: ValidatorSet;
  };
export type ConfigParam__28 = {
  	kind: 'ConfigParam__28';
	prev_temp_validators: ValidatorSet;
  };
export type ConfigParam__29 = {
  	kind: 'ConfigParam__29';
	cur_validators: ValidatorSet;
  };
export type ConfigParam__30 = {
  	kind: 'ConfigParam__30';
	cur_temp_validators: ValidatorSet;
  };
export type ConfigParam__31 = {
  	kind: 'ConfigParam__31';
	next_validators: ValidatorSet;
  };
export type ConfigParam__32 = {
  	kind: 'ConfigParam__32';
	next_temp_validators: ValidatorSet;
  };
export type ConfigParam__33 = {
  	kind: 'ConfigParam__33';
  };
export type ConfigParam__34 = {
  	kind: 'ConfigParam__34';
  };
export type ConfigParam__35 = {
  	kind: 'ConfigParam__35';
  };
export type ConfigParam__36 = {
  	kind: 'ConfigParam__36';
  };
export type ConfigParam__37 = {
  	kind: 'ConfigParam__37';
  };
export function loadConfigParam(slice: Slice, arg0: number): ConfigParam {
  	if ((arg0 == 0)) {
  		let config_addr: BitString = slice.loadBits(256);
		return {
  			kind: 'ConfigParam__',
			config_addr: config_addr
  		};
  	};
	if ((arg0 == 1)) {
  		let elector_addr: BitString = slice.loadBits(256);
		return {
  			kind: 'ConfigParam__1',
			elector_addr: elector_addr
  		};
  	};
	if ((arg0 == 2)) {
  		let minter_addr: BitString = slice.loadBits(256);
		return {
  			kind: 'ConfigParam__2',
			minter_addr: minter_addr
  		};
  	};
	if ((arg0 == 3)) {
  		let fee_collector_addr: BitString = slice.loadBits(256);
		return {
  			kind: 'ConfigParam__3',
			fee_collector_addr: fee_collector_addr
  		};
  	};
	if ((arg0 == 4)) {
  		let dns_root_addr: BitString = slice.loadBits(256);
		return {
  			kind: 'ConfigParam__4',
			dns_root_addr: dns_root_addr
  		};
  	};
	if ((arg0 == 6)) {
  		let mint_new_price: Grams = loadGrams(slice);
		let mint_add_price: Grams = loadGrams(slice);
		return {
  			kind: 'ConfigParam__5',
			mint_new_price: mint_new_price,
			mint_add_price: mint_add_price
  		};
  	};
	if ((arg0 == 7)) {
  		let to_mint: ExtraCurrencyCollection = loadExtraCurrencyCollection(slice);
		return {
  			kind: 'ConfigParam__6',
			to_mint: to_mint
  		};
  	};
	if ((arg0 == 8)) {
  		return {
  			kind: 'ConfigParam__7'
  		};
  	};
	if ((arg0 == 9)) {
  		let mandatory_params: Hashmap<True> = loadHashmap<True>(slice, 32, loadTrue);
		return {
  			kind: 'ConfigParam__8',
			mandatory_params: mandatory_params
  		};
  	};
	if ((arg0 == 10)) {
  		let critical_params: Hashmap<True> = loadHashmap<True>(slice, 32, loadTrue);
		return {
  			kind: 'ConfigParam__9',
			critical_params: critical_params
  		};
  	};
	if ((arg0 == 11)) {
  		return {
  			kind: 'ConfigParam__10'
  		};
  	};
	if ((arg0 == 12)) {
  		let workchains: HashmapE<WorkchainDescr> = loadHashmapE<WorkchainDescr>(slice, 32, loadWorkchainDescr);
		return {
  			kind: 'ConfigParam__11',
			workchains: workchains
  		};
  	};
	if ((arg0 == 13)) {
  		return {
  			kind: 'ConfigParam__12'
  		};
  	};
	if ((arg0 == 14)) {
  		return {
  			kind: 'ConfigParam__13'
  		};
  	};
	if ((arg0 == 15)) {
  		let validators_elected_for: number = slice.loadUint(32);
		let elections_start_before: number = slice.loadUint(32);
		let elections_end_before: number = slice.loadUint(32);
		let stake_held_for: number = slice.loadUint(32);
		return {
  			kind: 'ConfigParam__14',
			validators_elected_for: validators_elected_for,
			elections_start_before: elections_start_before,
			elections_end_before: elections_end_before,
			stake_held_for: stake_held_for
  		};
  	};
	if ((arg0 == 16)) {
  		let max_validators: number = slice.loadUint(16);
		let max_main_validators: number = slice.loadUint(16);
		let min_validators: number = slice.loadUint(16);
		if ((!(max_validators >= max_main_validators))) {
  			throw new Error('');
  		};
		if ((!(max_main_validators >= min_validators))) {
  			throw new Error('');
  		};
		if ((!(min_validators >= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ConfigParam__15',
			max_validators: max_validators,
			max_main_validators: max_main_validators,
			min_validators: min_validators
  		};
  	};
	if ((arg0 == 17)) {
  		let min_stake: Grams = loadGrams(slice);
		let max_stake: Grams = loadGrams(slice);
		let min_total_stake: Grams = loadGrams(slice);
		let max_stake_factor: number = slice.loadUint(32);
		return {
  			kind: 'ConfigParam__16',
			min_stake: min_stake,
			max_stake: max_stake,
			min_total_stake: min_total_stake,
			max_stake_factor: max_stake_factor
  		};
  	};
	if ((arg0 == 18)) {
  		return {
  			kind: 'ConfigParam__17'
  		};
  	};
	if ((arg0 == 20)) {
  		return {
  			kind: 'ConfigParam_config_mc_gas_prices'
  		};
  	};
	if ((arg0 == 21)) {
  		return {
  			kind: 'ConfigParam_config_gas_prices'
  		};
  	};
	if ((arg0 == 22)) {
  		return {
  			kind: 'ConfigParam_config_mc_block_limits'
  		};
  	};
	if ((arg0 == 23)) {
  		return {
  			kind: 'ConfigParam_config_block_limits'
  		};
  	};
	if ((arg0 == 24)) {
  		return {
  			kind: 'ConfigParam_config_mc_fwd_prices'
  		};
  	};
	if ((arg0 == 25)) {
  		return {
  			kind: 'ConfigParam_config_fwd_prices'
  		};
  	};
	if ((arg0 == 28)) {
  		return {
  			kind: 'ConfigParam__24'
  		};
  	};
	if ((arg0 == 29)) {
  		return {
  			kind: 'ConfigParam__25'
  		};
  	};
	if ((arg0 == 31)) {
  		let fundamental_smc_addr: HashmapE<True> = loadHashmapE<True>(slice, 256, loadTrue);
		return {
  			kind: 'ConfigParam__26',
			fundamental_smc_addr: fundamental_smc_addr
  		};
  	};
	if ((arg0 == 32)) {
  		let prev_validators: ValidatorSet = loadValidatorSet(slice);
		return {
  			kind: 'ConfigParam__27',
			prev_validators: prev_validators
  		};
  	};
	if ((arg0 == 33)) {
  		let prev_temp_validators: ValidatorSet = loadValidatorSet(slice);
		return {
  			kind: 'ConfigParam__28',
			prev_temp_validators: prev_temp_validators
  		};
  	};
	if ((arg0 == 34)) {
  		let cur_validators: ValidatorSet = loadValidatorSet(slice);
		return {
  			kind: 'ConfigParam__29',
			cur_validators: cur_validators
  		};
  	};
	if ((arg0 == 35)) {
  		let cur_temp_validators: ValidatorSet = loadValidatorSet(slice);
		return {
  			kind: 'ConfigParam__30',
			cur_temp_validators: cur_temp_validators
  		};
  	};
	if ((arg0 == 36)) {
  		let next_validators: ValidatorSet = loadValidatorSet(slice);
		return {
  			kind: 'ConfigParam__31',
			next_validators: next_validators
  		};
  	};
	if ((arg0 == 37)) {
  		let next_temp_validators: ValidatorSet = loadValidatorSet(slice);
		return {
  			kind: 'ConfigParam__32',
			next_temp_validators: next_temp_validators
  		};
  	};
	if ((arg0 == 39)) {
  		return {
  			kind: 'ConfigParam__33'
  		};
  	};
	if ((arg0 == 40)) {
  		return {
  			kind: 'ConfigParam__34'
  		};
  	};
	if ((arg0 == 71)) {
  		return {
  			kind: 'ConfigParam__35'
  		};
  	};
	if ((arg0 == 72)) {
  		return {
  			kind: 'ConfigParam__36'
  		};
  	};
	if ((arg0 == 73)) {
  		return {
  			kind: 'ConfigParam__37'
  		};
  	};
	throw new Error('');
  }
export function storeConfigParam(configParam: ConfigParam): (builder: Builder) => void {
  	if ((configParam.kind == 'ConfigParam__')) {
  		return ((builder: Builder) => {
  			builder.storeBits(configParam.config_addr);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__1')) {
  		return ((builder: Builder) => {
  			builder.storeBits(configParam.elector_addr);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__2')) {
  		return ((builder: Builder) => {
  			builder.storeBits(configParam.minter_addr);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__3')) {
  		return ((builder: Builder) => {
  			builder.storeBits(configParam.fee_collector_addr);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__4')) {
  		return ((builder: Builder) => {
  			builder.storeBits(configParam.dns_root_addr);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__5')) {
  		return ((builder: Builder) => {
  			storeGrams(configParam.mint_new_price)(builder);
			storeGrams(configParam.mint_add_price)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__6')) {
  		return ((builder: Builder) => {
  			storeExtraCurrencyCollection(configParam.to_mint)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__7')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__8')) {
  		return ((builder: Builder) => {
  			storeHashmap<True>(configParam.mandatory_params, storeTrue)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__9')) {
  		return ((builder: Builder) => {
  			storeHashmap<True>(configParam.critical_params, storeTrue)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__10')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__11')) {
  		return ((builder: Builder) => {
  			storeHashmapE<WorkchainDescr>(configParam.workchains, storeWorkchainDescr)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__12')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__13')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__14')) {
  		return ((builder: Builder) => {
  			builder.storeUint(configParam.validators_elected_for, 32);
			builder.storeUint(configParam.elections_start_before, 32);
			builder.storeUint(configParam.elections_end_before, 32);
			builder.storeUint(configParam.stake_held_for, 32);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__15')) {
  		return ((builder: Builder) => {
  			builder.storeUint(configParam.max_validators, 16);
			builder.storeUint(configParam.max_main_validators, 16);
			builder.storeUint(configParam.min_validators, 16);
			if ((!(configParam.max_validators >= configParam.max_main_validators))) {
  				throw new Error('');
  			};
			if ((!(configParam.max_main_validators >= configParam.min_validators))) {
  				throw new Error('');
  			};
			if ((!(configParam.min_validators >= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	if ((configParam.kind == 'ConfigParam__16')) {
  		return ((builder: Builder) => {
  			storeGrams(configParam.min_stake)(builder);
			storeGrams(configParam.max_stake)(builder);
			storeGrams(configParam.min_total_stake)(builder);
			builder.storeUint(configParam.max_stake_factor, 32);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__17')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam_config_mc_gas_prices')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam_config_gas_prices')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam_config_mc_block_limits')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam_config_block_limits')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam_config_mc_fwd_prices')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam_config_fwd_prices')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__24')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__25')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__26')) {
  		return ((builder: Builder) => {
  			storeHashmapE<True>(configParam.fundamental_smc_addr, storeTrue)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__27')) {
  		return ((builder: Builder) => {
  			storeValidatorSet(configParam.prev_validators)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__28')) {
  		return ((builder: Builder) => {
  			storeValidatorSet(configParam.prev_temp_validators)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__29')) {
  		return ((builder: Builder) => {
  			storeValidatorSet(configParam.cur_validators)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__30')) {
  		return ((builder: Builder) => {
  			storeValidatorSet(configParam.cur_temp_validators)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__31')) {
  		return ((builder: Builder) => {
  			storeValidatorSet(configParam.next_validators)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__32')) {
  		return ((builder: Builder) => {
  			storeValidatorSet(configParam.next_temp_validators)(builder);
  		});
  	};
	if ((configParam.kind == 'ConfigParam__33')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__34')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__35')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__36')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((configParam.kind == 'ConfigParam__37')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	throw new Error('');
  }
export type GlobalVersion = {
  	kind: 'GlobalVersion';
	version: number;
	capabilities: number;
  };
export function loadGlobalVersion(slice: Slice): GlobalVersion {
  	if ((slice.preloadUint(8) == 0xc4)) {
  		slice.loadUint(8);
		let version: number = slice.loadUint(32);
		let capabilities: number = slice.loadUint(64);
		return {
  			kind: 'GlobalVersion',
			version: version,
			capabilities: capabilities
  		};
  	};
	throw new Error('');
  }
export function storeGlobalVersion(globalVersion: GlobalVersion): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xc4, 8);
		builder.storeUint(globalVersion.version, 32);
		builder.storeUint(globalVersion.capabilities, 64);
  	});
  }
export type ConfigProposalSetup = {
  	kind: 'ConfigProposalSetup';
	min_tot_rounds: number;
	max_tot_rounds: number;
	min_wins: number;
	max_losses: number;
	min_store_sec: number;
	max_store_sec: number;
	bit_price: number;
	cell_price: number;
  };
export function loadConfigProposalSetup(slice: Slice): ConfigProposalSetup {
  	if ((slice.preloadUint(8) == 0x36)) {
  		slice.loadUint(8);
		let min_tot_rounds: number = slice.loadUint(8);
		let max_tot_rounds: number = slice.loadUint(8);
		let min_wins: number = slice.loadUint(8);
		let max_losses: number = slice.loadUint(8);
		let min_store_sec: number = slice.loadUint(32);
		let max_store_sec: number = slice.loadUint(32);
		let bit_price: number = slice.loadUint(32);
		let cell_price: number = slice.loadUint(32);
		return {
  			kind: 'ConfigProposalSetup',
			min_tot_rounds: min_tot_rounds,
			max_tot_rounds: max_tot_rounds,
			min_wins: min_wins,
			max_losses: max_losses,
			min_store_sec: min_store_sec,
			max_store_sec: max_store_sec,
			bit_price: bit_price,
			cell_price: cell_price
  		};
  	};
	throw new Error('');
  }
export function storeConfigProposalSetup(configProposalSetup: ConfigProposalSetup): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x36, 8);
		builder.storeUint(configProposalSetup.min_tot_rounds, 8);
		builder.storeUint(configProposalSetup.max_tot_rounds, 8);
		builder.storeUint(configProposalSetup.min_wins, 8);
		builder.storeUint(configProposalSetup.max_losses, 8);
		builder.storeUint(configProposalSetup.min_store_sec, 32);
		builder.storeUint(configProposalSetup.max_store_sec, 32);
		builder.storeUint(configProposalSetup.bit_price, 32);
		builder.storeUint(configProposalSetup.cell_price, 32);
  	});
  }
export type ConfigVotingSetup = {
  	kind: 'ConfigVotingSetup';
	normal_params: ConfigProposalSetup;
	critical_params: ConfigProposalSetup;
  };
export function loadConfigVotingSetup(slice: Slice): ConfigVotingSetup {
  	if ((slice.preloadUint(8) == 0x91)) {
  		slice.loadUint(8);
		let slice1 = slice.loadRef().beginParse();
		let normal_params: ConfigProposalSetup = loadConfigProposalSetup(slice1);
		let slice2 = slice.loadRef().beginParse();
		let critical_params: ConfigProposalSetup = loadConfigProposalSetup(slice2);
		return {
  			kind: 'ConfigVotingSetup',
			normal_params: normal_params,
			critical_params: critical_params
  		};
  	};
	throw new Error('');
  }
export function storeConfigVotingSetup(configVotingSetup: ConfigVotingSetup): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x91, 8);
		let cell1 = beginCell();
		storeConfigProposalSetup(configVotingSetup.normal_params)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeConfigProposalSetup(configVotingSetup.critical_params)(cell2);
		builder.storeRef(cell2);
  	});
  }
export type ConfigProposal = {
  	kind: 'ConfigProposal';
	param_id: number;
	param_value: Maybe<Slice>;
	if_hash_equal: Maybe<number>;
  };
export function loadConfigProposal(slice: Slice): ConfigProposal {
  	if ((slice.preloadUint(8) == 0xf3)) {
  		slice.loadUint(8);
		let param_id: number = slice.loadInt(32);
		let param_value: Maybe<Slice> = loadMaybe<Slice>(slice, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return slice1;
  		}));
		let if_hash_equal: Maybe<number> = loadMaybe<number>(slice, ((slice: Slice) => {
  			return slice.loadUint(256);
  		}));
		return {
  			kind: 'ConfigProposal',
			param_id: param_id,
			param_value: param_value,
			if_hash_equal: if_hash_equal
  		};
  	};
	throw new Error('');
  }
export function storeConfigProposal(configProposal: ConfigProposal): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xf3, 8);
		builder.storeInt(configProposal.param_id, 32);
		storeMaybe<Slice>(configProposal.param_value, ((arg: Slice) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				cell1.storeSlice(arg)
				builder.storeRef(cell1);
  			});
  		}))(builder);
		storeMaybe<number>(configProposal.if_hash_equal, ((arg: number) => {
  			return ((builder: Builder) => {
  				builder.storeUint(arg, 256);
  			});
  		}))(builder);
  	});
  }
export type ConfigProposalStatus = {
  	kind: 'ConfigProposalStatus';
	expires: number;
	proposal: ConfigProposal;
	is_critical: Bool;
	voters: HashmapE<True>;
	remaining_weight: number;
	validator_set_id: number;
	rounds_remaining: number;
	wins: number;
	losses: number;
  };
export function loadConfigProposalStatus(slice: Slice): ConfigProposalStatus {
  	if ((slice.preloadUint(8) == 0xce)) {
  		slice.loadUint(8);
		let expires: number = slice.loadUint(32);
		let slice1 = slice.loadRef().beginParse();
		let proposal: ConfigProposal = loadConfigProposal(slice1);
		let is_critical: Bool = loadBool(slice);
		let voters: HashmapE<True> = loadHashmapE<True>(slice, 16, loadTrue);
		let remaining_weight: number = slice.loadInt(64);
		let validator_set_id: number = slice.loadUint(256);
		let rounds_remaining: number = slice.loadUint(8);
		let wins: number = slice.loadUint(8);
		let losses: number = slice.loadUint(8);
		return {
  			kind: 'ConfigProposalStatus',
			expires: expires,
			proposal: proposal,
			is_critical: is_critical,
			voters: voters,
			remaining_weight: remaining_weight,
			validator_set_id: validator_set_id,
			rounds_remaining: rounds_remaining,
			wins: wins,
			losses: losses
  		};
  	};
	throw new Error('');
  }
export function storeConfigProposalStatus(configProposalStatus: ConfigProposalStatus): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xce, 8);
		builder.storeUint(configProposalStatus.expires, 32);
		let cell1 = beginCell();
		storeConfigProposal(configProposalStatus.proposal)(cell1);
		builder.storeRef(cell1);
		storeBool(configProposalStatus.is_critical)(builder);
		storeHashmapE<True>(configProposalStatus.voters, storeTrue)(builder);
		builder.storeInt(configProposalStatus.remaining_weight, 64);
		builder.storeUint(configProposalStatus.validator_set_id, 256);
		builder.storeUint(configProposalStatus.rounds_remaining, 8);
		builder.storeUint(configProposalStatus.wins, 8);
		builder.storeUint(configProposalStatus.losses, 8);
  	});
  }
export type WorkchainFormat = WorkchainFormat_wfmt_basic | WorkchainFormat_wfmt_ext;
export type WorkchainFormat_wfmt_basic = {
  	kind: 'WorkchainFormat_wfmt_basic';
	vm_version: number;
	vm_mode: number;
  };
export type WorkchainFormat_wfmt_ext = {
  	kind: 'WorkchainFormat_wfmt_ext';
	min_addr_len: number;
	max_addr_len: number;
	addr_len_step: number;
	workchain_type_id: number;
  };
export function loadWorkchainFormat(slice: Slice, arg0: number): WorkchainFormat {
  	if (((slice.preloadUint(4) == 0x1) && (arg0 == 1))) {
  		slice.loadUint(4);
		let vm_version: number = slice.loadInt(32);
		let vm_mode: number = slice.loadUint(64);
		return {
  			kind: 'WorkchainFormat_wfmt_basic',
			vm_version: vm_version,
			vm_mode: vm_mode
  		};
  	};
	if (((slice.preloadUint(4) == 0x0) && (arg0 == 0))) {
  		slice.loadUint(4);
		let min_addr_len: number = slice.loadUint(12);
		let max_addr_len: number = slice.loadUint(12);
		let addr_len_step: number = slice.loadUint(12);
		let workchain_type_id: number = slice.loadUint(32);
		if ((!(min_addr_len >= 64))) {
  			throw new Error('');
  		};
		if ((!(min_addr_len <= max_addr_len))) {
  			throw new Error('');
  		};
		if ((!(max_addr_len <= 1023))) {
  			throw new Error('');
  		};
		if ((!(addr_len_step <= 1023))) {
  			throw new Error('');
  		};
		if ((!(workchain_type_id >= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'WorkchainFormat_wfmt_ext',
			min_addr_len: min_addr_len,
			max_addr_len: max_addr_len,
			addr_len_step: addr_len_step,
			workchain_type_id: workchain_type_id
  		};
  	};
	throw new Error('');
  }
export function storeWorkchainFormat(workchainFormat: WorkchainFormat): (builder: Builder) => void {
  	if ((workchainFormat.kind == 'WorkchainFormat_wfmt_basic')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x1, 4);
			builder.storeInt(workchainFormat.vm_version, 32);
			builder.storeUint(workchainFormat.vm_mode, 64);
  		});
  	};
	if ((workchainFormat.kind == 'WorkchainFormat_wfmt_ext')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x0, 4);
			builder.storeUint(workchainFormat.min_addr_len, 12);
			builder.storeUint(workchainFormat.max_addr_len, 12);
			builder.storeUint(workchainFormat.addr_len_step, 12);
			builder.storeUint(workchainFormat.workchain_type_id, 32);
			if ((!(workchainFormat.min_addr_len >= 64))) {
  				throw new Error('');
  			};
			if ((!(workchainFormat.min_addr_len <= workchainFormat.max_addr_len))) {
  				throw new Error('');
  			};
			if ((!(workchainFormat.max_addr_len <= 1023))) {
  				throw new Error('');
  			};
			if ((!(workchainFormat.addr_len_step <= 1023))) {
  				throw new Error('');
  			};
			if ((!(workchainFormat.workchain_type_id >= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	throw new Error('');
  }
export type WorkchainDescr = {
  	kind: 'WorkchainDescr';
	enabled_since: number;
	actual_min_split: number;
	min_split: number;
	max_split: number;
	basic: number;
	active: Bool;
	accept_msgs: Bool;
	flags: number;
	zerostate_root_hash: BitString;
	zerostate_file_hash: BitString;
	version: number;
	format: WorkchainFormat;
  };
export function loadWorkchainDescr(slice: Slice): WorkchainDescr {
  	if ((slice.preloadUint(8) == 0xa6)) {
  		slice.loadUint(8);
		let enabled_since: number = slice.loadUint(32);
		let actual_min_split: number = slice.loadUint(8);
		let min_split: number = slice.loadUint(8);
		let max_split: number = slice.loadUint(8);
		let basic: number = slice.loadUint(1);
		let active: Bool = loadBool(slice);
		let accept_msgs: Bool = loadBool(slice);
		let flags: number = slice.loadUint(13);
		let zerostate_root_hash: BitString = slice.loadBits(256);
		let zerostate_file_hash: BitString = slice.loadBits(256);
		let version: number = slice.loadUint(32);
		let format: WorkchainFormat = loadWorkchainFormat(slice, basic);
		if ((!(actual_min_split <= min_split))) {
  			throw new Error('');
  		};
		if ((!(flags == 0))) {
  			throw new Error('');
  		};
		return {
  			kind: 'WorkchainDescr',
			enabled_since: enabled_since,
			actual_min_split: actual_min_split,
			min_split: min_split,
			max_split: max_split,
			basic: basic,
			active: active,
			accept_msgs: accept_msgs,
			flags: flags,
			zerostate_root_hash: zerostate_root_hash,
			zerostate_file_hash: zerostate_file_hash,
			version: version,
			format: format
  		};
  	};
	throw new Error('');
  }
export function storeWorkchainDescr(workchainDescr: WorkchainDescr): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xa6, 8);
		builder.storeUint(workchainDescr.enabled_since, 32);
		builder.storeUint(workchainDescr.actual_min_split, 8);
		builder.storeUint(workchainDescr.min_split, 8);
		builder.storeUint(workchainDescr.max_split, 8);
		builder.storeUint(workchainDescr.basic, 1);
		storeBool(workchainDescr.active)(builder);
		storeBool(workchainDescr.accept_msgs)(builder);
		builder.storeUint(workchainDescr.flags, 13);
		builder.storeBits(workchainDescr.zerostate_root_hash);
		builder.storeBits(workchainDescr.zerostate_file_hash);
		builder.storeUint(workchainDescr.version, 32);
		storeWorkchainFormat(workchainDescr.format)(builder);
		if ((!(workchainDescr.actual_min_split <= workchainDescr.min_split))) {
  			throw new Error('');
  		};
		if ((!(workchainDescr.flags == 0))) {
  			throw new Error('');
  		};
  	});
  }
export type ComplaintPricing = {
  	kind: 'ComplaintPricing';
	deposit: Grams;
	bit_price: Grams;
	cell_price: Grams;
  };
export function loadComplaintPricing(slice: Slice): ComplaintPricing {
  	if ((slice.preloadUint(8) == 0x1a)) {
  		slice.loadUint(8);
		let deposit: Grams = loadGrams(slice);
		let bit_price: Grams = loadGrams(slice);
		let cell_price: Grams = loadGrams(slice);
		return {
  			kind: 'ComplaintPricing',
			deposit: deposit,
			bit_price: bit_price,
			cell_price: cell_price
  		};
  	};
	throw new Error('');
  }
export function storeComplaintPricing(complaintPricing: ComplaintPricing): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x1a, 8);
		storeGrams(complaintPricing.deposit)(builder);
		storeGrams(complaintPricing.bit_price)(builder);
		storeGrams(complaintPricing.cell_price)(builder);
  	});
  }
export type BlockCreateFees = {
  	kind: 'BlockCreateFees';
	masterchain_block_fee: Grams;
	basechain_block_fee: Grams;
  };
export function loadBlockCreateFees(slice: Slice): BlockCreateFees {
  	if ((slice.preloadUint(8) == 0x6b)) {
  		slice.loadUint(8);
		let masterchain_block_fee: Grams = loadGrams(slice);
		let basechain_block_fee: Grams = loadGrams(slice);
		return {
  			kind: 'BlockCreateFees',
			masterchain_block_fee: masterchain_block_fee,
			basechain_block_fee: basechain_block_fee
  		};
  	};
	throw new Error('');
  }
export function storeBlockCreateFees(blockCreateFees: BlockCreateFees): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x6b, 8);
		storeGrams(blockCreateFees.masterchain_block_fee)(builder);
		storeGrams(blockCreateFees.basechain_block_fee)(builder);
  	});
  }
export type StoragePrices = {
  	kind: 'StoragePrices';
	utime_since: number;
	bit_price_ps: number;
	cell_price_ps: number;
	mc_bit_price_ps: number;
	mc_cell_price_ps: number;
  };
export function loadStoragePrices(slice: Slice): StoragePrices {
  	if ((slice.preloadUint(8) == 0xcc)) {
  		slice.loadUint(8);
		let utime_since: number = slice.loadUint(32);
		let bit_price_ps: number = slice.loadUint(64);
		let cell_price_ps: number = slice.loadUint(64);
		let mc_bit_price_ps: number = slice.loadUint(64);
		let mc_cell_price_ps: number = slice.loadUint(64);
		return {
  			kind: 'StoragePrices',
			utime_since: utime_since,
			bit_price_ps: bit_price_ps,
			cell_price_ps: cell_price_ps,
			mc_bit_price_ps: mc_bit_price_ps,
			mc_cell_price_ps: mc_cell_price_ps
  		};
  	};
	throw new Error('');
  }
export function storeStoragePrices(storagePrices: StoragePrices): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xcc, 8);
		builder.storeUint(storagePrices.utime_since, 32);
		builder.storeUint(storagePrices.bit_price_ps, 64);
		builder.storeUint(storagePrices.cell_price_ps, 64);
		builder.storeUint(storagePrices.mc_bit_price_ps, 64);
		builder.storeUint(storagePrices.mc_cell_price_ps, 64);
  	});
  }
export type GasLimitsPrices = GasLimitsPrices_gas_prices | GasLimitsPrices_gas_prices_ext | GasLimitsPrices_gas_flat_pfx;
export type GasLimitsPrices_gas_prices = {
  	kind: 'GasLimitsPrices_gas_prices';
	gas_price: number;
	gas_limit: number;
	gas_credit: number;
	block_gas_limit: number;
	freeze_due_limit: number;
	delete_due_limit: number;
  };
export type GasLimitsPrices_gas_prices_ext = {
  	kind: 'GasLimitsPrices_gas_prices_ext';
	gas_price: number;
	gas_limit: number;
	special_gas_limit: number;
	gas_credit: number;
	block_gas_limit: number;
	freeze_due_limit: number;
	delete_due_limit: number;
  };
export type GasLimitsPrices_gas_flat_pfx = {
  	kind: 'GasLimitsPrices_gas_flat_pfx';
	flat_gas_limit: number;
	flat_gas_price: number;
	other: GasLimitsPrices;
  };
export function loadGasLimitsPrices(slice: Slice): GasLimitsPrices {
  	if ((slice.preloadUint(8) == 0xdd)) {
  		slice.loadUint(8);
		let gas_price: number = slice.loadUint(64);
		let gas_limit: number = slice.loadUint(64);
		let gas_credit: number = slice.loadUint(64);
		let block_gas_limit: number = slice.loadUint(64);
		let freeze_due_limit: number = slice.loadUint(64);
		let delete_due_limit: number = slice.loadUint(64);
		return {
  			kind: 'GasLimitsPrices_gas_prices',
			gas_price: gas_price,
			gas_limit: gas_limit,
			gas_credit: gas_credit,
			block_gas_limit: block_gas_limit,
			freeze_due_limit: freeze_due_limit,
			delete_due_limit: delete_due_limit
  		};
  	};
	if ((slice.preloadUint(8) == 0xde)) {
  		slice.loadUint(8);
		let gas_price: number = slice.loadUint(64);
		let gas_limit: number = slice.loadUint(64);
		let special_gas_limit: number = slice.loadUint(64);
		let gas_credit: number = slice.loadUint(64);
		let block_gas_limit: number = slice.loadUint(64);
		let freeze_due_limit: number = slice.loadUint(64);
		let delete_due_limit: number = slice.loadUint(64);
		return {
  			kind: 'GasLimitsPrices_gas_prices_ext',
			gas_price: gas_price,
			gas_limit: gas_limit,
			special_gas_limit: special_gas_limit,
			gas_credit: gas_credit,
			block_gas_limit: block_gas_limit,
			freeze_due_limit: freeze_due_limit,
			delete_due_limit: delete_due_limit
  		};
  	};
	if ((slice.preloadUint(8) == 0xd1)) {
  		slice.loadUint(8);
		let flat_gas_limit: number = slice.loadUint(64);
		let flat_gas_price: number = slice.loadUint(64);
		let other: GasLimitsPrices = loadGasLimitsPrices(slice);
		return {
  			kind: 'GasLimitsPrices_gas_flat_pfx',
			flat_gas_limit: flat_gas_limit,
			flat_gas_price: flat_gas_price,
			other: other
  		};
  	};
	throw new Error('');
  }
export function storeGasLimitsPrices(gasLimitsPrices: GasLimitsPrices): (builder: Builder) => void {
  	if ((gasLimitsPrices.kind == 'GasLimitsPrices_gas_prices')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xdd, 8);
			builder.storeUint(gasLimitsPrices.gas_price, 64);
			builder.storeUint(gasLimitsPrices.gas_limit, 64);
			builder.storeUint(gasLimitsPrices.gas_credit, 64);
			builder.storeUint(gasLimitsPrices.block_gas_limit, 64);
			builder.storeUint(gasLimitsPrices.freeze_due_limit, 64);
			builder.storeUint(gasLimitsPrices.delete_due_limit, 64);
  		});
  	};
	if ((gasLimitsPrices.kind == 'GasLimitsPrices_gas_prices_ext')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xde, 8);
			builder.storeUint(gasLimitsPrices.gas_price, 64);
			builder.storeUint(gasLimitsPrices.gas_limit, 64);
			builder.storeUint(gasLimitsPrices.special_gas_limit, 64);
			builder.storeUint(gasLimitsPrices.gas_credit, 64);
			builder.storeUint(gasLimitsPrices.block_gas_limit, 64);
			builder.storeUint(gasLimitsPrices.freeze_due_limit, 64);
			builder.storeUint(gasLimitsPrices.delete_due_limit, 64);
  		});
  	};
	if ((gasLimitsPrices.kind == 'GasLimitsPrices_gas_flat_pfx')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xd1, 8);
			builder.storeUint(gasLimitsPrices.flat_gas_limit, 64);
			builder.storeUint(gasLimitsPrices.flat_gas_price, 64);
			storeGasLimitsPrices(gasLimitsPrices.other)(builder);
  		});
  	};
	throw new Error('');
  }
export type ParamLimits = {
  	kind: 'ParamLimits';
	underload: number;
	soft_limit: number;
	hard_limit: number;
  };
export function loadParamLimits(slice: Slice): ParamLimits {
  	if ((slice.preloadUint(8) == 0xc3)) {
  		slice.loadUint(8);
		let underload: number = slice.loadUint(32);
		let soft_limit: number = slice.loadUint(32);
		let hard_limit: number = slice.loadUint(32);
		if ((!(underload <= soft_limit))) {
  			throw new Error('');
  		};
		if ((!(soft_limit <= hard_limit))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ParamLimits',
			underload: underload,
			soft_limit: soft_limit,
			hard_limit: hard_limit
  		};
  	};
	throw new Error('');
  }
export function storeParamLimits(paramLimits: ParamLimits): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xc3, 8);
		builder.storeUint(paramLimits.underload, 32);
		builder.storeUint(paramLimits.soft_limit, 32);
		builder.storeUint(paramLimits.hard_limit, 32);
		if ((!(paramLimits.underload <= paramLimits.soft_limit))) {
  			throw new Error('');
  		};
		if ((!(paramLimits.soft_limit <= paramLimits.hard_limit))) {
  			throw new Error('');
  		};
  	});
  }
export type BlockLimits = {
  	kind: 'BlockLimits';
	bytes: ParamLimits;
	gas: ParamLimits;
	lt_delta: ParamLimits;
  };
export function loadBlockLimits(slice: Slice): BlockLimits {
  	if ((slice.preloadUint(8) == 0x5d)) {
  		slice.loadUint(8);
		let bytes: ParamLimits = loadParamLimits(slice);
		let gas: ParamLimits = loadParamLimits(slice);
		let lt_delta: ParamLimits = loadParamLimits(slice);
		return {
  			kind: 'BlockLimits',
			bytes: bytes,
			gas: gas,
			lt_delta: lt_delta
  		};
  	};
	throw new Error('');
  }
export function storeBlockLimits(blockLimits: BlockLimits): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x5d, 8);
		storeParamLimits(blockLimits.bytes)(builder);
		storeParamLimits(blockLimits.gas)(builder);
		storeParamLimits(blockLimits.lt_delta)(builder);
  	});
  }
export type MsgForwardPrices = {
  	kind: 'MsgForwardPrices';
	lump_price: number;
	bit_price: number;
	cell_price: number;
	ihr_price_factor: number;
	first_frac: number;
	next_frac: number;
  };
export function loadMsgForwardPrices(slice: Slice): MsgForwardPrices {
  	if ((slice.preloadUint(8) == 0xea)) {
  		slice.loadUint(8);
		let lump_price: number = slice.loadUint(64);
		let bit_price: number = slice.loadUint(64);
		let cell_price: number = slice.loadUint(64);
		let ihr_price_factor: number = slice.loadUint(32);
		let first_frac: number = slice.loadUint(16);
		let next_frac: number = slice.loadUint(16);
		return {
  			kind: 'MsgForwardPrices',
			lump_price: lump_price,
			bit_price: bit_price,
			cell_price: cell_price,
			ihr_price_factor: ihr_price_factor,
			first_frac: first_frac,
			next_frac: next_frac
  		};
  	};
	throw new Error('');
  }
export function storeMsgForwardPrices(msgForwardPrices: MsgForwardPrices): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xea, 8);
		builder.storeUint(msgForwardPrices.lump_price, 64);
		builder.storeUint(msgForwardPrices.bit_price, 64);
		builder.storeUint(msgForwardPrices.cell_price, 64);
		builder.storeUint(msgForwardPrices.ihr_price_factor, 32);
		builder.storeUint(msgForwardPrices.first_frac, 16);
		builder.storeUint(msgForwardPrices.next_frac, 16);
  	});
  }
export type CatchainConfig = CatchainConfig_catchain_config | CatchainConfig_catchain_config_new;
export type CatchainConfig_catchain_config = {
  	kind: 'CatchainConfig_catchain_config';
	mc_catchain_lifetime: number;
	shard_catchain_lifetime: number;
	shard_validators_lifetime: number;
	shard_validators_num: number;
  };
export type CatchainConfig_catchain_config_new = {
  	kind: 'CatchainConfig_catchain_config_new';
	flags: number;
	shuffle_mc_validators: Bool;
	mc_catchain_lifetime: number;
	shard_catchain_lifetime: number;
	shard_validators_lifetime: number;
	shard_validators_num: number;
  };
export function loadCatchainConfig(slice: Slice): CatchainConfig {
  	if ((slice.preloadUint(8) == 0xc1)) {
  		slice.loadUint(8);
		let mc_catchain_lifetime: number = slice.loadUint(32);
		let shard_catchain_lifetime: number = slice.loadUint(32);
		let shard_validators_lifetime: number = slice.loadUint(32);
		let shard_validators_num: number = slice.loadUint(32);
		return {
  			kind: 'CatchainConfig_catchain_config',
			mc_catchain_lifetime: mc_catchain_lifetime,
			shard_catchain_lifetime: shard_catchain_lifetime,
			shard_validators_lifetime: shard_validators_lifetime,
			shard_validators_num: shard_validators_num
  		};
  	};
	if ((slice.preloadUint(8) == 0xc2)) {
  		slice.loadUint(8);
		let flags: number = slice.loadUint(7);
		let shuffle_mc_validators: Bool = loadBool(slice);
		let mc_catchain_lifetime: number = slice.loadUint(32);
		let shard_catchain_lifetime: number = slice.loadUint(32);
		let shard_validators_lifetime: number = slice.loadUint(32);
		let shard_validators_num: number = slice.loadUint(32);
		if ((!(flags == 0))) {
  			throw new Error('');
  		};
		return {
  			kind: 'CatchainConfig_catchain_config_new',
			flags: flags,
			shuffle_mc_validators: shuffle_mc_validators,
			mc_catchain_lifetime: mc_catchain_lifetime,
			shard_catchain_lifetime: shard_catchain_lifetime,
			shard_validators_lifetime: shard_validators_lifetime,
			shard_validators_num: shard_validators_num
  		};
  	};
	throw new Error('');
  }
export function storeCatchainConfig(catchainConfig: CatchainConfig): (builder: Builder) => void {
  	if ((catchainConfig.kind == 'CatchainConfig_catchain_config')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xc1, 8);
			builder.storeUint(catchainConfig.mc_catchain_lifetime, 32);
			builder.storeUint(catchainConfig.shard_catchain_lifetime, 32);
			builder.storeUint(catchainConfig.shard_validators_lifetime, 32);
			builder.storeUint(catchainConfig.shard_validators_num, 32);
  		});
  	};
	if ((catchainConfig.kind == 'CatchainConfig_catchain_config_new')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xc2, 8);
			builder.storeUint(catchainConfig.flags, 7);
			storeBool(catchainConfig.shuffle_mc_validators)(builder);
			builder.storeUint(catchainConfig.mc_catchain_lifetime, 32);
			builder.storeUint(catchainConfig.shard_catchain_lifetime, 32);
			builder.storeUint(catchainConfig.shard_validators_lifetime, 32);
			builder.storeUint(catchainConfig.shard_validators_num, 32);
			if ((!(catchainConfig.flags == 0))) {
  				throw new Error('');
  			};
  		});
  	};
	throw new Error('');
  }
export type ConsensusConfig = ConsensusConfig_consensus_config | ConsensusConfig_consensus_config_new | ConsensusConfig_consensus_config_v3 | ConsensusConfig_consensus_config_v4;
export type ConsensusConfig_consensus_config = {
  	kind: 'ConsensusConfig_consensus_config';
	round_candidates: number;
	next_candidate_delay_ms: number;
	consensus_timeout_ms: number;
	fast_attempts: number;
	attempt_duration: number;
	catchain_max_deps: number;
	max_block_bytes: number;
	max_collated_bytes: number;
  };
export type ConsensusConfig_consensus_config_new = {
  	kind: 'ConsensusConfig_consensus_config_new';
	flags: number;
	new_catchain_ids: Bool;
	round_candidates: number;
	next_candidate_delay_ms: number;
	consensus_timeout_ms: number;
	fast_attempts: number;
	attempt_duration: number;
	catchain_max_deps: number;
	max_block_bytes: number;
	max_collated_bytes: number;
  };
export type ConsensusConfig_consensus_config_v3 = {
  	kind: 'ConsensusConfig_consensus_config_v3';
	flags: number;
	new_catchain_ids: Bool;
	round_candidates: number;
	next_candidate_delay_ms: number;
	consensus_timeout_ms: number;
	fast_attempts: number;
	attempt_duration: number;
	catchain_max_deps: number;
	max_block_bytes: number;
	max_collated_bytes: number;
	proto_version: number;
  };
export type ConsensusConfig_consensus_config_v4 = {
  	kind: 'ConsensusConfig_consensus_config_v4';
	flags: number;
	new_catchain_ids: Bool;
	round_candidates: number;
	next_candidate_delay_ms: number;
	consensus_timeout_ms: number;
	fast_attempts: number;
	attempt_duration: number;
	catchain_max_deps: number;
	max_block_bytes: number;
	max_collated_bytes: number;
	proto_version: number;
	catchain_max_blocks_coeff: number;
  };
export function loadConsensusConfig(slice: Slice): ConsensusConfig {
  	if ((slice.preloadUint(8) == 0xd6)) {
  		slice.loadUint(8);
		let round_candidates: number = slice.loadUint(32);
		let next_candidate_delay_ms: number = slice.loadUint(32);
		let consensus_timeout_ms: number = slice.loadUint(32);
		let fast_attempts: number = slice.loadUint(32);
		let attempt_duration: number = slice.loadUint(32);
		let catchain_max_deps: number = slice.loadUint(32);
		let max_block_bytes: number = slice.loadUint(32);
		let max_collated_bytes: number = slice.loadUint(32);
		if ((!(round_candidates >= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ConsensusConfig_consensus_config',
			round_candidates: round_candidates,
			next_candidate_delay_ms: next_candidate_delay_ms,
			consensus_timeout_ms: consensus_timeout_ms,
			fast_attempts: fast_attempts,
			attempt_duration: attempt_duration,
			catchain_max_deps: catchain_max_deps,
			max_block_bytes: max_block_bytes,
			max_collated_bytes: max_collated_bytes
  		};
  	};
	if ((slice.preloadUint(8) == 0xd7)) {
  		slice.loadUint(8);
		let flags: number = slice.loadUint(7);
		let new_catchain_ids: Bool = loadBool(slice);
		let round_candidates: number = slice.loadUint(8);
		let next_candidate_delay_ms: number = slice.loadUint(32);
		let consensus_timeout_ms: number = slice.loadUint(32);
		let fast_attempts: number = slice.loadUint(32);
		let attempt_duration: number = slice.loadUint(32);
		let catchain_max_deps: number = slice.loadUint(32);
		let max_block_bytes: number = slice.loadUint(32);
		let max_collated_bytes: number = slice.loadUint(32);
		if ((!(flags == 0))) {
  			throw new Error('');
  		};
		if ((!(round_candidates >= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ConsensusConfig_consensus_config_new',
			flags: flags,
			new_catchain_ids: new_catchain_ids,
			round_candidates: round_candidates,
			next_candidate_delay_ms: next_candidate_delay_ms,
			consensus_timeout_ms: consensus_timeout_ms,
			fast_attempts: fast_attempts,
			attempt_duration: attempt_duration,
			catchain_max_deps: catchain_max_deps,
			max_block_bytes: max_block_bytes,
			max_collated_bytes: max_collated_bytes
  		};
  	};
	if ((slice.preloadUint(8) == 0xd8)) {
  		slice.loadUint(8);
		let flags: number = slice.loadUint(7);
		let new_catchain_ids: Bool = loadBool(slice);
		let round_candidates: number = slice.loadUint(8);
		let next_candidate_delay_ms: number = slice.loadUint(32);
		let consensus_timeout_ms: number = slice.loadUint(32);
		let fast_attempts: number = slice.loadUint(32);
		let attempt_duration: number = slice.loadUint(32);
		let catchain_max_deps: number = slice.loadUint(32);
		let max_block_bytes: number = slice.loadUint(32);
		let max_collated_bytes: number = slice.loadUint(32);
		let proto_version: number = slice.loadUint(16);
		if ((!(flags == 0))) {
  			throw new Error('');
  		};
		if ((!(round_candidates >= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ConsensusConfig_consensus_config_v3',
			flags: flags,
			new_catchain_ids: new_catchain_ids,
			round_candidates: round_candidates,
			next_candidate_delay_ms: next_candidate_delay_ms,
			consensus_timeout_ms: consensus_timeout_ms,
			fast_attempts: fast_attempts,
			attempt_duration: attempt_duration,
			catchain_max_deps: catchain_max_deps,
			max_block_bytes: max_block_bytes,
			max_collated_bytes: max_collated_bytes,
			proto_version: proto_version
  		};
  	};
	if ((slice.preloadUint(8) == 0xd9)) {
  		slice.loadUint(8);
		let flags: number = slice.loadUint(7);
		let new_catchain_ids: Bool = loadBool(slice);
		let round_candidates: number = slice.loadUint(8);
		let next_candidate_delay_ms: number = slice.loadUint(32);
		let consensus_timeout_ms: number = slice.loadUint(32);
		let fast_attempts: number = slice.loadUint(32);
		let attempt_duration: number = slice.loadUint(32);
		let catchain_max_deps: number = slice.loadUint(32);
		let max_block_bytes: number = slice.loadUint(32);
		let max_collated_bytes: number = slice.loadUint(32);
		let proto_version: number = slice.loadUint(16);
		let catchain_max_blocks_coeff: number = slice.loadUint(32);
		if ((!(flags == 0))) {
  			throw new Error('');
  		};
		if ((!(round_candidates >= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'ConsensusConfig_consensus_config_v4',
			flags: flags,
			new_catchain_ids: new_catchain_ids,
			round_candidates: round_candidates,
			next_candidate_delay_ms: next_candidate_delay_ms,
			consensus_timeout_ms: consensus_timeout_ms,
			fast_attempts: fast_attempts,
			attempt_duration: attempt_duration,
			catchain_max_deps: catchain_max_deps,
			max_block_bytes: max_block_bytes,
			max_collated_bytes: max_collated_bytes,
			proto_version: proto_version,
			catchain_max_blocks_coeff: catchain_max_blocks_coeff
  		};
  	};
	throw new Error('');
  }
export function storeConsensusConfig(consensusConfig: ConsensusConfig): (builder: Builder) => void {
  	if ((consensusConfig.kind == 'ConsensusConfig_consensus_config')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xd6, 8);
			builder.storeUint(consensusConfig.round_candidates, 32);
			builder.storeUint(consensusConfig.next_candidate_delay_ms, 32);
			builder.storeUint(consensusConfig.consensus_timeout_ms, 32);
			builder.storeUint(consensusConfig.fast_attempts, 32);
			builder.storeUint(consensusConfig.attempt_duration, 32);
			builder.storeUint(consensusConfig.catchain_max_deps, 32);
			builder.storeUint(consensusConfig.max_block_bytes, 32);
			builder.storeUint(consensusConfig.max_collated_bytes, 32);
			if ((!(consensusConfig.round_candidates >= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	if ((consensusConfig.kind == 'ConsensusConfig_consensus_config_new')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xd7, 8);
			builder.storeUint(consensusConfig.flags, 7);
			storeBool(consensusConfig.new_catchain_ids)(builder);
			builder.storeUint(consensusConfig.round_candidates, 8);
			builder.storeUint(consensusConfig.next_candidate_delay_ms, 32);
			builder.storeUint(consensusConfig.consensus_timeout_ms, 32);
			builder.storeUint(consensusConfig.fast_attempts, 32);
			builder.storeUint(consensusConfig.attempt_duration, 32);
			builder.storeUint(consensusConfig.catchain_max_deps, 32);
			builder.storeUint(consensusConfig.max_block_bytes, 32);
			builder.storeUint(consensusConfig.max_collated_bytes, 32);
			if ((!(consensusConfig.flags == 0))) {
  				throw new Error('');
  			};
			if ((!(consensusConfig.round_candidates >= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	if ((consensusConfig.kind == 'ConsensusConfig_consensus_config_v3')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xd8, 8);
			builder.storeUint(consensusConfig.flags, 7);
			storeBool(consensusConfig.new_catchain_ids)(builder);
			builder.storeUint(consensusConfig.round_candidates, 8);
			builder.storeUint(consensusConfig.next_candidate_delay_ms, 32);
			builder.storeUint(consensusConfig.consensus_timeout_ms, 32);
			builder.storeUint(consensusConfig.fast_attempts, 32);
			builder.storeUint(consensusConfig.attempt_duration, 32);
			builder.storeUint(consensusConfig.catchain_max_deps, 32);
			builder.storeUint(consensusConfig.max_block_bytes, 32);
			builder.storeUint(consensusConfig.max_collated_bytes, 32);
			builder.storeUint(consensusConfig.proto_version, 16);
			if ((!(consensusConfig.flags == 0))) {
  				throw new Error('');
  			};
			if ((!(consensusConfig.round_candidates >= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	if ((consensusConfig.kind == 'ConsensusConfig_consensus_config_v4')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xd9, 8);
			builder.storeUint(consensusConfig.flags, 7);
			storeBool(consensusConfig.new_catchain_ids)(builder);
			builder.storeUint(consensusConfig.round_candidates, 8);
			builder.storeUint(consensusConfig.next_candidate_delay_ms, 32);
			builder.storeUint(consensusConfig.consensus_timeout_ms, 32);
			builder.storeUint(consensusConfig.fast_attempts, 32);
			builder.storeUint(consensusConfig.attempt_duration, 32);
			builder.storeUint(consensusConfig.catchain_max_deps, 32);
			builder.storeUint(consensusConfig.max_block_bytes, 32);
			builder.storeUint(consensusConfig.max_collated_bytes, 32);
			builder.storeUint(consensusConfig.proto_version, 16);
			builder.storeUint(consensusConfig.catchain_max_blocks_coeff, 32);
			if ((!(consensusConfig.flags == 0))) {
  				throw new Error('');
  			};
			if ((!(consensusConfig.round_candidates >= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	throw new Error('');
  }
export type ValidatorTempKey = {
  	kind: 'ValidatorTempKey';
	adnl_addr: BitString;
	temp_public_key: SigPubKey;
	seqno: number;
	valid_until: number;
  };
export function loadValidatorTempKey(slice: Slice): ValidatorTempKey {
  	if ((slice.preloadUint(4) == 0x3)) {
  		slice.loadUint(4);
		let adnl_addr: BitString = slice.loadBits(256);
		let temp_public_key: SigPubKey = loadSigPubKey(slice);
		let seqno: number = slice.loadUint(32);
		let valid_until: number = slice.loadUint(32);
		return {
  			kind: 'ValidatorTempKey',
			adnl_addr: adnl_addr,
			temp_public_key: temp_public_key,
			seqno: seqno,
			valid_until: valid_until
  		};
  	};
	throw new Error('');
  }
export function storeValidatorTempKey(validatorTempKey: ValidatorTempKey): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x3, 4);
		builder.storeBits(validatorTempKey.adnl_addr);
		storeSigPubKey(validatorTempKey.temp_public_key)(builder);
		builder.storeUint(validatorTempKey.seqno, 32);
		builder.storeUint(validatorTempKey.valid_until, 32);
  	});
  }
export type ValidatorSignedTempKey = {
  	kind: 'ValidatorSignedTempKey';
	key: ValidatorTempKey;
	signature: CryptoSignature;
  };
export function loadValidatorSignedTempKey(slice: Slice): ValidatorSignedTempKey {
  	if ((slice.preloadUint(4) == 0x4)) {
  		slice.loadUint(4);
		let slice1 = slice.loadRef().beginParse();
		let key: ValidatorTempKey = loadValidatorTempKey(slice1);
		let signature: CryptoSignature = loadCryptoSignature(slice);
		return {
  			kind: 'ValidatorSignedTempKey',
			key: key,
			signature: signature
  		};
  	};
	throw new Error('');
  }
export function storeValidatorSignedTempKey(validatorSignedTempKey: ValidatorSignedTempKey): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x4, 4);
		let cell1 = beginCell();
		storeValidatorTempKey(validatorSignedTempKey.key)(cell1);
		builder.storeRef(cell1);
		storeCryptoSignature(validatorSignedTempKey.signature)(builder);
  	});
  }
export type MisbehaviourPunishmentConfig = {
  	kind: 'MisbehaviourPunishmentConfig';
	default_flat_fine: Grams;
	default_proportional_fine: number;
	severity_flat_mult: number;
	severity_proportional_mult: number;
	unpunishable_interval: number;
	long_interval: number;
	long_flat_mult: number;
	long_proportional_mult: number;
	medium_interval: number;
	medium_flat_mult: number;
	medium_proportional_mult: number;
  };
export function loadMisbehaviourPunishmentConfig(slice: Slice): MisbehaviourPunishmentConfig {
  	if ((slice.preloadUint(8) == 0x01)) {
  		slice.loadUint(8);
		let default_flat_fine: Grams = loadGrams(slice);
		let default_proportional_fine: number = slice.loadUint(32);
		let severity_flat_mult: number = slice.loadUint(16);
		let severity_proportional_mult: number = slice.loadUint(16);
		let unpunishable_interval: number = slice.loadUint(16);
		let long_interval: number = slice.loadUint(16);
		let long_flat_mult: number = slice.loadUint(16);
		let long_proportional_mult: number = slice.loadUint(16);
		let medium_interval: number = slice.loadUint(16);
		let medium_flat_mult: number = slice.loadUint(16);
		let medium_proportional_mult: number = slice.loadUint(16);
		return {
  			kind: 'MisbehaviourPunishmentConfig',
			default_flat_fine: default_flat_fine,
			default_proportional_fine: default_proportional_fine,
			severity_flat_mult: severity_flat_mult,
			severity_proportional_mult: severity_proportional_mult,
			unpunishable_interval: unpunishable_interval,
			long_interval: long_interval,
			long_flat_mult: long_flat_mult,
			long_proportional_mult: long_proportional_mult,
			medium_interval: medium_interval,
			medium_flat_mult: medium_flat_mult,
			medium_proportional_mult: medium_proportional_mult
  		};
  	};
	throw new Error('');
  }
export function storeMisbehaviourPunishmentConfig(misbehaviourPunishmentConfig: MisbehaviourPunishmentConfig): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x01, 8);
		storeGrams(misbehaviourPunishmentConfig.default_flat_fine)(builder);
		builder.storeUint(misbehaviourPunishmentConfig.default_proportional_fine, 32);
		builder.storeUint(misbehaviourPunishmentConfig.severity_flat_mult, 16);
		builder.storeUint(misbehaviourPunishmentConfig.severity_proportional_mult, 16);
		builder.storeUint(misbehaviourPunishmentConfig.unpunishable_interval, 16);
		builder.storeUint(misbehaviourPunishmentConfig.long_interval, 16);
		builder.storeUint(misbehaviourPunishmentConfig.long_flat_mult, 16);
		builder.storeUint(misbehaviourPunishmentConfig.long_proportional_mult, 16);
		builder.storeUint(misbehaviourPunishmentConfig.medium_interval, 16);
		builder.storeUint(misbehaviourPunishmentConfig.medium_flat_mult, 16);
		builder.storeUint(misbehaviourPunishmentConfig.medium_proportional_mult, 16);
  	});
  }
export type OracleBridgeParams = {
  	kind: 'OracleBridgeParams';
	bridge_address: BitString;
	oracle_mutlisig_address: BitString;
	oracles: HashmapE<number>;
	external_chain_address: BitString;
  };
export function loadOracleBridgeParams(slice: Slice): OracleBridgeParams {
  	let bridge_address: BitString = slice.loadBits(256);
	let oracle_mutlisig_address: BitString = slice.loadBits(256);
	let oracles: HashmapE<number> = loadHashmapE<number>(slice, 256, ((slice: Slice) => {
  		return slice.loadUint(256);
  	}));
	let external_chain_address: BitString = slice.loadBits(256);
	return {
  		kind: 'OracleBridgeParams',
		bridge_address: bridge_address,
		oracle_mutlisig_address: oracle_mutlisig_address,
		oracles: oracles,
		external_chain_address: external_chain_address
  	};
  }
export function storeOracleBridgeParams(oracleBridgeParams: OracleBridgeParams): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeBits(oracleBridgeParams.bridge_address);
		builder.storeBits(oracleBridgeParams.oracle_mutlisig_address);
		storeHashmapE<number>(oracleBridgeParams.oracles, ((arg: number) => {
  			return ((builder: Builder) => {
  				builder.storeUint(arg, 256);
  			});
  		}))(builder);
		builder.storeBits(oracleBridgeParams.external_chain_address);
  	});
  }
export type BlockSignaturesPure = {
  	kind: 'BlockSignaturesPure';
	sig_count: number;
	sig_weight: number;
	signatures: HashmapE<CryptoSignaturePair>;
  };
export function loadBlockSignaturesPure(slice: Slice): BlockSignaturesPure {
  	let sig_count: number = slice.loadUint(32);
	let sig_weight: number = slice.loadUint(64);
	let signatures: HashmapE<CryptoSignaturePair> = loadHashmapE<CryptoSignaturePair>(slice, 16, loadCryptoSignaturePair);
	return {
  		kind: 'BlockSignaturesPure',
		sig_count: sig_count,
		sig_weight: sig_weight,
		signatures: signatures
  	};
  }
export function storeBlockSignaturesPure(blockSignaturesPure: BlockSignaturesPure): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(blockSignaturesPure.sig_count, 32);
		builder.storeUint(blockSignaturesPure.sig_weight, 64);
		storeHashmapE<CryptoSignaturePair>(blockSignaturesPure.signatures, storeCryptoSignaturePair)(builder);
  	});
  }
export type BlockSignatures = {
  	kind: 'BlockSignatures';
	validator_info: ValidatorBaseInfo;
	pure_signatures: BlockSignaturesPure;
  };
export function loadBlockSignatures(slice: Slice): BlockSignatures {
  	if ((slice.preloadUint(8) == 0x11)) {
  		slice.loadUint(8);
		let validator_info: ValidatorBaseInfo = loadValidatorBaseInfo(slice);
		let pure_signatures: BlockSignaturesPure = loadBlockSignaturesPure(slice);
		return {
  			kind: 'BlockSignatures',
			validator_info: validator_info,
			pure_signatures: pure_signatures
  		};
  	};
	throw new Error('');
  }
export function storeBlockSignatures(blockSignatures: BlockSignatures): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x11, 8);
		storeValidatorBaseInfo(blockSignatures.validator_info)(builder);
		storeBlockSignaturesPure(blockSignatures.pure_signatures)(builder);
  	});
  }
export type BlockProof = {
  	kind: 'BlockProof';
	proof_for: BlockIdExt;
	root: Slice;
	signatures: Maybe<BlockSignatures>;
  };
export function loadBlockProof(slice: Slice): BlockProof {
  	if ((slice.preloadUint(8) == 0xc3)) {
  		slice.loadUint(8);
		let proof_for: BlockIdExt = loadBlockIdExt(slice);
		let slice1 = slice.loadRef().beginParse();
		let root: Slice = slice1;
		let signatures: Maybe<BlockSignatures> = loadMaybe<BlockSignatures>(slice, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadBlockSignatures(slice1);
  		}));
		return {
  			kind: 'BlockProof',
			proof_for: proof_for,
			root: root,
			signatures: signatures
  		};
  	};
	throw new Error('');
  }
export function storeBlockProof(blockProof: BlockProof): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xc3, 8);
		storeBlockIdExt(blockProof.proof_for)(builder);
		let cell1 = beginCell();
		cell1.storeSlice(blockProof.root);
		builder.storeRef(cell1);
		storeMaybe<BlockSignatures>(blockProof.signatures, ((arg: BlockSignatures) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeBlockSignatures(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(builder);
  	});
  }
export type ProofChain = ProofChain_chain_empty | ProofChain_chain_link;
export type ProofChain_chain_empty = {
  	kind: 'ProofChain_chain_empty';
  };
export type ProofChain_chain_link = {
  	kind: 'ProofChain_chain_link';
	n: number;
	root: Slice;
	prev: ProofChain | undefined;
  };
export function loadProofChain(slice: Slice, arg0: number): ProofChain {
  	if ((arg0 == 0)) {
  		return {
  			kind: 'ProofChain_chain_empty'
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let root: Slice = slice1;
		let prev: ProofChain | undefined = ((arg0 - 1) ? ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadProofChain(slice1, (arg0 - 1));
  		})(slice) : undefined);
		return {
  			kind: 'ProofChain_chain_link',
			n: (arg0 - 1),
			root: root,
			prev: prev
  		};
  	};
	throw new Error('');
  }
export function storeProofChain(proofChain: ProofChain): (builder: Builder) => void {
  	if ((proofChain.kind == 'ProofChain_chain_empty')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((proofChain.kind == 'ProofChain_chain_link')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			cell1.storeSlice(proofChain.root);
			builder.storeRef(cell1);
			if ((proofChain.prev != undefined)) {
  				let cell1 = beginCell()
				storeProofChain(arg)(cell1)
				builder.storeRef(cell1);
  			};
  		});
  	};
	throw new Error('');
  }
export type TopBlockDescr = {
  	kind: 'TopBlockDescr';
	proof_for: BlockIdExt;
	signatures: Maybe<BlockSignatures>;
	len: number;
	chain: ProofChain;
  };
export function loadTopBlockDescr(slice: Slice): TopBlockDescr {
  	if ((slice.preloadUint(8) == 0xd5)) {
  		slice.loadUint(8);
		let proof_for: BlockIdExt = loadBlockIdExt(slice);
		let signatures: Maybe<BlockSignatures> = loadMaybe<BlockSignatures>(slice, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadBlockSignatures(slice1);
  		}));
		let len: number = slice.loadUint(8);
		let chain: ProofChain = loadProofChain(slice, len);
		if ((!(len >= 1))) {
  			throw new Error('');
  		};
		if ((!(len <= 8))) {
  			throw new Error('');
  		};
		return {
  			kind: 'TopBlockDescr',
			proof_for: proof_for,
			signatures: signatures,
			len: len,
			chain: chain
  		};
  	};
	throw new Error('');
  }
export function storeTopBlockDescr(topBlockDescr: TopBlockDescr): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xd5, 8);
		storeBlockIdExt(topBlockDescr.proof_for)(builder);
		storeMaybe<BlockSignatures>(topBlockDescr.signatures, ((arg: BlockSignatures) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeBlockSignatures(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(builder);
		builder.storeUint(topBlockDescr.len, 8);
		storeProofChain(topBlockDescr.chain)(builder);
		if ((!(topBlockDescr.len >= 1))) {
  			throw new Error('');
  		};
		if ((!(topBlockDescr.len <= 8))) {
  			throw new Error('');
  		};
  	});
  }
export type TopBlockDescrSet = {
  	kind: 'TopBlockDescrSet';
	collection: HashmapE<TopBlockDescr>;
  };
export function loadTopBlockDescrSet(slice: Slice): TopBlockDescrSet {
  	if ((slice.preloadUint(32) == 0x4ac789f3)) {
  		slice.loadUint(32);
		let collection: HashmapE<TopBlockDescr> = loadHashmapE<TopBlockDescr>(slice, 96, ((slice: Slice) => {
  			let slice1 = slice.loadRef().beginParse();
			return loadTopBlockDescr(slice1);
  		}));
		return {
  			kind: 'TopBlockDescrSet',
			collection: collection
  		};
  	};
	throw new Error('');
  }
export function storeTopBlockDescrSet(topBlockDescrSet: TopBlockDescrSet): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x4ac789f3, 32);
		storeHashmapE<TopBlockDescr>(topBlockDescrSet.collection, ((arg: TopBlockDescr) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				storeTopBlockDescr(arg)(cell1)
				builder.storeRef(cell1);
  			});
  		}))(builder);
  	});
  }
export type ProducerInfo = {
  	kind: 'ProducerInfo';
	utime: number;
	mc_blk_ref: ExtBlkRef;
	state_proof: MERKLE_PROOF<Block>;
	prod_proof: MERKLE_PROOF<ShardState>;
  };
export function loadProducerInfo(slice: Slice): ProducerInfo {
  	if ((slice.preloadUint(8) == 0x34)) {
  		slice.loadUint(8);
		let utime: number = slice.loadUint(32);
		let mc_blk_ref: ExtBlkRef = loadExtBlkRef(slice);
		let slice1 = slice.loadRef().beginParse();
		let state_proof: MERKLE_PROOF<Block> = loadMERKLE_PROOF<Block>(slice1, loadBlock);
		let slice2 = slice.loadRef().beginParse();
		let prod_proof: MERKLE_PROOF<ShardState> = loadMERKLE_PROOF<ShardState>(slice2, loadShardState);
		return {
  			kind: 'ProducerInfo',
			utime: utime,
			mc_blk_ref: mc_blk_ref,
			state_proof: state_proof,
			prod_proof: prod_proof
  		};
  	};
	throw new Error('');
  }
export function storeProducerInfo(producerInfo: ProducerInfo): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x34, 8);
		builder.storeUint(producerInfo.utime, 32);
		storeExtBlkRef(producerInfo.mc_blk_ref)(builder);
		let cell1 = beginCell();
		storeMERKLE_PROOF<Block>(producerInfo.state_proof, storeBlock)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeMERKLE_PROOF<ShardState>(producerInfo.prod_proof, storeShardState)(cell2);
		builder.storeRef(cell2);
  	});
  }
export type ComplaintDescr = ComplaintDescr_no_blk_gen | ComplaintDescr_no_blk_gen_diff;
export type ComplaintDescr_no_blk_gen = {
  	kind: 'ComplaintDescr_no_blk_gen';
	from_utime: number;
	prod_info: ProducerInfo;
  };
export type ComplaintDescr_no_blk_gen_diff = {
  	kind: 'ComplaintDescr_no_blk_gen_diff';
	prod_info_old: ProducerInfo;
	prod_info_new: ProducerInfo;
  };
export function loadComplaintDescr(slice: Slice): ComplaintDescr {
  	if (true) {
  		let from_utime: number = slice.loadUint(32);
		let slice1 = slice.loadRef().beginParse();
		let prod_info: ProducerInfo = loadProducerInfo(slice1);
		return {
  			kind: 'ComplaintDescr_no_blk_gen',
			from_utime: from_utime,
			prod_info: prod_info
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let prod_info_old: ProducerInfo = loadProducerInfo(slice1);
		let slice2 = slice.loadRef().beginParse();
		let prod_info_new: ProducerInfo = loadProducerInfo(slice2);
		return {
  			kind: 'ComplaintDescr_no_blk_gen_diff',
			prod_info_old: prod_info_old,
			prod_info_new: prod_info_new
  		};
  	};
	throw new Error('');
  }
export function storeComplaintDescr(complaintDescr: ComplaintDescr): (builder: Builder) => void {
  	if ((complaintDescr.kind == 'ComplaintDescr_no_blk_gen')) {
  		return ((builder: Builder) => {
  			builder.storeUint(complaintDescr.from_utime, 32);
			let cell1 = beginCell();
			storeProducerInfo(complaintDescr.prod_info)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	if ((complaintDescr.kind == 'ComplaintDescr_no_blk_gen_diff')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeProducerInfo(complaintDescr.prod_info_old)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeProducerInfo(complaintDescr.prod_info_new)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	throw new Error('');
  }
export type ValidatorComplaint = {
  	kind: 'ValidatorComplaint';
	validator_pubkey: BitString;
	description: ComplaintDescr;
	created_at: number;
	severity: number;
	reward_addr: number;
	paid: Grams;
	suggested_fine: Grams;
	suggested_fine_part: number;
  };
export function loadValidatorComplaint(slice: Slice): ValidatorComplaint {
  	if ((slice.preloadUint(8) == 0xbc)) {
  		slice.loadUint(8);
		let validator_pubkey: BitString = slice.loadBits(256);
		let slice1 = slice.loadRef().beginParse();
		let description: ComplaintDescr = loadComplaintDescr(slice1);
		let created_at: number = slice.loadUint(32);
		let severity: number = slice.loadUint(8);
		let reward_addr: number = slice.loadUint(256);
		let paid: Grams = loadGrams(slice);
		let suggested_fine: Grams = loadGrams(slice);
		let suggested_fine_part: number = slice.loadUint(32);
		return {
  			kind: 'ValidatorComplaint',
			validator_pubkey: validator_pubkey,
			description: description,
			created_at: created_at,
			severity: severity,
			reward_addr: reward_addr,
			paid: paid,
			suggested_fine: suggested_fine,
			suggested_fine_part: suggested_fine_part
  		};
  	};
	throw new Error('');
  }
export function storeValidatorComplaint(validatorComplaint: ValidatorComplaint): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0xbc, 8);
		builder.storeBits(validatorComplaint.validator_pubkey);
		let cell1 = beginCell();
		storeComplaintDescr(validatorComplaint.description)(cell1);
		builder.storeRef(cell1);
		builder.storeUint(validatorComplaint.created_at, 32);
		builder.storeUint(validatorComplaint.severity, 8);
		builder.storeUint(validatorComplaint.reward_addr, 256);
		storeGrams(validatorComplaint.paid)(builder);
		storeGrams(validatorComplaint.suggested_fine)(builder);
		builder.storeUint(validatorComplaint.suggested_fine_part, 32);
  	});
  }
export type ValidatorComplaintStatus = {
  	kind: 'ValidatorComplaintStatus';
	complaint: ValidatorComplaint;
	voters: HashmapE<True>;
	vset_id: number;
	weight_remaining: number;
  };
export function loadValidatorComplaintStatus(slice: Slice): ValidatorComplaintStatus {
  	if ((slice.preloadUint(8) == 0x2d)) {
  		slice.loadUint(8);
		let slice1 = slice.loadRef().beginParse();
		let complaint: ValidatorComplaint = loadValidatorComplaint(slice1);
		let voters: HashmapE<True> = loadHashmapE<True>(slice, 16, loadTrue);
		let vset_id: number = slice.loadUint(256);
		let weight_remaining: number = slice.loadInt(64);
		return {
  			kind: 'ValidatorComplaintStatus',
			complaint: complaint,
			voters: voters,
			vset_id: vset_id,
			weight_remaining: weight_remaining
  		};
  	};
	throw new Error('');
  }
export function storeValidatorComplaintStatus(validatorComplaintStatus: ValidatorComplaintStatus): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x2d, 8);
		let cell1 = beginCell();
		storeValidatorComplaint(validatorComplaintStatus.complaint)(cell1);
		builder.storeRef(cell1);
		storeHashmapE<True>(validatorComplaintStatus.voters, storeTrue)(builder);
		builder.storeUint(validatorComplaintStatus.vset_id, 256);
		builder.storeInt(validatorComplaintStatus.weight_remaining, 64);
  	});
  }
export type VmStackValue = VmStackValue_vm_stk_null | VmStackValue_vm_stk_tinyint | VmStackValue_vm_stk_int | VmStackValue_vm_stk_nan | VmStackValue_vm_stk_cell | VmStackValue_vm_stk_slice | VmStackValue_vm_stk_builder | VmStackValue_vm_stk_cont | VmStackValue_vm_stk_tuple;
export type VmStackValue_vm_stk_null = {
  	kind: 'VmStackValue_vm_stk_null';
  };
export type VmStackValue_vm_stk_tinyint = {
  	kind: 'VmStackValue_vm_stk_tinyint';
	value: number;
  };
export type VmStackValue_vm_stk_int = {
  	kind: 'VmStackValue_vm_stk_int';
	value: number;
  };
export type VmStackValue_vm_stk_nan = {
  	kind: 'VmStackValue_vm_stk_nan';
  };
export type VmStackValue_vm_stk_cell = {
  	kind: 'VmStackValue_vm_stk_cell';
	cell: Slice;
  };
export type VmStackValue_vm_stk_slice = {
  	kind: 'VmStackValue_vm_stk_slice';
	_: VmCellSlice;
  };
export type VmStackValue_vm_stk_builder = {
  	kind: 'VmStackValue_vm_stk_builder';
	cell: Slice;
  };
export type VmStackValue_vm_stk_cont = {
  	kind: 'VmStackValue_vm_stk_cont';
	cont: VmCont;
  };
export type VmStackValue_vm_stk_tuple = {
  	kind: 'VmStackValue_vm_stk_tuple';
	len: number;
	data: VmTuple;
  };
export function loadVmStackValue(slice: Slice): VmStackValue {
  	if ((slice.preloadUint(8) == 0x00)) {
  		slice.loadUint(8);
		return {
  			kind: 'VmStackValue_vm_stk_null'
  		};
  	};
	if ((slice.preloadUint(8) == 0x01)) {
  		slice.loadUint(8);
		let value: number = slice.loadInt(64);
		return {
  			kind: 'VmStackValue_vm_stk_tinyint',
			value: value
  		};
  	};
	if ((slice.preloadUint(16) == 0x0201)) {
  		slice.loadUint(16);
		let value: number = slice.loadInt(257);
		return {
  			kind: 'VmStackValue_vm_stk_int',
			value: value
  		};
  	};
	if ((slice.preloadUint(16) == 0x02ff)) {
  		slice.loadUint(16);
		return {
  			kind: 'VmStackValue_vm_stk_nan'
  		};
  	};
	if ((slice.preloadUint(8) == 0x03)) {
  		slice.loadUint(8);
		let slice1 = slice.loadRef().beginParse();
		let cell: Slice = slice1;
		return {
  			kind: 'VmStackValue_vm_stk_cell',
			cell: cell
  		};
  	};
	if ((slice.preloadUint(8) == 0x04)) {
  		slice.loadUint(8);
		let _: VmCellSlice = loadVmCellSlice(slice);
		return {
  			kind: 'VmStackValue_vm_stk_slice',
			_: _
  		};
  	};
	if ((slice.preloadUint(8) == 0x05)) {
  		slice.loadUint(8);
		let slice1 = slice.loadRef().beginParse();
		let cell: Slice = slice1;
		return {
  			kind: 'VmStackValue_vm_stk_builder',
			cell: cell
  		};
  	};
	if ((slice.preloadUint(8) == 0x06)) {
  		slice.loadUint(8);
		let cont: VmCont = loadVmCont(slice);
		return {
  			kind: 'VmStackValue_vm_stk_cont',
			cont: cont
  		};
  	};
	if ((slice.preloadUint(8) == 0x07)) {
  		slice.loadUint(8);
		let len: number = slice.loadUint(16);
		let data: VmTuple = loadVmTuple(slice, len);
		return {
  			kind: 'VmStackValue_vm_stk_tuple',
			len: len,
			data: data
  		};
  	};
	throw new Error('');
  }
export function storeVmStackValue(vmStackValue: VmStackValue): (builder: Builder) => void {
  	if ((vmStackValue.kind == 'VmStackValue_vm_stk_null')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x00, 8);
  		});
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_tinyint')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x01, 8);
			builder.storeInt(vmStackValue.value, 64);
  		});
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_int')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x0201, 16);
			builder.storeInt(vmStackValue.value, 257);
  		});
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_nan')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x02ff, 16);
  		});
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_cell')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x03, 8);
			let cell1 = beginCell();
			cell1.storeSlice(vmStackValue.cell);
			builder.storeRef(cell1);
  		});
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_slice')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x04, 8);
			storeVmCellSlice(vmStackValue._)(builder);
  		});
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_builder')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x05, 8);
			let cell1 = beginCell();
			cell1.storeSlice(vmStackValue.cell);
			builder.storeRef(cell1);
  		});
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_cont')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x06, 8);
			storeVmCont(vmStackValue.cont)(builder);
  		});
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_tuple')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x07, 8);
			builder.storeUint(vmStackValue.len, 16);
			storeVmTuple(vmStackValue.data)(builder);
  		});
  	};
	throw new Error('');
  }
export type VmCellSlice = {
  	kind: 'VmCellSlice';
	cell: Slice;
	st_bits: number;
	end_bits: number;
	st_ref: number;
	end_ref: number;
  };
export function loadVmCellSlice(slice: Slice): VmCellSlice {
  	let slice1 = slice.loadRef().beginParse();
	let cell: Slice = slice1;
	let st_bits: number = slice.loadUint(10);
	let end_bits: number = slice.loadUint(10);
	let st_ref: number = slice.loadUint(bitLen(4));
	let end_ref: number = slice.loadUint(bitLen(4));
	if ((!(st_bits <= end_bits))) {
  		throw new Error('');
  	};
	if ((!(st_ref <= end_ref))) {
  		throw new Error('');
  	};
	return {
  		kind: 'VmCellSlice',
		cell: cell,
		st_bits: st_bits,
		end_bits: end_bits,
		st_ref: st_ref,
		end_ref: end_ref
  	};
  }
export function storeVmCellSlice(vmCellSlice: VmCellSlice): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		let cell1 = beginCell();
		cell1.storeSlice(vmCellSlice.cell);
		builder.storeRef(cell1);
		builder.storeUint(vmCellSlice.st_bits, 10);
		builder.storeUint(vmCellSlice.end_bits, 10);
		builder.storeUint(vmCellSlice.st_ref, bitLen(4));
		builder.storeUint(vmCellSlice.end_ref, bitLen(4));
		if ((!(vmCellSlice.st_bits <= vmCellSlice.end_bits))) {
  			throw new Error('');
  		};
		if ((!(vmCellSlice.st_ref <= vmCellSlice.end_ref))) {
  			throw new Error('');
  		};
  	});
  }
export type VmTupleRef = VmTupleRef_vm_tupref_nil | VmTupleRef_vm_tupref_single | VmTupleRef_vm_tupref_any;
export type VmTupleRef_vm_tupref_nil = {
  	kind: 'VmTupleRef_vm_tupref_nil';
  };
export type VmTupleRef_vm_tupref_single = {
  	kind: 'VmTupleRef_vm_tupref_single';
	entry: VmStackValue;
  };
export type VmTupleRef_vm_tupref_any = {
  	kind: 'VmTupleRef_vm_tupref_any';
	n: number;
	ref: VmTuple;
  };
export function loadVmTupleRef(slice: Slice, arg0: number): VmTupleRef {
  	if ((arg0 == 0)) {
  		return {
  			kind: 'VmTupleRef_vm_tupref_nil'
  		};
  	};
	if ((arg0 == 1)) {
  		let slice1 = slice.loadRef().beginParse();
		let entry: VmStackValue = loadVmStackValue(slice1);
		return {
  			kind: 'VmTupleRef_vm_tupref_single',
			entry: entry
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let ref: VmTuple = loadVmTuple(slice1, ((arg0 - 2) + 2));
		return {
  			kind: 'VmTupleRef_vm_tupref_any',
			n: (arg0 - 2),
			ref: ref
  		};
  	};
	throw new Error('');
  }
export function storeVmTupleRef(vmTupleRef: VmTupleRef): (builder: Builder) => void {
  	if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_nil')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_single')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeVmStackValue(vmTupleRef.entry)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_any')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeVmTuple(vmTupleRef.ref)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	throw new Error('');
  }
export type VmTuple = VmTuple_vm_tuple_nil | VmTuple_vm_tuple_tcons;
export type VmTuple_vm_tuple_nil = {
  	kind: 'VmTuple_vm_tuple_nil';
  };
export type VmTuple_vm_tuple_tcons = {
  	kind: 'VmTuple_vm_tuple_tcons';
	n: number;
	head: VmTupleRef;
	tail: VmStackValue;
  };
export function loadVmTuple(slice: Slice, arg0: number): VmTuple {
  	if ((arg0 == 0)) {
  		return {
  			kind: 'VmTuple_vm_tuple_nil'
  		};
  	};
	if (true) {
  		let head: VmTupleRef = loadVmTupleRef(slice, (arg0 - 1));
		let slice1 = slice.loadRef().beginParse();
		let tail: VmStackValue = loadVmStackValue(slice1);
		return {
  			kind: 'VmTuple_vm_tuple_tcons',
			n: (arg0 - 1),
			head: head,
			tail: tail
  		};
  	};
	throw new Error('');
  }
export function storeVmTuple(vmTuple: VmTuple): (builder: Builder) => void {
  	if ((vmTuple.kind == 'VmTuple_vm_tuple_nil')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	if ((vmTuple.kind == 'VmTuple_vm_tuple_tcons')) {
  		return ((builder: Builder) => {
  			storeVmTupleRef(vmTuple.head)(builder);
			let cell1 = beginCell();
			storeVmStackValue(vmTuple.tail)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	throw new Error('');
  }
export type VmStack = {
  	kind: 'VmStack';
	depth: number;
	stack: VmStackList;
  };
export function loadVmStack(slice: Slice): VmStack {
  	let depth: number = slice.loadUint(24);
	let stack: VmStackList = loadVmStackList(slice, depth);
	return {
  		kind: 'VmStack',
		depth: depth,
		stack: stack
  	};
  }
export function storeVmStack(vmStack: VmStack): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(vmStack.depth, 24);
		storeVmStackList(vmStack.stack)(builder);
  	});
  }
export type VmStackList = VmStackList_vm_stk_cons | VmStackList_vm_stk_nil;
export type VmStackList_vm_stk_cons = {
  	kind: 'VmStackList_vm_stk_cons';
	n: number;
	rest: VmStackList;
	tos: VmStackValue;
  };
export type VmStackList_vm_stk_nil = {
  	kind: 'VmStackList_vm_stk_nil';
  };
export function loadVmStackList(slice: Slice, arg0: number): VmStackList {
  	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let rest: VmStackList = loadVmStackList(slice1, (arg0 - 1));
		let tos: VmStackValue = loadVmStackValue(slice);
		return {
  			kind: 'VmStackList_vm_stk_cons',
			n: (arg0 - 1),
			rest: rest,
			tos: tos
  		};
  	};
	if ((arg0 == 0)) {
  		return {
  			kind: 'VmStackList_vm_stk_nil'
  		};
  	};
	throw new Error('');
  }
export function storeVmStackList(vmStackList: VmStackList): (builder: Builder) => void {
  	if ((vmStackList.kind == 'VmStackList_vm_stk_cons')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeVmStackList(vmStackList.rest)(cell1);
			builder.storeRef(cell1);
			storeVmStackValue(vmStackList.tos)(builder);
  		});
  	};
	if ((vmStackList.kind == 'VmStackList_vm_stk_nil')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	throw new Error('');
  }
export type VmSaveList = {
  	kind: 'VmSaveList';
	cregs: HashmapE<VmStackValue>;
  };
export function loadVmSaveList(slice: Slice): VmSaveList {
  	let cregs: HashmapE<VmStackValue> = loadHashmapE<VmStackValue>(slice, 4, loadVmStackValue);
	return {
  		kind: 'VmSaveList',
		cregs: cregs
  	};
  }
export function storeVmSaveList(vmSaveList: VmSaveList): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeHashmapE<VmStackValue>(vmSaveList.cregs, storeVmStackValue)(builder);
  	});
  }
export type VmGasLimits = {
  	kind: 'VmGasLimits';
	remaining: number;
	max_limit: number;
	cur_limit: number;
	credit: number;
  };
export function loadVmGasLimits(slice: Slice): VmGasLimits {
  	let remaining: number = slice.loadInt(64);
	let slice1 = slice.loadRef().beginParse();
	let max_limit: number = slice1.loadInt(64);
	let cur_limit: number = slice1.loadInt(64);
	let credit: number = slice1.loadInt(64);
	return {
  		kind: 'VmGasLimits',
		remaining: remaining,
		max_limit: max_limit,
		cur_limit: cur_limit,
		credit: credit
  	};
  }
export function storeVmGasLimits(vmGasLimits: VmGasLimits): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeInt(vmGasLimits.remaining, 64);
		let cell1 = beginCell();
		cell1.storeInt(vmGasLimits.max_limit, 64);
		cell1.storeInt(vmGasLimits.cur_limit, 64);
		cell1.storeInt(vmGasLimits.credit, 64);
		builder.storeRef(cell1);
  	});
  }
export type VmLibraries = {
  	kind: 'VmLibraries';
	libraries: HashmapE<Slice>;
  };
export function loadVmLibraries(slice: Slice): VmLibraries {
  	let libraries: HashmapE<Slice> = loadHashmapE<Slice>(slice, 256, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return slice1;
  	}));
	return {
  		kind: 'VmLibraries',
		libraries: libraries
  	};
  }
export function storeVmLibraries(vmLibraries: VmLibraries): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeHashmapE<Slice>(vmLibraries.libraries, ((arg: Slice) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				cell1.storeSlice(arg)
				builder.storeRef(cell1);
  			});
  		}))(builder);
  	});
  }
export type VmControlData = {
  	kind: 'VmControlData';
	nargs: Maybe<number>;
	stack: Maybe<VmStack>;
	save: VmSaveList;
	cp: Maybe<number>;
  };
export function loadVmControlData(slice: Slice): VmControlData {
  	let nargs: Maybe<number> = loadMaybe<number>(slice, ((slice: Slice) => {
  		return slice.loadUint(13);
  	}));
	let stack: Maybe<VmStack> = loadMaybe<VmStack>(slice, loadVmStack);
	let save: VmSaveList = loadVmSaveList(slice);
	let cp: Maybe<number> = loadMaybe<number>(slice, ((slice: Slice) => {
  		return slice.loadInt(16);
  	}));
	return {
  		kind: 'VmControlData',
		nargs: nargs,
		stack: stack,
		save: save,
		cp: cp
  	};
  }
export function storeVmControlData(vmControlData: VmControlData): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeMaybe<number>(vmControlData.nargs, ((arg: number) => {
  			return ((builder: Builder) => {
  				builder.storeUint(arg, 13);
  			});
  		}))(builder);
		storeMaybe<VmStack>(vmControlData.stack, storeVmStack)(builder);
		storeVmSaveList(vmControlData.save)(builder);
		storeMaybe<number>(vmControlData.cp, ((arg: number) => {
  			return ((builder: Builder) => {
  				builder.storeInt(arg, 16);
  			});
  		}))(builder);
  	});
  }
export type VmCont = VmCont_vmc_std | VmCont_vmc_envelope | VmCont_vmc_quit | VmCont_vmc_quit_exc | VmCont_vmc_repeat | VmCont_vmc_until | VmCont_vmc_again | VmCont_vmc_while_cond | VmCont_vmc_while_body | VmCont_vmc_pushint;
export type VmCont_vmc_std = {
  	kind: 'VmCont_vmc_std';
	cdata: VmControlData;
	code: VmCellSlice;
  };
export type VmCont_vmc_envelope = {
  	kind: 'VmCont_vmc_envelope';
	cdata: VmControlData;
	next: VmCont;
  };
export type VmCont_vmc_quit = {
  	kind: 'VmCont_vmc_quit';
	exit_code: number;
  };
export type VmCont_vmc_quit_exc = {
  	kind: 'VmCont_vmc_quit_exc';
  };
export type VmCont_vmc_repeat = {
  	kind: 'VmCont_vmc_repeat';
	count: number;
	body: VmCont;
	after: VmCont;
  };
export type VmCont_vmc_until = {
  	kind: 'VmCont_vmc_until';
	body: VmCont;
	after: VmCont;
  };
export type VmCont_vmc_again = {
  	kind: 'VmCont_vmc_again';
	body: VmCont;
  };
export type VmCont_vmc_while_cond = {
  	kind: 'VmCont_vmc_while_cond';
	cond: VmCont;
	body: VmCont;
	after: VmCont;
  };
export type VmCont_vmc_while_body = {
  	kind: 'VmCont_vmc_while_body';
	cond: VmCont;
	body: VmCont;
	after: VmCont;
  };
export type VmCont_vmc_pushint = {
  	kind: 'VmCont_vmc_pushint';
	value: number;
	next: VmCont;
  };
export function loadVmCont(slice: Slice): VmCont {
  	if ((slice.preloadUint(2) == 0b00)) {
  		slice.loadUint(2);
		let cdata: VmControlData = loadVmControlData(slice);
		let code: VmCellSlice = loadVmCellSlice(slice);
		return {
  			kind: 'VmCont_vmc_std',
			cdata: cdata,
			code: code
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		slice.loadUint(2);
		let cdata: VmControlData = loadVmControlData(slice);
		let slice1 = slice.loadRef().beginParse();
		let next: VmCont = loadVmCont(slice1);
		return {
  			kind: 'VmCont_vmc_envelope',
			cdata: cdata,
			next: next
  		};
  	};
	if ((slice.preloadUint(4) == 0b1000)) {
  		slice.loadUint(4);
		let exit_code: number = slice.loadInt(32);
		return {
  			kind: 'VmCont_vmc_quit',
			exit_code: exit_code
  		};
  	};
	if ((slice.preloadUint(4) == 0b1001)) {
  		slice.loadUint(4);
		return {
  			kind: 'VmCont_vmc_quit_exc'
  		};
  	};
	if ((slice.preloadUint(5) == 0b10100)) {
  		slice.loadUint(5);
		let count: number = slice.loadUint(63);
		let slice1 = slice.loadRef().beginParse();
		let body: VmCont = loadVmCont(slice1);
		let slice2 = slice.loadRef().beginParse();
		let after: VmCont = loadVmCont(slice2);
		return {
  			kind: 'VmCont_vmc_repeat',
			count: count,
			body: body,
			after: after
  		};
  	};
	if ((slice.preloadUint(6) == 0b110000)) {
  		slice.loadUint(6);
		let slice1 = slice.loadRef().beginParse();
		let body: VmCont = loadVmCont(slice1);
		let slice2 = slice.loadRef().beginParse();
		let after: VmCont = loadVmCont(slice2);
		return {
  			kind: 'VmCont_vmc_until',
			body: body,
			after: after
  		};
  	};
	if ((slice.preloadUint(6) == 0b110001)) {
  		slice.loadUint(6);
		let slice1 = slice.loadRef().beginParse();
		let body: VmCont = loadVmCont(slice1);
		return {
  			kind: 'VmCont_vmc_again',
			body: body
  		};
  	};
	if ((slice.preloadUint(6) == 0b110010)) {
  		slice.loadUint(6);
		let slice1 = slice.loadRef().beginParse();
		let cond: VmCont = loadVmCont(slice1);
		let slice2 = slice.loadRef().beginParse();
		let body: VmCont = loadVmCont(slice2);
		let slice3 = slice.loadRef().beginParse();
		let after: VmCont = loadVmCont(slice3);
		return {
  			kind: 'VmCont_vmc_while_cond',
			cond: cond,
			body: body,
			after: after
  		};
  	};
	if ((slice.preloadUint(6) == 0b110011)) {
  		slice.loadUint(6);
		let slice1 = slice.loadRef().beginParse();
		let cond: VmCont = loadVmCont(slice1);
		let slice2 = slice.loadRef().beginParse();
		let body: VmCont = loadVmCont(slice2);
		let slice3 = slice.loadRef().beginParse();
		let after: VmCont = loadVmCont(slice3);
		return {
  			kind: 'VmCont_vmc_while_body',
			cond: cond,
			body: body,
			after: after
  		};
  	};
	if ((slice.preloadUint(4) == 0b1111)) {
  		slice.loadUint(4);
		let value: number = slice.loadInt(32);
		let slice1 = slice.loadRef().beginParse();
		let next: VmCont = loadVmCont(slice1);
		return {
  			kind: 'VmCont_vmc_pushint',
			value: value,
			next: next
  		};
  	};
	throw new Error('');
  }
export function storeVmCont(vmCont: VmCont): (builder: Builder) => void {
  	if ((vmCont.kind == 'VmCont_vmc_std')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b00, 2);
			storeVmControlData(vmCont.cdata)(builder);
			storeVmCellSlice(vmCont.code)(builder);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_envelope')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b01, 2);
			storeVmControlData(vmCont.cdata)(builder);
			let cell1 = beginCell();
			storeVmCont(vmCont.next)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_quit')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1000, 4);
			builder.storeInt(vmCont.exit_code, 32);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_quit_exc')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1001, 4);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_repeat')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b10100, 5);
			builder.storeUint(vmCont.count, 63);
			let cell1 = beginCell();
			storeVmCont(vmCont.body)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeVmCont(vmCont.after)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_until')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b110000, 6);
			let cell1 = beginCell();
			storeVmCont(vmCont.body)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeVmCont(vmCont.after)(cell2);
			builder.storeRef(cell2);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_again')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b110001, 6);
			let cell1 = beginCell();
			storeVmCont(vmCont.body)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_while_cond')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b110010, 6);
			let cell1 = beginCell();
			storeVmCont(vmCont.cond)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeVmCont(vmCont.body)(cell2);
			builder.storeRef(cell2);
			let cell3 = beginCell();
			storeVmCont(vmCont.after)(cell3);
			builder.storeRef(cell3);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_while_body')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b110011, 6);
			let cell1 = beginCell();
			storeVmCont(vmCont.cond)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeVmCont(vmCont.body)(cell2);
			builder.storeRef(cell2);
			let cell3 = beginCell();
			storeVmCont(vmCont.after)(cell3);
			builder.storeRef(cell3);
  		});
  	};
	if ((vmCont.kind == 'VmCont_vmc_pushint')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1111, 4);
			builder.storeInt(vmCont.value, 32);
			let cell1 = beginCell();
			storeVmCont(vmCont.next)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	throw new Error('');
  }
export type DNS_RecordSet = {
  	kind: 'DNS_RecordSet';
  };
export function loadDNS_RecordSet(slice: Slice): DNS_RecordSet {
  	return {
  		kind: 'DNS_RecordSet'
  	};
  }
export function storeDNS_RecordSet(dNS_RecordSet: DNS_RecordSet): (builder: Builder) => void {
  	return ((builder: Builder) => {
  
  	});
  }
export type TextChunkRef = TextChunkRef_chunk_ref | TextChunkRef_chunk_ref_empty;
export type TextChunkRef_chunk_ref = {
  	kind: 'TextChunkRef_chunk_ref';
	n: number;
	ref: TextChunks;
  };
export type TextChunkRef_chunk_ref_empty = {
  	kind: 'TextChunkRef_chunk_ref_empty';
  };
export function loadTextChunkRef(slice: Slice, arg0: number): TextChunkRef {
  	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let ref: TextChunks = loadTextChunks(slice1, ((arg0 - 1) + 1));
		return {
  			kind: 'TextChunkRef_chunk_ref',
			n: (arg0 - 1),
			ref: ref
  		};
  	};
	if ((arg0 == 0)) {
  		return {
  			kind: 'TextChunkRef_chunk_ref_empty'
  		};
  	};
	throw new Error('');
  }
export function storeTextChunkRef(textChunkRef: TextChunkRef): (builder: Builder) => void {
  	if ((textChunkRef.kind == 'TextChunkRef_chunk_ref')) {
  		return ((builder: Builder) => {
  			let cell1 = beginCell();
			storeTextChunks(textChunkRef.ref)(cell1);
			builder.storeRef(cell1);
  		});
  	};
	if ((textChunkRef.kind == 'TextChunkRef_chunk_ref_empty')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	throw new Error('');
  }
export type TextChunks = TextChunks_text_chunk | TextChunks_text_chunk_empty;
export type TextChunks_text_chunk = {
  	kind: 'TextChunks_text_chunk';
	n: number;
	len: number;
	data: BitString;
	next: TextChunkRef;
  };
export type TextChunks_text_chunk_empty = {
  	kind: 'TextChunks_text_chunk_empty';
  };
export function loadTextChunks(slice: Slice, arg0: number): TextChunks {
  	if (true) {
  		let len: number = slice.loadUint(8);
		let data: BitString = slice.loadBits((len * 8));
		let next: TextChunkRef = loadTextChunkRef(slice, (arg0 - 1));
		return {
  			kind: 'TextChunks_text_chunk',
			n: (arg0 - 1),
			len: len,
			data: data,
			next: next
  		};
  	};
	if ((arg0 == 0)) {
  		return {
  			kind: 'TextChunks_text_chunk_empty'
  		};
  	};
	throw new Error('');
  }
export function storeTextChunks(textChunks: TextChunks): (builder: Builder) => void {
  	if ((textChunks.kind == 'TextChunks_text_chunk')) {
  		return ((builder: Builder) => {
  			builder.storeUint(textChunks.len, 8);
			builder.storeBits(textChunks.data);
			storeTextChunkRef(textChunks.next)(builder);
  		});
  	};
	if ((textChunks.kind == 'TextChunks_text_chunk_empty')) {
  		return ((builder: Builder) => {
  
  		});
  	};
	throw new Error('');
  }
export type Text = {
  	kind: 'Text';
	chunks: number;
	rest: TextChunks;
  };
export function loadText(slice: Slice): Text {
  	let chunks: number = slice.loadUint(8);
	let rest: TextChunks = loadTextChunks(slice, chunks);
	return {
  		kind: 'Text',
		chunks: chunks,
		rest: rest
  	};
  }
export function storeText(text: Text): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(text.chunks, 8);
		storeTextChunks(text.rest)(builder);
  	});
  }
export type DNSRecord = DNSRecord_dns_text | DNSRecord_dns_next_resolver | DNSRecord_dns_adnl_address | DNSRecord_dns_smc_address;
export type DNSRecord_dns_text = {
  	kind: 'DNSRecord_dns_text';
	_: Text;
  };
export type DNSRecord_dns_next_resolver = {
  	kind: 'DNSRecord_dns_next_resolver';
	resolver: MsgAddressInt;
  };
export type DNSRecord_dns_adnl_address = {
  	kind: 'DNSRecord_dns_adnl_address';
	adnl_addr: BitString;
	flags: number;
	proto_list: ProtoList | undefined;
  };
export type DNSRecord_dns_smc_address = {
  	kind: 'DNSRecord_dns_smc_address';
	smc_addr: MsgAddressInt;
	flags: number;
	cap_list: SmcCapList | undefined;
  };
export function loadDNSRecord(slice: Slice): DNSRecord {
  	if ((slice.preloadUint(16) == 0x1eda)) {
  		slice.loadUint(16);
		let _: Text = loadText(slice);
		return {
  			kind: 'DNSRecord_dns_text',
			_: _
  		};
  	};
	if ((slice.preloadUint(16) == 0xba93)) {
  		slice.loadUint(16);
		let resolver: MsgAddressInt = loadMsgAddressInt(slice);
		return {
  			kind: 'DNSRecord_dns_next_resolver',
			resolver: resolver
  		};
  	};
	if ((slice.preloadUint(16) == 0xad01)) {
  		slice.loadUint(16);
		let adnl_addr: BitString = slice.loadBits(256);
		let flags: number = slice.loadUint(8);
		let proto_list: ProtoList | undefined = ((flags & (1 << 0)) ? loadProtoList(slice) : undefined);
		if ((!(flags <= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'DNSRecord_dns_adnl_address',
			adnl_addr: adnl_addr,
			flags: flags,
			proto_list: proto_list
  		};
  	};
	if ((slice.preloadUint(16) == 0x9fd3)) {
  		slice.loadUint(16);
		let smc_addr: MsgAddressInt = loadMsgAddressInt(slice);
		let flags: number = slice.loadUint(8);
		let cap_list: SmcCapList | undefined = ((flags & (1 << 0)) ? loadSmcCapList(slice) : undefined);
		if ((!(flags <= 1))) {
  			throw new Error('');
  		};
		return {
  			kind: 'DNSRecord_dns_smc_address',
			smc_addr: smc_addr,
			flags: flags,
			cap_list: cap_list
  		};
  	};
	throw new Error('');
  }
export function storeDNSRecord(dNSRecord: DNSRecord): (builder: Builder) => void {
  	if ((dNSRecord.kind == 'DNSRecord_dns_text')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x1eda, 16);
			storeText(dNSRecord._)(builder);
  		});
  	};
	if ((dNSRecord.kind == 'DNSRecord_dns_next_resolver')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xba93, 16);
			storeMsgAddressInt(dNSRecord.resolver)(builder);
  		});
  	};
	if ((dNSRecord.kind == 'DNSRecord_dns_adnl_address')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xad01, 16);
			builder.storeBits(dNSRecord.adnl_addr);
			builder.storeUint(dNSRecord.flags, 8);
			if ((dNSRecord.proto_list != undefined)) {
  				storeProtoList(dNSRecord.proto_list)(builder);
  			};
			if ((!(dNSRecord.flags <= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	if ((dNSRecord.kind == 'DNSRecord_dns_smc_address')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x9fd3, 16);
			storeMsgAddressInt(dNSRecord.smc_addr)(builder);
			builder.storeUint(dNSRecord.flags, 8);
			if ((dNSRecord.cap_list != undefined)) {
  				storeSmcCapList(dNSRecord.cap_list)(builder);
  			};
			if ((!(dNSRecord.flags <= 1))) {
  				throw new Error('');
  			};
  		});
  	};
	throw new Error('');
  }
export type ProtoList = ProtoList_proto_list_nil | ProtoList_proto_list_next;
export type ProtoList_proto_list_nil = {
  	kind: 'ProtoList_proto_list_nil';
  };
export type ProtoList_proto_list_next = {
  	kind: 'ProtoList_proto_list_next';
	head: Protocol;
	tail: ProtoList;
  };
export function loadProtoList(slice: Slice): ProtoList {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'ProtoList_proto_list_nil'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let head: Protocol = loadProtocol(slice);
		let tail: ProtoList = loadProtoList(slice);
		return {
  			kind: 'ProtoList_proto_list_next',
			head: head,
			tail: tail
  		};
  	};
	throw new Error('');
  }
export function storeProtoList(protoList: ProtoList): (builder: Builder) => void {
  	if ((protoList.kind == 'ProtoList_proto_list_nil')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((protoList.kind == 'ProtoList_proto_list_next')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeProtocol(protoList.head)(builder);
			storeProtoList(protoList.tail)(builder);
  		});
  	};
	throw new Error('');
  }
export type Protocol = {
  	kind: 'Protocol';
  };
export function loadProtocol(slice: Slice): Protocol {
  	if ((slice.preloadUint(16) == 0x4854)) {
  		slice.loadUint(16);
		return {
  			kind: 'Protocol'
  		};
  	};
	throw new Error('');
  }
export function storeProtocol(protocol: Protocol): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x4854, 16);
  	});
  }
export type SmcCapList = SmcCapList_cap_list_nil | SmcCapList_cap_list_next;
export type SmcCapList_cap_list_nil = {
  	kind: 'SmcCapList_cap_list_nil';
  };
export type SmcCapList_cap_list_next = {
  	kind: 'SmcCapList_cap_list_next';
	head: SmcCapability;
	tail: SmcCapList;
  };
export function loadSmcCapList(slice: Slice): SmcCapList {
  	if ((slice.preloadUint(1) == 0b0)) {
  		slice.loadUint(1);
		return {
  			kind: 'SmcCapList_cap_list_nil'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		slice.loadUint(1);
		let head: SmcCapability = loadSmcCapability(slice);
		let tail: SmcCapList = loadSmcCapList(slice);
		return {
  			kind: 'SmcCapList_cap_list_next',
			head: head,
			tail: tail
  		};
  	};
	throw new Error('');
  }
export function storeSmcCapList(smcCapList: SmcCapList): (builder: Builder) => void {
  	if ((smcCapList.kind == 'SmcCapList_cap_list_nil')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		});
  	};
	if ((smcCapList.kind == 'SmcCapList_cap_list_next')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeSmcCapability(smcCapList.head)(builder);
			storeSmcCapList(smcCapList.tail)(builder);
  		});
  	};
	throw new Error('');
  }
export type SmcCapability = SmcCapability_cap_method_seqno | SmcCapability_cap_method_pubkey | SmcCapability_cap_is_wallet | SmcCapability_cap_name;
export type SmcCapability_cap_method_seqno = {
  	kind: 'SmcCapability_cap_method_seqno';
  };
export type SmcCapability_cap_method_pubkey = {
  	kind: 'SmcCapability_cap_method_pubkey';
  };
export type SmcCapability_cap_is_wallet = {
  	kind: 'SmcCapability_cap_is_wallet';
  };
export type SmcCapability_cap_name = {
  	kind: 'SmcCapability_cap_name';
	name: Text;
  };
export function loadSmcCapability(slice: Slice): SmcCapability {
  	if ((slice.preloadUint(16) == 0x5371)) {
  		slice.loadUint(16);
		return {
  			kind: 'SmcCapability_cap_method_seqno'
  		};
  	};
	if ((slice.preloadUint(16) == 0x71f4)) {
  		slice.loadUint(16);
		return {
  			kind: 'SmcCapability_cap_method_pubkey'
  		};
  	};
	if ((slice.preloadUint(16) == 0x2177)) {
  		slice.loadUint(16);
		return {
  			kind: 'SmcCapability_cap_is_wallet'
  		};
  	};
	if ((slice.preloadUint(8) == 0xff)) {
  		slice.loadUint(8);
		let name: Text = loadText(slice);
		return {
  			kind: 'SmcCapability_cap_name',
			name: name
  		};
  	};
	throw new Error('');
  }
export function storeSmcCapability(smcCapability: SmcCapability): (builder: Builder) => void {
  	if ((smcCapability.kind == 'SmcCapability_cap_method_seqno')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x5371, 16);
  		});
  	};
	if ((smcCapability.kind == 'SmcCapability_cap_method_pubkey')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x71f4, 16);
  		});
  	};
	if ((smcCapability.kind == 'SmcCapability_cap_is_wallet')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x2177, 16);
  		});
  	};
	if ((smcCapability.kind == 'SmcCapability_cap_name')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xff, 8);
			storeText(smcCapability.name)(builder);
  		});
  	};
	throw new Error('');
  }
export type ChanConfig = {
  	kind: 'ChanConfig';
	init_timeout: number;
	close_timeout: number;
	a_key: BitString;
	b_key: BitString;
	a_addr: MsgAddressInt;
	b_addr: MsgAddressInt;
	channel_id: number;
	min_A_extra: Grams;
  };
export function loadChanConfig(slice: Slice): ChanConfig {
  	let init_timeout: number = slice.loadUint(32);
	let close_timeout: number = slice.loadUint(32);
	let a_key: BitString = slice.loadBits(256);
	let b_key: BitString = slice.loadBits(256);
	let slice1 = slice.loadRef().beginParse();
	let a_addr: MsgAddressInt = loadMsgAddressInt(slice1);
	let slice2 = slice.loadRef().beginParse();
	let b_addr: MsgAddressInt = loadMsgAddressInt(slice2);
	let channel_id: number = slice.loadUint(64);
	let min_A_extra: Grams = loadGrams(slice);
	return {
  		kind: 'ChanConfig',
		init_timeout: init_timeout,
		close_timeout: close_timeout,
		a_key: a_key,
		b_key: b_key,
		a_addr: a_addr,
		b_addr: b_addr,
		channel_id: channel_id,
		min_A_extra: min_A_extra
  	};
  }
export function storeChanConfig(chanConfig: ChanConfig): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(chanConfig.init_timeout, 32);
		builder.storeUint(chanConfig.close_timeout, 32);
		builder.storeBits(chanConfig.a_key);
		builder.storeBits(chanConfig.b_key);
		let cell1 = beginCell();
		storeMsgAddressInt(chanConfig.a_addr)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeMsgAddressInt(chanConfig.b_addr)(cell2);
		builder.storeRef(cell2);
		builder.storeUint(chanConfig.channel_id, 64);
		storeGrams(chanConfig.min_A_extra)(builder);
  	});
  }
export type ChanState = ChanState_chan_state_init | ChanState_chan_state_close | ChanState_chan_state_payout;
export type ChanState_chan_state_init = {
  	kind: 'ChanState_chan_state_init';
	signed_A: Bool;
	signed_B: Bool;
	min_A: Grams;
	min_B: Grams;
	expire_at: number;
	A: Grams;
	B: Grams;
  };
export type ChanState_chan_state_close = {
  	kind: 'ChanState_chan_state_close';
	signed_A: Bool;
	signed_B: Bool;
	promise_A: Grams;
	promise_B: Grams;
	expire_at: number;
	A: Grams;
	B: Grams;
  };
export type ChanState_chan_state_payout = {
  	kind: 'ChanState_chan_state_payout';
	A: Grams;
	B: Grams;
  };
export function loadChanState(slice: Slice): ChanState {
  	if ((slice.preloadUint(3) == 0b000)) {
  		slice.loadUint(3);
		let signed_A: Bool = loadBool(slice);
		let signed_B: Bool = loadBool(slice);
		let min_A: Grams = loadGrams(slice);
		let min_B: Grams = loadGrams(slice);
		let expire_at: number = slice.loadUint(32);
		let A: Grams = loadGrams(slice);
		let B: Grams = loadGrams(slice);
		return {
  			kind: 'ChanState_chan_state_init',
			signed_A: signed_A,
			signed_B: signed_B,
			min_A: min_A,
			min_B: min_B,
			expire_at: expire_at,
			A: A,
			B: B
  		};
  	};
	if ((slice.preloadUint(3) == 0b001)) {
  		slice.loadUint(3);
		let signed_A: Bool = loadBool(slice);
		let signed_B: Bool = loadBool(slice);
		let promise_A: Grams = loadGrams(slice);
		let promise_B: Grams = loadGrams(slice);
		let expire_at: number = slice.loadUint(32);
		let A: Grams = loadGrams(slice);
		let B: Grams = loadGrams(slice);
		return {
  			kind: 'ChanState_chan_state_close',
			signed_A: signed_A,
			signed_B: signed_B,
			promise_A: promise_A,
			promise_B: promise_B,
			expire_at: expire_at,
			A: A,
			B: B
  		};
  	};
	if ((slice.preloadUint(3) == 0b010)) {
  		slice.loadUint(3);
		let A: Grams = loadGrams(slice);
		let B: Grams = loadGrams(slice);
		return {
  			kind: 'ChanState_chan_state_payout',
			A: A,
			B: B
  		};
  	};
	throw new Error('');
  }
export function storeChanState(chanState: ChanState): (builder: Builder) => void {
  	if ((chanState.kind == 'ChanState_chan_state_init')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b000, 3);
			storeBool(chanState.signed_A)(builder);
			storeBool(chanState.signed_B)(builder);
			storeGrams(chanState.min_A)(builder);
			storeGrams(chanState.min_B)(builder);
			builder.storeUint(chanState.expire_at, 32);
			storeGrams(chanState.A)(builder);
			storeGrams(chanState.B)(builder);
  		});
  	};
	if ((chanState.kind == 'ChanState_chan_state_close')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b001, 3);
			storeBool(chanState.signed_A)(builder);
			storeBool(chanState.signed_B)(builder);
			storeGrams(chanState.promise_A)(builder);
			storeGrams(chanState.promise_B)(builder);
			builder.storeUint(chanState.expire_at, 32);
			storeGrams(chanState.A)(builder);
			storeGrams(chanState.B)(builder);
  		});
  	};
	if ((chanState.kind == 'ChanState_chan_state_payout')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0b010, 3);
			storeGrams(chanState.A)(builder);
			storeGrams(chanState.B)(builder);
  		});
  	};
	throw new Error('');
  }
export type ChanPromise = {
  	kind: 'ChanPromise';
	channel_id: number;
	promise_A: Grams;
	promise_B: Grams;
  };
export function loadChanPromise(slice: Slice): ChanPromise {
  	let channel_id: number = slice.loadUint(64);
	let promise_A: Grams = loadGrams(slice);
	let promise_B: Grams = loadGrams(slice);
	return {
  		kind: 'ChanPromise',
		channel_id: channel_id,
		promise_A: promise_A,
		promise_B: promise_B
  	};
  }
export function storeChanPromise(chanPromise: ChanPromise): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(chanPromise.channel_id, 64);
		storeGrams(chanPromise.promise_A)(builder);
		storeGrams(chanPromise.promise_B)(builder);
  	});
  }
export type ChanSignedPromise = {
  	kind: 'ChanSignedPromise';
	sig: Maybe<BitString>;
	promise: ChanPromise;
  };
export function loadChanSignedPromise(slice: Slice): ChanSignedPromise {
  	let sig: Maybe<BitString> = loadMaybe<BitString>(slice, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return slice1.loadBits(512);
  	}));
	let promise: ChanPromise = loadChanPromise(slice);
	return {
  		kind: 'ChanSignedPromise',
		sig: sig,
		promise: promise
  	};
  }
export function storeChanSignedPromise(chanSignedPromise: ChanSignedPromise): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeMaybe<BitString>(chanSignedPromise.sig, ((arg: BitString) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				cell1.storeBits(arg)
				builder.storeRef(cell1);
  			});
  		}))(builder);
		storeChanPromise(chanSignedPromise.promise)(builder);
  	});
  }
export type ChanMsg = ChanMsg_chan_msg_init | ChanMsg_chan_msg_close | ChanMsg_chan_msg_timeout | ChanMsg_chan_msg_payout;
export type ChanMsg_chan_msg_init = {
  	kind: 'ChanMsg_chan_msg_init';
	inc_A: Grams;
	inc_B: Grams;
	min_A: Grams;
	min_B: Grams;
	channel_id: number;
  };
export type ChanMsg_chan_msg_close = {
  	kind: 'ChanMsg_chan_msg_close';
	extra_A: Grams;
	extra_B: Grams;
	promise: ChanSignedPromise;
  };
export type ChanMsg_chan_msg_timeout = {
  	kind: 'ChanMsg_chan_msg_timeout';
  };
export type ChanMsg_chan_msg_payout = {
  	kind: 'ChanMsg_chan_msg_payout';
  };
export function loadChanMsg(slice: Slice): ChanMsg {
  	if ((slice.preloadUint(32) == 0x27317822)) {
  		slice.loadUint(32);
		let inc_A: Grams = loadGrams(slice);
		let inc_B: Grams = loadGrams(slice);
		let min_A: Grams = loadGrams(slice);
		let min_B: Grams = loadGrams(slice);
		let channel_id: number = slice.loadUint(64);
		return {
  			kind: 'ChanMsg_chan_msg_init',
			inc_A: inc_A,
			inc_B: inc_B,
			min_A: min_A,
			min_B: min_B,
			channel_id: channel_id
  		};
  	};
	if ((slice.preloadUint(32) == 0xf28ae183)) {
  		slice.loadUint(32);
		let extra_A: Grams = loadGrams(slice);
		let extra_B: Grams = loadGrams(slice);
		let promise: ChanSignedPromise = loadChanSignedPromise(slice);
		return {
  			kind: 'ChanMsg_chan_msg_close',
			extra_A: extra_A,
			extra_B: extra_B,
			promise: promise
  		};
  	};
	if ((slice.preloadUint(32) == 0x43278a28)) {
  		slice.loadUint(32);
		return {
  			kind: 'ChanMsg_chan_msg_timeout'
  		};
  	};
	if ((slice.preloadUint(32) == 0x37fe7810)) {
  		slice.loadUint(32);
		return {
  			kind: 'ChanMsg_chan_msg_payout'
  		};
  	};
	throw new Error('');
  }
export function storeChanMsg(chanMsg: ChanMsg): (builder: Builder) => void {
  	if ((chanMsg.kind == 'ChanMsg_chan_msg_init')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x27317822, 32);
			storeGrams(chanMsg.inc_A)(builder);
			storeGrams(chanMsg.inc_B)(builder);
			storeGrams(chanMsg.min_A)(builder);
			storeGrams(chanMsg.min_B)(builder);
			builder.storeUint(chanMsg.channel_id, 64);
  		});
  	};
	if ((chanMsg.kind == 'ChanMsg_chan_msg_close')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0xf28ae183, 32);
			storeGrams(chanMsg.extra_A)(builder);
			storeGrams(chanMsg.extra_B)(builder);
			storeChanSignedPromise(chanMsg.promise)(builder);
  		});
  	};
	if ((chanMsg.kind == 'ChanMsg_chan_msg_timeout')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x43278a28, 32);
  		});
  	};
	if ((chanMsg.kind == 'ChanMsg_chan_msg_payout')) {
  		return ((builder: Builder) => {
  			builder.storeUint(0x37fe7810, 32);
  		});
  	};
	throw new Error('');
  }
export type ChanSignedMsg = {
  	kind: 'ChanSignedMsg';
	sig_A: Maybe<BitString>;
	sig_B: Maybe<BitString>;
	msg: ChanMsg;
  };
export function loadChanSignedMsg(slice: Slice): ChanSignedMsg {
  	let sig_A: Maybe<BitString> = loadMaybe<BitString>(slice, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return slice1.loadBits(512);
  	}));
	let sig_B: Maybe<BitString> = loadMaybe<BitString>(slice, ((slice: Slice) => {
  		let slice1 = slice.loadRef().beginParse();
		return slice1.loadBits(512);
  	}));
	let msg: ChanMsg = loadChanMsg(slice);
	return {
  		kind: 'ChanSignedMsg',
		sig_A: sig_A,
		sig_B: sig_B,
		msg: msg
  	};
  }
export function storeChanSignedMsg(chanSignedMsg: ChanSignedMsg): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		storeMaybe<BitString>(chanSignedMsg.sig_A, ((arg: BitString) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				cell1.storeBits(arg)
				builder.storeRef(cell1);
  			});
  		}))(builder);
		storeMaybe<BitString>(chanSignedMsg.sig_B, ((arg: BitString) => {
  			return ((builder: Builder) => {
  				let cell1 = beginCell()
				cell1.storeBits(arg)
				builder.storeRef(cell1);
  			});
  		}))(builder);
		storeChanMsg(chanSignedMsg.msg)(builder);
  	});
  }
export type ChanOp = {
  	kind: 'ChanOp';
	msg: ChanSignedMsg;
  };
export function loadChanOp(slice: Slice): ChanOp {
  	if ((slice.preloadUint(32) == 0x912838d1)) {
  		slice.loadUint(32);
		let msg: ChanSignedMsg = loadChanSignedMsg(slice);
		return {
  			kind: 'ChanOp',
			msg: msg
  		};
  	};
	throw new Error('');
  }
export function storeChanOp(chanOp: ChanOp): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		builder.storeUint(0x912838d1, 32);
		storeChanSignedMsg(chanOp.msg)(builder);
  	});
  }
export type ChanData = {
  	kind: 'ChanData';
	config: ChanConfig;
	state: ChanState;
  };
export function loadChanData(slice: Slice): ChanData {
  	let slice1 = slice.loadRef().beginParse();
	let config: ChanConfig = loadChanConfig(slice1);
	let slice2 = slice.loadRef().beginParse();
	let state: ChanState = loadChanState(slice2);
	return {
  		kind: 'ChanData',
		config: config,
		state: state
  	};
  }
export function storeChanData(chanData: ChanData): (builder: Builder) => void {
  	return ((builder: Builder) => {
  		let cell1 = beginCell();
		storeChanConfig(chanData.config)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeChanState(chanData.state)(cell2);
		builder.storeRef(cell2);
  	});
  }
