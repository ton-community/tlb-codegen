import { Builder } from 'ton'
import { Slice } from 'ton'
import { beginCell } from 'ton'
import { BitString } from 'ton'
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
export type Bool = Bool_bool_false | Bool_bool_true;
export type Bool_bool_false = {
  	kind: 'Bool_bool_false';
  };
export type Bool_bool_true = {
  	kind: 'Bool_bool_true';
  };
export function loadBool(slice: Slice): Bool {
  	if ((slice.preloadUint(1) == 0b0)) {
  		return {
  			kind: 'Bool_bool_false'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		return {
  			kind: 'Bool_bool_true'
  		};
  	};
	throw new Error('');
  }
export function storeBool(bool: Bool): (builder: Builder) => void {
  	if ((bool.kind == 'Bool_bool_false')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((bool.kind == 'Bool_bool_true')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
  		};
  	};
	throw new Error('');
  }
export type BoolFalse = {
  	kind: 'BoolFalse';
  };
export function loadBoolFalse(slice: Slice): BoolFalse {
  	return {
  		kind: 'BoolFalse'
  	};
  }
export function storeBoolFalse(boolFalse: BoolFalse): (builder: Builder) => void {
  	return (builder: Builder) => {
  
  	};
  }
export type BoolTrue = {
  	kind: 'BoolTrue';
  };
export function loadBoolTrue(slice: Slice): BoolTrue {
  	return {
  		kind: 'BoolTrue'
  	};
  }
export function storeBoolTrue(boolTrue: BoolTrue): (builder: Builder) => void {
  	return (builder: Builder) => {
  
  	};
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
  		return {
  			kind: 'Maybe_nothing'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		return {
  			kind: 'Maybe_just',
			value: loadX(slice)
  		};
  	};
	throw new Error('');
  }
export function storeMaybe<X>(maybe: Maybe<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((maybe.kind == 'Maybe_nothing')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((maybe.kind == 'Maybe_just')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeX(maybe.value)(builder);
  		};
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
  		return {
  			kind: 'Either_left',
			value: loadX(slice)
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		return {
  			kind: 'Either_right',
			value: loadY(slice)
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
	return {
  		kind: 'Hashmap',
		m: (n - l),
		n: n,
		label: label,
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
  	if ((n == 0)) {
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
			n: (n + 1),
			left: loadHashmap<X>(slice1, n, loadX),
			right: loadHashmap<X>(slice2, n, loadX)
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
  		let len: Unary = loadUnary(slice);
		return {
  			kind: 'HmLabel_hml_short',
			m: m,
			n: hmLabel_hml_short_get_n(len),
			len: len
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		return {
  			kind: 'HmLabel_hml_long',
			m: m
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		let v: BitString;
		(v = slice.loadBits(1));
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
  		return {
  			kind: 'Unary_unary_zero'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
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
  		return {
  			kind: 'HashmapE_hme_empty',
			n: n
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'HashmapE_hme_root',
			n: n,
			root: loadHashmap<X>(slice1, n, loadX)
  		};
  	};
	throw new Error('');
  }
export function storeHashmapE<X>(hashmapE: HashmapE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((hashmapE.kind == 'HashmapE_hme_empty')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((hashmapE.kind == 'HashmapE_hme_root')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeHashmap<X>(hashmapE.root, storeX)(cell1);
			builder.storeRef(cell1);
  		};
  	};
	throw new Error('');
  }
export function loadBitstringSet(slice: Slice, n: number): BitstringSet {
  
  }
export function storeBitstringSet(bitstringSet: BitstringSet): (builder: Builder) => void {
  
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
	return {
  		kind: 'HashmapAug',
		m: (n - l),
		n: n,
		label: label,
		node: loadHashmapAugNode<X,Y>(slice, m, loadX, loadY)
  	};
  }
export function storeHashmapAug<X,Y>(hashmapAug: HashmapAug<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeHmLabel(hashmapAug.label)(builder);
		storeHashmapAugNode<X,Y>(hashmapAug.node, storeX, storeY)(builder);
  	};
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
export function loadHashmapAugNode<X,Y>(slice: Slice, n: number, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): HashmapAugNode<X,Y> {
  	if ((n == 0)) {
  		return {
  			kind: 'HashmapAugNode_ahmn_leaf',
			extra: loadY(slice),
			value: loadX(slice)
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'HashmapAugNode_ahmn_fork',
			n: (n + 1),
			left: loadHashmapAug<X,Y>(slice1, n, loadX, loadY),
			right: loadHashmapAug<X,Y>(slice2, n, loadX, loadY),
			extra: loadY(slice)
  		};
  	};
	throw new Error('');
  }
export function storeHashmapAugNode<X,Y>(hashmapAugNode: HashmapAugNode<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((hashmapAugNode.kind == 'HashmapAugNode_ahmn_leaf')) {
  		return (builder: Builder) => {
  			storeY(hashmapAugNode.extra)(builder);
			storeX(hashmapAugNode.value)(builder);
  		};
  	};
	if ((hashmapAugNode.kind == 'HashmapAugNode_ahmn_fork')) {
  		return (builder: Builder) => {
  			let cell1 = beginCell();
			storeHashmapAug<X,Y>(hashmapAugNode.left, storeX, storeY)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeHashmapAug<X,Y>(hashmapAugNode.right, storeX, storeY)(cell2);
			builder.storeRef(cell2);
			storeY(hashmapAugNode.extra)(builder);
  		};
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
  		return {
  			kind: 'HashmapAugE_ahme_empty',
			n: n,
			extra: loadY(slice)
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'HashmapAugE_ahme_root',
			n: n,
			root: loadHashmapAug<X,Y>(slice1, n, loadX, loadY),
			extra: loadY(slice)
  		};
  	};
	throw new Error('');
  }
export function storeHashmapAugE<X,Y>(hashmapAugE: HashmapAugE<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((hashmapAugE.kind == 'HashmapAugE_ahme_empty')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeY(hashmapAugE.extra)(builder);
  		};
  	};
	if ((hashmapAugE.kind == 'HashmapAugE_ahme_root')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeHashmapAug<X,Y>(hashmapAugE.root, storeX, storeY)(cell1);
			builder.storeRef(cell1);
			storeY(hashmapAugE.extra)(builder);
  		};
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
	return {
  		kind: 'VarHashmap',
		m: (n - l),
		n: n,
		label: label,
		node: loadVarHashmapNode<X>(slice, m, loadX)
  	};
  }
export function storeVarHashmap<X>(varHashmap: VarHashmap<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeHmLabel(varHashmap.label)(builder);
		storeVarHashmapNode<X>(varHashmap.node, storeX)(builder);
  	};
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
export function loadVarHashmapNode<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): VarHashmapNode<X> {
  	if ((slice.preloadUint(2) == 0b00)) {
  		return {
  			kind: 'VarHashmapNode_vhmn_leaf',
			n: n,
			value: loadX(slice)
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'VarHashmapNode_vhmn_fork',
			n: (n + 1),
			left: loadVarHashmap<X>(slice1, n, loadX),
			right: loadVarHashmap<X>(slice2, n, loadX),
			value: loadMaybe<X>(slice, loadX)
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let branch: BitString;
		(branch = slice.loadBits(1));
		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VarHashmapNode_vhmn_cont',
			n: (n + 1),
			branch: branch,
			child: loadVarHashmap<X>(slice1, n, loadX),
			value: loadX(slice)
  		};
  	};
	throw new Error('');
  }
export function storeVarHashmapNode<X>(varHashmapNode: VarHashmapNode<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((varHashmapNode.kind == 'VarHashmapNode_vhmn_leaf')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b00, 2);
			storeX(varHashmapNode.value)(builder);
  		};
  	};
	if ((varHashmapNode.kind == 'VarHashmapNode_vhmn_fork')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
			let cell1 = beginCell();
			storeVarHashmap<X>(varHashmapNode.left, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeVarHashmap<X>(varHashmapNode.right, storeX)(cell2);
			builder.storeRef(cell2);
			storeMaybe<X>(varHashmapNode.value, storeX)(builder);
  		};
  	};
	if ((varHashmapNode.kind == 'VarHashmapNode_vhmn_cont')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			builder.storeBits(varHashmapNode.branch);
			let cell1 = beginCell();
			storeVarHashmap<X>(varHashmapNode.child, storeX)(cell1);
			builder.storeRef(cell1);
			storeX(varHashmapNode.value)(builder);
  		};
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
  		return {
  			kind: 'VarHashmapE_vhme_empty',
			n: n
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VarHashmapE_vhme_root',
			n: n,
			root: loadVarHashmap<X>(slice1, n, loadX)
  		};
  	};
	throw new Error('');
  }
export function storeVarHashmapE<X>(varHashmapE: VarHashmapE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((varHashmapE.kind == 'VarHashmapE_vhme_empty')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((varHashmapE.kind == 'VarHashmapE_vhme_root')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeVarHashmap<X>(varHashmapE.root, storeX)(cell1);
			builder.storeRef(cell1);
  		};
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
	return {
  		kind: 'PfxHashmap',
		m: (n - l),
		n: n,
		label: label,
		node: loadPfxHashmapNode<X>(slice, m, loadX)
  	};
  }
export function storePfxHashmap<X>(pfxHashmap: PfxHashmap<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeHmLabel(pfxHashmap.label)(builder);
		storePfxHashmapNode<X>(pfxHashmap.node, storeX)(builder);
  	};
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
export function loadPfxHashmapNode<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): PfxHashmapNode<X> {
  	if ((slice.preloadUint(1) == 0b0)) {
  		return {
  			kind: 'PfxHashmapNode_phmn_leaf',
			n: n,
			value: loadX(slice)
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'PfxHashmapNode_phmn_fork',
			n: (n + 1),
			left: loadPfxHashmap<X>(slice1, n, loadX),
			right: loadPfxHashmap<X>(slice2, n, loadX)
  		};
  	};
	throw new Error('');
  }
export function storePfxHashmapNode<X>(pfxHashmapNode: PfxHashmapNode<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((pfxHashmapNode.kind == 'PfxHashmapNode_phmn_leaf')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeX(pfxHashmapNode.value)(builder);
  		};
  	};
	if ((pfxHashmapNode.kind == 'PfxHashmapNode_phmn_fork')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storePfxHashmap<X>(pfxHashmapNode.left, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storePfxHashmap<X>(pfxHashmapNode.right, storeX)(cell2);
			builder.storeRef(cell2);
  		};
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
  		return {
  			kind: 'PfxHashmapE_phme_empty',
			n: n
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'PfxHashmapE_phme_root',
			n: n,
			root: loadPfxHashmap<X>(slice1, n, loadX)
  		};
  	};
	throw new Error('');
  }
export function storePfxHashmapE<X>(pfxHashmapE: PfxHashmapE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((pfxHashmapE.kind == 'PfxHashmapE_phme_empty')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((pfxHashmapE.kind == 'PfxHashmapE_phme_root')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storePfxHashmap<X>(pfxHashmapE.root, storeX)(cell1);
			builder.storeRef(cell1);
  		};
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
  		return {
  			kind: 'MsgAddressExt_addr_none'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		let len: number;
		(len = slice.loadUint(9));
		let external_address: BitString;
		(external_address = slice.loadBits(len));
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
  		return (builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		};
  	};
	if ((msgAddressExt.kind == 'MsgAddressExt_addr_extern')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
			builder.storeUint(msgAddressExt.len, 9);
			builder.storeBits(msgAddressExt.external_address);
  		};
  	};
	throw new Error('');
  }
export type Anycast = {
  	kind: 'Anycast';
	depth: number;
	rewrite_pfx: BitString;
  };
export function loadAnycast(slice: Slice): Anycast {
  	let depth: number;
	(depth = slice.loadUint(5));
	let rewrite_pfx: BitString;
	(rewrite_pfx = slice.loadBits(depth));
	return {
  		kind: 'Anycast',
		depth: depth,
		rewrite_pfx: rewrite_pfx
  	};
  }
export function storeAnycast(anycast: Anycast): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(anycast.depth, 5);
		builder.storeBits(anycast.rewrite_pfx);
  	};
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
  		let workchain_id: number;
		(workchain_id = slice.loadInt(8));
		let address: BitString;
		(address = slice.loadBits(256));
		return {
  			kind: 'MsgAddressInt_addr_std',
			anycast: loadMaybe<Anycast>(slice, loadAnycast),
			workchain_id: workchain_id,
			address: address
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		let addr_len: number;
		(addr_len = slice.loadUint(9));
		let workchain_id: number;
		(workchain_id = slice.loadInt(32));
		let address: BitString;
		(address = slice.loadBits(addr_len));
		return {
  			kind: 'MsgAddressInt_addr_var',
			anycast: loadMaybe<Anycast>(slice, loadAnycast),
			addr_len: addr_len,
			workchain_id: workchain_id,
			address: address
  		};
  	};
	throw new Error('');
  }
export function storeMsgAddressInt(msgAddressInt: MsgAddressInt): (builder: Builder) => void {
  	if ((msgAddressInt.kind == 'MsgAddressInt_addr_std')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10, 2);
			storeMaybe<Anycast>(msgAddressInt.anycast, storeAnycast)(builder);
			builder.storeInt(msgAddressInt.workchain_id, 8);
			builder.storeBits(msgAddressInt.address);
  		};
  	};
	if ((msgAddressInt.kind == 'MsgAddressInt_addr_var')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
			storeMaybe<Anycast>(msgAddressInt.anycast, storeAnycast)(builder);
			builder.storeUint(msgAddressInt.addr_len, 9);
			builder.storeInt(msgAddressInt.workchain_id, 32);
			builder.storeBits(msgAddressInt.address);
  		};
  	};
	throw new Error('');
  }
export type MsgAddress = ;
export function loadMsgAddress(slice: Slice): MsgAddress {
  	throw new Error('');
  }
export function storeMsgAddress(msgAddress: MsgAddress): (builder: Builder) => void {
  	throw new Error('');
  }
export type VarUInteger = {
  	kind: 'VarUInteger';
	n: number;
	value: number;
  };
export function loadVarUInteger(slice: Slice, n: number): VarUInteger {
  	let value: number;
	(value = slice.loadUint((len * 8)));
	return {
  		kind: 'VarUInteger',
		n: n,
		value: value
  	};
  }
export function storeVarUInteger(varUInteger: VarUInteger): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(varUInteger.value, (varUInteger.len * 8));
  	};
  }
export type VarInteger = {
  	kind: 'VarInteger';
	n: number;
	value: number;
  };
export function loadVarInteger(slice: Slice, n: number): VarInteger {
  	let value: number;
	(value = slice.loadInt((len * 8)));
	return {
  		kind: 'VarInteger',
		n: n,
		value: value
  	};
  }
export function storeVarInteger(varInteger: VarInteger): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeInt(varInteger.value, (varInteger.len * 8));
  	};
  }
export type Grams = {
  	kind: 'Grams';
	amount: VarUInteger;
  };
export function loadGrams(slice: Slice): Grams {
  	return {
  		kind: 'Grams',
		amount: loadVarUInteger(slice, 16)
  	};
  }
export function storeGrams(grams: Grams): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeVarUInteger(grams.amount)(builder);
  	};
  }
export type ExtraCurrencyCollection = {
  	kind: 'ExtraCurrencyCollection';
	dict: HashmapE<number>;
  };
export function loadExtraCurrencyCollection(slice: Slice): ExtraCurrencyCollection {
  	return {
  		kind: 'ExtraCurrencyCollection',
		dict: loadHashmapE<number>(slice, 32, () => {
  			return slice.loadUint();
  		})
  	};
  }
export function storeExtraCurrencyCollection(extraCurrencyCollection: ExtraCurrencyCollection): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeHashmapE<number>(extraCurrencyCollection.dict, (arg: number) => {
  			return (builder: Builder) => {
  				builder.storeUint(arg, );
  			};
  		})(builder);
  	};
  }
export type CurrencyCollection = {
  	kind: 'CurrencyCollection';
	grams: Grams;
	other: ExtraCurrencyCollection;
  };
export function loadCurrencyCollection(slice: Slice): CurrencyCollection {
  	return {
  		kind: 'CurrencyCollection',
		grams: loadGrams(slice),
		other: loadExtraCurrencyCollection(slice)
  	};
  }
export function storeCurrencyCollection(currencyCollection: CurrencyCollection): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeGrams(currencyCollection.grams)(builder);
		storeExtraCurrencyCollection(currencyCollection.other)(builder);
  	};
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
  		let created_lt: number;
		(created_lt = slice.loadUint(64));
		let created_at: number;
		(created_at = slice.loadUint(32));
		return {
  			kind: 'CommonMsgInfo_int_msg_info',
			ihr_disabled: loadBool(slice),
			bounce: loadBool(slice),
			bounced: loadBool(slice),
			src: loadMsgAddressInt(slice),
			dest: loadMsgAddressInt(slice),
			value: loadCurrencyCollection(slice),
			ihr_fee: loadGrams(slice),
			fwd_fee: loadGrams(slice),
			created_lt: created_lt,
			created_at: created_at
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		return {
  			kind: 'CommonMsgInfo_ext_in_msg_info',
			src: loadMsgAddressExt(slice),
			dest: loadMsgAddressInt(slice),
			import_fee: loadGrams(slice)
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		let created_lt: number;
		(created_lt = slice.loadUint(64));
		let created_at: number;
		(created_at = slice.loadUint(32));
		return {
  			kind: 'CommonMsgInfo_ext_out_msg_info',
			src: loadMsgAddressInt(slice),
			dest: loadMsgAddressExt(slice),
			created_lt: created_lt,
			created_at: created_at
  		};
  	};
	throw new Error('');
  }
export function storeCommonMsgInfo(commonMsgInfo: CommonMsgInfo): (builder: Builder) => void {
  	if ((commonMsgInfo.kind == 'CommonMsgInfo_int_msg_info')) {
  		return (builder: Builder) => {
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
  		};
  	};
	if ((commonMsgInfo.kind == 'CommonMsgInfo_ext_in_msg_info')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10, 2);
			storeMsgAddressExt(commonMsgInfo.src)(builder);
			storeMsgAddressInt(commonMsgInfo.dest)(builder);
			storeGrams(commonMsgInfo.import_fee)(builder);
  		};
  	};
	if ((commonMsgInfo.kind == 'CommonMsgInfo_ext_out_msg_info')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
			storeMsgAddressInt(commonMsgInfo.src)(builder);
			storeMsgAddressExt(commonMsgInfo.dest)(builder);
			builder.storeUint(commonMsgInfo.created_lt, 64);
			builder.storeUint(commonMsgInfo.created_at, 32);
  		};
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
  		let created_lt: number;
		(created_lt = slice.loadUint(64));
		let created_at: number;
		(created_at = slice.loadUint(32));
		return {
  			kind: 'CommonMsgInfoRelaxed_int_msg_info',
			ihr_disabled: loadBool(slice),
			bounce: loadBool(slice),
			bounced: loadBool(slice),
			src: loadMsgAddress(slice),
			dest: loadMsgAddressInt(slice),
			value: loadCurrencyCollection(slice),
			ihr_fee: loadGrams(slice),
			fwd_fee: loadGrams(slice),
			created_lt: created_lt,
			created_at: created_at
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		let created_lt: number;
		(created_lt = slice.loadUint(64));
		let created_at: number;
		(created_at = slice.loadUint(32));
		return {
  			kind: 'CommonMsgInfoRelaxed_ext_out_msg_info',
			src: loadMsgAddress(slice),
			dest: loadMsgAddressExt(slice),
			created_lt: created_lt,
			created_at: created_at
  		};
  	};
	throw new Error('');
  }
export function storeCommonMsgInfoRelaxed(commonMsgInfoRelaxed: CommonMsgInfoRelaxed): (builder: Builder) => void {
  	if ((commonMsgInfoRelaxed.kind == 'CommonMsgInfoRelaxed_int_msg_info')) {
  		return (builder: Builder) => {
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
  		};
  	};
	if ((commonMsgInfoRelaxed.kind == 'CommonMsgInfoRelaxed_ext_out_msg_info')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
			storeMsgAddress(commonMsgInfoRelaxed.src)(builder);
			storeMsgAddressExt(commonMsgInfoRelaxed.dest)(builder);
			builder.storeUint(commonMsgInfoRelaxed.created_lt, 64);
			builder.storeUint(commonMsgInfoRelaxed.created_at, 32);
  		};
  	};
	throw new Error('');
  }
export type TickTock = {
  	kind: 'TickTock';
	tick: Bool;
	tock: Bool;
  };
export function loadTickTock(slice: Slice): TickTock {
  	return {
  		kind: 'TickTock',
		tick: loadBool(slice),
		tock: loadBool(slice)
  	};
  }
export function storeTickTock(tickTock: TickTock): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeBool(tickTock.tick)(builder);
		storeBool(tickTock.tock)(builder);
  	};
  }
export function loadStateInit(slice: Slice): StateInit {
  
  }
export function storeStateInit(stateInit: StateInit): (builder: Builder) => void {
  
  }
export type SimpleLib = {
  	kind: 'SimpleLib';
	public: Bool;
	root: Slice;
  };
export function loadSimpleLib(slice: Slice): SimpleLib {
  	let slice1 = slice.loadRef().beginParse();
	let root: Slice;
	(root = slice1);
	return {
  		kind: 'SimpleLib',
		public: loadBool(slice),
		root: root
  	};
  }
export function storeSimpleLib(simpleLib: SimpleLib): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeBool(simpleLib.public)(builder);
		let cell1 = beginCell();
		cell1.storeSlice(simpleLib.root);
		builder.storeRef(cell1);
  	};
  }
export type Message<X> = {
  	kind: 'Message';
	info: CommonMsgInfo;
	init: Maybe<number>;
	body: Either<X>;
  };
export function loadMessage<X>(slice: Slice, loadX: (slice: Slice) => X): Message<X> {
  	return {
  		kind: 'Message',
		info: loadCommonMsgInfo(slice),
		init: loadMaybe<number>(slice, () => {
  			return slice.loadUint();
  		}),
		body: loadEither<X>(slice, loadX)
  	};
  }
export function storeMessage<X>(message: Message<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeCommonMsgInfo(message.info)(builder);
		storeMaybe<number>(message.init, (arg: number) => {
  			return (builder: Builder) => {
  				builder.storeUint(arg, );
  			};
  		})(builder);
		storeEither<X>(message.body, storeX)(builder);
  	};
  }
export type MessageRelaxed<X> = {
  	kind: 'MessageRelaxed';
	info: CommonMsgInfoRelaxed;
	init: Maybe<number>;
	body: Either<X>;
  };
export function loadMessageRelaxed<X>(slice: Slice, loadX: (slice: Slice) => X): MessageRelaxed<X> {
  	return {
  		kind: 'MessageRelaxed',
		info: loadCommonMsgInfoRelaxed(slice),
		init: loadMaybe<number>(slice, () => {
  			return slice.loadUint();
  		}),
		body: loadEither<X>(slice, loadX)
  	};
  }
export function storeMessageRelaxed<X>(messageRelaxed: MessageRelaxed<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeCommonMsgInfoRelaxed(messageRelaxed.info)(builder);
		storeMaybe<number>(messageRelaxed.init, (arg: number) => {
  			return (builder: Builder) => {
  				builder.storeUint(arg, );
  			};
  		})(builder);
		storeEither<X>(messageRelaxed.body, storeX)(builder);
  	};
  }
export function loadMessageAny(slice: Slice): MessageAny {
  
  }
export function storeMessageAny(messageAny: MessageAny): (builder: Builder) => void {
  
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
  		let use_dest_bits: number;
		(use_dest_bits = slice.loadUint(7));
		return {
  			kind: 'IntermediateAddress_interm_addr_regular',
			use_dest_bits: use_dest_bits
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		let workchain_id: number;
		(workchain_id = slice.loadInt(8));
		let addr_pfx: number;
		(addr_pfx = slice.loadUint(64));
		return {
  			kind: 'IntermediateAddress_interm_addr_simple',
			workchain_id: workchain_id,
			addr_pfx: addr_pfx
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		let workchain_id: number;
		(workchain_id = slice.loadInt(32));
		let addr_pfx: number;
		(addr_pfx = slice.loadUint(64));
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
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			builder.storeUint(intermediateAddress.use_dest_bits, 7);
  		};
  	};
	if ((intermediateAddress.kind == 'IntermediateAddress_interm_addr_simple')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10, 2);
			builder.storeInt(intermediateAddress.workchain_id, 8);
			builder.storeUint(intermediateAddress.addr_pfx, 64);
  		};
  	};
	if ((intermediateAddress.kind == 'IntermediateAddress_interm_addr_ext')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
			builder.storeInt(intermediateAddress.workchain_id, 32);
			builder.storeUint(intermediateAddress.addr_pfx, 64);
  		};
  	};
	throw new Error('');
  }
export type MsgEnvelope = {
  	kind: 'MsgEnvelope';
	cur_addr: IntermediateAddress;
	next_addr: IntermediateAddress;
	fwd_fee_remaining: Grams;
	msg: Message<Any>;
  };
export function loadMsgEnvelope(slice: Slice): MsgEnvelope {
  	let slice1 = slice.loadRef().beginParse();
	return {
  		kind: 'MsgEnvelope',
		cur_addr: loadIntermediateAddress(slice),
		next_addr: loadIntermediateAddress(slice),
		fwd_fee_remaining: loadGrams(slice),
		msg: loadMessage<Any>(slice1, loadAny)
  	};
  }
export function storeMsgEnvelope(msgEnvelope: MsgEnvelope): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeIntermediateAddress(msgEnvelope.cur_addr)(builder);
		storeIntermediateAddress(msgEnvelope.next_addr)(builder);
		storeGrams(msgEnvelope.fwd_fee_remaining)(builder);
		let cell1 = beginCell();
		storeMessage<Any>(msgEnvelope.msg, storeAny)(cell1);
		builder.storeRef(cell1);
  	};
  }
export type InMsg = InMsg_msg_import_ext | InMsg_msg_import_ihr | InMsg_msg_import_imm | InMsg_msg_import_fin | InMsg_msg_import_tr | InMsg_msg_discard_fin | InMsg_msg_discard_tr;
export type InMsg_msg_import_ext = {
  	kind: 'InMsg_msg_import_ext';
	msg: Message<Any>;
	transaction: Transaction;
  };
export type InMsg_msg_import_ihr = {
  	kind: 'InMsg_msg_import_ihr';
	msg: Message<Any>;
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
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'InMsg_msg_import_ext',
			msg: loadMessage<Any>(slice1, loadAny),
			transaction: loadTransaction(slice2)
  		};
  	};
	if ((slice.preloadUint(3) == 0b010)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		let slice3 = slice.loadRef().beginParse();
		let proof_created: Slice;
		(proof_created = slice3);
		return {
  			kind: 'InMsg_msg_import_ihr',
			msg: loadMessage<Any>(slice1, loadAny),
			transaction: loadTransaction(slice2),
			ihr_fee: loadGrams(slice),
			proof_created: proof_created
  		};
  	};
	if ((slice.preloadUint(3) == 0b011)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'InMsg_msg_import_imm',
			in_msg: loadMsgEnvelope(slice1),
			transaction: loadTransaction(slice2),
			fwd_fee: loadGrams(slice)
  		};
  	};
	if ((slice.preloadUint(3) == 0b100)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'InMsg_msg_import_fin',
			in_msg: loadMsgEnvelope(slice1),
			transaction: loadTransaction(slice2),
			fwd_fee: loadGrams(slice)
  		};
  	};
	if ((slice.preloadUint(3) == 0b101)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'InMsg_msg_import_tr',
			in_msg: loadMsgEnvelope(slice1),
			out_msg: loadMsgEnvelope(slice2),
			transit_fee: loadGrams(slice)
  		};
  	};
	if ((slice.preloadUint(3) == 0b110)) {
  		let slice1 = slice.loadRef().beginParse();
		let transaction_id: number;
		(transaction_id = slice.loadUint(64));
		return {
  			kind: 'InMsg_msg_discard_fin',
			in_msg: loadMsgEnvelope(slice1),
			transaction_id: transaction_id,
			fwd_fee: loadGrams(slice)
  		};
  	};
	if ((slice.preloadUint(3) == 0b111)) {
  		let slice1 = slice.loadRef().beginParse();
		let transaction_id: number;
		(transaction_id = slice.loadUint(64));
		let slice2 = slice.loadRef().beginParse();
		let proof_delivered: Slice;
		(proof_delivered = slice2);
		return {
  			kind: 'InMsg_msg_discard_tr',
			in_msg: loadMsgEnvelope(slice1),
			transaction_id: transaction_id,
			fwd_fee: loadGrams(slice),
			proof_delivered: proof_delivered
  		};
  	};
	throw new Error('');
  }
export function storeInMsg(inMsg: InMsg): (builder: Builder) => void {
  	if ((inMsg.kind == 'InMsg_msg_import_ext')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b000, 3);
			let cell1 = beginCell();
			storeMessage<Any>(inMsg.msg, storeAny)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(inMsg.transaction)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	if ((inMsg.kind == 'InMsg_msg_import_ihr')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b010, 3);
			let cell1 = beginCell();
			storeMessage<Any>(inMsg.msg, storeAny)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(inMsg.transaction)(cell2);
			builder.storeRef(cell2);
			storeGrams(inMsg.ihr_fee)(builder);
			let cell3 = beginCell();
			cell3.storeSlice(inMsg.proof_created);
			builder.storeRef(cell3);
  		};
  	};
	if ((inMsg.kind == 'InMsg_msg_import_imm')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b011, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(inMsg.transaction)(cell2);
			builder.storeRef(cell2);
			storeGrams(inMsg.fwd_fee)(builder);
  		};
  	};
	if ((inMsg.kind == 'InMsg_msg_import_fin')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b100, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(inMsg.transaction)(cell2);
			builder.storeRef(cell2);
			storeGrams(inMsg.fwd_fee)(builder);
  		};
  	};
	if ((inMsg.kind == 'InMsg_msg_import_tr')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b101, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeMsgEnvelope(inMsg.out_msg)(cell2);
			builder.storeRef(cell2);
			storeGrams(inMsg.transit_fee)(builder);
  		};
  	};
	if ((inMsg.kind == 'InMsg_msg_discard_fin')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b110, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			builder.storeUint(inMsg.transaction_id, 64);
			storeGrams(inMsg.fwd_fee)(builder);
  		};
  	};
	if ((inMsg.kind == 'InMsg_msg_discard_tr')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b111, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(inMsg.in_msg)(cell1);
			builder.storeRef(cell1);
			builder.storeUint(inMsg.transaction_id, 64);
			storeGrams(inMsg.fwd_fee)(builder);
			let cell2 = beginCell();
			cell2.storeSlice(inMsg.proof_delivered);
			builder.storeRef(cell2);
  		};
  	};
	throw new Error('');
  }
export type ImportFees = {
  	kind: 'ImportFees';
	fees_collected: Grams;
	value_imported: CurrencyCollection;
  };
export function loadImportFees(slice: Slice): ImportFees {
  	return {
  		kind: 'ImportFees',
		fees_collected: loadGrams(slice),
		value_imported: loadCurrencyCollection(slice)
  	};
  }
export function storeImportFees(importFees: ImportFees): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeGrams(importFees.fees_collected)(builder);
		storeCurrencyCollection(importFees.value_imported)(builder);
  	};
  }
export function loadInMsgDescr(slice: Slice): InMsgDescr {
  
  }
export function storeInMsgDescr(inMsgDescr: InMsgDescr): (builder: Builder) => void {
  
  }
export type OutMsg = OutMsg_msg_export_ext | OutMsg_msg_export_imm | OutMsg_msg_export_new | OutMsg_msg_export_tr | OutMsg_msg_export_deq | OutMsg_msg_export_deq_short | OutMsg_msg_export_tr_req | OutMsg_msg_export_deq_imm;
export type OutMsg_msg_export_ext = {
  	kind: 'OutMsg_msg_export_ext';
	msg: Message<Any>;
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
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'OutMsg_msg_export_ext',
			msg: loadMessage<Any>(slice1, loadAny),
			transaction: loadTransaction(slice2)
  		};
  	};
	if ((slice.preloadUint(3) == 0b010)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		let slice3 = slice.loadRef().beginParse();
		return {
  			kind: 'OutMsg_msg_export_imm',
			out_msg: loadMsgEnvelope(slice1),
			transaction: loadTransaction(slice2),
			reimport: loadInMsg(slice3)
  		};
  	};
	if ((slice.preloadUint(3) == 0b001)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'OutMsg_msg_export_new',
			out_msg: loadMsgEnvelope(slice1),
			transaction: loadTransaction(slice2)
  		};
  	};
	if ((slice.preloadUint(3) == 0b011)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'OutMsg_msg_export_tr',
			out_msg: loadMsgEnvelope(slice1),
			imported: loadInMsg(slice2)
  		};
  	};
	if ((slice.preloadUint(4) == 0b1100)) {
  		let slice1 = slice.loadRef().beginParse();
		let import_block_lt: number;
		(import_block_lt = slice.loadUint(63));
		return {
  			kind: 'OutMsg_msg_export_deq',
			out_msg: loadMsgEnvelope(slice1),
			import_block_lt: import_block_lt
  		};
  	};
	if ((slice.preloadUint(4) == 0b1101)) {
  		let msg_env_hash: BitString;
		(msg_env_hash = slice.loadBits(256));
		let next_workchain: number;
		(next_workchain = slice.loadInt(32));
		let next_addr_pfx: number;
		(next_addr_pfx = slice.loadUint(64));
		let import_block_lt: number;
		(import_block_lt = slice.loadUint(64));
		return {
  			kind: 'OutMsg_msg_export_deq_short',
			msg_env_hash: msg_env_hash,
			next_workchain: next_workchain,
			next_addr_pfx: next_addr_pfx,
			import_block_lt: import_block_lt
  		};
  	};
	if ((slice.preloadUint(3) == 0b111)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'OutMsg_msg_export_tr_req',
			out_msg: loadMsgEnvelope(slice1),
			imported: loadInMsg(slice2)
  		};
  	};
	if ((slice.preloadUint(3) == 0b100)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'OutMsg_msg_export_deq_imm',
			out_msg: loadMsgEnvelope(slice1),
			reimport: loadInMsg(slice2)
  		};
  	};
	throw new Error('');
  }
export function storeOutMsg(outMsg: OutMsg): (builder: Builder) => void {
  	if ((outMsg.kind == 'OutMsg_msg_export_ext')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b000, 3);
			let cell1 = beginCell();
			storeMessage<Any>(outMsg.msg, storeAny)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(outMsg.transaction)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_imm')) {
  		return (builder: Builder) => {
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
  		};
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_new')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b001, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeTransaction(outMsg.transaction)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_tr')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b011, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeInMsg(outMsg.imported)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_deq')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1100, 4);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			builder.storeUint(outMsg.import_block_lt, 63);
  		};
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_deq_short')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1101, 4);
			builder.storeBits(outMsg.msg_env_hash);
			builder.storeInt(outMsg.next_workchain, 32);
			builder.storeUint(outMsg.next_addr_pfx, 64);
			builder.storeUint(outMsg.import_block_lt, 64);
  		};
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_tr_req')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b111, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeInMsg(outMsg.imported)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	if ((outMsg.kind == 'OutMsg_msg_export_deq_imm')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b100, 3);
			let cell1 = beginCell();
			storeMsgEnvelope(outMsg.out_msg)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeInMsg(outMsg.reimport)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	throw new Error('');
  }
export function loadEnqueuedMsg(slice: Slice): EnqueuedMsg {
  
  }
export function storeEnqueuedMsg(enqueuedMsg: EnqueuedMsg): (builder: Builder) => void {
  
  }
export function loadOutMsgDescr(slice: Slice): OutMsgDescr {
  
  }
export function storeOutMsgDescr(outMsgDescr: OutMsgDescr): (builder: Builder) => void {
  
  }
export function loadOutMsgQueue(slice: Slice): OutMsgQueue {
  
  }
export function storeOutMsgQueue(outMsgQueue: OutMsgQueue): (builder: Builder) => void {
  
  }
export type ProcessedUpto = {
  	kind: 'ProcessedUpto';
	last_msg_lt: number;
	last_msg_hash: BitString;
  };
export function loadProcessedUpto(slice: Slice): ProcessedUpto {
  	let last_msg_lt: number;
	(last_msg_lt = slice.loadUint(64));
	let last_msg_hash: BitString;
	(last_msg_hash = slice.loadBits(256));
	return {
  		kind: 'ProcessedUpto',
		last_msg_lt: last_msg_lt,
		last_msg_hash: last_msg_hash
  	};
  }
export function storeProcessedUpto(processedUpto: ProcessedUpto): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(processedUpto.last_msg_lt, 64);
		builder.storeBits(processedUpto.last_msg_hash);
  	};
  }
export function loadProcessedInfo(slice: Slice): ProcessedInfo {
  
  }
export function storeProcessedInfo(processedInfo: ProcessedInfo): (builder: Builder) => void {
  
  }
export type IhrPendingSince = {
  	kind: 'IhrPendingSince';
	import_lt: number;
  };
export function loadIhrPendingSince(slice: Slice): IhrPendingSince {
  	let import_lt: number;
	(import_lt = slice.loadUint(64));
	return {
  		kind: 'IhrPendingSince',
		import_lt: import_lt
  	};
  }
export function storeIhrPendingSince(ihrPendingSince: IhrPendingSince): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(ihrPendingSince.import_lt, 64);
  	};
  }
export function loadIhrPendingInfo(slice: Slice): IhrPendingInfo {
  
  }
export function storeIhrPendingInfo(ihrPendingInfo: IhrPendingInfo): (builder: Builder) => void {
  
  }
export function loadOutMsgQueueInfo(slice: Slice): OutMsgQueueInfo {
  
  }
export function storeOutMsgQueueInfo(outMsgQueueInfo: OutMsgQueueInfo): (builder: Builder) => void {
  
  }
export type StorageUsed = {
  	kind: 'StorageUsed';
	cells: VarUInteger;
	bits: VarUInteger;
	public_cells: VarUInteger;
  };
export function loadStorageUsed(slice: Slice): StorageUsed {
  	return {
  		kind: 'StorageUsed',
		cells: loadVarUInteger(slice, 7),
		bits: loadVarUInteger(slice, 7),
		public_cells: loadVarUInteger(slice, 7)
  	};
  }
export function storeStorageUsed(storageUsed: StorageUsed): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeVarUInteger(storageUsed.cells)(builder);
		storeVarUInteger(storageUsed.bits)(builder);
		storeVarUInteger(storageUsed.public_cells)(builder);
  	};
  }
export type StorageUsedShort = {
  	kind: 'StorageUsedShort';
	cells: VarUInteger;
	bits: VarUInteger;
  };
export function loadStorageUsedShort(slice: Slice): StorageUsedShort {
  	return {
  		kind: 'StorageUsedShort',
		cells: loadVarUInteger(slice, 7),
		bits: loadVarUInteger(slice, 7)
  	};
  }
export function storeStorageUsedShort(storageUsedShort: StorageUsedShort): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeVarUInteger(storageUsedShort.cells)(builder);
		storeVarUInteger(storageUsedShort.bits)(builder);
  	};
  }
export type StorageInfo = {
  	kind: 'StorageInfo';
	used: StorageUsed;
	last_paid: number;
	due_payment: Maybe<Grams>;
  };
export function loadStorageInfo(slice: Slice): StorageInfo {
  	let last_paid: number;
	(last_paid = slice.loadUint(32));
	return {
  		kind: 'StorageInfo',
		used: loadStorageUsed(slice),
		last_paid: last_paid,
		due_payment: loadMaybe<Grams>(slice, loadGrams)
  	};
  }
export function storeStorageInfo(storageInfo: StorageInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeStorageUsed(storageInfo.used)(builder);
		builder.storeUint(storageInfo.last_paid, 32);
		storeMaybe<Grams>(storageInfo.due_payment, storeGrams)(builder);
  	};
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
  		return {
  			kind: 'Account_account_none'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		return {
  			kind: 'Account_account',
			addr: loadMsgAddressInt(slice),
			storage_stat: loadStorageInfo(slice),
			storage: loadAccountStorage(slice)
  		};
  	};
	throw new Error('');
  }
export function storeAccount(account: Account): (builder: Builder) => void {
  	if ((account.kind == 'Account_account_none')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((account.kind == 'Account_account')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeMsgAddressInt(account.addr)(builder);
			storeStorageInfo(account.storage_stat)(builder);
			storeAccountStorage(account.storage)(builder);
  		};
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
  	let last_trans_lt: number;
	(last_trans_lt = slice.loadUint(64));
	return {
  		kind: 'AccountStorage',
		last_trans_lt: last_trans_lt,
		balance: loadCurrencyCollection(slice),
		state: loadAccountState(slice)
  	};
  }
export function storeAccountStorage(accountStorage: AccountStorage): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(accountStorage.last_trans_lt, 64);
		storeCurrencyCollection(accountStorage.balance)(builder);
		storeAccountState(accountStorage.state)(builder);
  	};
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
  		return {
  			kind: 'AccountState_account_uninit'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		return {
  			kind: 'AccountState_account_active',
			_: loadStateInit(slice)
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		let state_hash: BitString;
		(state_hash = slice.loadBits(256));
		return {
  			kind: 'AccountState_account_frozen',
			state_hash: state_hash
  		};
  	};
	throw new Error('');
  }
export function storeAccountState(accountState: AccountState): (builder: Builder) => void {
  	if ((accountState.kind == 'AccountState_account_uninit')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		};
  	};
	if ((accountState.kind == 'AccountState_account_active')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeStateInit(accountState._)(builder);
  		};
  	};
	if ((accountState.kind == 'AccountState_account_frozen')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
			builder.storeBits(accountState.state_hash);
  		};
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
  		return {
  			kind: 'AccountStatus_acc_state_uninit'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		return {
  			kind: 'AccountStatus_acc_state_frozen'
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		return {
  			kind: 'AccountStatus_acc_state_active'
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		return {
  			kind: 'AccountStatus_acc_state_nonexist'
  		};
  	};
	throw new Error('');
  }
export function storeAccountStatus(accountStatus: AccountStatus): (builder: Builder) => void {
  	if ((accountStatus.kind == 'AccountStatus_acc_state_uninit')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		};
  	};
	if ((accountStatus.kind == 'AccountStatus_acc_state_frozen')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
  		};
  	};
	if ((accountStatus.kind == 'AccountStatus_acc_state_active')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10, 2);
  		};
  	};
	if ((accountStatus.kind == 'AccountStatus_acc_state_nonexist')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
  		};
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
	let last_trans_hash: BitString;
	(last_trans_hash = slice.loadBits(256));
	let last_trans_lt: number;
	(last_trans_lt = slice.loadUint(64));
	return {
  		kind: 'ShardAccount',
		account: loadAccount(slice1),
		last_trans_hash: last_trans_hash,
		last_trans_lt: last_trans_lt
  	};
  }
export function storeShardAccount(shardAccount: ShardAccount): (builder: Builder) => void {
  	return (builder: Builder) => {
  		let cell1 = beginCell();
		storeAccount(shardAccount.account)(cell1);
		builder.storeRef(cell1);
		builder.storeBits(shardAccount.last_trans_hash);
		builder.storeUint(shardAccount.last_trans_lt, 64);
  	};
  }
export type DepthBalanceInfo = {
  	kind: 'DepthBalanceInfo';
	split_depth: number;
	balance: CurrencyCollection;
  };
export function loadDepthBalanceInfo(slice: Slice): DepthBalanceInfo {
  	let split_depth: number;
	(split_depth = slice.loadUint(5));
	return {
  		kind: 'DepthBalanceInfo',
		split_depth: split_depth,
		balance: loadCurrencyCollection(slice)
  	};
  }
export function storeDepthBalanceInfo(depthBalanceInfo: DepthBalanceInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(depthBalanceInfo.split_depth, 5);
		storeCurrencyCollection(depthBalanceInfo.balance)(builder);
  	};
  }
export function loadShardAccounts(slice: Slice): ShardAccounts {
  
  }
export function storeShardAccounts(shardAccounts: ShardAccounts): (builder: Builder) => void {
  
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
	in_msg: Maybe;
	out_msgs: HashmapE;
	total_fees: CurrencyCollection;
	state_update: HASH_UPDATE<Account>;
	description: TransactionDescr;
  };
export function loadTransaction(slice: Slice): Transaction {
  	let account_addr: BitString;
	(account_addr = slice.loadBits(256));
	let lt: number;
	(lt = slice.loadUint(64));
	let prev_trans_hash: BitString;
	(prev_trans_hash = slice.loadBits(256));
	let prev_trans_lt: number;
	(prev_trans_lt = slice.loadUint(64));
	let now: number;
	(now = slice.loadUint(32));
	let outmsg_cnt: number;
	(outmsg_cnt = slice.loadUint(15));
	let slice1 = slice.loadRef().beginParse();
	let slice2 = slice.loadRef().beginParse();
	let slice3 = slice.loadRef().beginParse();
	return {
  		kind: 'Transaction',
		account_addr: account_addr,
		lt: lt,
		prev_trans_hash: prev_trans_hash,
		prev_trans_lt: prev_trans_lt,
		now: now,
		outmsg_cnt: outmsg_cnt,
		orig_status: loadAccountStatus(slice),
		end_status: loadAccountStatus(slice),
		in_msg: loadMaybe(slice1),
		out_msgs: loadHashmapE(slice1, 15),
		total_fees: loadCurrencyCollection(slice),
		state_update: loadHASH_UPDATE<Account>(slice2, loadAccount),
		description: loadTransactionDescr(slice3)
  	};
  }
export function storeTransaction(transaction: Transaction): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(transaction.account_addr);
		builder.storeUint(transaction.lt, 64);
		builder.storeBits(transaction.prev_trans_hash);
		builder.storeUint(transaction.prev_trans_lt, 64);
		builder.storeUint(transaction.now, 32);
		builder.storeUint(transaction.outmsg_cnt, 15);
		storeAccountStatus(transaction.orig_status)(builder);
		storeAccountStatus(transaction.end_status)(builder);
		let cell1 = beginCell();
		storeMaybe(transaction.in_msg)(cell1);
		storeHashmapE(transaction.out_msgs)(cell1);
		builder.storeRef(cell1);
		storeCurrencyCollection(transaction.total_fees)(builder);
		let cell2 = beginCell();
		storeHASH_UPDATE<Account>(transaction.state_update, storeAccount)(cell2);
		builder.storeRef(cell2);
		let cell3 = beginCell();
		storeTransactionDescr(transaction.description)(cell3);
		builder.storeRef(cell3);
  	};
  }
export type MERKLE_UPDATE<X> = {
  	kind: 'MERKLE_UPDATE';
	old_hash: BitString;
	new_hash: BitString;
	old: X;
	new: X;
  };
export function loadMERKLE_UPDATE<X>(slice: Slice, loadX: (slice: Slice) => X): MERKLE_UPDATE<X> {
  	let old_hash: BitString;
	(old_hash = slice.loadBits(256));
	let new_hash: BitString;
	(new_hash = slice.loadBits(256));
	let slice1 = slice.loadRef().beginParse();
	let slice2 = slice.loadRef().beginParse();
	return {
  		kind: 'MERKLE_UPDATE',
		old_hash: old_hash,
		new_hash: new_hash,
		old: loadX(slice1),
		new: loadX(slice2)
  	};
  }
export function storeMERKLE_UPDATE<X>(mERKLE_UPDATE: MERKLE_UPDATE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(mERKLE_UPDATE.old_hash);
		builder.storeBits(mERKLE_UPDATE.new_hash);
		let cell1 = beginCell();
		storeX(mERKLE_UPDATE.old)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeX(mERKLE_UPDATE.new)(cell2);
		builder.storeRef(cell2);
  	};
  }
export type HASH_UPDATE<X> = {
  	kind: 'HASH_UPDATE';
	old_hash: BitString;
	new_hash: BitString;
  };
export function loadHASH_UPDATE<X>(slice: Slice, loadX: (slice: Slice) => X): HASH_UPDATE<X> {
  	let old_hash: BitString;
	(old_hash = slice.loadBits(256));
	let new_hash: BitString;
	(new_hash = slice.loadBits(256));
	return {
  		kind: 'HASH_UPDATE',
		old_hash: old_hash,
		new_hash: new_hash
  	};
  }
export function storeHASH_UPDATE<X>(hASH_UPDATE: HASH_UPDATE<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(hASH_UPDATE.old_hash);
		builder.storeBits(hASH_UPDATE.new_hash);
  	};
  }
export type MERKLE_PROOF<X> = {
  	kind: 'MERKLE_PROOF';
	virtual_hash: BitString;
	depth: number;
	virtual_root: X;
  };
export function loadMERKLE_PROOF<X>(slice: Slice, loadX: (slice: Slice) => X): MERKLE_PROOF<X> {
  	let virtual_hash: BitString;
	(virtual_hash = slice.loadBits(256));
	let depth: number;
	(depth = slice.loadUint(16));
	let slice1 = slice.loadRef().beginParse();
	return {
  		kind: 'MERKLE_PROOF',
		virtual_hash: virtual_hash,
		depth: depth,
		virtual_root: loadX(slice1)
  	};
  }
export function storeMERKLE_PROOF<X>(mERKLE_PROOF: MERKLE_PROOF<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(mERKLE_PROOF.virtual_hash);
		builder.storeUint(mERKLE_PROOF.depth, 16);
		let cell1 = beginCell();
		storeX(mERKLE_PROOF.virtual_root)(cell1);
		builder.storeRef(cell1);
  	};
  }
export type AccountBlock = {
  	kind: 'AccountBlock';
	account_addr: BitString;
	transactions: HashmapAug<CurrencyCollection>;
	state_update: HASH_UPDATE<Account>;
  };
export function loadAccountBlock(slice: Slice): AccountBlock {
  	let account_addr: BitString;
	(account_addr = slice.loadBits(256));
	let slice1 = slice.loadRef().beginParse();
	return {
  		kind: 'AccountBlock',
		account_addr: account_addr,
		transactions: loadHashmapAug<CurrencyCollection>(slice, 64, loadCurrencyCollection),
		state_update: loadHASH_UPDATE<Account>(slice1, loadAccount)
  	};
  }
export function storeAccountBlock(accountBlock: AccountBlock): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(accountBlock.account_addr);
		storeHashmapAug<CurrencyCollection>(accountBlock.transactions, storeCurrencyCollection)(builder);
		let cell1 = beginCell();
		storeHASH_UPDATE<Account>(accountBlock.state_update, storeAccount)(cell1);
		builder.storeRef(cell1);
  	};
  }
export function loadShardAccountBlocks(slice: Slice): ShardAccountBlocks {
  
  }
export function storeShardAccountBlocks(shardAccountBlocks: ShardAccountBlocks): (builder: Builder) => void {
  
  }
export type TrStoragePhase = {
  	kind: 'TrStoragePhase';
	storage_fees_collected: Grams;
	storage_fees_due: Maybe<Grams>;
	status_change: AccStatusChange;
  };
export function loadTrStoragePhase(slice: Slice): TrStoragePhase {
  	return {
  		kind: 'TrStoragePhase',
		storage_fees_collected: loadGrams(slice),
		storage_fees_due: loadMaybe<Grams>(slice, loadGrams),
		status_change: loadAccStatusChange(slice)
  	};
  }
export function storeTrStoragePhase(trStoragePhase: TrStoragePhase): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeGrams(trStoragePhase.storage_fees_collected)(builder);
		storeMaybe<Grams>(trStoragePhase.storage_fees_due, storeGrams)(builder);
		storeAccStatusChange(trStoragePhase.status_change)(builder);
  	};
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
  		return {
  			kind: 'AccStatusChange_acst_unchanged'
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		return {
  			kind: 'AccStatusChange_acst_frozen'
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		return {
  			kind: 'AccStatusChange_acst_deleted'
  		};
  	};
	throw new Error('');
  }
export function storeAccStatusChange(accStatusChange: AccStatusChange): (builder: Builder) => void {
  	if ((accStatusChange.kind == 'AccStatusChange_acst_unchanged')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((accStatusChange.kind == 'AccStatusChange_acst_frozen')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10, 2);
  		};
  	};
	if ((accStatusChange.kind == 'AccStatusChange_acst_deleted')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
  		};
  	};
	throw new Error('');
  }
export type TrCreditPhase = {
  	kind: 'TrCreditPhase';
	due_fees_collected: Maybe<Grams>;
	credit: CurrencyCollection;
  };
export function loadTrCreditPhase(slice: Slice): TrCreditPhase {
  	return {
  		kind: 'TrCreditPhase',
		due_fees_collected: loadMaybe<Grams>(slice, loadGrams),
		credit: loadCurrencyCollection(slice)
  	};
  }
export function storeTrCreditPhase(trCreditPhase: TrCreditPhase): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeMaybe<Grams>(trCreditPhase.due_fees_collected, storeGrams)(builder);
		storeCurrencyCollection(trCreditPhase.credit)(builder);
  	};
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
	gas_credit: Maybe<number>;
	mode: number;
	exit_code: number;
	exit_arg: Maybe<int32>;
	vm_steps: number;
	vm_init_state_hash: BitString;
	vm_final_state_hash: BitString;
  };
export function loadTrComputePhase(slice: Slice): TrComputePhase {
  	if ((slice.preloadUint(1) == 0b0)) {
  		return {
  			kind: 'TrComputePhase_tr_phase_compute_skipped',
			reason: loadComputeSkipReason(slice)
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		let mode: number;
		(mode = slice1.loadInt(8));
		let exit_code: number;
		(exit_code = slice1.loadInt(32));
		let vm_steps: number;
		(vm_steps = slice1.loadUint(32));
		let vm_init_state_hash: BitString;
		(vm_init_state_hash = slice1.loadBits(256));
		let vm_final_state_hash: BitString;
		(vm_final_state_hash = slice1.loadBits(256));
		return {
  			kind: 'TrComputePhase_tr_phase_compute_vm',
			success: loadBool(slice),
			msg_state_used: loadBool(slice),
			account_activated: loadBool(slice),
			gas_fees: loadGrams(slice),
			gas_used: loadVarUInteger(slice1, 7),
			gas_limit: loadVarUInteger(slice1, 7),
			gas_credit: loadMaybe<number>(slice1, () => {
  				return slice1.loadUint();
  			}),
			mode: mode,
			exit_code: exit_code,
			exit_arg: loadMaybe<int32>(slice1, loadint32),
			vm_steps: vm_steps,
			vm_init_state_hash: vm_init_state_hash,
			vm_final_state_hash: vm_final_state_hash
  		};
  	};
	throw new Error('');
  }
export function storeTrComputePhase(trComputePhase: TrComputePhase): (builder: Builder) => void {
  	if ((trComputePhase.kind == 'TrComputePhase_tr_phase_compute_skipped')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeComputeSkipReason(trComputePhase.reason)(builder);
  		};
  	};
	if ((trComputePhase.kind == 'TrComputePhase_tr_phase_compute_vm')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeBool(trComputePhase.success)(builder);
			storeBool(trComputePhase.msg_state_used)(builder);
			storeBool(trComputePhase.account_activated)(builder);
			storeGrams(trComputePhase.gas_fees)(builder);
			let cell1 = beginCell();
			storeVarUInteger(trComputePhase.gas_used)(cell1);
			storeVarUInteger(trComputePhase.gas_limit)(cell1);
			storeMaybe<number>(trComputePhase.gas_credit, (arg: number) => {
  				return (builder: Builder) => {
  					builder.storeUint(arg, );
  				};
  			})(cell1);
			cell1.storeInt(trComputePhase.mode, 8);
			cell1.storeInt(trComputePhase.exit_code, 32);
			storeMaybe<int32>(trComputePhase.exit_arg, storeint32)(cell1);
			cell1.storeUint(trComputePhase.vm_steps, 32);
			cell1.storeBits(trComputePhase.vm_init_state_hash);
			cell1.storeBits(trComputePhase.vm_final_state_hash);
			builder.storeRef(cell1);
  		};
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
  		return {
  			kind: 'ComputeSkipReason_cskip_no_state'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		return {
  			kind: 'ComputeSkipReason_cskip_bad_state'
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		return {
  			kind: 'ComputeSkipReason_cskip_no_gas'
  		};
  	};
	throw new Error('');
  }
export function storeComputeSkipReason(computeSkipReason: ComputeSkipReason): (builder: Builder) => void {
  	if ((computeSkipReason.kind == 'ComputeSkipReason_cskip_no_state')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		};
  	};
	if ((computeSkipReason.kind == 'ComputeSkipReason_cskip_bad_state')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
  		};
  	};
	if ((computeSkipReason.kind == 'ComputeSkipReason_cskip_no_gas')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10, 2);
  		};
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
	result_arg: Maybe<int32>;
	tot_actions: number;
	spec_actions: number;
	skipped_actions: number;
	msgs_created: number;
	action_list_hash: BitString;
	tot_msg_size: StorageUsedShort;
  };
export function loadTrActionPhase(slice: Slice): TrActionPhase {
  	let result_code: number;
	(result_code = slice.loadInt(32));
	let tot_actions: number;
	(tot_actions = slice.loadUint(16));
	let spec_actions: number;
	(spec_actions = slice.loadUint(16));
	let skipped_actions: number;
	(skipped_actions = slice.loadUint(16));
	let msgs_created: number;
	(msgs_created = slice.loadUint(16));
	let action_list_hash: BitString;
	(action_list_hash = slice.loadBits(256));
	return {
  		kind: 'TrActionPhase',
		success: loadBool(slice),
		valid: loadBool(slice),
		no_funds: loadBool(slice),
		status_change: loadAccStatusChange(slice),
		total_fwd_fees: loadMaybe<Grams>(slice, loadGrams),
		total_action_fees: loadMaybe<Grams>(slice, loadGrams),
		result_code: result_code,
		result_arg: loadMaybe<int32>(slice, loadint32),
		tot_actions: tot_actions,
		spec_actions: spec_actions,
		skipped_actions: skipped_actions,
		msgs_created: msgs_created,
		action_list_hash: action_list_hash,
		tot_msg_size: loadStorageUsedShort(slice)
  	};
  }
export function storeTrActionPhase(trActionPhase: TrActionPhase): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeBool(trActionPhase.success)(builder);
		storeBool(trActionPhase.valid)(builder);
		storeBool(trActionPhase.no_funds)(builder);
		storeAccStatusChange(trActionPhase.status_change)(builder);
		storeMaybe<Grams>(trActionPhase.total_fwd_fees, storeGrams)(builder);
		storeMaybe<Grams>(trActionPhase.total_action_fees, storeGrams)(builder);
		builder.storeInt(trActionPhase.result_code, 32);
		storeMaybe<int32>(trActionPhase.result_arg, storeint32)(builder);
		builder.storeUint(trActionPhase.tot_actions, 16);
		builder.storeUint(trActionPhase.spec_actions, 16);
		builder.storeUint(trActionPhase.skipped_actions, 16);
		builder.storeUint(trActionPhase.msgs_created, 16);
		builder.storeBits(trActionPhase.action_list_hash);
		storeStorageUsedShort(trActionPhase.tot_msg_size)(builder);
  	};
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
  		return {
  			kind: 'TrBouncePhase_tr_phase_bounce_negfunds'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		return {
  			kind: 'TrBouncePhase_tr_phase_bounce_nofunds',
			msg_size: loadStorageUsedShort(slice),
			req_fwd_fees: loadGrams(slice)
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		return {
  			kind: 'TrBouncePhase_tr_phase_bounce_ok',
			msg_size: loadStorageUsedShort(slice),
			msg_fees: loadGrams(slice),
			fwd_fees: loadGrams(slice)
  		};
  	};
	throw new Error('');
  }
export function storeTrBouncePhase(trBouncePhase: TrBouncePhase): (builder: Builder) => void {
  	if ((trBouncePhase.kind == 'TrBouncePhase_tr_phase_bounce_negfunds')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		};
  	};
	if ((trBouncePhase.kind == 'TrBouncePhase_tr_phase_bounce_nofunds')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
			storeStorageUsedShort(trBouncePhase.msg_size)(builder);
			storeGrams(trBouncePhase.req_fwd_fees)(builder);
  		};
  	};
	if ((trBouncePhase.kind == 'TrBouncePhase_tr_phase_bounce_ok')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeStorageUsedShort(trBouncePhase.msg_size)(builder);
			storeGrams(trBouncePhase.msg_fees)(builder);
			storeGrams(trBouncePhase.fwd_fees)(builder);
  		};
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
	action: Maybe;
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
	action: Maybe;
	aborted: Bool;
	destroyed: Bool;
  };
export type TransactionDescr_trans_split_prepare = {
  	kind: 'TransactionDescr_trans_split_prepare';
	split_info: SplitMergeInfo;
	storage_ph: Maybe<TrStoragePhase>;
	compute_ph: TrComputePhase;
	action: Maybe;
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
	action: Maybe;
	aborted: Bool;
	destroyed: Bool;
  };
export function loadTransactionDescr(slice: Slice): TransactionDescr {
  	if ((slice.preloadUint(4) == 0b0000)) {
  		return {
  			kind: 'TransactionDescr_trans_ord',
			credit_first: loadBool(slice),
			storage_ph: loadMaybe<TrStoragePhase>(slice, loadTrStoragePhase),
			credit_ph: loadMaybe<TrCreditPhase>(slice, loadTrCreditPhase),
			compute_ph: loadTrComputePhase(slice),
			action: loadMaybe(slice),
			aborted: loadBool(slice),
			bounce: loadMaybe<TrBouncePhase>(slice, loadTrBouncePhase),
			destroyed: loadBool(slice)
  		};
  	};
	if ((slice.preloadUint(4) == 0b0001)) {
  		return {
  			kind: 'TransactionDescr_trans_storage',
			storage_ph: loadTrStoragePhase(slice)
  		};
  	};
	if ((slice.preloadUint(3) == 0b001)) {
  		return {
  			kind: 'TransactionDescr_trans_tick_tock',
			is_tock: loadBool(slice),
			storage_ph: loadTrStoragePhase(slice),
			compute_ph: loadTrComputePhase(slice),
			action: loadMaybe(slice),
			aborted: loadBool(slice),
			destroyed: loadBool(slice)
  		};
  	};
	if ((slice.preloadUint(4) == 0b0100)) {
  		return {
  			kind: 'TransactionDescr_trans_split_prepare',
			split_info: loadSplitMergeInfo(slice),
			storage_ph: loadMaybe<TrStoragePhase>(slice, loadTrStoragePhase),
			compute_ph: loadTrComputePhase(slice),
			action: loadMaybe(slice),
			aborted: loadBool(slice),
			destroyed: loadBool(slice)
  		};
  	};
	if ((slice.preloadUint(4) == 0b0101)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'TransactionDescr_trans_split_install',
			split_info: loadSplitMergeInfo(slice),
			prepare_transaction: loadTransaction(slice1),
			installed: loadBool(slice)
  		};
  	};
	if ((slice.preloadUint(4) == 0b0110)) {
  		return {
  			kind: 'TransactionDescr_trans_merge_prepare',
			split_info: loadSplitMergeInfo(slice),
			storage_ph: loadTrStoragePhase(slice),
			aborted: loadBool(slice)
  		};
  	};
	if ((slice.preloadUint(4) == 0b0111)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'TransactionDescr_trans_merge_install',
			split_info: loadSplitMergeInfo(slice),
			prepare_transaction: loadTransaction(slice1),
			storage_ph: loadMaybe<TrStoragePhase>(slice, loadTrStoragePhase),
			credit_ph: loadMaybe<TrCreditPhase>(slice, loadTrCreditPhase),
			compute_ph: loadTrComputePhase(slice),
			action: loadMaybe(slice),
			aborted: loadBool(slice),
			destroyed: loadBool(slice)
  		};
  	};
	throw new Error('');
  }
export function storeTransactionDescr(transactionDescr: TransactionDescr): (builder: Builder) => void {
  	if ((transactionDescr.kind == 'TransactionDescr_trans_ord')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0000, 4);
			storeBool(transactionDescr.credit_first)(builder);
			storeMaybe<TrStoragePhase>(transactionDescr.storage_ph, storeTrStoragePhase)(builder);
			storeMaybe<TrCreditPhase>(transactionDescr.credit_ph, storeTrCreditPhase)(builder);
			storeTrComputePhase(transactionDescr.compute_ph)(builder);
			storeMaybe(transactionDescr.action)(builder);
			storeBool(transactionDescr.aborted)(builder);
			storeMaybe<TrBouncePhase>(transactionDescr.bounce, storeTrBouncePhase)(builder);
			storeBool(transactionDescr.destroyed)(builder);
  		};
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_storage')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0001, 4);
			storeTrStoragePhase(transactionDescr.storage_ph)(builder);
  		};
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_tick_tock')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b001, 3);
			storeBool(transactionDescr.is_tock)(builder);
			storeTrStoragePhase(transactionDescr.storage_ph)(builder);
			storeTrComputePhase(transactionDescr.compute_ph)(builder);
			storeMaybe(transactionDescr.action)(builder);
			storeBool(transactionDescr.aborted)(builder);
			storeBool(transactionDescr.destroyed)(builder);
  		};
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_split_prepare')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0100, 4);
			storeSplitMergeInfo(transactionDescr.split_info)(builder);
			storeMaybe<TrStoragePhase>(transactionDescr.storage_ph, storeTrStoragePhase)(builder);
			storeTrComputePhase(transactionDescr.compute_ph)(builder);
			storeMaybe(transactionDescr.action)(builder);
			storeBool(transactionDescr.aborted)(builder);
			storeBool(transactionDescr.destroyed)(builder);
  		};
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_split_install')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0101, 4);
			storeSplitMergeInfo(transactionDescr.split_info)(builder);
			let cell1 = beginCell();
			storeTransaction(transactionDescr.prepare_transaction)(cell1);
			builder.storeRef(cell1);
			storeBool(transactionDescr.installed)(builder);
  		};
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_merge_prepare')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0110, 4);
			storeSplitMergeInfo(transactionDescr.split_info)(builder);
			storeTrStoragePhase(transactionDescr.storage_ph)(builder);
			storeBool(transactionDescr.aborted)(builder);
  		};
  	};
	if ((transactionDescr.kind == 'TransactionDescr_trans_merge_install')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0111, 4);
			storeSplitMergeInfo(transactionDescr.split_info)(builder);
			let cell1 = beginCell();
			storeTransaction(transactionDescr.prepare_transaction)(cell1);
			builder.storeRef(cell1);
			storeMaybe<TrStoragePhase>(transactionDescr.storage_ph, storeTrStoragePhase)(builder);
			storeMaybe<TrCreditPhase>(transactionDescr.credit_ph, storeTrCreditPhase)(builder);
			storeTrComputePhase(transactionDescr.compute_ph)(builder);
			storeMaybe(transactionDescr.action)(builder);
			storeBool(transactionDescr.aborted)(builder);
			storeBool(transactionDescr.destroyed)(builder);
  		};
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
  	let cur_shard_pfx_len: number;
	(cur_shard_pfx_len = slice.loadUint(6));
	let acc_split_depth: number;
	(acc_split_depth = slice.loadUint(6));
	let this_addr: BitString;
	(this_addr = slice.loadBits(256));
	let sibling_addr: BitString;
	(sibling_addr = slice.loadBits(256));
	return {
  		kind: 'SplitMergeInfo',
		cur_shard_pfx_len: cur_shard_pfx_len,
		acc_split_depth: acc_split_depth,
		this_addr: this_addr,
		sibling_addr: sibling_addr
  	};
  }
export function storeSplitMergeInfo(splitMergeInfo: SplitMergeInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(splitMergeInfo.cur_shard_pfx_len, 6);
		builder.storeUint(splitMergeInfo.acc_split_depth, 6);
		builder.storeBits(splitMergeInfo.this_addr);
		builder.storeBits(splitMergeInfo.sibling_addr);
  	};
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
  	let actions: number;
	(actions = slice.loadUint(16));
	let msgs_sent: number;
	(msgs_sent = slice.loadUint(16));
	let unixtime: number;
	(unixtime = slice.loadUint(32));
	let block_lt: number;
	(block_lt = slice.loadUint(64));
	let trans_lt: number;
	(trans_lt = slice.loadUint(64));
	let rand_seed: BitString;
	(rand_seed = slice.loadBits(256));
	return {
  		kind: 'SmartContractInfo',
		actions: actions,
		msgs_sent: msgs_sent,
		unixtime: unixtime,
		block_lt: block_lt,
		trans_lt: trans_lt,
		rand_seed: rand_seed,
		balance_remaining: loadCurrencyCollection(slice),
		myself: loadMsgAddressInt(slice)
  	};
  }
export function storeSmartContractInfo(smartContractInfo: SmartContractInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(smartContractInfo.actions, 16);
		builder.storeUint(smartContractInfo.msgs_sent, 16);
		builder.storeUint(smartContractInfo.unixtime, 32);
		builder.storeUint(smartContractInfo.block_lt, 64);
		builder.storeUint(smartContractInfo.trans_lt, 64);
		builder.storeBits(smartContractInfo.rand_seed);
		storeCurrencyCollection(smartContractInfo.balance_remaining)(builder);
		storeMsgAddressInt(smartContractInfo.myself)(builder);
  	};
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
export function loadOutList(slice: Slice, n: number): OutList {
  	if ((n == 0)) {
  		return {
  			kind: 'OutList_out_list_empty'
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'OutList_out_list',
			n: (n + 1),
			prev: loadOutList(slice1, n),
			action: loadOutAction(slice)
  		};
  	};
	throw new Error('');
  }
export function storeOutList(outList: OutList): (builder: Builder) => void {
  	if ((outList.kind == 'OutList_out_list_empty')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((outList.kind == 'OutList_out_list')) {
  		return (builder: Builder) => {
  			let cell1 = beginCell();
			storeOutList(outList.prev)(cell1);
			builder.storeRef(cell1);
			storeOutAction(outList.action)(builder);
  		};
  	};
	throw new Error('');
  }
export type OutAction = OutAction_action_send_msg | OutAction_action_set_code | OutAction_action_reserve_currency | OutAction_action_change_library;
export type OutAction_action_send_msg = {
  	kind: 'OutAction_action_send_msg';
	mode: number;
	out_msg: MessageRelaxed<Any>;
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
  	if ((slice.preloadUint(8) == 0b0ec3c86d)) {
  		let mode: number;
		(mode = slice.loadUint(8));
		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'OutAction_action_send_msg',
			mode: mode,
			out_msg: loadMessageRelaxed<Any>(slice1, loadAny)
  		};
  	};
	if ((slice.preloadUint(8) == 0bad4de08e)) {
  		let slice1 = slice.loadRef().beginParse();
		let new_code: Slice;
		(new_code = slice1);
		return {
  			kind: 'OutAction_action_set_code',
			new_code: new_code
  		};
  	};
	if ((slice.preloadUint(8) == 0b36e6b809)) {
  		let mode: number;
		(mode = slice.loadUint(8));
		return {
  			kind: 'OutAction_action_reserve_currency',
			mode: mode,
			currency: loadCurrencyCollection(slice)
  		};
  	};
	if ((slice.preloadUint(8) == 0b26fa1dd4)) {
  		let mode: number;
		(mode = slice.loadUint(7));
		return {
  			kind: 'OutAction_action_change_library',
			mode: mode,
			libref: loadLibRef(slice)
  		};
  	};
	throw new Error('');
  }
export function storeOutAction(outAction: OutAction): (builder: Builder) => void {
  	if ((outAction.kind == 'OutAction_action_send_msg')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0ec3c86d, 8);
			builder.storeUint(outAction.mode, 8);
			let cell1 = beginCell();
			storeMessageRelaxed<Any>(outAction.out_msg, storeAny)(cell1);
			builder.storeRef(cell1);
  		};
  	};
	if ((outAction.kind == 'OutAction_action_set_code')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bad4de08e, 8);
			let cell1 = beginCell();
			cell1.storeSlice(outAction.new_code);
			builder.storeRef(cell1);
  		};
  	};
	if ((outAction.kind == 'OutAction_action_reserve_currency')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b36e6b809, 8);
			builder.storeUint(outAction.mode, 8);
			storeCurrencyCollection(outAction.currency)(builder);
  		};
  	};
	if ((outAction.kind == 'OutAction_action_change_library')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b26fa1dd4, 8);
			builder.storeUint(outAction.mode, 7);
			storeLibRef(outAction.libref)(builder);
  		};
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
  		let lib_hash: BitString;
		(lib_hash = slice.loadBits(256));
		return {
  			kind: 'LibRef_libref_hash',
			lib_hash: lib_hash
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		let library: Slice;
		(library = slice1);
		return {
  			kind: 'LibRef_libref_ref',
			library: library
  		};
  	};
	throw new Error('');
  }
export function storeLibRef(libRef: LibRef): (builder: Builder) => void {
  	if ((libRef.kind == 'LibRef_libref_hash')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			builder.storeBits(libRef.lib_hash);
  		};
  	};
	if ((libRef.kind == 'LibRef_libref_ref')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			cell1.storeSlice(libRef.library);
			builder.storeRef(cell1);
  		};
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
	let prev: Slice;
	(prev = slice1);
	return {
  		kind: 'OutListNode',
		prev: prev,
		action: loadOutAction(slice)
  	};
  }
export function storeOutListNode(outListNode: OutListNode): (builder: Builder) => void {
  	return (builder: Builder) => {
  		let cell1 = beginCell();
		cell1.storeSlice(outListNode.prev);
		builder.storeRef(cell1);
		storeOutAction(outListNode.action)(builder);
  	};
  }
export type ShardIdent = {
  	kind: 'ShardIdent';
	shard_pfx_bits: number;
	workchain_id: number;
	shard_prefix: number;
  };
export function loadShardIdent(slice: Slice): ShardIdent {
  	let shard_pfx_bits: number;
	(shard_pfx_bits = slice.loadUint(6));
	let workchain_id: number;
	(workchain_id = slice.loadInt(32));
	let shard_prefix: number;
	(shard_prefix = slice.loadUint(64));
	return {
  		kind: 'ShardIdent',
		shard_pfx_bits: shard_pfx_bits,
		workchain_id: workchain_id,
		shard_prefix: shard_prefix
  	};
  }
export function storeShardIdent(shardIdent: ShardIdent): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(shardIdent.shard_pfx_bits, 6);
		builder.storeInt(shardIdent.workchain_id, 32);
		builder.storeUint(shardIdent.shard_prefix, 64);
  	};
  }
export type ExtBlkRef = {
  	kind: 'ExtBlkRef';
	end_lt: number;
	seq_no: number;
	root_hash: BitString;
	file_hash: BitString;
  };
export function loadExtBlkRef(slice: Slice): ExtBlkRef {
  	let end_lt: number;
	(end_lt = slice.loadUint(64));
	let seq_no: number;
	(seq_no = slice.loadUint(32));
	let root_hash: BitString;
	(root_hash = slice.loadBits(256));
	let file_hash: BitString;
	(file_hash = slice.loadBits(256));
	return {
  		kind: 'ExtBlkRef',
		end_lt: end_lt,
		seq_no: seq_no,
		root_hash: root_hash,
		file_hash: file_hash
  	};
  }
export function storeExtBlkRef(extBlkRef: ExtBlkRef): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(extBlkRef.end_lt, 64);
		builder.storeUint(extBlkRef.seq_no, 32);
		builder.storeBits(extBlkRef.root_hash);
		builder.storeBits(extBlkRef.file_hash);
  	};
  }
export type BlockIdExt = {
  	kind: 'BlockIdExt';
	shard_id: ShardIdent;
	seq_no: number;
	root_hash: BitString;
	file_hash: BitString;
  };
export function loadBlockIdExt(slice: Slice): BlockIdExt {
  	let seq_no: number;
	(seq_no = slice.loadUint(32));
	let root_hash: BitString;
	(root_hash = slice.loadBits(256));
	let file_hash: BitString;
	(file_hash = slice.loadBits(256));
	return {
  		kind: 'BlockIdExt',
		shard_id: loadShardIdent(slice),
		seq_no: seq_no,
		root_hash: root_hash,
		file_hash: file_hash
  	};
  }
export function storeBlockIdExt(blockIdExt: BlockIdExt): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeShardIdent(blockIdExt.shard_id)(builder);
		builder.storeUint(blockIdExt.seq_no, 32);
		builder.storeBits(blockIdExt.root_hash);
		builder.storeBits(blockIdExt.file_hash);
  	};
  }
export type BlkMasterInfo = {
  	kind: 'BlkMasterInfo';
	master: ExtBlkRef;
  };
export function loadBlkMasterInfo(slice: Slice): BlkMasterInfo {
  	return {
  		kind: 'BlkMasterInfo',
		master: loadExtBlkRef(slice)
  	};
  }
export function storeBlkMasterInfo(blkMasterInfo: BlkMasterInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeExtBlkRef(blkMasterInfo.master)(builder);
  	};
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
	custom: Maybe;
  };
export function loadShardStateUnsplit(slice: Slice): ShardStateUnsplit {
  	let global_id: number;
	(global_id = slice.loadInt(32));
	let seq_no: number;
	(seq_no = slice.loadUint(32));
	let vert_seq_no: number;
	(vert_seq_no = slice.loadUint(32));
	let gen_utime: number;
	(gen_utime = slice.loadUint(32));
	let gen_lt: number;
	(gen_lt = slice.loadUint(64));
	let min_ref_mc_seqno: number;
	(min_ref_mc_seqno = slice.loadUint(32));
	let slice1 = slice.loadRef().beginParse();
	let before_split: number;
	(before_split = slice.loadUint(1));
	let slice2 = slice.loadRef().beginParse();
	let slice3 = slice.loadRef().beginParse();
	let overload_history: number;
	(overload_history = slice3.loadUint(64));
	let underload_history: number;
	(underload_history = slice3.loadUint(64));
	return {
  		kind: 'ShardStateUnsplit',
		global_id: global_id,
		shard_id: loadShardIdent(slice),
		seq_no: seq_no,
		vert_seq_no: vert_seq_no,
		gen_utime: gen_utime,
		gen_lt: gen_lt,
		min_ref_mc_seqno: min_ref_mc_seqno,
		out_msg_queue_info: loadOutMsgQueueInfo(slice1),
		before_split: before_split,
		accounts: loadShardAccounts(slice2),
		overload_history: overload_history,
		underload_history: underload_history,
		total_balance: loadCurrencyCollection(slice3),
		total_validator_fees: loadCurrencyCollection(slice3),
		libraries: loadHashmapE<LibDescr>(slice3, 256, loadLibDescr),
		master_ref: loadMaybe<BlkMasterInfo>(slice3, loadBlkMasterInfo),
		custom: loadMaybe(slice)
  	};
  }
export function storeShardStateUnsplit(shardStateUnsplit: ShardStateUnsplit): (builder: Builder) => void {
  	return (builder: Builder) => {
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
		storeMaybe(shardStateUnsplit.custom)(builder);
  	};
  }
export type ShardState = ShardState_split_state;
export type ShardState_split_state = {
  	kind: 'ShardState_split_state';
	left: ShardStateUnsplit;
	right: ShardStateUnsplit;
  };
export function loadShardState(slice: Slice): ShardState {
  	if ((slice.preloadUint(8) == 0b5f327da5)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'ShardState_split_state',
			left: loadShardStateUnsplit(slice1),
			right: loadShardStateUnsplit(slice2)
  		};
  	};
	throw new Error('');
  }
export function storeShardState(shardState: ShardState): (builder: Builder) => void {
  	if ((shardState.kind == 'ShardState_split_state')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b5f327da5, 8);
			let cell1 = beginCell();
			storeShardStateUnsplit(shardState.left)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeShardStateUnsplit(shardState.right)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	throw new Error('');
  }
export type LibDescr = {
  	kind: 'LibDescr';
	lib: Slice;
	publishers: Hashmap<True>;
  };
export function loadLibDescr(slice: Slice): LibDescr {
  	let slice1 = slice.loadRef().beginParse();
	let lib: Slice;
	(lib = slice1);
	return {
  		kind: 'LibDescr',
		lib: lib,
		publishers: loadHashmap<True>(slice, 256, loadTrue)
  	};
  }
export function storeLibDescr(libDescr: LibDescr): (builder: Builder) => void {
  	return (builder: Builder) => {
  		let cell1 = beginCell();
		cell1.storeSlice(libDescr.lib);
		builder.storeRef(cell1);
		storeHashmap<True>(libDescr.publishers, storeTrue)(builder);
  	};
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
	prev_ref: BlkPrevInfo<after_merge>;
  };
export function loadBlockInfo(slice: Slice): BlockInfo {
  	let version: number;
	(version = slice.loadUint(32));
	let not_master: number;
	(not_master = slice.loadUint(1));
	let after_merge: number;
	(after_merge = slice.loadUint(1));
	let before_split: number;
	(before_split = slice.loadUint(1));
	let after_split: number;
	(after_split = slice.loadUint(1));
	let vert_seqno_incr: number;
	(vert_seqno_incr = slice.loadUint(1));
	let flags: number;
	(flags = slice.loadUint(8));
	let seq_no: number;
	(seq_no = slice.loadUint(32));
	let vert_seq_no: number;
	(vert_seq_no = slice.loadUint(32));
	let gen_utime: number;
	(gen_utime = slice.loadUint(32));
	let start_lt: number;
	(start_lt = slice.loadUint(64));
	let end_lt: number;
	(end_lt = slice.loadUint(64));
	let gen_validator_list_hash_short: number;
	(gen_validator_list_hash_short = slice.loadUint(32));
	let gen_catchain_seqno: number;
	(gen_catchain_seqno = slice.loadUint(32));
	let min_ref_mc_seqno: number;
	(min_ref_mc_seqno = slice.loadUint(32));
	let prev_key_block_seqno: number;
	(prev_key_block_seqno = slice.loadUint(32));
	let slice1 = slice.loadRef().beginParse();
	return {
  		kind: 'BlockInfo',
		version: version,
		not_master: not_master,
		after_merge: after_merge,
		before_split: before_split,
		after_split: after_split,
		want_split: loadBool(slice),
		want_merge: loadBool(slice),
		key_block: loadBool(slice),
		vert_seqno_incr: vert_seqno_incr,
		flags: flags,
		seq_no: seq_no,
		vert_seq_no: vert_seq_no,
		shard: loadShardIdent(slice),
		gen_utime: gen_utime,
		start_lt: start_lt,
		end_lt: end_lt,
		gen_validator_list_hash_short: gen_validator_list_hash_short,
		gen_catchain_seqno: gen_catchain_seqno,
		min_ref_mc_seqno: min_ref_mc_seqno,
		prev_key_block_seqno: prev_key_block_seqno,
		prev_ref: loadBlkPrevInfo<after_merge>(slice1, loadafter_merge)
  	};
  }
export function storeBlockInfo(blockInfo: BlockInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
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
		let cell1 = beginCell();
		storeBlkPrevInfo<after_merge>(blockInfo.prev_ref, storeafter_merge)(cell1);
		builder.storeRef(cell1);
  	};
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
  		return {
  			kind: 'BlkPrevInfo_prev_blk_info',
			prev: loadExtBlkRef(slice)
  		};
  	};
	if ((arg0 == 1)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'BlkPrevInfo_prev_blks_info',
			prev1: loadExtBlkRef(slice1),
			prev2: loadExtBlkRef(slice2)
  		};
  	};
	throw new Error('');
  }
export function storeBlkPrevInfo(blkPrevInfo: BlkPrevInfo): (builder: Builder) => void {
  	if ((blkPrevInfo.kind == 'BlkPrevInfo_prev_blk_info')) {
  		return (builder: Builder) => {
  			storeExtBlkRef(blkPrevInfo.prev)(builder);
  		};
  	};
	if ((blkPrevInfo.kind == 'BlkPrevInfo_prev_blks_info')) {
  		return (builder: Builder) => {
  			let cell1 = beginCell();
			storeExtBlkRef(blkPrevInfo.prev1)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeExtBlkRef(blkPrevInfo.prev2)(cell2);
			builder.storeRef(cell2);
  		};
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
  	let global_id: number;
	(global_id = slice.loadInt(32));
	let slice1 = slice.loadRef().beginParse();
	let slice2 = slice.loadRef().beginParse();
	let slice3 = slice.loadRef().beginParse();
	let slice4 = slice.loadRef().beginParse();
	return {
  		kind: 'Block',
		global_id: global_id,
		info: loadBlockInfo(slice1),
		value_flow: loadValueFlow(slice2),
		state_update: loadMERKLE_UPDATE<ShardState>(slice3, loadShardState),
		extra: loadBlockExtra(slice4)
  	};
  }
export function storeBlock(block: Block): (builder: Builder) => void {
  	return (builder: Builder) => {
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
  	};
  }
export function loadBlockExtra(slice: Slice): BlockExtra {
  
  }
export function storeBlockExtra(blockExtra: BlockExtra): (builder: Builder) => void {
  
  }
export function loadValueFlow(slice: Slice): ValueFlow {
  
  }
export function storeValueFlow(valueFlow: ValueFlow): (builder: Builder) => void {
  
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
  		return {
  			kind: 'BinTree_bt_leaf',
			leaf: loadX(slice)
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'BinTree_bt_fork',
			left: loadBinTree<X>(slice1, loadX),
			right: loadBinTree<X>(slice2, loadX)
  		};
  	};
	throw new Error('');
  }
export function storeBinTree<X>(binTree: BinTree<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((binTree.kind == 'BinTree_bt_leaf')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeX(binTree.leaf)(builder);
  		};
  	};
	if ((binTree.kind == 'BinTree_bt_fork')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeBinTree<X>(binTree.left, storeX)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeBinTree<X>(binTree.right, storeX)(cell2);
			builder.storeRef(cell2);
  		};
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
  		return {
  			kind: 'FutureSplitMerge_fsm_none'
  		};
  	};
	if ((slice.preloadUint(2) == 0b10)) {
  		let split_utime: number;
		(split_utime = slice.loadUint(32));
		let interval: number;
		(interval = slice.loadUint(32));
		return {
  			kind: 'FutureSplitMerge_fsm_split',
			split_utime: split_utime,
			interval: interval
  		};
  	};
	if ((slice.preloadUint(2) == 0b11)) {
  		let merge_utime: number;
		(merge_utime = slice.loadUint(32));
		let interval: number;
		(interval = slice.loadUint(32));
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
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((futureSplitMerge.kind == 'FutureSplitMerge_fsm_split')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10, 2);
			builder.storeUint(futureSplitMerge.split_utime, 32);
			builder.storeUint(futureSplitMerge.interval, 32);
  		};
  	};
	if ((futureSplitMerge.kind == 'FutureSplitMerge_fsm_merge')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
			builder.storeUint(futureSplitMerge.merge_utime, 32);
			builder.storeUint(futureSplitMerge.interval, 32);
  		};
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
  	if ((slice.preloadUint(1) == 0bb)) {
  		let seq_no: number;
		(seq_no = slice.loadUint(32));
		let reg_mc_seqno: number;
		(reg_mc_seqno = slice.loadUint(32));
		let start_lt: number;
		(start_lt = slice.loadUint(64));
		let end_lt: number;
		(end_lt = slice.loadUint(64));
		let root_hash: BitString;
		(root_hash = slice.loadBits(256));
		let file_hash: BitString;
		(file_hash = slice.loadBits(256));
		let flags: number;
		(flags = slice.loadUint(3));
		let next_catchain_seqno: number;
		(next_catchain_seqno = slice.loadUint(32));
		let next_validator_shard: number;
		(next_validator_shard = slice.loadUint(64));
		let min_ref_mc_seqno: number;
		(min_ref_mc_seqno = slice.loadUint(32));
		let gen_utime: number;
		(gen_utime = slice.loadUint(32));
		return {
  			kind: 'ShardDescr_shard_descr',
			seq_no: seq_no,
			reg_mc_seqno: reg_mc_seqno,
			start_lt: start_lt,
			end_lt: end_lt,
			root_hash: root_hash,
			file_hash: file_hash,
			before_split: loadBool(slice),
			before_merge: loadBool(slice),
			want_split: loadBool(slice),
			want_merge: loadBool(slice),
			nx_cc_updated: loadBool(slice),
			flags: flags,
			next_catchain_seqno: next_catchain_seqno,
			next_validator_shard: next_validator_shard,
			min_ref_mc_seqno: min_ref_mc_seqno,
			gen_utime: gen_utime,
			split_merge_at: loadFutureSplitMerge(slice),
			fees_collected: loadCurrencyCollection(slice),
			funds_created: loadCurrencyCollection(slice)
  		};
  	};
	if ((slice.preloadUint(1) == 0ba)) {
  		let seq_no: number;
		(seq_no = slice.loadUint(32));
		let reg_mc_seqno: number;
		(reg_mc_seqno = slice.loadUint(32));
		let start_lt: number;
		(start_lt = slice.loadUint(64));
		let end_lt: number;
		(end_lt = slice.loadUint(64));
		let root_hash: BitString;
		(root_hash = slice.loadBits(256));
		let file_hash: BitString;
		(file_hash = slice.loadBits(256));
		let flags: number;
		(flags = slice.loadUint(3));
		let next_catchain_seqno: number;
		(next_catchain_seqno = slice.loadUint(32));
		let next_validator_shard: number;
		(next_validator_shard = slice.loadUint(64));
		let min_ref_mc_seqno: number;
		(min_ref_mc_seqno = slice.loadUint(32));
		let gen_utime: number;
		(gen_utime = slice.loadUint(32));
		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'ShardDescr_shard_descr_new',
			seq_no: seq_no,
			reg_mc_seqno: reg_mc_seqno,
			start_lt: start_lt,
			end_lt: end_lt,
			root_hash: root_hash,
			file_hash: file_hash,
			before_split: loadBool(slice),
			before_merge: loadBool(slice),
			want_split: loadBool(slice),
			want_merge: loadBool(slice),
			nx_cc_updated: loadBool(slice),
			flags: flags,
			next_catchain_seqno: next_catchain_seqno,
			next_validator_shard: next_validator_shard,
			min_ref_mc_seqno: min_ref_mc_seqno,
			gen_utime: gen_utime,
			split_merge_at: loadFutureSplitMerge(slice),
			fees_collected: loadCurrencyCollection(slice1),
			funds_created: loadCurrencyCollection(slice1)
  		};
  	};
	throw new Error('');
  }
export function storeShardDescr(shardDescr: ShardDescr): (builder: Builder) => void {
  	if ((shardDescr.kind == 'ShardDescr_shard_descr')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bb, 1);
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
  		};
  	};
	if ((shardDescr.kind == 'ShardDescr_shard_descr_new')) {
  		return (builder: Builder) => {
  			builder.storeUint(0ba, 1);
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
  		};
  	};
	throw new Error('');
  }
export function loadShardHashes(slice: Slice): ShardHashes {
  
  }
export function storeShardHashes(shardHashes: ShardHashes): (builder: Builder) => void {
  
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
  		return {
  			kind: 'BinTreeAug_bta_leaf',
			extra: loadY(slice),
			leaf: loadX(slice)
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'BinTreeAug_bta_fork',
			left: loadBinTreeAug<X,Y>(slice1, loadX, loadY),
			right: loadBinTreeAug<X,Y>(slice2, loadX, loadY),
			extra: loadY(slice)
  		};
  	};
	throw new Error('');
  }
export function storeBinTreeAug<X,Y>(binTreeAug: BinTreeAug<X,Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
  	if ((binTreeAug.kind == 'BinTreeAug_bta_leaf')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			storeY(binTreeAug.extra)(builder);
			storeX(binTreeAug.leaf)(builder);
  		};
  	};
	if ((binTreeAug.kind == 'BinTreeAug_bta_fork')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			let cell1 = beginCell();
			storeBinTreeAug<X,Y>(binTreeAug.left, storeX, storeY)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeBinTreeAug<X,Y>(binTreeAug.right, storeX, storeY)(cell2);
			builder.storeRef(cell2);
			storeY(binTreeAug.extra)(builder);
  		};
  	};
	throw new Error('');
  }
export function loadShardFeeCreated(slice: Slice): ShardFeeCreated {
  
  }
export function storeShardFeeCreated(shardFeeCreated: ShardFeeCreated): (builder: Builder) => void {
  
  }
export function loadShardFees(slice: Slice): ShardFees {
  
  }
export function storeShardFees(shardFees: ShardFees): (builder: Builder) => void {
  
  }
export function loadConfigParams(slice: Slice): ConfigParams {
  
  }
export function storeConfigParams(configParams: ConfigParams): (builder: Builder) => void {
  
  }
export type ValidatorInfo = {
  	kind: 'ValidatorInfo';
	validator_list_hash_short: number;
	catchain_seqno: number;
	nx_cc_updated: Bool;
  };
export function loadValidatorInfo(slice: Slice): ValidatorInfo {
  	let validator_list_hash_short: number;
	(validator_list_hash_short = slice.loadUint(32));
	let catchain_seqno: number;
	(catchain_seqno = slice.loadUint(32));
	return {
  		kind: 'ValidatorInfo',
		validator_list_hash_short: validator_list_hash_short,
		catchain_seqno: catchain_seqno,
		nx_cc_updated: loadBool(slice)
  	};
  }
export function storeValidatorInfo(validatorInfo: ValidatorInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(validatorInfo.validator_list_hash_short, 32);
		builder.storeUint(validatorInfo.catchain_seqno, 32);
		storeBool(validatorInfo.nx_cc_updated)(builder);
  	};
  }
export type ValidatorBaseInfo = {
  	kind: 'ValidatorBaseInfo';
	validator_list_hash_short: number;
	catchain_seqno: number;
  };
export function loadValidatorBaseInfo(slice: Slice): ValidatorBaseInfo {
  	let validator_list_hash_short: number;
	(validator_list_hash_short = slice.loadUint(32));
	let catchain_seqno: number;
	(catchain_seqno = slice.loadUint(32));
	return {
  		kind: 'ValidatorBaseInfo',
		validator_list_hash_short: validator_list_hash_short,
		catchain_seqno: catchain_seqno
  	};
  }
export function storeValidatorBaseInfo(validatorBaseInfo: ValidatorBaseInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(validatorBaseInfo.validator_list_hash_short, 32);
		builder.storeUint(validatorBaseInfo.catchain_seqno, 32);
  	};
  }
export function loadKeyMaxLt(slice: Slice): KeyMaxLt {
  
  }
export function storeKeyMaxLt(keyMaxLt: KeyMaxLt): (builder: Builder) => void {
  
  }
export function loadKeyExtBlkRef(slice: Slice): KeyExtBlkRef {
  
  }
export function storeKeyExtBlkRef(keyExtBlkRef: KeyExtBlkRef): (builder: Builder) => void {
  
  }
export function loadOldMcBlocksInfo(slice: Slice): OldMcBlocksInfo {
  
  }
export function storeOldMcBlocksInfo(oldMcBlocksInfo: OldMcBlocksInfo): (builder: Builder) => void {
  
  }
export type Counters = {
  	kind: 'Counters';
	last_updated: number;
	total: number;
	cnt2048: number;
	cnt65536: number;
  };
export function loadCounters(slice: Slice): Counters {
  	let last_updated: number;
	(last_updated = slice.loadUint(32));
	let total: number;
	(total = slice.loadUint(64));
	let cnt2048: number;
	(cnt2048 = slice.loadUint(64));
	let cnt65536: number;
	(cnt65536 = slice.loadUint(64));
	return {
  		kind: 'Counters',
		last_updated: last_updated,
		total: total,
		cnt2048: cnt2048,
		cnt65536: cnt65536
  	};
  }
export function storeCounters(counters: Counters): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(counters.last_updated, 32);
		builder.storeUint(counters.total, 64);
		builder.storeUint(counters.cnt2048, 64);
		builder.storeUint(counters.cnt65536, 64);
  	};
  }
export type CreatorStats = {
  	kind: 'CreatorStats';
	mc_blocks: Counters;
	shard_blocks: Counters;
  };
export function loadCreatorStats(slice: Slice): CreatorStats {
  	return {
  		kind: 'CreatorStats',
		mc_blocks: loadCounters(slice),
		shard_blocks: loadCounters(slice)
  	};
  }
export function storeCreatorStats(creatorStats: CreatorStats): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeCounters(creatorStats.mc_blocks)(builder);
		storeCounters(creatorStats.shard_blocks)(builder);
  	};
  }
export type BlockCreateStats = BlockCreateStats_block_create_stats | BlockCreateStats_block_create_stats_ext;
export type BlockCreateStats_block_create_stats = {
  	kind: 'BlockCreateStats_block_create_stats';
	counters: HashmapE<CreatorStats>;
  };
export type BlockCreateStats_block_create_stats_ext = {
  	kind: 'BlockCreateStats_block_create_stats_ext';
	counters: HashmapAugE<CreatorStats,uint32>;
  };
export function loadBlockCreateStats(slice: Slice): BlockCreateStats {
  	if ((slice.preloadUint(2) == 0b17)) {
  		return {
  			kind: 'BlockCreateStats_block_create_stats',
			counters: loadHashmapE<CreatorStats>(slice, 256, loadCreatorStats)
  		};
  	};
	if ((slice.preloadUint(2) == 0b34)) {
  		return {
  			kind: 'BlockCreateStats_block_create_stats_ext',
			counters: loadHashmapAugE<CreatorStats,uint32>(slice, 256, loadCreatorStats, loaduint32)
  		};
  	};
	throw new Error('');
  }
export function storeBlockCreateStats(blockCreateStats: BlockCreateStats): (builder: Builder) => void {
  	if ((blockCreateStats.kind == 'BlockCreateStats_block_create_stats')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b17, 2);
			storeHashmapE<CreatorStats>(blockCreateStats.counters, storeCreatorStats)(builder);
  		};
  	};
	if ((blockCreateStats.kind == 'BlockCreateStats_block_create_stats_ext')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b34, 2);
			storeHashmapAugE<CreatorStats,uint32>(blockCreateStats.counters, storeCreatorStats, storeuint32)(builder);
  		};
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
	global_balance: CurrencyCollection;
  };
export function loadMcStateExtra(slice: Slice): McStateExtra {
  	let slice1 = slice.loadRef().beginParse();
	let flags: number;
	(flags = slice1.loadUint(16));
	return {
  		kind: 'McStateExtra',
		shard_hashes: loadShardHashes(slice),
		config: loadConfigParams(slice),
		flags: flags,
		validator_info: loadValidatorInfo(slice1),
		prev_blocks: loadOldMcBlocksInfo(slice1),
		after_key_block: loadBool(slice1),
		last_key_block: loadMaybe<ExtBlkRef>(slice1, loadExtBlkRef),
		global_balance: loadCurrencyCollection(slice)
  	};
  }
export function storeMcStateExtra(mcStateExtra: McStateExtra): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeShardHashes(mcStateExtra.shard_hashes)(builder);
		storeConfigParams(mcStateExtra.config)(builder);
		let cell1 = beginCell();
		cell1.storeUint(mcStateExtra.flags, 16);
		storeValidatorInfo(mcStateExtra.validator_info)(cell1);
		storeOldMcBlocksInfo(mcStateExtra.prev_blocks)(cell1);
		storeBool(mcStateExtra.after_key_block)(cell1);
		storeMaybe<ExtBlkRef>(mcStateExtra.last_key_block, storeExtBlkRef)(cell1);
		builder.storeRef(cell1);
		storeCurrencyCollection(mcStateExtra.global_balance)(builder);
  	};
  }
export type SigPubKey = {
  	kind: 'SigPubKey';
	pubkey: BitString;
  };
export function loadSigPubKey(slice: Slice): SigPubKey {
  	let pubkey: BitString;
	(pubkey = slice.loadBits(256));
	return {
  		kind: 'SigPubKey',
		pubkey: pubkey
  	};
  }
export function storeSigPubKey(sigPubKey: SigPubKey): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(sigPubKey.pubkey);
  	};
  }
export type CryptoSignatureSimple = {
  	kind: 'CryptoSignatureSimple';
	R: BitString;
	s: BitString;
  };
export function loadCryptoSignatureSimple(slice: Slice): CryptoSignatureSimple {
  	let R: BitString;
	(R = slice.loadBits(256));
	let s: BitString;
	(s = slice.loadBits(256));
	return {
  		kind: 'CryptoSignatureSimple',
		R: R,
		s: s
  	};
  }
export function storeCryptoSignatureSimple(cryptoSignatureSimple: CryptoSignatureSimple): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(cryptoSignatureSimple.R);
		builder.storeBits(cryptoSignatureSimple.s);
  	};
  }
export type CryptoSignature = CryptoSignature_chained_signature;
export type CryptoSignature_chained_signature = {
  	kind: 'CryptoSignature_chained_signature';
	signed_cert: SignedCertificate;
	temp_key_signature: CryptoSignatureSimple;
  };
export function loadCryptoSignature(slice: Slice): CryptoSignature {
  	if ((slice.preloadUint(1) == 0bf)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'CryptoSignature_chained_signature',
			signed_cert: loadSignedCertificate(slice1),
			temp_key_signature: loadCryptoSignatureSimple(slice)
  		};
  	};
	throw new Error('');
  }
export function storeCryptoSignature(cryptoSignature: CryptoSignature): (builder: Builder) => void {
  	if ((cryptoSignature.kind == 'CryptoSignature_chained_signature')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bf, 1);
			let cell1 = beginCell();
			storeSignedCertificate(cryptoSignature.signed_cert)(cell1);
			builder.storeRef(cell1);
			storeCryptoSignatureSimple(cryptoSignature.temp_key_signature)(builder);
  		};
  	};
	throw new Error('');
  }
export type CryptoSignaturePair = {
  	kind: 'CryptoSignaturePair';
	node_id_short: BitString;
	sign: CryptoSignature;
  };
export function loadCryptoSignaturePair(slice: Slice): CryptoSignaturePair {
  	let node_id_short: BitString;
	(node_id_short = slice.loadBits(256));
	return {
  		kind: 'CryptoSignaturePair',
		node_id_short: node_id_short,
		sign: loadCryptoSignature(slice)
  	};
  }
export function storeCryptoSignaturePair(cryptoSignaturePair: CryptoSignaturePair): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(cryptoSignaturePair.node_id_short);
		storeCryptoSignature(cryptoSignaturePair.sign)(builder);
  	};
  }
export type Certificate = {
  	kind: 'Certificate';
	temp_key: SigPubKey;
	valid_since: number;
	valid_until: number;
  };
export function loadCertificate(slice: Slice): Certificate {
  	let valid_since: number;
	(valid_since = slice.loadUint(32));
	let valid_until: number;
	(valid_until = slice.loadUint(32));
	return {
  		kind: 'Certificate',
		temp_key: loadSigPubKey(slice),
		valid_since: valid_since,
		valid_until: valid_until
  	};
  }
export function storeCertificate(certificate: Certificate): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeSigPubKey(certificate.temp_key)(builder);
		builder.storeUint(certificate.valid_since, 32);
		builder.storeUint(certificate.valid_until, 32);
  	};
  }
export type CertificateEnv = {
  	kind: 'CertificateEnv';
	certificate: Certificate;
  };
export function loadCertificateEnv(slice: Slice): CertificateEnv {
  	return {
  		kind: 'CertificateEnv',
		certificate: loadCertificate(slice)
  	};
  }
export function storeCertificateEnv(certificateEnv: CertificateEnv): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeCertificate(certificateEnv.certificate)(builder);
  	};
  }
export type SignedCertificate = {
  	kind: 'SignedCertificate';
	certificate: Certificate;
	certificate_signature: CryptoSignature;
  };
export function loadSignedCertificate(slice: Slice): SignedCertificate {
  	return {
  		kind: 'SignedCertificate',
		certificate: loadCertificate(slice),
		certificate_signature: loadCryptoSignature(slice)
  	};
  }
export function storeSignedCertificate(signedCertificate: SignedCertificate): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeCertificate(signedCertificate.certificate)(builder);
		storeCryptoSignature(signedCertificate.certificate_signature)(builder);
  	};
  }
export type McBlockExtra = {
  	kind: 'McBlockExtra';
	key_block: number;
	shard_hashes: ShardHashes;
	shard_fees: ShardFees;
	prev_blk_signatures: HashmapE<CryptoSignaturePair>;
	recover_create_msg: Maybe;
	mint_msg: Maybe;
  };
export function loadMcBlockExtra(slice: Slice): McBlockExtra {
  	let key_block: number;
	(key_block = slice.loadUint(1));
	let slice1 = slice.loadRef().beginParse();
	return {
  		kind: 'McBlockExtra',
		key_block: key_block,
		shard_hashes: loadShardHashes(slice),
		shard_fees: loadShardFees(slice),
		prev_blk_signatures: loadHashmapE<CryptoSignaturePair>(slice1, 16, loadCryptoSignaturePair),
		recover_create_msg: loadMaybe(slice1),
		mint_msg: loadMaybe(slice1)
  	};
  }
export function storeMcBlockExtra(mcBlockExtra: McBlockExtra): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(mcBlockExtra.key_block, 1);
		storeShardHashes(mcBlockExtra.shard_hashes)(builder);
		storeShardFees(mcBlockExtra.shard_fees)(builder);
		let cell1 = beginCell();
		storeHashmapE<CryptoSignaturePair>(mcBlockExtra.prev_blk_signatures, storeCryptoSignaturePair)(cell1);
		storeMaybe(mcBlockExtra.recover_create_msg)(cell1);
		storeMaybe(mcBlockExtra.mint_msg)(cell1);
		builder.storeRef(cell1);
  	};
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
  	if ((slice.preloadUint(2) == 0b53)) {
  		let weight: number;
		(weight = slice.loadUint(64));
		return {
  			kind: 'ValidatorDescr_validator',
			public_key: loadSigPubKey(slice),
			weight: weight
  		};
  	};
	if ((slice.preloadUint(2) == 0b73)) {
  		let weight: number;
		(weight = slice.loadUint(64));
		let adnl_addr: BitString;
		(adnl_addr = slice.loadBits(256));
		return {
  			kind: 'ValidatorDescr_validator_addr',
			public_key: loadSigPubKey(slice),
			weight: weight,
			adnl_addr: adnl_addr
  		};
  	};
	throw new Error('');
  }
export function storeValidatorDescr(validatorDescr: ValidatorDescr): (builder: Builder) => void {
  	if ((validatorDescr.kind == 'ValidatorDescr_validator')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b53, 2);
			storeSigPubKey(validatorDescr.public_key)(builder);
			builder.storeUint(validatorDescr.weight, 64);
  		};
  	};
	if ((validatorDescr.kind == 'ValidatorDescr_validator_addr')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b73, 2);
			storeSigPubKey(validatorDescr.public_key)(builder);
			builder.storeUint(validatorDescr.weight, 64);
			builder.storeBits(validatorDescr.adnl_addr);
  		};
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
  	if ((slice.preloadUint(2) == 0b11)) {
  		let utime_since: number;
		(utime_since = slice.loadUint(32));
		let utime_until: number;
		(utime_until = slice.loadUint(32));
		let main: number;
		(main = slice.loadUint(16));
		return {
  			kind: 'ValidatorSet_validators',
			utime_since: utime_since,
			utime_until: utime_until,
			main: main,
			list: loadHashmap<ValidatorDescr>(slice, 16, loadValidatorDescr)
  		};
  	};
	if ((slice.preloadUint(2) == 0b12)) {
  		let utime_since: number;
		(utime_since = slice.loadUint(32));
		let utime_until: number;
		(utime_until = slice.loadUint(32));
		let total: number;
		(total = slice.loadUint(16));
		let main: number;
		(main = slice.loadUint(16));
		let total_weight: number;
		(total_weight = slice.loadUint(64));
		return {
  			kind: 'ValidatorSet_validators_ext',
			utime_since: utime_since,
			utime_until: utime_until,
			total: total,
			main: main,
			total_weight: total_weight,
			list: loadHashmapE<ValidatorDescr>(slice, 16, loadValidatorDescr)
  		};
  	};
	throw new Error('');
  }
export function storeValidatorSet(validatorSet: ValidatorSet): (builder: Builder) => void {
  	if ((validatorSet.kind == 'ValidatorSet_validators')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b11, 2);
			builder.storeUint(validatorSet.utime_since, 32);
			builder.storeUint(validatorSet.utime_until, 32);
			builder.storeUint(validatorSet.main, 16);
			storeHashmap<ValidatorDescr>(validatorSet.list, storeValidatorDescr)(builder);
  		};
  	};
	if ((validatorSet.kind == 'ValidatorSet_validators_ext')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b12, 2);
			builder.storeUint(validatorSet.utime_since, 32);
			builder.storeUint(validatorSet.utime_until, 32);
			builder.storeUint(validatorSet.total, 16);
			builder.storeUint(validatorSet.main, 16);
			builder.storeUint(validatorSet.total_weight, 64);
			storeHashmapE<ValidatorDescr>(validatorSet.list, storeValidatorDescr)(builder);
  		};
  	};
	throw new Error('');
  }
export type ConfigParam = ConfigParam_config_mc_gas_prices | ConfigParam_config_gas_prices | ConfigParam_config_mc_block_limits | ConfigParam_config_block_limits | ConfigParam_config_mc_fwd_prices | ConfigParam_config_fwd_prices;
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
export function loadConfigParam(slice: Slice, arg0: number): ConfigParam {
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
	throw new Error('');
  }
export function storeConfigParam(configParam: ConfigParam): (builder: Builder) => void {
  	if ((configParam.kind == 'ConfigParam_config_mc_gas_prices')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((configParam.kind == 'ConfigParam_config_gas_prices')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((configParam.kind == 'ConfigParam_config_mc_block_limits')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((configParam.kind == 'ConfigParam_config_block_limits')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((configParam.kind == 'ConfigParam_config_mc_fwd_prices')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((configParam.kind == 'ConfigParam_config_fwd_prices')) {
  		return (builder: Builder) => {
  
  		};
  	};
	throw new Error('');
  }
export type GlobalVersion = {
  	kind: 'GlobalVersion';
	version: number;
	capabilities: number;
  };
export function loadGlobalVersion(slice: Slice): GlobalVersion {
  	let version: number;
	(version = slice.loadUint(32));
	let capabilities: number;
	(capabilities = slice.loadUint(64));
	return {
  		kind: 'GlobalVersion',
		version: version,
		capabilities: capabilities
  	};
  }
export function storeGlobalVersion(globalVersion: GlobalVersion): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(globalVersion.version, 32);
		builder.storeUint(globalVersion.capabilities, 64);
  	};
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
  	let min_tot_rounds: number;
	(min_tot_rounds = slice.loadUint(8));
	let max_tot_rounds: number;
	(max_tot_rounds = slice.loadUint(8));
	let min_wins: number;
	(min_wins = slice.loadUint(8));
	let max_losses: number;
	(max_losses = slice.loadUint(8));
	let min_store_sec: number;
	(min_store_sec = slice.loadUint(32));
	let max_store_sec: number;
	(max_store_sec = slice.loadUint(32));
	let bit_price: number;
	(bit_price = slice.loadUint(32));
	let cell_price: number;
	(cell_price = slice.loadUint(32));
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
  }
export function storeConfigProposalSetup(configProposalSetup: ConfigProposalSetup): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(configProposalSetup.min_tot_rounds, 8);
		builder.storeUint(configProposalSetup.max_tot_rounds, 8);
		builder.storeUint(configProposalSetup.min_wins, 8);
		builder.storeUint(configProposalSetup.max_losses, 8);
		builder.storeUint(configProposalSetup.min_store_sec, 32);
		builder.storeUint(configProposalSetup.max_store_sec, 32);
		builder.storeUint(configProposalSetup.bit_price, 32);
		builder.storeUint(configProposalSetup.cell_price, 32);
  	};
  }
export type ConfigVotingSetup = {
  	kind: 'ConfigVotingSetup';
	normal_params: ConfigProposalSetup;
	critical_params: ConfigProposalSetup;
  };
export function loadConfigVotingSetup(slice: Slice): ConfigVotingSetup {
  	let slice1 = slice.loadRef().beginParse();
	let slice2 = slice.loadRef().beginParse();
	return {
  		kind: 'ConfigVotingSetup',
		normal_params: loadConfigProposalSetup(slice1),
		critical_params: loadConfigProposalSetup(slice2)
  	};
  }
export function storeConfigVotingSetup(configVotingSetup: ConfigVotingSetup): (builder: Builder) => void {
  	return (builder: Builder) => {
  		let cell1 = beginCell();
		storeConfigProposalSetup(configVotingSetup.normal_params)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeConfigProposalSetup(configVotingSetup.critical_params)(cell2);
		builder.storeRef(cell2);
  	};
  }
export type ConfigProposal = {
  	kind: 'ConfigProposal';
	param_id: number;
	param_value: Maybe;
	if_hash_equal: Maybe<uint256>;
  };
export function loadConfigProposal(slice: Slice): ConfigProposal {
  	let param_id: number;
	(param_id = slice.loadInt(32));
	return {
  		kind: 'ConfigProposal',
		param_id: param_id,
		param_value: loadMaybe(slice),
		if_hash_equal: loadMaybe<uint256>(slice, loaduint256)
  	};
  }
export function storeConfigProposal(configProposal: ConfigProposal): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeInt(configProposal.param_id, 32);
		storeMaybe(configProposal.param_value)(builder);
		storeMaybe<uint256>(configProposal.if_hash_equal, storeuint256)(builder);
  	};
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
  	let expires: number;
	(expires = slice.loadUint(32));
	let slice1 = slice.loadRef().beginParse();
	let remaining_weight: number;
	(remaining_weight = slice.loadInt(64));
	let validator_set_id: number;
	(validator_set_id = slice.loadUint(256));
	let rounds_remaining: number;
	(rounds_remaining = slice.loadUint(8));
	let wins: number;
	(wins = slice.loadUint(8));
	let losses: number;
	(losses = slice.loadUint(8));
	return {
  		kind: 'ConfigProposalStatus',
		expires: expires,
		proposal: loadConfigProposal(slice1),
		is_critical: loadBool(slice),
		voters: loadHashmapE<True>(slice, 16, loadTrue),
		remaining_weight: remaining_weight,
		validator_set_id: validator_set_id,
		rounds_remaining: rounds_remaining,
		wins: wins,
		losses: losses
  	};
  }
export function storeConfigProposalStatus(configProposalStatus: ConfigProposalStatus): (builder: Builder) => void {
  	return (builder: Builder) => {
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
  	};
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
  	if (((slice.preloadUint(1) == 0b1) && (arg0 == 1))) {
  		let vm_version: number;
		(vm_version = slice.loadInt(32));
		let vm_mode: number;
		(vm_mode = slice.loadUint(64));
		return {
  			kind: 'WorkchainFormat_wfmt_basic',
			vm_version: vm_version,
			vm_mode: vm_mode
  		};
  	};
	if (((slice.preloadUint(1) == 0b0) && (arg0 == 0))) {
  		let min_addr_len: number;
		(min_addr_len = slice.loadUint(12));
		let max_addr_len: number;
		(max_addr_len = slice.loadUint(12));
		let addr_len_step: number;
		(addr_len_step = slice.loadUint(12));
		let workchain_type_id: number;
		(workchain_type_id = slice.loadUint(32));
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
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			builder.storeInt(workchainFormat.vm_version, 32);
			builder.storeUint(workchainFormat.vm_mode, 64);
  		};
  	};
	if ((workchainFormat.kind == 'WorkchainFormat_wfmt_ext')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
			builder.storeUint(workchainFormat.min_addr_len, 12);
			builder.storeUint(workchainFormat.max_addr_len, 12);
			builder.storeUint(workchainFormat.addr_len_step, 12);
			builder.storeUint(workchainFormat.workchain_type_id, 32);
  		};
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
	format: WorkchainFormat<basic>;
  };
export function loadWorkchainDescr(slice: Slice): WorkchainDescr {
  	let enabled_since: number;
	(enabled_since = slice.loadUint(32));
	let actual_min_split: number;
	(actual_min_split = slice.loadUint(8));
	let min_split: number;
	(min_split = slice.loadUint(8));
	let max_split: number;
	(max_split = slice.loadUint(8));
	let basic: number;
	(basic = slice.loadUint(1));
	let flags: number;
	(flags = slice.loadUint(13));
	let zerostate_root_hash: BitString;
	(zerostate_root_hash = slice.loadBits(256));
	let zerostate_file_hash: BitString;
	(zerostate_file_hash = slice.loadBits(256));
	let version: number;
	(version = slice.loadUint(32));
	return {
  		kind: 'WorkchainDescr',
		enabled_since: enabled_since,
		actual_min_split: actual_min_split,
		min_split: min_split,
		max_split: max_split,
		basic: basic,
		active: loadBool(slice),
		accept_msgs: loadBool(slice),
		flags: flags,
		zerostate_root_hash: zerostate_root_hash,
		zerostate_file_hash: zerostate_file_hash,
		version: version,
		format: loadWorkchainFormat<basic>(slice, loadbasic)
  	};
  }
export function storeWorkchainDescr(workchainDescr: WorkchainDescr): (builder: Builder) => void {
  	return (builder: Builder) => {
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
		storeWorkchainFormat<basic>(workchainDescr.format, storebasic)(builder);
  	};
  }
export type ComplaintPricing = {
  	kind: 'ComplaintPricing';
	deposit: Grams;
	bit_price: Grams;
	cell_price: Grams;
  };
export function loadComplaintPricing(slice: Slice): ComplaintPricing {
  	return {
  		kind: 'ComplaintPricing',
		deposit: loadGrams(slice),
		bit_price: loadGrams(slice),
		cell_price: loadGrams(slice)
  	};
  }
export function storeComplaintPricing(complaintPricing: ComplaintPricing): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeGrams(complaintPricing.deposit)(builder);
		storeGrams(complaintPricing.bit_price)(builder);
		storeGrams(complaintPricing.cell_price)(builder);
  	};
  }
export type BlockCreateFees = {
  	kind: 'BlockCreateFees';
	masterchain_block_fee: Grams;
	basechain_block_fee: Grams;
  };
export function loadBlockCreateFees(slice: Slice): BlockCreateFees {
  	return {
  		kind: 'BlockCreateFees',
		masterchain_block_fee: loadGrams(slice),
		basechain_block_fee: loadGrams(slice)
  	};
  }
export function storeBlockCreateFees(blockCreateFees: BlockCreateFees): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeGrams(blockCreateFees.masterchain_block_fee)(builder);
		storeGrams(blockCreateFees.basechain_block_fee)(builder);
  	};
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
  	let utime_since: number;
	(utime_since = slice.loadUint(32));
	let bit_price_ps: number;
	(bit_price_ps = slice.loadUint(64));
	let cell_price_ps: number;
	(cell_price_ps = slice.loadUint(64));
	let mc_bit_price_ps: number;
	(mc_bit_price_ps = slice.loadUint(64));
	let mc_cell_price_ps: number;
	(mc_cell_price_ps = slice.loadUint(64));
	return {
  		kind: 'StoragePrices',
		utime_since: utime_since,
		bit_price_ps: bit_price_ps,
		cell_price_ps: cell_price_ps,
		mc_bit_price_ps: mc_bit_price_ps,
		mc_cell_price_ps: mc_cell_price_ps
  	};
  }
export function storeStoragePrices(storagePrices: StoragePrices): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(storagePrices.utime_since, 32);
		builder.storeUint(storagePrices.bit_price_ps, 64);
		builder.storeUint(storagePrices.cell_price_ps, 64);
		builder.storeUint(storagePrices.mc_bit_price_ps, 64);
		builder.storeUint(storagePrices.mc_cell_price_ps, 64);
  	};
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
  	if ((slice.preloadUint(2) == 0bdd)) {
  		let gas_price: number;
		(gas_price = slice.loadUint(64));
		let gas_limit: number;
		(gas_limit = slice.loadUint(64));
		let gas_credit: number;
		(gas_credit = slice.loadUint(64));
		let block_gas_limit: number;
		(block_gas_limit = slice.loadUint(64));
		let freeze_due_limit: number;
		(freeze_due_limit = slice.loadUint(64));
		let delete_due_limit: number;
		(delete_due_limit = slice.loadUint(64));
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
	if ((slice.preloadUint(2) == 0bde)) {
  		let gas_price: number;
		(gas_price = slice.loadUint(64));
		let gas_limit: number;
		(gas_limit = slice.loadUint(64));
		let special_gas_limit: number;
		(special_gas_limit = slice.loadUint(64));
		let gas_credit: number;
		(gas_credit = slice.loadUint(64));
		let block_gas_limit: number;
		(block_gas_limit = slice.loadUint(64));
		let freeze_due_limit: number;
		(freeze_due_limit = slice.loadUint(64));
		let delete_due_limit: number;
		(delete_due_limit = slice.loadUint(64));
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
	if ((slice.preloadUint(2) == 0bd1)) {
  		let flat_gas_limit: number;
		(flat_gas_limit = slice.loadUint(64));
		let flat_gas_price: number;
		(flat_gas_price = slice.loadUint(64));
		return {
  			kind: 'GasLimitsPrices_gas_flat_pfx',
			flat_gas_limit: flat_gas_limit,
			flat_gas_price: flat_gas_price,
			other: loadGasLimitsPrices(slice)
  		};
  	};
	throw new Error('');
  }
export function storeGasLimitsPrices(gasLimitsPrices: GasLimitsPrices): (builder: Builder) => void {
  	if ((gasLimitsPrices.kind == 'GasLimitsPrices_gas_prices')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bdd, 2);
			builder.storeUint(gasLimitsPrices.gas_price, 64);
			builder.storeUint(gasLimitsPrices.gas_limit, 64);
			builder.storeUint(gasLimitsPrices.gas_credit, 64);
			builder.storeUint(gasLimitsPrices.block_gas_limit, 64);
			builder.storeUint(gasLimitsPrices.freeze_due_limit, 64);
			builder.storeUint(gasLimitsPrices.delete_due_limit, 64);
  		};
  	};
	if ((gasLimitsPrices.kind == 'GasLimitsPrices_gas_prices_ext')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bde, 2);
			builder.storeUint(gasLimitsPrices.gas_price, 64);
			builder.storeUint(gasLimitsPrices.gas_limit, 64);
			builder.storeUint(gasLimitsPrices.special_gas_limit, 64);
			builder.storeUint(gasLimitsPrices.gas_credit, 64);
			builder.storeUint(gasLimitsPrices.block_gas_limit, 64);
			builder.storeUint(gasLimitsPrices.freeze_due_limit, 64);
			builder.storeUint(gasLimitsPrices.delete_due_limit, 64);
  		};
  	};
	if ((gasLimitsPrices.kind == 'GasLimitsPrices_gas_flat_pfx')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bd1, 2);
			builder.storeUint(gasLimitsPrices.flat_gas_limit, 64);
			builder.storeUint(gasLimitsPrices.flat_gas_price, 64);
			storeGasLimitsPrices(gasLimitsPrices.other)(builder);
  		};
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
  	let underload: number;
	(underload = slice.loadUint(32));
	let soft_limit: number;
	(soft_limit = slice.loadUint(32));
	let hard_limit: number;
	(hard_limit = slice.loadUint(32));
	return {
  		kind: 'ParamLimits',
		underload: underload,
		soft_limit: soft_limit,
		hard_limit: hard_limit
  	};
  }
export function storeParamLimits(paramLimits: ParamLimits): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(paramLimits.underload, 32);
		builder.storeUint(paramLimits.soft_limit, 32);
		builder.storeUint(paramLimits.hard_limit, 32);
  	};
  }
export type BlockLimits = {
  	kind: 'BlockLimits';
	bytes: ParamLimits;
	gas: ParamLimits;
	lt_delta: ParamLimits;
  };
export function loadBlockLimits(slice: Slice): BlockLimits {
  	return {
  		kind: 'BlockLimits',
		bytes: loadParamLimits(slice),
		gas: loadParamLimits(slice),
		lt_delta: loadParamLimits(slice)
  	};
  }
export function storeBlockLimits(blockLimits: BlockLimits): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeParamLimits(blockLimits.bytes)(builder);
		storeParamLimits(blockLimits.gas)(builder);
		storeParamLimits(blockLimits.lt_delta)(builder);
  	};
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
  	let lump_price: number;
	(lump_price = slice.loadUint(64));
	let bit_price: number;
	(bit_price = slice.loadUint(64));
	let cell_price: number;
	(cell_price = slice.loadUint(64));
	let ihr_price_factor: number;
	(ihr_price_factor = slice.loadUint(32));
	let first_frac: number;
	(first_frac = slice.loadUint(16));
	let next_frac: number;
	(next_frac = slice.loadUint(16));
	return {
  		kind: 'MsgForwardPrices',
		lump_price: lump_price,
		bit_price: bit_price,
		cell_price: cell_price,
		ihr_price_factor: ihr_price_factor,
		first_frac: first_frac,
		next_frac: next_frac
  	};
  }
export function storeMsgForwardPrices(msgForwardPrices: MsgForwardPrices): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(msgForwardPrices.lump_price, 64);
		builder.storeUint(msgForwardPrices.bit_price, 64);
		builder.storeUint(msgForwardPrices.cell_price, 64);
		builder.storeUint(msgForwardPrices.ihr_price_factor, 32);
		builder.storeUint(msgForwardPrices.first_frac, 16);
		builder.storeUint(msgForwardPrices.next_frac, 16);
  	};
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
  	if ((slice.preloadUint(2) == 0bc1)) {
  		let mc_catchain_lifetime: number;
		(mc_catchain_lifetime = slice.loadUint(32));
		let shard_catchain_lifetime: number;
		(shard_catchain_lifetime = slice.loadUint(32));
		let shard_validators_lifetime: number;
		(shard_validators_lifetime = slice.loadUint(32));
		let shard_validators_num: number;
		(shard_validators_num = slice.loadUint(32));
		return {
  			kind: 'CatchainConfig_catchain_config',
			mc_catchain_lifetime: mc_catchain_lifetime,
			shard_catchain_lifetime: shard_catchain_lifetime,
			shard_validators_lifetime: shard_validators_lifetime,
			shard_validators_num: shard_validators_num
  		};
  	};
	if ((slice.preloadUint(2) == 0bc2)) {
  		let flags: number;
		(flags = slice.loadUint(7));
		let mc_catchain_lifetime: number;
		(mc_catchain_lifetime = slice.loadUint(32));
		let shard_catchain_lifetime: number;
		(shard_catchain_lifetime = slice.loadUint(32));
		let shard_validators_lifetime: number;
		(shard_validators_lifetime = slice.loadUint(32));
		let shard_validators_num: number;
		(shard_validators_num = slice.loadUint(32));
		return {
  			kind: 'CatchainConfig_catchain_config_new',
			flags: flags,
			shuffle_mc_validators: loadBool(slice),
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
  		return (builder: Builder) => {
  			builder.storeUint(0bc1, 2);
			builder.storeUint(catchainConfig.mc_catchain_lifetime, 32);
			builder.storeUint(catchainConfig.shard_catchain_lifetime, 32);
			builder.storeUint(catchainConfig.shard_validators_lifetime, 32);
			builder.storeUint(catchainConfig.shard_validators_num, 32);
  		};
  	};
	if ((catchainConfig.kind == 'CatchainConfig_catchain_config_new')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bc2, 2);
			builder.storeUint(catchainConfig.flags, 7);
			storeBool(catchainConfig.shuffle_mc_validators)(builder);
			builder.storeUint(catchainConfig.mc_catchain_lifetime, 32);
			builder.storeUint(catchainConfig.shard_catchain_lifetime, 32);
			builder.storeUint(catchainConfig.shard_validators_lifetime, 32);
			builder.storeUint(catchainConfig.shard_validators_num, 32);
  		};
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
  	if ((slice.preloadUint(2) == 0bd6)) {
  		let round_candidates: number;
		(round_candidates = slice.loadUint(32));
		let next_candidate_delay_ms: number;
		(next_candidate_delay_ms = slice.loadUint(32));
		let consensus_timeout_ms: number;
		(consensus_timeout_ms = slice.loadUint(32));
		let fast_attempts: number;
		(fast_attempts = slice.loadUint(32));
		let attempt_duration: number;
		(attempt_duration = slice.loadUint(32));
		let catchain_max_deps: number;
		(catchain_max_deps = slice.loadUint(32));
		let max_block_bytes: number;
		(max_block_bytes = slice.loadUint(32));
		let max_collated_bytes: number;
		(max_collated_bytes = slice.loadUint(32));
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
	if ((slice.preloadUint(2) == 0bd7)) {
  		let flags: number;
		(flags = slice.loadUint(7));
		let round_candidates: number;
		(round_candidates = slice.loadUint(8));
		let next_candidate_delay_ms: number;
		(next_candidate_delay_ms = slice.loadUint(32));
		let consensus_timeout_ms: number;
		(consensus_timeout_ms = slice.loadUint(32));
		let fast_attempts: number;
		(fast_attempts = slice.loadUint(32));
		let attempt_duration: number;
		(attempt_duration = slice.loadUint(32));
		let catchain_max_deps: number;
		(catchain_max_deps = slice.loadUint(32));
		let max_block_bytes: number;
		(max_block_bytes = slice.loadUint(32));
		let max_collated_bytes: number;
		(max_collated_bytes = slice.loadUint(32));
		return {
  			kind: 'ConsensusConfig_consensus_config_new',
			flags: flags,
			new_catchain_ids: loadBool(slice),
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
	if ((slice.preloadUint(2) == 0bd8)) {
  		let flags: number;
		(flags = slice.loadUint(7));
		let round_candidates: number;
		(round_candidates = slice.loadUint(8));
		let next_candidate_delay_ms: number;
		(next_candidate_delay_ms = slice.loadUint(32));
		let consensus_timeout_ms: number;
		(consensus_timeout_ms = slice.loadUint(32));
		let fast_attempts: number;
		(fast_attempts = slice.loadUint(32));
		let attempt_duration: number;
		(attempt_duration = slice.loadUint(32));
		let catchain_max_deps: number;
		(catchain_max_deps = slice.loadUint(32));
		let max_block_bytes: number;
		(max_block_bytes = slice.loadUint(32));
		let max_collated_bytes: number;
		(max_collated_bytes = slice.loadUint(32));
		let proto_version: number;
		(proto_version = slice.loadUint(16));
		return {
  			kind: 'ConsensusConfig_consensus_config_v3',
			flags: flags,
			new_catchain_ids: loadBool(slice),
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
	if ((slice.preloadUint(2) == 0bd9)) {
  		let flags: number;
		(flags = slice.loadUint(7));
		let round_candidates: number;
		(round_candidates = slice.loadUint(8));
		let next_candidate_delay_ms: number;
		(next_candidate_delay_ms = slice.loadUint(32));
		let consensus_timeout_ms: number;
		(consensus_timeout_ms = slice.loadUint(32));
		let fast_attempts: number;
		(fast_attempts = slice.loadUint(32));
		let attempt_duration: number;
		(attempt_duration = slice.loadUint(32));
		let catchain_max_deps: number;
		(catchain_max_deps = slice.loadUint(32));
		let max_block_bytes: number;
		(max_block_bytes = slice.loadUint(32));
		let max_collated_bytes: number;
		(max_collated_bytes = slice.loadUint(32));
		let proto_version: number;
		(proto_version = slice.loadUint(16));
		let catchain_max_blocks_coeff: number;
		(catchain_max_blocks_coeff = slice.loadUint(32));
		return {
  			kind: 'ConsensusConfig_consensus_config_v4',
			flags: flags,
			new_catchain_ids: loadBool(slice),
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
  		return (builder: Builder) => {
  			builder.storeUint(0bd6, 2);
			builder.storeUint(consensusConfig.round_candidates, 32);
			builder.storeUint(consensusConfig.next_candidate_delay_ms, 32);
			builder.storeUint(consensusConfig.consensus_timeout_ms, 32);
			builder.storeUint(consensusConfig.fast_attempts, 32);
			builder.storeUint(consensusConfig.attempt_duration, 32);
			builder.storeUint(consensusConfig.catchain_max_deps, 32);
			builder.storeUint(consensusConfig.max_block_bytes, 32);
			builder.storeUint(consensusConfig.max_collated_bytes, 32);
  		};
  	};
	if ((consensusConfig.kind == 'ConsensusConfig_consensus_config_new')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bd7, 2);
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
  		};
  	};
	if ((consensusConfig.kind == 'ConsensusConfig_consensus_config_v3')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bd8, 2);
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
  		};
  	};
	if ((consensusConfig.kind == 'ConsensusConfig_consensus_config_v4')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bd9, 2);
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
  		};
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
  	let adnl_addr: BitString;
	(adnl_addr = slice.loadBits(256));
	let seqno: number;
	(seqno = slice.loadUint(32));
	let valid_until: number;
	(valid_until = slice.loadUint(32));
	return {
  		kind: 'ValidatorTempKey',
		adnl_addr: adnl_addr,
		temp_public_key: loadSigPubKey(slice),
		seqno: seqno,
		valid_until: valid_until
  	};
  }
export function storeValidatorTempKey(validatorTempKey: ValidatorTempKey): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(validatorTempKey.adnl_addr);
		storeSigPubKey(validatorTempKey.temp_public_key)(builder);
		builder.storeUint(validatorTempKey.seqno, 32);
		builder.storeUint(validatorTempKey.valid_until, 32);
  	};
  }
export type ValidatorSignedTempKey = {
  	kind: 'ValidatorSignedTempKey';
	key: ValidatorTempKey;
	signature: CryptoSignature;
  };
export function loadValidatorSignedTempKey(slice: Slice): ValidatorSignedTempKey {
  	let slice1 = slice.loadRef().beginParse();
	return {
  		kind: 'ValidatorSignedTempKey',
		key: loadValidatorTempKey(slice1),
		signature: loadCryptoSignature(slice)
  	};
  }
export function storeValidatorSignedTempKey(validatorSignedTempKey: ValidatorSignedTempKey): (builder: Builder) => void {
  	return (builder: Builder) => {
  		let cell1 = beginCell();
		storeValidatorTempKey(validatorSignedTempKey.key)(cell1);
		builder.storeRef(cell1);
		storeCryptoSignature(validatorSignedTempKey.signature)(builder);
  	};
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
  	let default_proportional_fine: number;
	(default_proportional_fine = slice.loadUint(32));
	let severity_flat_mult: number;
	(severity_flat_mult = slice.loadUint(16));
	let severity_proportional_mult: number;
	(severity_proportional_mult = slice.loadUint(16));
	let unpunishable_interval: number;
	(unpunishable_interval = slice.loadUint(16));
	let long_interval: number;
	(long_interval = slice.loadUint(16));
	let long_flat_mult: number;
	(long_flat_mult = slice.loadUint(16));
	let long_proportional_mult: number;
	(long_proportional_mult = slice.loadUint(16));
	let medium_interval: number;
	(medium_interval = slice.loadUint(16));
	let medium_flat_mult: number;
	(medium_flat_mult = slice.loadUint(16));
	let medium_proportional_mult: number;
	(medium_proportional_mult = slice.loadUint(16));
	return {
  		kind: 'MisbehaviourPunishmentConfig',
		default_flat_fine: loadGrams(slice),
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
  }
export function storeMisbehaviourPunishmentConfig(misbehaviourPunishmentConfig: MisbehaviourPunishmentConfig): (builder: Builder) => void {
  	return (builder: Builder) => {
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
  	};
  }
export type OracleBridgeParams = {
  	kind: 'OracleBridgeParams';
	bridge_address: BitString;
	oracle_mutlisig_address: BitString;
	oracles: HashmapE<uint256>;
	external_chain_address: BitString;
  };
export function loadOracleBridgeParams(slice: Slice): OracleBridgeParams {
  	let bridge_address: BitString;
	(bridge_address = slice.loadBits(256));
	let oracle_mutlisig_address: BitString;
	(oracle_mutlisig_address = slice.loadBits(256));
	let external_chain_address: BitString;
	(external_chain_address = slice.loadBits(256));
	return {
  		kind: 'OracleBridgeParams',
		bridge_address: bridge_address,
		oracle_mutlisig_address: oracle_mutlisig_address,
		oracles: loadHashmapE<uint256>(slice, 256, loaduint256),
		external_chain_address: external_chain_address
  	};
  }
export function storeOracleBridgeParams(oracleBridgeParams: OracleBridgeParams): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeBits(oracleBridgeParams.bridge_address);
		builder.storeBits(oracleBridgeParams.oracle_mutlisig_address);
		storeHashmapE<uint256>(oracleBridgeParams.oracles, storeuint256)(builder);
		builder.storeBits(oracleBridgeParams.external_chain_address);
  	};
  }
export type BlockSignaturesPure = {
  	kind: 'BlockSignaturesPure';
	sig_count: number;
	sig_weight: number;
	signatures: HashmapE<CryptoSignaturePair>;
  };
export function loadBlockSignaturesPure(slice: Slice): BlockSignaturesPure {
  	let sig_count: number;
	(sig_count = slice.loadUint(32));
	let sig_weight: number;
	(sig_weight = slice.loadUint(64));
	return {
  		kind: 'BlockSignaturesPure',
		sig_count: sig_count,
		sig_weight: sig_weight,
		signatures: loadHashmapE<CryptoSignaturePair>(slice, 16, loadCryptoSignaturePair)
  	};
  }
export function storeBlockSignaturesPure(blockSignaturesPure: BlockSignaturesPure): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(blockSignaturesPure.sig_count, 32);
		builder.storeUint(blockSignaturesPure.sig_weight, 64);
		storeHashmapE<CryptoSignaturePair>(blockSignaturesPure.signatures, storeCryptoSignaturePair)(builder);
  	};
  }
export type BlockSignatures = {
  	kind: 'BlockSignatures';
	validator_info: ValidatorBaseInfo;
	pure_signatures: BlockSignaturesPure;
  };
export function loadBlockSignatures(slice: Slice): BlockSignatures {
  	return {
  		kind: 'BlockSignatures',
		validator_info: loadValidatorBaseInfo(slice),
		pure_signatures: loadBlockSignaturesPure(slice)
  	};
  }
export function storeBlockSignatures(blockSignatures: BlockSignatures): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeValidatorBaseInfo(blockSignatures.validator_info)(builder);
		storeBlockSignaturesPure(blockSignatures.pure_signatures)(builder);
  	};
  }
export type BlockProof = {
  	kind: 'BlockProof';
	proof_for: BlockIdExt;
	root: Slice;
	signatures: Maybe;
  };
export function loadBlockProof(slice: Slice): BlockProof {
  	let slice1 = slice.loadRef().beginParse();
	let root: Slice;
	(root = slice1);
	return {
  		kind: 'BlockProof',
		proof_for: loadBlockIdExt(slice),
		root: root,
		signatures: loadMaybe(slice)
  	};
  }
export function storeBlockProof(blockProof: BlockProof): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeBlockIdExt(blockProof.proof_for)(builder);
		let cell1 = beginCell();
		cell1.storeSlice(blockProof.root);
		builder.storeRef(cell1);
		storeMaybe(blockProof.signatures)(builder);
  	};
  }
export type ProofChain = ProofChain_chain_empty | ProofChain_chain_link;
export type ProofChain_chain_empty = {
  	kind: 'ProofChain_chain_empty';
  };
export type ProofChain_chain_link = {
  	kind: 'ProofChain_chain_link';
	n: number;
	root: Slice;
  };
export function loadProofChain(slice: Slice, n: number): ProofChain {
  	if ((n == 0)) {
  		return {
  			kind: 'ProofChain_chain_empty'
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		let root: Slice;
		(root = slice1);
		return {
  			kind: 'ProofChain_chain_link',
			n: (n + 1),
			root: root
  		};
  	};
	throw new Error('');
  }
export function storeProofChain(proofChain: ProofChain): (builder: Builder) => void {
  	if ((proofChain.kind == 'ProofChain_chain_empty')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((proofChain.kind == 'ProofChain_chain_link')) {
  		return (builder: Builder) => {
  			let cell1 = beginCell();
			cell1.storeSlice(proofChain.root);
			builder.storeRef(cell1);
  		};
  	};
	throw new Error('');
  }
export type TopBlockDescr = {
  	kind: 'TopBlockDescr';
	proof_for: BlockIdExt;
	signatures: Maybe;
	len: number;
	chain: ProofChain<len>;
  };
export function loadTopBlockDescr(slice: Slice): TopBlockDescr {
  	let len: number;
	(len = slice.loadUint(8));
	return {
  		kind: 'TopBlockDescr',
		proof_for: loadBlockIdExt(slice),
		signatures: loadMaybe(slice),
		len: len,
		chain: loadProofChain<len>(slice, loadlen)
  	};
  }
export function storeTopBlockDescr(topBlockDescr: TopBlockDescr): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeBlockIdExt(topBlockDescr.proof_for)(builder);
		storeMaybe(topBlockDescr.signatures)(builder);
		builder.storeUint(topBlockDescr.len, 8);
		storeProofChain<len>(topBlockDescr.chain, storelen)(builder);
  	};
  }
export type TopBlockDescrSet = {
  	kind: 'TopBlockDescrSet';
	collection: HashmapE;
  };
export function loadTopBlockDescrSet(slice: Slice): TopBlockDescrSet {
  	return {
  		kind: 'TopBlockDescrSet',
		collection: loadHashmapE(slice, 96)
  	};
  }
export function storeTopBlockDescrSet(topBlockDescrSet: TopBlockDescrSet): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeHashmapE(topBlockDescrSet.collection)(builder);
  	};
  }
export type ProducerInfo = {
  	kind: 'ProducerInfo';
	utime: number;
	mc_blk_ref: ExtBlkRef;
	state_proof: MERKLE_PROOF<Block>;
	prod_proof: MERKLE_PROOF<ShardState>;
  };
export function loadProducerInfo(slice: Slice): ProducerInfo {
  	let utime: number;
	(utime = slice.loadUint(32));
	let slice1 = slice.loadRef().beginParse();
	let slice2 = slice.loadRef().beginParse();
	return {
  		kind: 'ProducerInfo',
		utime: utime,
		mc_blk_ref: loadExtBlkRef(slice),
		state_proof: loadMERKLE_PROOF<Block>(slice1, loadBlock),
		prod_proof: loadMERKLE_PROOF<ShardState>(slice2, loadShardState)
  	};
  }
export function storeProducerInfo(producerInfo: ProducerInfo): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(producerInfo.utime, 32);
		storeExtBlkRef(producerInfo.mc_blk_ref)(builder);
		let cell1 = beginCell();
		storeMERKLE_PROOF<Block>(producerInfo.state_proof, storeBlock)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeMERKLE_PROOF<ShardState>(producerInfo.prod_proof, storeShardState)(cell2);
		builder.storeRef(cell2);
  	};
  }
export type ComplaintDescr = ;
export function loadComplaintDescr(slice: Slice): ComplaintDescr {
  	throw new Error('');
  }
export function storeComplaintDescr(complaintDescr: ComplaintDescr): (builder: Builder) => void {
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
  	let validator_pubkey: BitString;
	(validator_pubkey = slice.loadBits(256));
	let slice1 = slice.loadRef().beginParse();
	let created_at: number;
	(created_at = slice.loadUint(32));
	let severity: number;
	(severity = slice.loadUint(8));
	let reward_addr: number;
	(reward_addr = slice.loadUint(256));
	let suggested_fine_part: number;
	(suggested_fine_part = slice.loadUint(32));
	return {
  		kind: 'ValidatorComplaint',
		validator_pubkey: validator_pubkey,
		description: loadComplaintDescr(slice1),
		created_at: created_at,
		severity: severity,
		reward_addr: reward_addr,
		paid: loadGrams(slice),
		suggested_fine: loadGrams(slice),
		suggested_fine_part: suggested_fine_part
  	};
  }
export function storeValidatorComplaint(validatorComplaint: ValidatorComplaint): (builder: Builder) => void {
  	return (builder: Builder) => {
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
  	};
  }
export type ValidatorComplaintStatus = {
  	kind: 'ValidatorComplaintStatus';
	complaint: ValidatorComplaint;
	voters: HashmapE<True>;
	vset_id: number;
	weight_remaining: number;
  };
export function loadValidatorComplaintStatus(slice: Slice): ValidatorComplaintStatus {
  	let slice1 = slice.loadRef().beginParse();
	let vset_id: number;
	(vset_id = slice.loadUint(256));
	let weight_remaining: number;
	(weight_remaining = slice.loadInt(64));
	return {
  		kind: 'ValidatorComplaintStatus',
		complaint: loadValidatorComplaint(slice1),
		voters: loadHashmapE<True>(slice, 16, loadTrue),
		vset_id: vset_id,
		weight_remaining: weight_remaining
  	};
  }
export function storeValidatorComplaintStatus(validatorComplaintStatus: ValidatorComplaintStatus): (builder: Builder) => void {
  	return (builder: Builder) => {
  		let cell1 = beginCell();
		storeValidatorComplaint(validatorComplaintStatus.complaint)(cell1);
		builder.storeRef(cell1);
		storeHashmapE<True>(validatorComplaintStatus.voters, storeTrue)(builder);
		builder.storeUint(validatorComplaintStatus.vset_id, 256);
		builder.storeInt(validatorComplaintStatus.weight_remaining, 64);
  	};
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
	data: VmTuple<len>;
  };
export function loadVmStackValue(slice: Slice): VmStackValue {
  	if ((slice.preloadUint(2) == 0b00)) {
  		return {
  			kind: 'VmStackValue_vm_stk_null'
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		let value: number;
		(value = slice.loadInt(64));
		return {
  			kind: 'VmStackValue_vm_stk_tinyint',
			value: value
  		};
  	};
	if ((slice.preloadUint(4) == 0b0201)) {
  		let value: number;
		(value = slice.loadInt(257));
		return {
  			kind: 'VmStackValue_vm_stk_int',
			value: value
  		};
  	};
	if ((slice.preloadUint(4) == 0b02ff)) {
  		return {
  			kind: 'VmStackValue_vm_stk_nan'
  		};
  	};
	if ((slice.preloadUint(2) == 0b03)) {
  		let slice1 = slice.loadRef().beginParse();
		let cell: Slice;
		(cell = slice1);
		return {
  			kind: 'VmStackValue_vm_stk_cell',
			cell: cell
  		};
  	};
	if ((slice.preloadUint(2) == 0b04)) {
  		return {
  			kind: 'VmStackValue_vm_stk_slice',
			_: loadVmCellSlice(slice)
  		};
  	};
	if ((slice.preloadUint(2) == 0b05)) {
  		let slice1 = slice.loadRef().beginParse();
		let cell: Slice;
		(cell = slice1);
		return {
  			kind: 'VmStackValue_vm_stk_builder',
			cell: cell
  		};
  	};
	if ((slice.preloadUint(2) == 0b06)) {
  		return {
  			kind: 'VmStackValue_vm_stk_cont',
			cont: loadVmCont(slice)
  		};
  	};
	if ((slice.preloadUint(2) == 0b07)) {
  		let len: number;
		(len = slice.loadUint(16));
		return {
  			kind: 'VmStackValue_vm_stk_tuple',
			len: len,
			data: loadVmTuple<len>(slice, loadlen)
  		};
  	};
	throw new Error('');
  }
export function storeVmStackValue(vmStackValue: VmStackValue): (builder: Builder) => void {
  	if ((vmStackValue.kind == 'VmStackValue_vm_stk_null')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b00, 2);
  		};
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_tinyint')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
			builder.storeInt(vmStackValue.value, 64);
  		};
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_int')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0201, 4);
			builder.storeInt(vmStackValue.value, 257);
  		};
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_nan')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b02ff, 4);
  		};
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_cell')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b03, 2);
			let cell1 = beginCell();
			cell1.storeSlice(vmStackValue.cell);
			builder.storeRef(cell1);
  		};
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_slice')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b04, 2);
			storeVmCellSlice(vmStackValue._)(builder);
  		};
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_builder')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b05, 2);
			let cell1 = beginCell();
			cell1.storeSlice(vmStackValue.cell);
			builder.storeRef(cell1);
  		};
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_cont')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b06, 2);
			storeVmCont(vmStackValue.cont)(builder);
  		};
  	};
	if ((vmStackValue.kind == 'VmStackValue_vm_stk_tuple')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b07, 2);
			builder.storeUint(vmStackValue.len, 16);
			storeVmTuple<len>(vmStackValue.data, storelen)(builder);
  		};
  	};
	throw new Error('');
  }
export function loadVmCellSlice(slice: Slice): VmCellSlice {
  
  }
export function storeVmCellSlice(vmCellSlice: VmCellSlice): (builder: Builder) => void {
  
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
export function loadVmTupleRef(slice: Slice, n: number): VmTupleRef {
  	if ((n == 0)) {
  		return {
  			kind: 'VmTupleRef_vm_tupref_nil'
  		};
  	};
	if ((n == 1)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VmTupleRef_vm_tupref_single',
			entry: loadVmStackValue(slice1)
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VmTupleRef_vm_tupref_any',
			n: (n + 2),
			ref: loadVmTuple(slice1)
  		};
  	};
	throw new Error('');
  }
export function storeVmTupleRef(vmTupleRef: VmTupleRef): (builder: Builder) => void {
  	if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_nil')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_single')) {
  		return (builder: Builder) => {
  			let cell1 = beginCell();
			storeVmStackValue(vmTupleRef.entry)(cell1);
			builder.storeRef(cell1);
  		};
  	};
	if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_any')) {
  		return (builder: Builder) => {
  			let cell1 = beginCell();
			storeVmTuple(vmTupleRef.ref)(cell1);
			builder.storeRef(cell1);
  		};
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
export function loadVmTuple(slice: Slice, n: number): VmTuple {
  	if ((n == 0)) {
  		return {
  			kind: 'VmTuple_vm_tuple_nil'
  		};
  	};
	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VmTuple_vm_tuple_tcons',
			n: (n + 1),
			head: loadVmTupleRef(slice, n),
			tail: loadVmStackValue(slice1)
  		};
  	};
	throw new Error('');
  }
export function storeVmTuple(vmTuple: VmTuple): (builder: Builder) => void {
  	if ((vmTuple.kind == 'VmTuple_vm_tuple_nil')) {
  		return (builder: Builder) => {
  
  		};
  	};
	if ((vmTuple.kind == 'VmTuple_vm_tuple_tcons')) {
  		return (builder: Builder) => {
  			storeVmTupleRef(vmTuple.head)(builder);
			let cell1 = beginCell();
			storeVmStackValue(vmTuple.tail)(cell1);
			builder.storeRef(cell1);
  		};
  	};
	throw new Error('');
  }
export type VmStack = {
  	kind: 'VmStack';
	depth: number;
	stack: VmStackList<depth>;
  };
export function loadVmStack(slice: Slice): VmStack {
  	let depth: number;
	(depth = slice.loadUint(24));
	return {
  		kind: 'VmStack',
		depth: depth,
		stack: loadVmStackList<depth>(slice, loaddepth)
  	};
  }
export function storeVmStack(vmStack: VmStack): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(vmStack.depth, 24);
		storeVmStackList<depth>(vmStack.stack, storedepth)(builder);
  	};
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
export function loadVmStackList(slice: Slice, n: number): VmStackList {
  	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VmStackList_vm_stk_cons',
			n: (n + 1),
			rest: loadVmStackList(slice1, n),
			tos: loadVmStackValue(slice)
  		};
  	};
	if ((n == 0)) {
  		return {
  			kind: 'VmStackList_vm_stk_nil'
  		};
  	};
	throw new Error('');
  }
export function storeVmStackList(vmStackList: VmStackList): (builder: Builder) => void {
  	if ((vmStackList.kind == 'VmStackList_vm_stk_cons')) {
  		return (builder: Builder) => {
  			let cell1 = beginCell();
			storeVmStackList(vmStackList.rest)(cell1);
			builder.storeRef(cell1);
			storeVmStackValue(vmStackList.tos)(builder);
  		};
  	};
	if ((vmStackList.kind == 'VmStackList_vm_stk_nil')) {
  		return (builder: Builder) => {
  
  		};
  	};
	throw new Error('');
  }
export function loadVmSaveList(slice: Slice): VmSaveList {
  
  }
export function storeVmSaveList(vmSaveList: VmSaveList): (builder: Builder) => void {
  
  }
export type VmGasLimits = {
  	kind: 'VmGasLimits';
	remaining: number;
	max_limit: number;
	cur_limit: number;
	credit: number;
  };
export function loadVmGasLimits(slice: Slice): VmGasLimits {
  	let remaining: number;
	(remaining = slice.loadInt(64));
	let slice1 = slice.loadRef().beginParse();
	let max_limit: number;
	(max_limit = slice1.loadInt(64));
	let cur_limit: number;
	(cur_limit = slice1.loadInt(64));
	let credit: number;
	(credit = slice1.loadInt(64));
	return {
  		kind: 'VmGasLimits',
		remaining: remaining,
		max_limit: max_limit,
		cur_limit: cur_limit,
		credit: credit
  	};
  }
export function storeVmGasLimits(vmGasLimits: VmGasLimits): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeInt(vmGasLimits.remaining, 64);
		let cell1 = beginCell();
		cell1.storeInt(vmGasLimits.max_limit, 64);
		cell1.storeInt(vmGasLimits.cur_limit, 64);
		cell1.storeInt(vmGasLimits.credit, 64);
		builder.storeRef(cell1);
  	};
  }
export function loadVmLibraries(slice: Slice): VmLibraries {
  
  }
export function storeVmLibraries(vmLibraries: VmLibraries): (builder: Builder) => void {
  
  }
export type VmControlData = {
  	kind: 'VmControlData';
	nargs: Maybe<uint13>;
	stack: Maybe<VmStack>;
	save: VmSaveList;
	cp: Maybe<int16>;
  };
export function loadVmControlData(slice: Slice): VmControlData {
  	return {
  		kind: 'VmControlData',
		nargs: loadMaybe<uint13>(slice, loaduint13),
		stack: loadMaybe<VmStack>(slice, loadVmStack),
		save: loadVmSaveList(slice),
		cp: loadMaybe<int16>(slice, loadint16)
  	};
  }
export function storeVmControlData(vmControlData: VmControlData): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeMaybe<uint13>(vmControlData.nargs, storeuint13)(builder);
		storeMaybe<VmStack>(vmControlData.stack, storeVmStack)(builder);
		storeVmSaveList(vmControlData.save)(builder);
		storeMaybe<int16>(vmControlData.cp, storeint16)(builder);
  	};
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
  		return {
  			kind: 'VmCont_vmc_std',
			cdata: loadVmControlData(slice),
			code: loadVmCellSlice(slice)
  		};
  	};
	if ((slice.preloadUint(2) == 0b01)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VmCont_vmc_envelope',
			cdata: loadVmControlData(slice),
			next: loadVmCont(slice1)
  		};
  	};
	if ((slice.preloadUint(4) == 0b1000)) {
  		let exit_code: number;
		(exit_code = slice.loadInt(32));
		return {
  			kind: 'VmCont_vmc_quit',
			exit_code: exit_code
  		};
  	};
	if ((slice.preloadUint(4) == 0b1001)) {
  		return {
  			kind: 'VmCont_vmc_quit_exc'
  		};
  	};
	if ((slice.preloadUint(5) == 0b10100)) {
  		let count: number;
		(count = slice.loadUint(63));
		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'VmCont_vmc_repeat',
			count: count,
			body: loadVmCont(slice1),
			after: loadVmCont(slice2)
  		};
  	};
	if ((slice.preloadUint(6) == 0b110000)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		return {
  			kind: 'VmCont_vmc_until',
			body: loadVmCont(slice1),
			after: loadVmCont(slice2)
  		};
  	};
	if ((slice.preloadUint(6) == 0b110001)) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VmCont_vmc_again',
			body: loadVmCont(slice1)
  		};
  	};
	if ((slice.preloadUint(6) == 0b110010)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		let slice3 = slice.loadRef().beginParse();
		return {
  			kind: 'VmCont_vmc_while_cond',
			cond: loadVmCont(slice1),
			body: loadVmCont(slice2),
			after: loadVmCont(slice3)
  		};
  	};
	if ((slice.preloadUint(6) == 0b110011)) {
  		let slice1 = slice.loadRef().beginParse();
		let slice2 = slice.loadRef().beginParse();
		let slice3 = slice.loadRef().beginParse();
		return {
  			kind: 'VmCont_vmc_while_body',
			cond: loadVmCont(slice1),
			body: loadVmCont(slice2),
			after: loadVmCont(slice3)
  		};
  	};
	if ((slice.preloadUint(4) == 0b1111)) {
  		let value: number;
		(value = slice.loadInt(32));
		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'VmCont_vmc_pushint',
			value: value,
			next: loadVmCont(slice1)
  		};
  	};
	throw new Error('');
  }
export function storeVmCont(vmCont: VmCont): (builder: Builder) => void {
  	if ((vmCont.kind == 'VmCont_vmc_std')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b00, 2);
			storeVmControlData(vmCont.cdata)(builder);
			storeVmCellSlice(vmCont.code)(builder);
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_envelope')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b01, 2);
			storeVmControlData(vmCont.cdata)(builder);
			let cell1 = beginCell();
			storeVmCont(vmCont.next)(cell1);
			builder.storeRef(cell1);
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_quit')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1000, 4);
			builder.storeInt(vmCont.exit_code, 32);
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_quit_exc')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1001, 4);
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_repeat')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b10100, 5);
			builder.storeUint(vmCont.count, 63);
			let cell1 = beginCell();
			storeVmCont(vmCont.body)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeVmCont(vmCont.after)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_until')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b110000, 6);
			let cell1 = beginCell();
			storeVmCont(vmCont.body)(cell1);
			builder.storeRef(cell1);
			let cell2 = beginCell();
			storeVmCont(vmCont.after)(cell2);
			builder.storeRef(cell2);
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_again')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b110001, 6);
			let cell1 = beginCell();
			storeVmCont(vmCont.body)(cell1);
			builder.storeRef(cell1);
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_while_cond')) {
  		return (builder: Builder) => {
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
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_while_body')) {
  		return (builder: Builder) => {
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
  		};
  	};
	if ((vmCont.kind == 'VmCont_vmc_pushint')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1111, 4);
			builder.storeInt(vmCont.value, 32);
			let cell1 = beginCell();
			storeVmCont(vmCont.next)(cell1);
			builder.storeRef(cell1);
  		};
  	};
	throw new Error('');
  }
export function loadDNS_RecordSet(slice: Slice): DNS_RecordSet {
  
  }
export function storeDNS_RecordSet(dNS_RecordSet: DNS_RecordSet): (builder: Builder) => void {
  
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
export function loadTextChunkRef(slice: Slice, n: number): TextChunkRef {
  	if (true) {
  		let slice1 = slice.loadRef().beginParse();
		return {
  			kind: 'TextChunkRef_chunk_ref',
			n: (n + 1),
			ref: loadTextChunks(slice1)
  		};
  	};
	if ((n == 0)) {
  		return {
  			kind: 'TextChunkRef_chunk_ref_empty'
  		};
  	};
	throw new Error('');
  }
export function storeTextChunkRef(textChunkRef: TextChunkRef): (builder: Builder) => void {
  	if ((textChunkRef.kind == 'TextChunkRef_chunk_ref')) {
  		return (builder: Builder) => {
  			let cell1 = beginCell();
			storeTextChunks(textChunkRef.ref)(cell1);
			builder.storeRef(cell1);
  		};
  	};
	if ((textChunkRef.kind == 'TextChunkRef_chunk_ref_empty')) {
  		return (builder: Builder) => {
  
  		};
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
export function loadTextChunks(slice: Slice, n: number): TextChunks {
  	if (true) {
  		let len: number;
		(len = slice.loadUint(8));
		let data: BitString;
		(data = slice.loadBits((len * 8)));
		return {
  			kind: 'TextChunks_text_chunk',
			n: (n + 1),
			len: len,
			data: data,
			next: loadTextChunkRef(slice, n)
  		};
  	};
	if ((n == 0)) {
  		return {
  			kind: 'TextChunks_text_chunk_empty'
  		};
  	};
	throw new Error('');
  }
export function storeTextChunks(textChunks: TextChunks): (builder: Builder) => void {
  	if ((textChunks.kind == 'TextChunks_text_chunk')) {
  		return (builder: Builder) => {
  			builder.storeUint(textChunks.len, 8);
			builder.storeBits(textChunks.data);
			storeTextChunkRef(textChunks.next)(builder);
  		};
  	};
	if ((textChunks.kind == 'TextChunks_text_chunk_empty')) {
  		return (builder: Builder) => {
  
  		};
  	};
	throw new Error('');
  }
export type Text = {
  	kind: 'Text';
	chunks: number;
	rest: TextChunks<chunks>;
  };
export function loadText(slice: Slice): Text {
  	let chunks: number;
	(chunks = slice.loadUint(8));
	return {
  		kind: 'Text',
		chunks: chunks,
		rest: loadTextChunks<chunks>(slice, loadchunks)
  	};
  }
export function storeText(text: Text): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(text.chunks, 8);
		storeTextChunks<chunks>(text.rest, storechunks)(builder);
  	};
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
  };
export type DNSRecord_dns_smc_address = {
  	kind: 'DNSRecord_dns_smc_address';
	smc_addr: MsgAddressInt;
	flags: number;
  };
export function loadDNSRecord(slice: Slice): DNSRecord {
  	if ((slice.preloadUint(4) == 0b1eda)) {
  		return {
  			kind: 'DNSRecord_dns_text',
			_: loadText(slice)
  		};
  	};
	if ((slice.preloadUint(4) == 0bba93)) {
  		return {
  			kind: 'DNSRecord_dns_next_resolver',
			resolver: loadMsgAddressInt(slice)
  		};
  	};
	if ((slice.preloadUint(4) == 0bad01)) {
  		let adnl_addr: BitString;
		(adnl_addr = slice.loadBits(256));
		let flags: number;
		(flags = slice.loadUint(8));
		return {
  			kind: 'DNSRecord_dns_adnl_address',
			adnl_addr: adnl_addr,
			flags: flags
  		};
  	};
	if ((slice.preloadUint(4) == 0b9fd3)) {
  		let flags: number;
		(flags = slice.loadUint(8));
		return {
  			kind: 'DNSRecord_dns_smc_address',
			smc_addr: loadMsgAddressInt(slice),
			flags: flags
  		};
  	};
	throw new Error('');
  }
export function storeDNSRecord(dNSRecord: DNSRecord): (builder: Builder) => void {
  	if ((dNSRecord.kind == 'DNSRecord_dns_text')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1eda, 4);
			storeText(dNSRecord._)(builder);
  		};
  	};
	if ((dNSRecord.kind == 'DNSRecord_dns_next_resolver')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bba93, 4);
			storeMsgAddressInt(dNSRecord.resolver)(builder);
  		};
  	};
	if ((dNSRecord.kind == 'DNSRecord_dns_adnl_address')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bad01, 4);
			builder.storeBits(dNSRecord.adnl_addr);
			builder.storeUint(dNSRecord.flags, 8);
  		};
  	};
	if ((dNSRecord.kind == 'DNSRecord_dns_smc_address')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b9fd3, 4);
			storeMsgAddressInt(dNSRecord.smc_addr)(builder);
			builder.storeUint(dNSRecord.flags, 8);
  		};
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
  		return {
  			kind: 'ProtoList_proto_list_nil'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		return {
  			kind: 'ProtoList_proto_list_next',
			head: loadProtocol(slice),
			tail: loadProtoList(slice)
  		};
  	};
	throw new Error('');
  }
export function storeProtoList(protoList: ProtoList): (builder: Builder) => void {
  	if ((protoList.kind == 'ProtoList_proto_list_nil')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((protoList.kind == 'ProtoList_proto_list_next')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeProtocol(protoList.head)(builder);
			storeProtoList(protoList.tail)(builder);
  		};
  	};
	throw new Error('');
  }
export type Protocol = {
  	kind: 'Protocol';
  };
export function loadProtocol(slice: Slice): Protocol {
  	return {
  		kind: 'Protocol'
  	};
  }
export function storeProtocol(protocol: Protocol): (builder: Builder) => void {
  	return (builder: Builder) => {
  
  	};
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
  		return {
  			kind: 'SmcCapList_cap_list_nil'
  		};
  	};
	if ((slice.preloadUint(1) == 0b1)) {
  		return {
  			kind: 'SmcCapList_cap_list_next',
			head: loadSmcCapability(slice),
			tail: loadSmcCapList(slice)
  		};
  	};
	throw new Error('');
  }
export function storeSmcCapList(smcCapList: SmcCapList): (builder: Builder) => void {
  	if ((smcCapList.kind == 'SmcCapList_cap_list_nil')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b0, 1);
  		};
  	};
	if ((smcCapList.kind == 'SmcCapList_cap_list_next')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b1, 1);
			storeSmcCapability(smcCapList.head)(builder);
			storeSmcCapList(smcCapList.tail)(builder);
  		};
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
  	if ((slice.preloadUint(4) == 0b5371)) {
  		return {
  			kind: 'SmcCapability_cap_method_seqno'
  		};
  	};
	if ((slice.preloadUint(4) == 0b71f4)) {
  		return {
  			kind: 'SmcCapability_cap_method_pubkey'
  		};
  	};
	if ((slice.preloadUint(4) == 0b2177)) {
  		return {
  			kind: 'SmcCapability_cap_is_wallet'
  		};
  	};
	if ((slice.preloadUint(2) == 0bff)) {
  		return {
  			kind: 'SmcCapability_cap_name',
			name: loadText(slice)
  		};
  	};
	throw new Error('');
  }
export function storeSmcCapability(smcCapability: SmcCapability): (builder: Builder) => void {
  	if ((smcCapability.kind == 'SmcCapability_cap_method_seqno')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b5371, 4);
  		};
  	};
	if ((smcCapability.kind == 'SmcCapability_cap_method_pubkey')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b71f4, 4);
  		};
  	};
	if ((smcCapability.kind == 'SmcCapability_cap_is_wallet')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b2177, 4);
  		};
  	};
	if ((smcCapability.kind == 'SmcCapability_cap_name')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bff, 2);
			storeText(smcCapability.name)(builder);
  		};
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
  	let init_timeout: number;
	(init_timeout = slice.loadUint(32));
	let close_timeout: number;
	(close_timeout = slice.loadUint(32));
	let a_key: BitString;
	(a_key = slice.loadBits(256));
	let b_key: BitString;
	(b_key = slice.loadBits(256));
	let slice1 = slice.loadRef().beginParse();
	let slice2 = slice.loadRef().beginParse();
	let channel_id: number;
	(channel_id = slice.loadUint(64));
	return {
  		kind: 'ChanConfig',
		init_timeout: init_timeout,
		close_timeout: close_timeout,
		a_key: a_key,
		b_key: b_key,
		a_addr: loadMsgAddressInt(slice1),
		b_addr: loadMsgAddressInt(slice2),
		channel_id: channel_id,
		min_A_extra: loadGrams(slice)
  	};
  }
export function storeChanConfig(chanConfig: ChanConfig): (builder: Builder) => void {
  	return (builder: Builder) => {
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
  	};
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
  		let expire_at: number;
		(expire_at = slice.loadUint(32));
		return {
  			kind: 'ChanState_chan_state_init',
			signed_A: loadBool(slice),
			signed_B: loadBool(slice),
			min_A: loadGrams(slice),
			min_B: loadGrams(slice),
			expire_at: expire_at,
			A: loadGrams(slice),
			B: loadGrams(slice)
  		};
  	};
	if ((slice.preloadUint(3) == 0b001)) {
  		let expire_at: number;
		(expire_at = slice.loadUint(32));
		return {
  			kind: 'ChanState_chan_state_close',
			signed_A: loadBool(slice),
			signed_B: loadBool(slice),
			promise_A: loadGrams(slice),
			promise_B: loadGrams(slice),
			expire_at: expire_at,
			A: loadGrams(slice),
			B: loadGrams(slice)
  		};
  	};
	if ((slice.preloadUint(3) == 0b010)) {
  		return {
  			kind: 'ChanState_chan_state_payout',
			A: loadGrams(slice),
			B: loadGrams(slice)
  		};
  	};
	throw new Error('');
  }
export function storeChanState(chanState: ChanState): (builder: Builder) => void {
  	if ((chanState.kind == 'ChanState_chan_state_init')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b000, 3);
			storeBool(chanState.signed_A)(builder);
			storeBool(chanState.signed_B)(builder);
			storeGrams(chanState.min_A)(builder);
			storeGrams(chanState.min_B)(builder);
			builder.storeUint(chanState.expire_at, 32);
			storeGrams(chanState.A)(builder);
			storeGrams(chanState.B)(builder);
  		};
  	};
	if ((chanState.kind == 'ChanState_chan_state_close')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b001, 3);
			storeBool(chanState.signed_A)(builder);
			storeBool(chanState.signed_B)(builder);
			storeGrams(chanState.promise_A)(builder);
			storeGrams(chanState.promise_B)(builder);
			builder.storeUint(chanState.expire_at, 32);
			storeGrams(chanState.A)(builder);
			storeGrams(chanState.B)(builder);
  		};
  	};
	if ((chanState.kind == 'ChanState_chan_state_payout')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b010, 3);
			storeGrams(chanState.A)(builder);
			storeGrams(chanState.B)(builder);
  		};
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
  	let channel_id: number;
	(channel_id = slice.loadUint(64));
	return {
  		kind: 'ChanPromise',
		channel_id: channel_id,
		promise_A: loadGrams(slice),
		promise_B: loadGrams(slice)
  	};
  }
export function storeChanPromise(chanPromise: ChanPromise): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(chanPromise.channel_id, 64);
		storeGrams(chanPromise.promise_A)(builder);
		storeGrams(chanPromise.promise_B)(builder);
  	};
  }
export type ChanSignedPromise = {
  	kind: 'ChanSignedPromise';
	sig: Maybe;
	promise: ChanPromise;
  };
export function loadChanSignedPromise(slice: Slice): ChanSignedPromise {
  	return {
  		kind: 'ChanSignedPromise',
		sig: loadMaybe(slice),
		promise: loadChanPromise(slice)
  	};
  }
export function storeChanSignedPromise(chanSignedPromise: ChanSignedPromise): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeMaybe(chanSignedPromise.sig)(builder);
		storeChanPromise(chanSignedPromise.promise)(builder);
  	};
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
  	if ((slice.preloadUint(8) == 0b27317822)) {
  		let channel_id: number;
		(channel_id = slice.loadUint(64));
		return {
  			kind: 'ChanMsg_chan_msg_init',
			inc_A: loadGrams(slice),
			inc_B: loadGrams(slice),
			min_A: loadGrams(slice),
			min_B: loadGrams(slice),
			channel_id: channel_id
  		};
  	};
	if ((slice.preloadUint(8) == 0bf28ae183)) {
  		return {
  			kind: 'ChanMsg_chan_msg_close',
			extra_A: loadGrams(slice),
			extra_B: loadGrams(slice),
			promise: loadChanSignedPromise(slice)
  		};
  	};
	if ((slice.preloadUint(8) == 0b43278a28)) {
  		return {
  			kind: 'ChanMsg_chan_msg_timeout'
  		};
  	};
	if ((slice.preloadUint(8) == 0b37fe7810)) {
  		return {
  			kind: 'ChanMsg_chan_msg_payout'
  		};
  	};
	throw new Error('');
  }
export function storeChanMsg(chanMsg: ChanMsg): (builder: Builder) => void {
  	if ((chanMsg.kind == 'ChanMsg_chan_msg_init')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b27317822, 8);
			storeGrams(chanMsg.inc_A)(builder);
			storeGrams(chanMsg.inc_B)(builder);
			storeGrams(chanMsg.min_A)(builder);
			storeGrams(chanMsg.min_B)(builder);
			builder.storeUint(chanMsg.channel_id, 64);
  		};
  	};
	if ((chanMsg.kind == 'ChanMsg_chan_msg_close')) {
  		return (builder: Builder) => {
  			builder.storeUint(0bf28ae183, 8);
			storeGrams(chanMsg.extra_A)(builder);
			storeGrams(chanMsg.extra_B)(builder);
			storeChanSignedPromise(chanMsg.promise)(builder);
  		};
  	};
	if ((chanMsg.kind == 'ChanMsg_chan_msg_timeout')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b43278a28, 8);
  		};
  	};
	if ((chanMsg.kind == 'ChanMsg_chan_msg_payout')) {
  		return (builder: Builder) => {
  			builder.storeUint(0b37fe7810, 8);
  		};
  	};
	throw new Error('');
  }
export type ChanSignedMsg = {
  	kind: 'ChanSignedMsg';
	sig_A: Maybe;
	sig_B: Maybe;
	msg: ChanMsg;
  };
export function loadChanSignedMsg(slice: Slice): ChanSignedMsg {
  	return {
  		kind: 'ChanSignedMsg',
		sig_A: loadMaybe(slice),
		sig_B: loadMaybe(slice),
		msg: loadChanMsg(slice)
  	};
  }
export function storeChanSignedMsg(chanSignedMsg: ChanSignedMsg): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeMaybe(chanSignedMsg.sig_A)(builder);
		storeMaybe(chanSignedMsg.sig_B)(builder);
		storeChanMsg(chanSignedMsg.msg)(builder);
  	};
  }
export type ChanOp = {
  	kind: 'ChanOp';
	msg: ChanSignedMsg;
  };
export function loadChanOp(slice: Slice): ChanOp {
  	return {
  		kind: 'ChanOp',
		msg: loadChanSignedMsg(slice)
  	};
  }
export function storeChanOp(chanOp: ChanOp): (builder: Builder) => void {
  	return (builder: Builder) => {
  		storeChanSignedMsg(chanOp.msg)(builder);
  	};
  }
export type ChanData = {
  	kind: 'ChanData';
	config: ChanConfig;
	state: ChanState;
  };
export function loadChanData(slice: Slice): ChanData {
  	let slice1 = slice.loadRef().beginParse();
	let slice2 = slice.loadRef().beginParse();
	return {
  		kind: 'ChanData',
		config: loadChanConfig(slice1),
		state: loadChanState(slice2)
  	};
  }
export function storeChanData(chanData: ChanData): (builder: Builder) => void {
  	return (builder: Builder) => {
  		let cell1 = beginCell();
		storeChanConfig(chanData.config)(cell1);
		builder.storeRef(cell1);
		let cell2 = beginCell();
		storeChanState(chanData.state)(cell2);
		builder.storeRef(cell2);
  	};
  }
