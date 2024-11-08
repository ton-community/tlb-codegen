import { Builder } from '@ton/core'
import { Slice } from '@ton/core'
import { beginCell } from '@ton/core'
import { BitString } from '@ton/core'
import { Cell } from '@ton/core'
import { Address } from '@ton/core'
import { ExternalAddress } from '@ton/core'
import { Dictionary } from '@ton/core'
import { DictionaryValue } from '@ton/core'
import { TupleItem } from '@ton/core'
import { parseTuple } from '@ton/core'
import { serializeTuple } from '@ton/core'
export function bitLen(n: number) {
    return n.toString(2).length;
}

export interface Bool {
    readonly kind: 'Bool';
    readonly value: boolean;
}

export function loadBool(slice: Slice): Bool {
    if (slice.remainingBits >= 1) {
        let value = slice.loadUint(1);
        return {
            kind: 'Bool',
            value: value == 1
        }

    }
    throw new Error('Expected one of "BoolFalse" in loading "BoolFalse", but data does not satisfy any constructor');
}

export function storeBool(bool: Bool): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(bool.value ? 1: 0, 1);
    })

}
export function copyCellToBuilder(from: Cell, to: Builder): void {
    let slice = from.beginParse();
    to.storeBits(slice.loadBits(slice.remainingBits));
    while (slice.remainingRefs) {
        to.storeRef(slice.loadRef());
    }
}
// tmpa$_ a:# b:# = Simple;

export interface Simple {
    readonly kind: 'Simple';
    readonly a: number;
    readonly b: number;
}

// a$_ {Arg:Type} arg:Arg = TypedArg Arg;

export interface TypedArg<Arg> {
    readonly kind: 'TypedArg';
    readonly arg: Arg;
}

// a$_ x:(TypedArg Simple) = TypedArgUser;

export interface TypedArgUser {
    readonly kind: 'TypedArgUser';
    readonly x: TypedArg<Simple>;
}

// a$_ {Arg:Type} {n:#} arg:Arg c:(## n) = ParamAndTypedArg n Arg;

export interface ParamAndTypedArg<Arg> {
    readonly kind: 'ParamAndTypedArg';
    readonly n: number;
    readonly arg: Arg;
    readonly c: bigint;
}

// a$_ x:(ParamAndTypedArg 5 Simple) = ParamAndTypedArgUser;

export interface ParamAndTypedArgUser {
    readonly kind: 'ParamAndTypedArgUser';
    readonly x: ParamAndTypedArg<Simple>;
}

// _ x:Simple y:Simple = TwoSimples;

export interface TwoSimples {
    readonly kind: 'TwoSimples';
    readonly x: Simple;
    readonly y: Simple;
}

// _ one_maybe:(Maybe Simple) second_maybe:(Maybe Simple) = TwoMaybes;

export interface TwoMaybes {
    readonly kind: 'TwoMaybes';
    readonly one_maybe: Maybe<Simple>;
    readonly second_maybe: Maybe<Simple>;
}

// bool_false$0 a:# b:(## 7) c:# = TwoConstructors;

// bool_true$1 b:# = TwoConstructors;

export type TwoConstructors = TwoConstructors_bool_false | TwoConstructors_bool_true;

export interface TwoConstructors_bool_false {
    readonly kind: 'TwoConstructors_bool_false';
    readonly a: number;
    readonly b: number;
    readonly c: number;
}

export interface TwoConstructors_bool_true {
    readonly kind: 'TwoConstructors_bool_true';
    readonly b: number;
}

// tmpb$_ y:(## 5) = FixedIntParam;

export interface FixedIntParam {
    readonly kind: 'FixedIntParam';
    readonly y: number;
}

// tmpc$_ y:FixedIntParam c:# = TypedField;

export interface TypedField {
    readonly kind: 'TypedField';
    readonly y: FixedIntParam;
    readonly c: number;
}

// tmpd#_ y:FixedIntParam c:# = SharpConstructor;

export interface SharpConstructor {
    readonly kind: 'SharpConstructor';
    readonly y: FixedIntParam;
    readonly c: number;
}

// nothing$0 {TheType:Type} = Maybe TheType;

// just$1 {TheType:Type} value:TheType = Maybe TheType;

export type Maybe<TheType> = Maybe_nothing<TheType> | Maybe_just<TheType>;

export interface Maybe_nothing<TheType> {
    readonly kind: 'Maybe_nothing';
}

export interface Maybe_just<TheType> {
    readonly kind: 'Maybe_just';
    readonly value: TheType;
}

// thejust$_ x:(Maybe SharpConstructor) = TypedParam;

export interface TypedParam {
    readonly kind: 'TypedParam';
    readonly x: Maybe<SharpConstructor>;
}

// left$0 {X:Type} {Y:Type} value:X = Either X Y;

// right$1 {X:Type} {Y:Type} value:Y = Either X Y;

export type Either<X, Y> = Either_left<X, Y> | Either_right<X, Y>;

export interface Either_left<X, Y> {
    readonly kind: 'Either_left';
    readonly value: X;
}

export interface Either_right<X, Y> {
    readonly kind: 'Either_right';
    readonly value: Y;
}

// a$_ {x:#} value:(## x) = BitLenArg x;

export interface BitLenArg {
    readonly kind: 'BitLenArg';
    readonly x: number;
    readonly value: bigint;
}

// a$_ t:(BitLenArg 4) = BitLenArgUser;

export interface BitLenArgUser {
    readonly kind: 'BitLenArgUser';
    readonly t: BitLenArg;
}

// a$_ {x:#} value:(## x) = ExprArg (2 + x);

export interface ExprArg {
    readonly kind: 'ExprArg';
    readonly x: number;
    readonly value: bigint;
}

// a$_ t:(ExprArg 6) = ExprArgUser;

export interface ExprArgUser {
    readonly kind: 'ExprArgUser';
    readonly t: ExprArg;
}

// a$_ a:ExprArgUser = ComplexTypedField;

export interface ComplexTypedField {
    readonly kind: 'ComplexTypedField';
    readonly a: ExprArgUser;
}

// a$_ a:^ExprArgUser = CellTypedField;

export interface CellTypedField {
    readonly kind: 'CellTypedField';
    readonly a: ExprArgUser;
}

// a$_ t:# ^[ q:# ] ^[ a:(## 32) ^[ e:# ] ^[ b:(## 32) d:# ^[ c:(## 32) ] ] ] = CellsSimple;

export interface CellsSimple {
    readonly kind: 'CellsSimple';
    readonly t: number;
    readonly q: number;
    readonly a: number;
    readonly e: number;
    readonly b: number;
    readonly d: number;
    readonly c: number;
}

// b$_ d:int11 g:bits2 {Arg:Type} arg:Arg x:Any = IntBits Arg;

export interface IntBits<Arg> {
    readonly kind: 'IntBits';
    readonly d: number;
    readonly g: BitString;
    readonly arg: Arg;
    readonly x: Cell;
}

// a$_ {x:#} a:(IntBits (int (1 + x))) = IntBitsInside (x * 2);

export interface IntBitsInside {
    readonly kind: 'IntBitsInside';
    readonly x: number;
    readonly a: IntBits<bigint>;
}

// a$_ x:(IntBitsInside 6) = IntBitsOutside;

export interface IntBitsOutside {
    readonly kind: 'IntBitsOutside';
    readonly x: IntBitsInside;
}

// a$_ {e:#} h:(int (e * 8)) f:(uint (7 * e)) i:(bits (5 + e)) j:(int 5) k:(uint e) tc:Cell = IntBitsParametrized e;

export interface IntBitsParametrized {
    readonly kind: 'IntBitsParametrized';
    readonly e: number;
    readonly h: bigint;
    readonly f: bigint;
    readonly i: BitString;
    readonly j: number;
    readonly k: bigint;
    readonly tc: Cell;
}

// a$_ {x:#} a:(IntBitsParametrized x) = IntBitsParametrizedInside x;

export interface IntBitsParametrizedInside {
    readonly kind: 'IntBitsParametrizedInside';
    readonly x: number;
    readonly a: IntBitsParametrized;
}

// a$_ x:(IntBitsParametrizedInside 5) = IntBitsParametrizedOutside;

export interface IntBitsParametrizedOutside {
    readonly kind: 'IntBitsParametrizedOutside';
    readonly x: IntBitsParametrizedInside;
}

// a$_ x:(#< 4) y:(#<= 4) = LessThan;

export interface LessThan {
    readonly kind: 'LessThan';
    readonly x: number;
    readonly y: number;
}

// a$_ {A:Type} t:# x:A = OneComb A;

export interface OneComb<A> {
    readonly kind: 'OneComb';
    readonly t: number;
    readonly x: A;
}

// a$_ y:(OneComb(OneComb(OneComb int3))) = ManyComb;

export interface ManyComb {
    readonly kind: 'ManyComb';
    readonly y: OneComb<OneComb<OneComb<number>>>;
}

// unary_zero$0 = Unary ~0;

// unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);

export type Unary = Unary_unary_zero | Unary_unary_succ;

export interface Unary_unary_zero {
    readonly kind: 'Unary_unary_zero';
}

export interface Unary_unary_succ {
    readonly kind: 'Unary_unary_succ';
    readonly n: number;
    readonly x: Unary;
}

// b$01 m:# k:# = ParamConst 2 1;

// c$01 n:# m:# k:# = ParamConst 3 3;

// a$_ n:# = ParamConst 1 1;

// d$_ n:# m:# k:# l:# = ParamConst 4 2;

export type ParamConst = ParamConst_b | ParamConst_c | ParamConst_a | ParamConst_d;

export interface ParamConst_b {
    readonly kind: 'ParamConst_b';
    readonly m: number;
    readonly k: number;
}

export interface ParamConst_c {
    readonly kind: 'ParamConst_c';
    readonly n: number;
    readonly m: number;
    readonly k: number;
}

export interface ParamConst_a {
    readonly kind: 'ParamConst_a';
    readonly n: number;
}

export interface ParamConst_d {
    readonly kind: 'ParamConst_d';
    readonly n: number;
    readonly m: number;
    readonly k: number;
    readonly l: number;
}

// a$0 = ParamDifNames 2 ~1;

// b$1 = ParamDifNames 3 ~1;

// c$1 {n:#} x:(ParamDifNames 2 ~n) = ParamDifNames 2 ~(n + 1);

// d$0 {m:#} x:(ParamDifNames 3 ~m) = ParamDifNames 3 ~(m * 2);

export type ParamDifNames = ParamDifNames_a | ParamDifNames_b | ParamDifNames_c | ParamDifNames_d;

export interface ParamDifNames_a {
    readonly kind: 'ParamDifNames_a';
}

export interface ParamDifNames_b {
    readonly kind: 'ParamDifNames_b';
}

export interface ParamDifNames_c {
    readonly kind: 'ParamDifNames_c';
    readonly n: number;
    readonly x: ParamDifNames;
}

export interface ParamDifNames_d {
    readonly kind: 'ParamDifNames_d';
    readonly m: number;
    readonly x: ParamDifNames;
}

// e$0 {k:#} x:(ParamDifNames 2 ~k) = ParamDifNamesUser;

export interface ParamDifNamesUser {
    readonly kind: 'ParamDifNamesUser';
    readonly k: number;
    readonly x: ParamDifNames;
}

// b$1 {y:#} t:# z:# { t = (~y) * 2} = NegationFromImplicit ~(y + 1);

export interface NegationFromImplicit {
    readonly kind: 'NegationFromImplicit';
    readonly y: number;
    readonly t: number;
    readonly z: number;
}

// hm_edge#_ {l:#} {m:#} label:(Unary ~l) {7 = (~m) + l} = UnaryUserCheckOrder;

export interface UnaryUserCheckOrder {
    readonly kind: 'UnaryUserCheckOrder';
    readonly l: number;
    readonly m: number;
    readonly label: Unary;
}

/*
a$_ {X:Type} info:int32
  init:(Maybe (Either X ^int22))
  other:(Either X ^(OneComb X))
  body:(Either X ^X) = CombArgCellRef X;
*/

export interface CombArgCellRef<X> {
    readonly kind: 'CombArgCellRef';
    readonly info: number;
    readonly init: Maybe<Either<X, number>>;
    readonly other: Either<X, OneComb<X>>;
    readonly body: Either<X, X>;
}

// a$_ x:(CombArgCellRef int12) = CombArgCellRefUser;

export interface CombArgCellRefUser {
    readonly kind: 'CombArgCellRefUser';
    readonly x: CombArgCellRef<number>;
}

// a$_ {n:#} ref:^(BitLenArg (n + 2)) = MathExprAsCombArg (n + 2);

export interface MathExprAsCombArg {
    readonly kind: 'MathExprAsCombArg';
    readonly n: number;
    readonly ref: BitLenArg;
}

// _ a:# = EmptyTag;

export interface EmptyTag {
    readonly kind: 'EmptyTag';
    readonly a: number;
}

// a#f4 x:# = SharpTag;

export interface SharpTag {
    readonly kind: 'SharpTag';
    readonly x: number;
}

// a$1011 x:# = DollarTag;

export interface DollarTag {
    readonly kind: 'DollarTag';
    readonly x: number;
}

// a$_ s:(3 * int5) = TupleCheck;

export interface TupleCheck {
    readonly kind: 'TupleCheck';
    readonly s: Array<number>;
}

/*
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n) 
          {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;
*/

export interface Hashmap<X> {
    readonly kind: 'Hashmap';
    readonly n: number;
    readonly l: number;
    readonly m: number;
    readonly label: HmLabel;
    readonly node: HashmapNode<X>;
}

// hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;

/*
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X) 
           right:^(Hashmap n X) = HashmapNode (n + 1) X;
*/

export type HashmapNode<X> = HashmapNode_hmn_leaf<X> | HashmapNode_hmn_fork<X>;

export interface HashmapNode_hmn_leaf<X> {
    readonly kind: 'HashmapNode_hmn_leaf';
    readonly value: X;
}

export interface HashmapNode_hmn_fork<X> {
    readonly kind: 'HashmapNode_hmn_fork';
    readonly n: number;
    readonly left: Hashmap<X>;
    readonly right: Hashmap<X>;
}

// hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;

// hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;

// hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;

export type HmLabel = HmLabel_hml_short | HmLabel_hml_long | HmLabel_hml_same;

export interface HmLabel_hml_short {
    readonly kind: 'HmLabel_hml_short';
    readonly m: number;
    readonly n: number;
    readonly len: Unary;
    readonly s: Array<boolean>;
}

export interface HmLabel_hml_long {
    readonly kind: 'HmLabel_hml_long';
    readonly m: number;
    readonly n: number;
    readonly s: Array<boolean>;
}

export interface HmLabel_hml_same {
    readonly kind: 'HmLabel_hml_same';
    readonly m: number;
    readonly v: boolean;
    readonly n: number;
}

// a$_ x:(HashmapE 8 uint16) = HashmapEUser;

export interface HashmapEUser {
    readonly kind: 'HashmapEUser';
    readonly x: Dictionary<number, number>;
}

// _ a:(## 1) b:a?(## 32) = ConditionalField;

export interface ConditionalField {
    readonly kind: 'ConditionalField';
    readonly a: number;
    readonly b: number | undefined;
}

// _ a:(## 6) b:(a . 2)?(## 32) = BitSelection;

export interface BitSelection {
    readonly kind: 'BitSelection';
    readonly a: number;
    readonly b: number | undefined;
}

// _ flags:(## 10) { flags <= 100 } = ImplicitCondition;

export interface ImplicitCondition {
    readonly kind: 'ImplicitCondition';
    readonly flags: number;
}

// _ a:# = MultipleEmptyConstructor 0;

// _ b:(## 5) = MultipleEmptyConstructor 1;

// a$_ x:(## 6) = MultipleEmptyConstructor 2;

export type MultipleEmptyConstructor = MultipleEmptyConstructor__ | MultipleEmptyConstructor__1 | MultipleEmptyConstructor_a;

export interface MultipleEmptyConstructor__ {
    readonly kind: 'MultipleEmptyConstructor__';
    readonly a: number;
}

export interface MultipleEmptyConstructor__1 {
    readonly kind: 'MultipleEmptyConstructor__1';
    readonly b: number;
}

export interface MultipleEmptyConstructor_a {
    readonly kind: 'MultipleEmptyConstructor_a';
    readonly x: number;
}

// true$_ = True;

export interface True {
    readonly kind: 'True';
}

// a$0 {n:#} = ParamNamedArgInSecondConstr n;

// b$1 {n:#} = ParamNamedArgInSecondConstr (n + 1);

export type ParamNamedArgInSecondConstr = ParamNamedArgInSecondConstr_a | ParamNamedArgInSecondConstr_b;

export interface ParamNamedArgInSecondConstr_a {
    readonly kind: 'ParamNamedArgInSecondConstr_a';
    readonly n: number;
}

export interface ParamNamedArgInSecondConstr_b {
    readonly kind: 'ParamNamedArgInSecondConstr_b';
    readonly n: number;
}

// a$_ msg:^(Maybe Any) = RefCombinatorAny;

export interface RefCombinatorAny {
    readonly kind: 'RefCombinatorAny';
    readonly msg: Maybe<Cell>;
}

// a$_ n:# { 5 + n = 7 } = EqualityExpression;

export interface EqualityExpression {
    readonly kind: 'EqualityExpression';
    readonly n: number;
}

// a$_ x:(## 1) y:x?^Simple = ConditionalRef;

export interface ConditionalRef {
    readonly kind: 'ConditionalRef';
    readonly x: number;
    readonly y: Simple | undefined;
}

// block_info#9bc7a987 seq_no:# { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no } = LoadFromNegationOutsideExpr;

export interface LoadFromNegationOutsideExpr {
    readonly kind: 'LoadFromNegationOutsideExpr';
    readonly prev_seq_no: number;
    readonly seq_no: number;
}

// bit$_ (## 1) anon0:# = AnonymousData;

export interface AnonymousData {
    readonly kind: 'AnonymousData';
    readonly anon0: number;
    readonly anon0_0: number;
}

// vm_stk_int#0201_ value:int257 = FalseAnonField;

export interface FalseAnonField {
    readonly kind: 'FalseAnonField';
    readonly value: bigint;
}

// b$1 Simple = ConstructorOrder;

// a$0 a:Simple = ConstructorOrder;

export type ConstructorOrder = ConstructorOrder_b | ConstructorOrder_a;

export interface ConstructorOrder_b {
    readonly kind: 'ConstructorOrder_b';
    readonly anon0: Simple;
}

export interface ConstructorOrder_a {
    readonly kind: 'ConstructorOrder_a';
    readonly a: Simple;
}

// a a:#  = CheckCrc32;

// b b:# c:# = CheckCrc32;

export type CheckCrc32 = CheckCrc32_a | CheckCrc32_b;

export interface CheckCrc32_a {
    readonly kind: 'CheckCrc32_a';
    readonly a: number;
}

export interface CheckCrc32_b {
    readonly kind: 'CheckCrc32_b';
    readonly b: number;
    readonly c: number;
}

// a$_ const:# = CheckKeyword;

export interface CheckKeyword {
    readonly kind: 'CheckKeyword';
    readonly const0: number;
}

// a$_ {X:Type} t:# y:(Maybe ^X) = RefCombinatorInRefHelper X;

export interface RefCombinatorInRefHelper<X> {
    readonly kind: 'RefCombinatorInRefHelper';
    readonly t: number;
    readonly y: Maybe<X>;
}

// a$_ msg:^(RefCombinatorInRefHelper Any) = RefCombinatorInRef;

export interface RefCombinatorInRef {
    readonly kind: 'RefCombinatorInRef';
    readonly msg: RefCombinatorInRefHelper<Cell>;
}

// _ a:Bool = BoolUser;

export interface BoolUser {
    readonly kind: 'BoolUser';
    readonly a: Bool;
}

/*
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
*/

export interface Anycast {
    readonly kind: 'Anycast';
    readonly depth: number;
    readonly rewrite_pfx: BitString;
}

// _ src:MsgAddressInt = AddressUser;

export interface AddressUser {
    readonly kind: 'AddressUser';
    readonly src: Address;
}

// _ src:MsgAddressExt = ExtAddressUser;

export interface ExtAddressUser {
    readonly kind: 'ExtAddressUser';
    readonly src: ExternalAddress | null;
}

// _ src:MsgAddress = AnyAddressUser;

export interface AnyAddressUser {
    readonly kind: 'AnyAddressUser';
    readonly src: Address | ExternalAddress | null;
}

// _ inside:AddressUser = InsideAddressUser;

export interface InsideAddressUser {
    readonly kind: 'InsideAddressUser';
    readonly inside: AddressUser;
}

// a$_ b:Bit = BitUser;

export interface BitUser {
    readonly kind: 'BitUser';
    readonly b: boolean;
}

// a$_ v:(VarUInteger 5) = VarUIntegerUser;

export interface VarUIntegerUser {
    readonly kind: 'VarUIntegerUser';
    readonly v: bigint;
}

// a$_ v:(VarInteger 5) = VarIntegerUser;

export interface VarIntegerUser {
    readonly kind: 'VarIntegerUser';
    readonly v: bigint;
}

// a$_ g:Grams = GramsUser;

export interface GramsUser {
    readonly kind: 'GramsUser';
    readonly g: bigint;
}

// a$_ x:(HashmapE 100 VarUIntegerUser) = HashmapVUIUser;

export interface HashmapVUIUser {
    readonly kind: 'HashmapVUIUser';
    readonly x: Dictionary<bigint, VarUIntegerUser>;
}

// a$_ x:(HashmapE 100 ^TypedParam) = HashmapTPCell;

export interface HashmapTPCell {
    readonly kind: 'HashmapTPCell';
    readonly x: Dictionary<bigint, TypedParam>;
}

// a$_ {n:#} x:(HashmapE n uint5) = HashmapVarKey n;

export interface HashmapVarKey {
    readonly kind: 'HashmapVarKey';
    readonly n: number;
    readonly x: Dictionary<bigint, number>;
}

// a$_ x:(HashmapVarKey 5) = HashmapVarKeyUser;

export interface HashmapVarKeyUser {
    readonly kind: 'HashmapVarKeyUser';
    readonly x: HashmapVarKey;
}

// a$_ {n:#} x:(HashmapE (n+2) uint5) = HashmapExprKey n;

export interface HashmapExprKey {
    readonly kind: 'HashmapExprKey';
    readonly n: number;
    readonly x: Dictionary<bigint, number>;
}

// a$_ x:(HashmapExprKey 5) = HashmapExprKeyUser;

export interface HashmapExprKeyUser {
    readonly kind: 'HashmapExprKeyUser';
    readonly x: HashmapExprKey;
}

// a$_ {A: Type} x:(HashmapE 200 (OneComb A)) = HashmapOneComb A;

export interface HashmapOneComb<A> {
    readonly kind: 'HashmapOneComb';
    readonly x: Dictionary<bigint, OneComb<A>>;
}

// a$_ x:(HashmapOneComb uint5) = HashmapOneCombUser;

export interface HashmapOneCombUser {
    readonly kind: 'HashmapOneCombUser';
    readonly x: HashmapOneComb<number>;
}

/*
ahm_edge#_ {n:#} {X:Type} {Y:Type} {l:#} {m:#} 
  label:(HmLabel ~l n) {n = (~m) + l} 
  node:(HashmapAugNode m X Y) = HashmapAug n X Y;
*/

export interface HashmapAug<X, Y> {
    readonly kind: 'HashmapAug';
    readonly n: number;
    readonly l: number;
    readonly m: number;
    readonly label: HmLabel;
    readonly node: HashmapAugNode<X, Y>;
}

// ahmn_leaf#_ {X:Type} {Y:Type} extra:Y value:X = HashmapAugNode 0 X Y;

/*
ahmn_fork#_ {n:#} {X:Type} {Y:Type} left:^(HashmapAug n X Y)
  right:^(HashmapAug n X Y) extra:Y = HashmapAugNode (n + 1) X Y;
*/

export type HashmapAugNode<X, Y> = HashmapAugNode_ahmn_leaf<X, Y> | HashmapAugNode_ahmn_fork<X, Y>;

export interface HashmapAugNode_ahmn_leaf<X, Y> {
    readonly kind: 'HashmapAugNode_ahmn_leaf';
    readonly extra: Y;
    readonly value: X;
}

export interface HashmapAugNode_ahmn_fork<X, Y> {
    readonly kind: 'HashmapAugNode_ahmn_fork';
    readonly n: number;
    readonly left: HashmapAug<X, Y>;
    readonly right: HashmapAug<X, Y>;
    readonly extra: Y;
}

// a$_ x:(HashmapAugE 16 Grams FixedIntParam) = HashmapAugEUser;

export interface HashmapAugEUser {
    readonly kind: 'HashmapAugEUser';
    readonly x: Dictionary<number, {value: bigint, extra: FixedIntParam}>;
}

// message$_ {X:Type} body:(Either X ^X) = Message X;

export interface Message<X> {
    readonly kind: 'Message';
    readonly body: Either<X, X>;
}

// _ (Message Any) = MessageAny;

export interface MessageAny {
    readonly kind: 'MessageAny';
    readonly anon0: Message<Cell>;
}

// _ x:^FixedIntParam = ShardState;

export interface ShardState {
    readonly kind: 'ShardState';
    readonly x: FixedIntParam;
}

// a$_ {X:Type} a:^X = InsideCell X;

export interface InsideCell<X> {
    readonly kind: 'InsideCell';
    readonly a: X;
}

// a$_ inside_cell:^(InsideCell ShardState) = InsideCellUser;

export interface InsideCellUser {
    readonly kind: 'InsideCellUser';
    readonly inside_cell: InsideCell<ShardState>;
}

// vm_stk_null#00 = VmStackValue;

// vm_stk_tinyint#01 value:int64 = VmStackValue;

// vm_stk_int#0201_ value:int257 = VmStackValue;

// vm_stk_nan#02ff = VmStackValue;

// vm_stk_cell#03 cell:^Cell = VmStackValue;

// vm_stk_slice#04 _:VmCellSlice = VmStackValue;

// vm_stk_builder#05 cell:^Cell = VmStackValue;

// vm_stk_cont#06 cont:VmCont = VmStackValue;

// vm_stk_tuple#07 len:(## 16) data:(VmTuple len) = VmStackValue;

export type VmStackValue = VmStackValue_vm_stk_null | VmStackValue_vm_stk_tinyint | VmStackValue_vm_stk_int | VmStackValue_vm_stk_nan | VmStackValue_vm_stk_cell | VmStackValue_vm_stk_slice | VmStackValue_vm_stk_builder | VmStackValue_vm_stk_cont | VmStackValue_vm_stk_tuple;

export interface VmStackValue_vm_stk_null {
    readonly kind: 'VmStackValue_vm_stk_null';
}

export interface VmStackValue_vm_stk_tinyint {
    readonly kind: 'VmStackValue_vm_stk_tinyint';
    readonly value: bigint;
}

export interface VmStackValue_vm_stk_int {
    readonly kind: 'VmStackValue_vm_stk_int';
    readonly value: bigint;
}

export interface VmStackValue_vm_stk_nan {
    readonly kind: 'VmStackValue_vm_stk_nan';
}

export interface VmStackValue_vm_stk_cell {
    readonly kind: 'VmStackValue_vm_stk_cell';
    readonly _cell: Cell;
}

export interface VmStackValue_vm_stk_slice {
    readonly kind: 'VmStackValue_vm_stk_slice';
    readonly _: VmCellSlice;
}

export interface VmStackValue_vm_stk_builder {
    readonly kind: 'VmStackValue_vm_stk_builder';
    readonly _cell: Cell;
}

export interface VmStackValue_vm_stk_cont {
    readonly kind: 'VmStackValue_vm_stk_cont';
    readonly cont: VmCont;
}

export interface VmStackValue_vm_stk_tuple {
    readonly kind: 'VmStackValue_vm_stk_tuple';
    readonly len: number;
    readonly data: VmTuple;
}

/*
_ cell:^Cell st_bits:(## 10) end_bits:(## 10) { st_bits <= end_bits }
  st_ref:(#<= 4) end_ref:(#<= 4) { st_ref <= end_ref } = VmCellSlice;
*/

export interface VmCellSlice {
    readonly kind: 'VmCellSlice';
    readonly _cell: Cell;
    readonly st_bits: number;
    readonly end_bits: number;
    readonly st_ref: number;
    readonly end_ref: number;
}

// vm_tupref_nil$_ = VmTupleRef 0;

// vm_tupref_single$_ entry:^VmStackValue = VmTupleRef 1;

// vm_tupref_any$_ {n:#} ref:^(VmTuple (n + 2)) = VmTupleRef (n + 2);

export type VmTupleRef = VmTupleRef_vm_tupref_nil | VmTupleRef_vm_tupref_single | VmTupleRef_vm_tupref_any;

export interface VmTupleRef_vm_tupref_nil {
    readonly kind: 'VmTupleRef_vm_tupref_nil';
}

export interface VmTupleRef_vm_tupref_single {
    readonly kind: 'VmTupleRef_vm_tupref_single';
    readonly entry: VmStackValue;
}

export interface VmTupleRef_vm_tupref_any {
    readonly kind: 'VmTupleRef_vm_tupref_any';
    readonly n: number;
    readonly ref: VmTuple;
}

// vm_tuple_nil$_ = VmTuple 0;

// vm_tuple_tcons$_ {n:#} head:(VmTupleRef n) tail:^VmStackValue = VmTuple (n + 1);

export type VmTuple = VmTuple_vm_tuple_nil | VmTuple_vm_tuple_tcons;

export interface VmTuple_vm_tuple_nil {
    readonly kind: 'VmTuple_vm_tuple_nil';
}

export interface VmTuple_vm_tuple_tcons {
    readonly kind: 'VmTuple_vm_tuple_tcons';
    readonly n: number;
    readonly head: VmTupleRef;
    readonly tail: VmStackValue;
}

// vm_stack#_ depth:(## 24) stack:(VmStackList depth) = VmStack;

export interface VmStack {
    readonly kind: 'VmStack';
    readonly depth: number;
    readonly stack: VmStackList;
}

// vm_stk_nil#_ = VmStackList 0;

// vm_stk_cons#_ {n:#} rest:^(VmStackList n) tos:VmStackValue = VmStackList (n + 1);

export type VmStackList = VmStackList_vm_stk_nil | VmStackList_vm_stk_cons;

export interface VmStackList_vm_stk_nil {
    readonly kind: 'VmStackList_vm_stk_nil';
}

export interface VmStackList_vm_stk_cons {
    readonly kind: 'VmStackList_vm_stk_cons';
    readonly n: number;
    readonly rest: VmStackList;
    readonly tos: VmStackValue;
}

// _ cregs:(HashmapE 4 VmStackValue) = VmSaveList;

export interface VmSaveList {
    readonly kind: 'VmSaveList';
    readonly cregs: Dictionary<number, VmStackValue>;
}

/*
gas_limits#_ remaining:int64 _:^[ max_limit:int64 cur_limit:int64 credit:int64 ]
  = VmGasLimits;
*/

export interface VmGasLimits {
    readonly kind: 'VmGasLimits';
    readonly remaining: bigint;
    readonly max_limit: bigint;
    readonly cur_limit: bigint;
    readonly credit: bigint;
}

// _ libraries:(HashmapE 256 ^Cell) = VmLibraries;

export interface VmLibraries {
    readonly kind: 'VmLibraries';
    readonly libraries: Dictionary<bigint, Cell>;
}

/*
vm_ctl_data$_ nargs:(Maybe uint13) stack:(Maybe VmStack) save:VmSaveList
cp:(Maybe int16) = VmControlData;
*/

export interface VmControlData {
    readonly kind: 'VmControlData';
    readonly nargs: Maybe<number>;
    readonly stack: Maybe<TupleItem[]>;
    readonly save: VmSaveList;
    readonly cp: Maybe<number>;
}

// vmc_std$00 cdata:VmControlData code:VmCellSlice = VmCont;

// vmc_envelope$01 cdata:VmControlData next:^VmCont = VmCont;

// vmc_quit$1000 exit_code:int32 = VmCont;

// vmc_quit_exc$1001 = VmCont;

// vmc_repeat$10100 count:uint63 body:^VmCont after:^VmCont = VmCont;

// vmc_until$110000 body:^VmCont after:^VmCont = VmCont;

// vmc_again$110001 body:^VmCont = VmCont;

/*
vmc_while_cond$110010 cond:^VmCont body:^VmCont
after:^VmCont = VmCont;
*/

/*
vmc_while_body$110011 cond:^VmCont body:^VmCont
after:^VmCont = VmCont;
*/

// vmc_pushint$1111 value:int32 next:^VmCont = VmCont;

export type VmCont = VmCont_vmc_std | VmCont_vmc_envelope | VmCont_vmc_quit | VmCont_vmc_quit_exc | VmCont_vmc_repeat | VmCont_vmc_until | VmCont_vmc_again | VmCont_vmc_while_cond | VmCont_vmc_while_body | VmCont_vmc_pushint;

export interface VmCont_vmc_std {
    readonly kind: 'VmCont_vmc_std';
    readonly cdata: VmControlData;
    readonly code: VmCellSlice;
}

export interface VmCont_vmc_envelope {
    readonly kind: 'VmCont_vmc_envelope';
    readonly cdata: VmControlData;
    readonly next: VmCont;
}

export interface VmCont_vmc_quit {
    readonly kind: 'VmCont_vmc_quit';
    readonly exit_code: number;
}

export interface VmCont_vmc_quit_exc {
    readonly kind: 'VmCont_vmc_quit_exc';
}

export interface VmCont_vmc_repeat {
    readonly kind: 'VmCont_vmc_repeat';
    readonly count: bigint;
    readonly body: VmCont;
    readonly after: VmCont;
}

export interface VmCont_vmc_until {
    readonly kind: 'VmCont_vmc_until';
    readonly body: VmCont;
    readonly after: VmCont;
}

export interface VmCont_vmc_again {
    readonly kind: 'VmCont_vmc_again';
    readonly body: VmCont;
}

export interface VmCont_vmc_while_cond {
    readonly kind: 'VmCont_vmc_while_cond';
    readonly cond: VmCont;
    readonly body: VmCont;
    readonly after: VmCont;
}

export interface VmCont_vmc_while_body {
    readonly kind: 'VmCont_vmc_while_body';
    readonly cond: VmCont;
    readonly body: VmCont;
    readonly after: VmCont;
}

export interface VmCont_vmc_pushint {
    readonly kind: 'VmCont_vmc_pushint';
    readonly value: number;
    readonly next: VmCont;
}

// _ t:VmStack = VMStackUser;

export interface VMStackUser {
    readonly kind: 'VMStackUser';
    readonly t: TupleItem[];
}

// tmpa$_ a:# b:# = Simple;

export function loadSimple(slice: Slice): Simple {
    let a: number = slice.loadUint(32);
    let b: number = slice.loadUint(32);
    return {
        kind: 'Simple',
        a: a,
        b: b,
    }

}

export function storeSimple(simple: Simple): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(simple.a, 32);
        builder.storeUint(simple.b, 32);
    })

}

// a$_ {Arg:Type} arg:Arg = TypedArg Arg;

export function loadTypedArg<Arg>(slice: Slice, loadArg: (slice: Slice) => Arg): TypedArg<Arg> {
    let arg: Arg = loadArg(slice);
    return {
        kind: 'TypedArg',
        arg: arg,
    }

}

export function storeTypedArg<Arg>(typedArg: TypedArg<Arg>, storeArg: (arg: Arg) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeArg(typedArg.arg)(builder);
    })

}

// a$_ x:(TypedArg Simple) = TypedArgUser;

export function loadTypedArgUser(slice: Slice): TypedArgUser {
    let x: TypedArg<Simple> = loadTypedArg<Simple>(slice, loadSimple);
    return {
        kind: 'TypedArgUser',
        x: x,
    }

}

export function storeTypedArgUser(typedArgUser: TypedArgUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeTypedArg<Simple>(typedArgUser.x, storeSimple)(builder);
    })

}

// a$_ {Arg:Type} {n:#} arg:Arg c:(## n) = ParamAndTypedArg n Arg;

export function loadParamAndTypedArg<Arg>(slice: Slice, n: number, loadArg: (slice: Slice) => Arg): ParamAndTypedArg<Arg> {
    let arg: Arg = loadArg(slice);
    let c: bigint = slice.loadUintBig(n);
    return {
        kind: 'ParamAndTypedArg',
        n: n,
        arg: arg,
        c: c,
    }

}

export function storeParamAndTypedArg<Arg>(paramAndTypedArg: ParamAndTypedArg<Arg>, storeArg: (arg: Arg) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeArg(paramAndTypedArg.arg)(builder);
        builder.storeUint(paramAndTypedArg.c, paramAndTypedArg.n);
    })

}

// a$_ x:(ParamAndTypedArg 5 Simple) = ParamAndTypedArgUser;

export function loadParamAndTypedArgUser(slice: Slice): ParamAndTypedArgUser {
    let x: ParamAndTypedArg<Simple> = loadParamAndTypedArg<Simple>(slice, 5, loadSimple);
    return {
        kind: 'ParamAndTypedArgUser',
        x: x,
    }

}

export function storeParamAndTypedArgUser(paramAndTypedArgUser: ParamAndTypedArgUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeParamAndTypedArg<Simple>(paramAndTypedArgUser.x, storeSimple)(builder);
    })

}

// _ x:Simple y:Simple = TwoSimples;

export function loadTwoSimples(slice: Slice): TwoSimples {
    let x: Simple = loadSimple(slice);
    let y: Simple = loadSimple(slice);
    return {
        kind: 'TwoSimples',
        x: x,
        y: y,
    }

}

export function storeTwoSimples(twoSimples: TwoSimples): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeSimple(twoSimples.x)(builder);
        storeSimple(twoSimples.y)(builder);
    })

}

// _ one_maybe:(Maybe Simple) second_maybe:(Maybe Simple) = TwoMaybes;

export function loadTwoMaybes(slice: Slice): TwoMaybes {
    let one_maybe: Maybe<Simple> = loadMaybe<Simple>(slice, loadSimple);
    let second_maybe: Maybe<Simple> = loadMaybe<Simple>(slice, loadSimple);
    return {
        kind: 'TwoMaybes',
        one_maybe: one_maybe,
        second_maybe: second_maybe,
    }

}

export function storeTwoMaybes(twoMaybes: TwoMaybes): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeMaybe<Simple>(twoMaybes.one_maybe, storeSimple)(builder);
        storeMaybe<Simple>(twoMaybes.second_maybe, storeSimple)(builder);
    })

}

// bool_false$0 a:# b:(## 7) c:# = TwoConstructors;

// bool_true$1 b:# = TwoConstructors;

export function loadTwoConstructors(slice: Slice): TwoConstructors {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        let a: number = slice.loadUint(32);
        let b: number = slice.loadUint(7);
        let c: number = slice.loadUint(32);
        return {
            kind: 'TwoConstructors_bool_false',
            a: a,
            b: b,
            c: c,
        }

    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        let b: number = slice.loadUint(32);
        return {
            kind: 'TwoConstructors_bool_true',
            b: b,
        }

    }
    throw new Error('Expected one of "TwoConstructors_bool_false", "TwoConstructors_bool_true" in loading "TwoConstructors", but data does not satisfy any constructor');
}

export function storeTwoConstructors(twoConstructors: TwoConstructors): (builder: Builder) => void {
    if ((twoConstructors.kind == 'TwoConstructors_bool_false')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
            builder.storeUint(twoConstructors.a, 32);
            builder.storeUint(twoConstructors.b, 7);
            builder.storeUint(twoConstructors.c, 32);
        })

    }
    if ((twoConstructors.kind == 'TwoConstructors_bool_true')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            builder.storeUint(twoConstructors.b, 32);
        })

    }
    throw new Error('Expected one of "TwoConstructors_bool_false", "TwoConstructors_bool_true" in loading "TwoConstructors", but data does not satisfy any constructor');
}

// tmpb$_ y:(## 5) = FixedIntParam;

export function loadFixedIntParam(slice: Slice): FixedIntParam {
    let y: number = slice.loadUint(5);
    return {
        kind: 'FixedIntParam',
        y: y,
    }

}

export function storeFixedIntParam(fixedIntParam: FixedIntParam): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(fixedIntParam.y, 5);
    })

}

// tmpc$_ y:FixedIntParam c:# = TypedField;

export function loadTypedField(slice: Slice): TypedField {
    let y: FixedIntParam = loadFixedIntParam(slice);
    let c: number = slice.loadUint(32);
    return {
        kind: 'TypedField',
        y: y,
        c: c,
    }

}

export function storeTypedField(typedField: TypedField): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeFixedIntParam(typedField.y)(builder);
        builder.storeUint(typedField.c, 32);
    })

}

// tmpd#_ y:FixedIntParam c:# = SharpConstructor;

export function loadSharpConstructor(slice: Slice): SharpConstructor {
    let y: FixedIntParam = loadFixedIntParam(slice);
    let c: number = slice.loadUint(32);
    return {
        kind: 'SharpConstructor',
        y: y,
        c: c,
    }

}

export function storeSharpConstructor(sharpConstructor: SharpConstructor): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeFixedIntParam(sharpConstructor.y)(builder);
        builder.storeUint(sharpConstructor.c, 32);
    })

}

// nothing$0 {TheType:Type} = Maybe TheType;

// just$1 {TheType:Type} value:TheType = Maybe TheType;

export function loadMaybe<TheType>(slice: Slice, loadTheType: (slice: Slice) => TheType): Maybe<TheType> {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        return {
            kind: 'Maybe_nothing',
        }

    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        let value: TheType = loadTheType(slice);
        return {
            kind: 'Maybe_just',
            value: value,
        }

    }
    throw new Error('Expected one of "Maybe_nothing", "Maybe_just" in loading "Maybe", but data does not satisfy any constructor');
}

export function storeMaybe<TheType>(maybe: Maybe<TheType>, storeTheType: (theType: TheType) => (builder: Builder) => void): (builder: Builder) => void {
    if ((maybe.kind == 'Maybe_nothing')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
        })

    }
    if ((maybe.kind == 'Maybe_just')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeTheType(maybe.value)(builder);
        })

    }
    throw new Error('Expected one of "Maybe_nothing", "Maybe_just" in loading "Maybe", but data does not satisfy any constructor');
}

// thejust$_ x:(Maybe SharpConstructor) = TypedParam;

export function loadTypedParam(slice: Slice): TypedParam {
    let x: Maybe<SharpConstructor> = loadMaybe<SharpConstructor>(slice, loadSharpConstructor);
    return {
        kind: 'TypedParam',
        x: x,
    }

}

export function storeTypedParam(typedParam: TypedParam): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeMaybe<SharpConstructor>(typedParam.x, storeSharpConstructor)(builder);
    })

}

// left$0 {X:Type} {Y:Type} value:X = Either X Y;

// right$1 {X:Type} {Y:Type} value:Y = Either X Y;

export function loadEither<X, Y>(slice: Slice, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): Either<X, Y> {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        let value: X = loadX(slice);
        return {
            kind: 'Either_left',
            value: value,
        }

    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        let value: Y = loadY(slice);
        return {
            kind: 'Either_right',
            value: value,
        }

    }
    throw new Error('Expected one of "Either_left", "Either_right" in loading "Either", but data does not satisfy any constructor');
}

export function storeEither<X, Y>(either: Either<X, Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
    if ((either.kind == 'Either_left')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
            storeX(either.value)(builder);
        })

    }
    if ((either.kind == 'Either_right')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeY(either.value)(builder);
        })

    }
    throw new Error('Expected one of "Either_left", "Either_right" in loading "Either", but data does not satisfy any constructor');
}

// a$_ {x:#} value:(## x) = BitLenArg x;

export function loadBitLenArg(slice: Slice, x: number): BitLenArg {
    let value: bigint = slice.loadUintBig(x);
    return {
        kind: 'BitLenArg',
        x: x,
        value: value,
    }

}

export function storeBitLenArg(bitLenArg: BitLenArg): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(bitLenArg.value, bitLenArg.x);
    })

}

// a$_ t:(BitLenArg 4) = BitLenArgUser;

export function loadBitLenArgUser(slice: Slice): BitLenArgUser {
    let t: BitLenArg = loadBitLenArg(slice, 4);
    return {
        kind: 'BitLenArgUser',
        t: t,
    }

}

export function storeBitLenArgUser(bitLenArgUser: BitLenArgUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeBitLenArg(bitLenArgUser.t)(builder);
    })

}

// a$_ {x:#} value:(## x) = ExprArg (2 + x);

export function loadExprArg(slice: Slice, arg0: number): ExprArg {
    let value: bigint = slice.loadUintBig((arg0 - 2));
    return {
        kind: 'ExprArg',
        x: (arg0 - 2),
        value: value,
    }

}

export function storeExprArg(exprArg: ExprArg): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(exprArg.value, exprArg.x);
    })

}

// a$_ t:(ExprArg 6) = ExprArgUser;

export function loadExprArgUser(slice: Slice): ExprArgUser {
    let t: ExprArg = loadExprArg(slice, 6);
    return {
        kind: 'ExprArgUser',
        t: t,
    }

}

export function storeExprArgUser(exprArgUser: ExprArgUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeExprArg(exprArgUser.t)(builder);
    })

}

// a$_ a:ExprArgUser = ComplexTypedField;

export function loadComplexTypedField(slice: Slice): ComplexTypedField {
    let a: ExprArgUser = loadExprArgUser(slice);
    return {
        kind: 'ComplexTypedField',
        a: a,
    }

}

export function storeComplexTypedField(complexTypedField: ComplexTypedField): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeExprArgUser(complexTypedField.a)(builder);
    })

}

// a$_ a:^ExprArgUser = CellTypedField;

export function loadCellTypedField(slice: Slice): CellTypedField {
    let slice1 = slice.loadRef().beginParse(true);
    let a: ExprArgUser = loadExprArgUser(slice1);
    return {
        kind: 'CellTypedField',
        a: a,
    }

}

export function storeCellTypedField(_cellTypedField: CellTypedField): (builder: Builder) => void {
    return ((builder: Builder) => {
        let cell1 = beginCell();
        storeExprArgUser(_cellTypedField.a)(cell1);
        builder.storeRef(cell1);
    })

}

// a$_ t:# ^[ q:# ] ^[ a:(## 32) ^[ e:# ] ^[ b:(## 32) d:# ^[ c:(## 32) ] ] ] = CellsSimple;

export function loadCellsSimple(slice: Slice): CellsSimple {
    let t: number = slice.loadUint(32);
    let slice1 = slice.loadRef().beginParse(true);
    let q: number = slice1.loadUint(32);
    let slice2 = slice.loadRef().beginParse(true);
    let a: number = slice2.loadUint(32);
    let slice21 = slice2.loadRef().beginParse(true);
    let e: number = slice21.loadUint(32);
    let slice22 = slice2.loadRef().beginParse(true);
    let b: number = slice22.loadUint(32);
    let d: number = slice22.loadUint(32);
    let slice221 = slice22.loadRef().beginParse(true);
    let c: number = slice221.loadUint(32);
    return {
        kind: 'CellsSimple',
        t: t,
        q: q,
        a: a,
        e: e,
        b: b,
        d: d,
        c: c,
    }

}

export function storeCellsSimple(_cellsSimple: CellsSimple): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(_cellsSimple.t, 32);
        let cell1 = beginCell();
        cell1.storeUint(_cellsSimple.q, 32);
        builder.storeRef(cell1);
        let cell2 = beginCell();
        cell2.storeUint(_cellsSimple.a, 32);
        let cell21 = beginCell();
        cell21.storeUint(_cellsSimple.e, 32);
        cell2.storeRef(cell21);
        let cell22 = beginCell();
        cell22.storeUint(_cellsSimple.b, 32);
        cell22.storeUint(_cellsSimple.d, 32);
        let cell221 = beginCell();
        cell221.storeUint(_cellsSimple.c, 32);
        cell22.storeRef(cell221);
        cell2.storeRef(cell22);
        builder.storeRef(cell2);
    })

}

// b$_ d:int11 g:bits2 {Arg:Type} arg:Arg x:Any = IntBits Arg;

export function loadIntBits<Arg>(slice: Slice, loadArg: (slice: Slice) => Arg): IntBits<Arg> {
    let d: number = slice.loadInt(11);
    let g: BitString = slice.loadBits(2);
    let arg: Arg = loadArg(slice);
    let x: Cell = slice.asCell();
    return {
        kind: 'IntBits',
        d: d,
        g: g,
        arg: arg,
        x: x,
    }

}

export function storeIntBits<Arg>(intBits: IntBits<Arg>, storeArg: (arg: Arg) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeInt(intBits.d, 11);
        builder.storeBits(intBits.g);
        storeArg(intBits.arg)(builder);
        builder.storeSlice(intBits.x.beginParse(true));
    })

}

// a$_ {x:#} a:(IntBits (int (1 + x))) = IntBitsInside (x * 2);

export function loadIntBitsInside(slice: Slice, arg0: number): IntBitsInside {
    let a: IntBits<bigint> = loadIntBits<bigint>(slice, ((slice: Slice) => {
        return slice.loadIntBig((1 + (arg0 / 2)))

    }));
    return {
        kind: 'IntBitsInside',
        x: (arg0 / 2),
        a: a,
    }

}

export function storeIntBitsInside(intBitsInside: IntBitsInside): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeIntBits<bigint>(intBitsInside.a, ((arg: bigint) => {
            return ((builder: Builder) => {
                builder.storeInt(arg, (1 + intBitsInside.x));
            })

        }))(builder);
    })

}

// a$_ x:(IntBitsInside 6) = IntBitsOutside;

export function loadIntBitsOutside(slice: Slice): IntBitsOutside {
    let x: IntBitsInside = loadIntBitsInside(slice, 6);
    return {
        kind: 'IntBitsOutside',
        x: x,
    }

}

export function storeIntBitsOutside(intBitsOutside: IntBitsOutside): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeIntBitsInside(intBitsOutside.x)(builder);
    })

}

// a$_ {e:#} h:(int (e * 8)) f:(uint (7 * e)) i:(bits (5 + e)) j:(int 5) k:(uint e) tc:Cell = IntBitsParametrized e;

export function loadIntBitsParametrized(slice: Slice, e: number): IntBitsParametrized {
    let h: bigint = slice.loadIntBig((e * 8));
    let f: bigint = slice.loadUintBig((7 * e));
    let i: BitString = slice.loadBits((5 + e));
    let j: number = slice.loadInt(5);
    let k: bigint = slice.loadUintBig(e);
    let tc: Cell = slice.asCell();
    return {
        kind: 'IntBitsParametrized',
        e: e,
        h: h,
        f: f,
        i: i,
        j: j,
        k: k,
        tc: tc,
    }

}

export function storeIntBitsParametrized(intBitsParametrized: IntBitsParametrized): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeInt(intBitsParametrized.h, (intBitsParametrized.e * 8));
        builder.storeUint(intBitsParametrized.f, (7 * intBitsParametrized.e));
        builder.storeBits(intBitsParametrized.i);
        builder.storeInt(intBitsParametrized.j, 5);
        builder.storeUint(intBitsParametrized.k, intBitsParametrized.e);
        builder.storeSlice(intBitsParametrized.tc.beginParse(true));
    })

}

// a$_ {x:#} a:(IntBitsParametrized x) = IntBitsParametrizedInside x;

export function loadIntBitsParametrizedInside(slice: Slice, x: number): IntBitsParametrizedInside {
    let a: IntBitsParametrized = loadIntBitsParametrized(slice, x);
    return {
        kind: 'IntBitsParametrizedInside',
        x: x,
        a: a,
    }

}

export function storeIntBitsParametrizedInside(intBitsParametrizedInside: IntBitsParametrizedInside): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeIntBitsParametrized(intBitsParametrizedInside.a)(builder);
    })

}

// a$_ x:(IntBitsParametrizedInside 5) = IntBitsParametrizedOutside;

export function loadIntBitsParametrizedOutside(slice: Slice): IntBitsParametrizedOutside {
    let x: IntBitsParametrizedInside = loadIntBitsParametrizedInside(slice, 5);
    return {
        kind: 'IntBitsParametrizedOutside',
        x: x,
    }

}

export function storeIntBitsParametrizedOutside(intBitsParametrizedOutside: IntBitsParametrizedOutside): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeIntBitsParametrizedInside(intBitsParametrizedOutside.x)(builder);
    })

}

// a$_ x:(#< 4) y:(#<= 4) = LessThan;

export function loadLessThan(slice: Slice): LessThan {
    let x: number = slice.loadUint(bitLen((4 - 1)));
    let y: number = slice.loadUint(bitLen(4));
    return {
        kind: 'LessThan',
        x: x,
        y: y,
    }

}

export function storeLessThan(lessThan: LessThan): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(lessThan.x, bitLen((4 - 1)));
        builder.storeUint(lessThan.y, bitLen(4));
    })

}

// a$_ {A:Type} t:# x:A = OneComb A;

export function loadOneComb<A>(slice: Slice, loadA: (slice: Slice) => A): OneComb<A> {
    let t: number = slice.loadUint(32);
    let x: A = loadA(slice);
    return {
        kind: 'OneComb',
        t: t,
        x: x,
    }

}

export function storeOneComb<A>(oneComb: OneComb<A>, storeA: (a: A) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(oneComb.t, 32);
        storeA(oneComb.x)(builder);
    })

}

// a$_ y:(OneComb(OneComb(OneComb int3))) = ManyComb;

export function loadManyComb(slice: Slice): ManyComb {
    let y: OneComb<OneComb<OneComb<number>>> = loadOneComb<OneComb<OneComb<number>>>(slice, ((slice: Slice) => {
        return loadOneComb<OneComb<number>>(slice, ((slice: Slice) => {
            return loadOneComb<number>(slice, ((slice: Slice) => {
                return slice.loadInt(3)

            }))

        }))

    }));
    return {
        kind: 'ManyComb',
        y: y,
    }

}

export function storeManyComb(manyComb: ManyComb): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeOneComb<OneComb<OneComb<number>>>(manyComb.y, ((arg: OneComb<OneComb<number>>) => {
            return ((builder: Builder) => {
                storeOneComb<OneComb<number>>(arg, ((arg: OneComb<number>) => {
                    return ((builder: Builder) => {
                        storeOneComb<number>(arg, ((arg: number) => {
                            return ((builder: Builder) => {
                                builder.storeInt(arg, 3);
                            })

                        }))(builder);
                    })

                }))(builder);
            })

        }))(builder);
    })

}

// unary_zero$0 = Unary ~0;

export function unary_unary_succ_get_n(x: Unary): number {
    if ((x.kind == 'Unary_unary_zero')) {
        return 0

    }
    if ((x.kind == 'Unary_unary_succ')) {
        let n = x.n;
        return (n + 1)

    }
    throw new Error('Expected one of "Unary_unary_zero", "Unary_unary_succ" for type "Unary" while getting "x", but data does not satisfy any constructor');
}

// unary_succ$1 {n:#} x:(Unary ~n) = Unary ~(n + 1);

export function loadUnary(slice: Slice): Unary {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        return {
            kind: 'Unary_unary_zero',
        }

    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        let x: Unary = loadUnary(slice);
        let n = unary_unary_succ_get_n(x);
        return {
            kind: 'Unary_unary_succ',
            x: x,
            n: n,
        }

    }
    throw new Error('Expected one of "Unary_unary_zero", "Unary_unary_succ" in loading "Unary", but data does not satisfy any constructor');
}

export function storeUnary(unary: Unary): (builder: Builder) => void {
    if ((unary.kind == 'Unary_unary_zero')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
        })

    }
    if ((unary.kind == 'Unary_unary_succ')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeUnary(unary.x)(builder);
        })

    }
    throw new Error('Expected one of "Unary_unary_zero", "Unary_unary_succ" in loading "Unary", but data does not satisfy any constructor');
}

// b$01 m:# k:# = ParamConst 2 1;

// c$01 n:# m:# k:# = ParamConst 3 3;

// a$_ n:# = ParamConst 1 1;

// d$_ n:# m:# k:# l:# = ParamConst 4 2;

export function loadParamConst(slice: Slice, arg0: number, arg1: number): ParamConst {
    if (((slice.remainingBits >= 2) && ((slice.preloadUint(2) == 0b01) && ((arg0 == 2) && (arg1 == 1))))) {
        slice.loadUint(2);
        let m: number = slice.loadUint(32);
        let k: number = slice.loadUint(32);
        return {
            kind: 'ParamConst_b',
            m: m,
            k: k,
        }

    }
    if (((slice.remainingBits >= 2) && ((slice.preloadUint(2) == 0b01) && ((arg0 == 3) && (arg1 == 3))))) {
        slice.loadUint(2);
        let n: number = slice.loadUint(32);
        let m: number = slice.loadUint(32);
        let k: number = slice.loadUint(32);
        return {
            kind: 'ParamConst_c',
            n: n,
            m: m,
            k: k,
        }

    }
    if (((arg0 == 1) && (arg1 == 1))) {
        let n: number = slice.loadUint(32);
        return {
            kind: 'ParamConst_a',
            n: n,
        }

    }
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
            l: l,
        }

    }
    throw new Error('Expected one of "ParamConst_b", "ParamConst_c", "ParamConst_a", "ParamConst_d" in loading "ParamConst", but data does not satisfy any constructor');
}

export function storeParamConst(paramConst: ParamConst): (builder: Builder) => void {
    if ((paramConst.kind == 'ParamConst_b')) {
        return ((builder: Builder) => {
            builder.storeUint(0b01, 2);
            builder.storeUint(paramConst.m, 32);
            builder.storeUint(paramConst.k, 32);
        })

    }
    if ((paramConst.kind == 'ParamConst_c')) {
        return ((builder: Builder) => {
            builder.storeUint(0b01, 2);
            builder.storeUint(paramConst.n, 32);
            builder.storeUint(paramConst.m, 32);
            builder.storeUint(paramConst.k, 32);
        })

    }
    if ((paramConst.kind == 'ParamConst_a')) {
        return ((builder: Builder) => {
            builder.storeUint(paramConst.n, 32);
        })

    }
    if ((paramConst.kind == 'ParamConst_d')) {
        return ((builder: Builder) => {
            builder.storeUint(paramConst.n, 32);
            builder.storeUint(paramConst.m, 32);
            builder.storeUint(paramConst.k, 32);
            builder.storeUint(paramConst.l, 32);
        })

    }
    throw new Error('Expected one of "ParamConst_b", "ParamConst_c", "ParamConst_a", "ParamConst_d" in loading "ParamConst", but data does not satisfy any constructor');
}

// a$0 = ParamDifNames 2 ~1;

// b$1 = ParamDifNames 3 ~1;

export function paramDifNames_c_get_n(x: ParamDifNames): number {
    if ((x.kind == 'ParamDifNames_a')) {
        return 1

    }
    if ((x.kind == 'ParamDifNames_b')) {
        return 1

    }
    if ((x.kind == 'ParamDifNames_c')) {
        let n = x.n;
        return (n + 1)

    }
    if ((x.kind == 'ParamDifNames_d')) {
        let m = x.m;
        return (m * 2)

    }
    throw new Error('Expected one of "ParamDifNames_a", "ParamDifNames_b", "ParamDifNames_c", "ParamDifNames_d" for type "ParamDifNames" while getting "x", but data does not satisfy any constructor');
}

// c$1 {n:#} x:(ParamDifNames 2 ~n) = ParamDifNames 2 ~(n + 1);

export function paramDifNames_d_get_m(x: ParamDifNames): number {
    if ((x.kind == 'ParamDifNames_a')) {
        return 1

    }
    if ((x.kind == 'ParamDifNames_b')) {
        return 1

    }
    if ((x.kind == 'ParamDifNames_c')) {
        let n = x.n;
        return (n + 1)

    }
    if ((x.kind == 'ParamDifNames_d')) {
        let m = x.m;
        return (m * 2)

    }
    throw new Error('Expected one of "ParamDifNames_a", "ParamDifNames_b", "ParamDifNames_c", "ParamDifNames_d" for type "ParamDifNames" while getting "x", but data does not satisfy any constructor');
}

// d$0 {m:#} x:(ParamDifNames 3 ~m) = ParamDifNames 3 ~(m * 2);

export function loadParamDifNames(slice: Slice, arg0: number): ParamDifNames {
    if (((slice.remainingBits >= 1) && ((slice.preloadUint(1) == 0b0) && (arg0 == 2)))) {
        slice.loadUint(1);
        return {
            kind: 'ParamDifNames_a',
        }

    }
    if (((slice.remainingBits >= 1) && ((slice.preloadUint(1) == 0b1) && (arg0 == 3)))) {
        slice.loadUint(1);
        return {
            kind: 'ParamDifNames_b',
        }

    }
    if (((slice.remainingBits >= 1) && ((slice.preloadUint(1) == 0b1) && (arg0 == 2)))) {
        slice.loadUint(1);
        let x: ParamDifNames = loadParamDifNames(slice, 2);
        let n = paramDifNames_c_get_n(x);
        return {
            kind: 'ParamDifNames_c',
            x: x,
            n: n,
        }

    }
    if (((slice.remainingBits >= 1) && ((slice.preloadUint(1) == 0b0) && (arg0 == 3)))) {
        slice.loadUint(1);
        let x: ParamDifNames = loadParamDifNames(slice, 3);
        let m = paramDifNames_d_get_m(x);
        return {
            kind: 'ParamDifNames_d',
            x: x,
            m: m,
        }

    }
    throw new Error('Expected one of "ParamDifNames_a", "ParamDifNames_b", "ParamDifNames_c", "ParamDifNames_d" in loading "ParamDifNames", but data does not satisfy any constructor');
}

export function storeParamDifNames(paramDifNames: ParamDifNames): (builder: Builder) => void {
    if ((paramDifNames.kind == 'ParamDifNames_a')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
        })

    }
    if ((paramDifNames.kind == 'ParamDifNames_b')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
        })

    }
    if ((paramDifNames.kind == 'ParamDifNames_c')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeParamDifNames(paramDifNames.x)(builder);
        })

    }
    if ((paramDifNames.kind == 'ParamDifNames_d')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
            storeParamDifNames(paramDifNames.x)(builder);
        })

    }
    throw new Error('Expected one of "ParamDifNames_a", "ParamDifNames_b", "ParamDifNames_c", "ParamDifNames_d" in loading "ParamDifNames", but data does not satisfy any constructor');
}

export function paramDifNamesUser_get_k(x: ParamDifNames): number {
    if ((x.kind == 'ParamDifNames_a')) {
        return 1

    }
    if ((x.kind == 'ParamDifNames_b')) {
        return 1

    }
    if ((x.kind == 'ParamDifNames_c')) {
        let n = x.n;
        return (n + 1)

    }
    if ((x.kind == 'ParamDifNames_d')) {
        let m = x.m;
        return (m * 2)

    }
    throw new Error('Expected one of "ParamDifNames_a", "ParamDifNames_b", "ParamDifNames_c", "ParamDifNames_d" for type "ParamDifNames" while getting "x", but data does not satisfy any constructor');
}

// e$0 {k:#} x:(ParamDifNames 2 ~k) = ParamDifNamesUser;

export function loadParamDifNamesUser(slice: Slice): ParamDifNamesUser {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        let x: ParamDifNames = loadParamDifNames(slice, 2);
        let k = paramDifNamesUser_get_k(x);
        return {
            kind: 'ParamDifNamesUser',
            x: x,
            k: k,
        }

    }
    throw new Error('Expected one of "ParamDifNamesUser" in loading "ParamDifNamesUser", but data does not satisfy any constructor');
}

export function storeParamDifNamesUser(paramDifNamesUser: ParamDifNamesUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0b0, 1);
        storeParamDifNames(paramDifNamesUser.x)(builder);
    })

}

// b$1 {y:#} t:# z:# { t = (~y) * 2} = NegationFromImplicit ~(y + 1);

export function loadNegationFromImplicit(slice: Slice): NegationFromImplicit {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        let t: number = slice.loadUint(32);
        let z: number = slice.loadUint(32);
        return {
            kind: 'NegationFromImplicit',
            y: (t / 2),
            t: t,
            z: z,
        }

    }
    throw new Error('Expected one of "NegationFromImplicit" in loading "NegationFromImplicit", but data does not satisfy any constructor');
}

export function storeNegationFromImplicit(negationFromImplicit: NegationFromImplicit): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0b1, 1);
        builder.storeUint(negationFromImplicit.t, 32);
        builder.storeUint(negationFromImplicit.z, 32);
    })

}

export function unaryUserCheckOrder_get_l(label: Unary): number {
    if ((label.kind == 'Unary_unary_zero')) {
        return 0

    }
    if ((label.kind == 'Unary_unary_succ')) {
        let n = label.n;
        return (n + 1)

    }
    throw new Error('Expected one of "Unary_unary_zero", "Unary_unary_succ" for type "Unary" while getting "label", but data does not satisfy any constructor');
}

// hm_edge#_ {l:#} {m:#} label:(Unary ~l) {7 = (~m) + l} = UnaryUserCheckOrder;

export function loadUnaryUserCheckOrder(slice: Slice): UnaryUserCheckOrder {
    let label: Unary = loadUnary(slice);
    let l = unaryUserCheckOrder_get_l(label);
    return {
        kind: 'UnaryUserCheckOrder',
        m: (7 - l),
        label: label,
        l: l,
    }

}

export function storeUnaryUserCheckOrder(unaryUserCheckOrder: UnaryUserCheckOrder): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeUnary(unaryUserCheckOrder.label)(builder);
    })

}

/*
a$_ {X:Type} info:int32
  init:(Maybe (Either X ^int22))
  other:(Either X ^(OneComb X))
  body:(Either X ^X) = CombArgCellRef X;
*/

export function loadCombArgCellRef<X>(slice: Slice, loadX: (slice: Slice) => X): CombArgCellRef<X> {
    let info: number = slice.loadInt(32);
    let init: Maybe<Either<X, number>> = loadMaybe<Either<X, number>>(slice, ((slice: Slice) => {
        return loadEither<X, number>(slice, loadX, ((slice: Slice) => {
            let slice1 = slice.loadRef().beginParse(true);
            return slice1.loadInt(22)

        }))

    }));
    let other: Either<X, OneComb<X>> = loadEither<X, OneComb<X>>(slice, loadX, ((slice: Slice) => {
        let slice1 = slice.loadRef().beginParse(true);
        return loadOneComb<X>(slice1, loadX)

    }));
    let body: Either<X, X> = loadEither<X, X>(slice, loadX, ((slice: Slice) => {
        let slice1 = slice.loadRef().beginParse(true);
        return loadX(slice1)

    }));
    return {
        kind: 'CombArgCellRef',
        info: info,
        init: init,
        other: other,
        body: body,
    }

}

export function storeCombArgCellRef<X>(combArgCellRef: CombArgCellRef<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeInt(combArgCellRef.info, 32);
        storeMaybe<Either<X, number>>(combArgCellRef.init, ((arg: Either<X, number>) => {
            return ((builder: Builder) => {
                storeEither<X, number>(arg, storeX, ((arg: number) => {
                    return ((builder: Builder) => {
                        let cell1 = beginCell();
                        cell1.storeInt(arg, 22);
                        builder.storeRef(cell1);

                    })

                }))(builder);
            })

        }))(builder);
        storeEither<X, OneComb<X>>(combArgCellRef.other, storeX, ((arg: OneComb<X>) => {
            return ((builder: Builder) => {
                let cell1 = beginCell();
                storeOneComb<X>(arg, storeX)(cell1);
                builder.storeRef(cell1);

            })

        }))(builder);
        storeEither<X, X>(combArgCellRef.body, storeX, ((arg: X) => {
            return ((builder: Builder) => {
                let cell1 = beginCell();
                storeX(arg)(cell1);
                builder.storeRef(cell1);

            })

        }))(builder);
    })

}

// a$_ x:(CombArgCellRef int12) = CombArgCellRefUser;

export function loadCombArgCellRefUser(slice: Slice): CombArgCellRefUser {
    let x: CombArgCellRef<number> = loadCombArgCellRef<number>(slice, ((slice: Slice) => {
        return slice.loadInt(12)

    }));
    return {
        kind: 'CombArgCellRefUser',
        x: x,
    }

}

export function storeCombArgCellRefUser(combArgCellRefUser: CombArgCellRefUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeCombArgCellRef<number>(combArgCellRefUser.x, ((arg: number) => {
            return ((builder: Builder) => {
                builder.storeInt(arg, 12);
            })

        }))(builder);
    })

}

// a$_ {n:#} ref:^(BitLenArg (n + 2)) = MathExprAsCombArg (n + 2);

export function loadMathExprAsCombArg(slice: Slice, arg0: number): MathExprAsCombArg {
    let slice1 = slice.loadRef().beginParse(true);
    let ref: BitLenArg = loadBitLenArg(slice1, ((arg0 - 2) + 2));
    return {
        kind: 'MathExprAsCombArg',
        n: (arg0 - 2),
        ref: ref,
    }

}

export function storeMathExprAsCombArg(mathExprAsCombArg: MathExprAsCombArg): (builder: Builder) => void {
    return ((builder: Builder) => {
        let cell1 = beginCell();
        storeBitLenArg(mathExprAsCombArg.ref)(cell1);
        builder.storeRef(cell1);
    })

}

// _ a:# = EmptyTag;

export function loadEmptyTag(slice: Slice): EmptyTag {
    let a: number = slice.loadUint(32);
    return {
        kind: 'EmptyTag',
        a: a,
    }

}

export function storeEmptyTag(emptyTag: EmptyTag): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(emptyTag.a, 32);
    })

}

// a#f4 x:# = SharpTag;

export function loadSharpTag(slice: Slice): SharpTag {
    if (((slice.remainingBits >= 8) && (slice.preloadUint(8) == 0xf4))) {
        slice.loadUint(8);
        let x: number = slice.loadUint(32);
        return {
            kind: 'SharpTag',
            x: x,
        }

    }
    throw new Error('Expected one of "SharpTag" in loading "SharpTag", but data does not satisfy any constructor');
}

export function storeSharpTag(sharpTag: SharpTag): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0xf4, 8);
        builder.storeUint(sharpTag.x, 32);
    })

}

// a$1011 x:# = DollarTag;

export function loadDollarTag(slice: Slice): DollarTag {
    if (((slice.remainingBits >= 4) && (slice.preloadUint(4) == 0b1011))) {
        slice.loadUint(4);
        let x: number = slice.loadUint(32);
        return {
            kind: 'DollarTag',
            x: x,
        }

    }
    throw new Error('Expected one of "DollarTag" in loading "DollarTag", but data does not satisfy any constructor');
}

export function storeDollarTag(dollarTag: DollarTag): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0b1011, 4);
        builder.storeUint(dollarTag.x, 32);
    })

}

// a$_ s:(3 * int5) = TupleCheck;

export function loadTupleCheck(slice: Slice): TupleCheck {
    let s: Array<number> = Array.from(Array(3).keys()).map(((arg: number) => {
        return slice.loadInt(5)

    }));
    return {
        kind: 'TupleCheck',
        s: s,
    }

}

export function storeTupleCheck(tupleCheck: TupleCheck): (builder: Builder) => void {
    return ((builder: Builder) => {
        tupleCheck.s.forEach(((arg: number) => {
            builder.storeInt(arg, 5);
        }));
    })

}

export function hashmap_get_l(label: HmLabel): number {
    if ((label.kind == 'HmLabel_hml_short')) {
        let n = label.n;
        return n

    }
    if ((label.kind == 'HmLabel_hml_long')) {
        let n = label.n;
        return n

    }
    if ((label.kind == 'HmLabel_hml_same')) {
        let n = label.n;
        return n

    }
    throw new Error('Expected one of "HmLabel_hml_short", "HmLabel_hml_long", "HmLabel_hml_same" for type "HmLabel" while getting "label", but data does not satisfy any constructor');
}

/*
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n) 
          {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;
*/

export function loadHashmap<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): Hashmap<X> {
    let label: HmLabel = loadHmLabel(slice, n);
    let l = hashmap_get_l(label);
    let node: HashmapNode<X> = loadHashmapNode<X>(slice, (n - l), loadX);
    return {
        kind: 'Hashmap',
        n: n,
        m: (n - l),
        label: label,
        l: l,
        node: node,
    }

}

export function storeHashmap<X>(hashmap: Hashmap<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeHmLabel(hashmap.label)(builder);
        storeHashmapNode<X>(hashmap.node, storeX)(builder);
    })

}

// hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;

/*
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X) 
           right:^(Hashmap n X) = HashmapNode (n + 1) X;
*/

export function loadHashmapNode<X>(slice: Slice, arg0: number, loadX: (slice: Slice) => X): HashmapNode<X> {
    if ((arg0 == 0)) {
        let value: X = loadX(slice);
        return {
            kind: 'HashmapNode_hmn_leaf',
            value: value,
        }

    }
    if (true) {
        let slice1 = slice.loadRef().beginParse(true);
        let left: Hashmap<X> = loadHashmap<X>(slice1, (arg0 - 1), loadX);
        let slice2 = slice.loadRef().beginParse(true);
        let right: Hashmap<X> = loadHashmap<X>(slice2, (arg0 - 1), loadX);
        return {
            kind: 'HashmapNode_hmn_fork',
            n: (arg0 - 1),
            left: left,
            right: right,
        }

    }
    throw new Error('Expected one of "HashmapNode_hmn_leaf", "HashmapNode_hmn_fork" in loading "HashmapNode", but data does not satisfy any constructor');
}

export function storeHashmapNode<X>(hashmapNode: HashmapNode<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
    if ((hashmapNode.kind == 'HashmapNode_hmn_leaf')) {
        return ((builder: Builder) => {
            storeX(hashmapNode.value)(builder);
        })

    }
    if ((hashmapNode.kind == 'HashmapNode_hmn_fork')) {
        return ((builder: Builder) => {
            let cell1 = beginCell();
            storeHashmap<X>(hashmapNode.left, storeX)(cell1);
            builder.storeRef(cell1);
            let cell2 = beginCell();
            storeHashmap<X>(hashmapNode.right, storeX)(cell2);
            builder.storeRef(cell2);
        })

    }
    throw new Error('Expected one of "HashmapNode_hmn_leaf", "HashmapNode_hmn_fork" in loading "HashmapNode", but data does not satisfy any constructor');
}

export function hmLabel_hml_short_get_n(len: Unary): number {
    if ((len.kind == 'Unary_unary_zero')) {
        return 0

    }
    if ((len.kind == 'Unary_unary_succ')) {
        let n = len.n;
        return (n + 1)

    }
    throw new Error('Expected one of "Unary_unary_zero", "Unary_unary_succ" for type "Unary" while getting "len", but data does not satisfy any constructor');
}

// hml_short$0 {m:#} {n:#} len:(Unary ~n) {n <= m} s:(n * Bit) = HmLabel ~n m;

// hml_long$10 {m:#} n:(#<= m) s:(n * Bit) = HmLabel ~n m;

// hml_same$11 {m:#} v:Bit n:(#<= m) = HmLabel ~n m;

export function loadHmLabel(slice: Slice, m: number): HmLabel {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        let len: Unary = loadUnary(slice);
        let n = hmLabel_hml_short_get_n(len);
        let s: Array<boolean> = Array.from(Array(n).keys()).map(((arg: number) => {
            return slice.loadBit()

        }));
        if ((!(n <= m))) {
            throw new Error('Condition (n <= m) is not satisfied while loading "HmLabel_hml_short" for type "HmLabel"');
        }
        return {
            kind: 'HmLabel_hml_short',
            m: m,
            len: len,
            n: n,
            s: s,
        }

    }
    if (((slice.remainingBits >= 2) && (slice.preloadUint(2) == 0b10))) {
        slice.loadUint(2);
        let n: number = slice.loadUint(bitLen(m));
        let s: Array<boolean> = Array.from(Array(n).keys()).map(((arg: number) => {
            return slice.loadBit()

        }));
        return {
            kind: 'HmLabel_hml_long',
            m: m,
            n: n,
            s: s,
        }

    }
    if (((slice.remainingBits >= 2) && (slice.preloadUint(2) == 0b11))) {
        slice.loadUint(2);
        let v: boolean = slice.loadBit();
        let n: number = slice.loadUint(bitLen(m));
        return {
            kind: 'HmLabel_hml_same',
            m: m,
            v: v,
            n: n,
        }

    }
    throw new Error('Expected one of "HmLabel_hml_short", "HmLabel_hml_long", "HmLabel_hml_same" in loading "HmLabel", but data does not satisfy any constructor');
}

export function storeHmLabel(hmLabel: HmLabel): (builder: Builder) => void {
    if ((hmLabel.kind == 'HmLabel_hml_short')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
            storeUnary(hmLabel.len)(builder);
            hmLabel.s.forEach(((arg: boolean) => {
                builder.storeBit(arg);
            }));
            if ((!(hmLabel.n <= hmLabel.m))) {
                throw new Error('Condition (hmLabel.n <= hmLabel.m) is not satisfied while loading "HmLabel_hml_short" for type "HmLabel"');
            }
        })

    }
    if ((hmLabel.kind == 'HmLabel_hml_long')) {
        return ((builder: Builder) => {
            builder.storeUint(0b10, 2);
            builder.storeUint(hmLabel.n, bitLen(hmLabel.m));
            hmLabel.s.forEach(((arg: boolean) => {
                builder.storeBit(arg);
            }));
        })

    }
    if ((hmLabel.kind == 'HmLabel_hml_same')) {
        return ((builder: Builder) => {
            builder.storeUint(0b11, 2);
            builder.storeBit(hmLabel.v);
            builder.storeUint(hmLabel.n, bitLen(hmLabel.m));
        })

    }
    throw new Error('Expected one of "HmLabel_hml_short", "HmLabel_hml_long", "HmLabel_hml_same" in loading "HmLabel", but data does not satisfy any constructor');
}

// a$_ x:(HashmapE 8 uint16) = HashmapEUser;

export function loadHashmapEUser(slice: Slice): HashmapEUser {
    let x: Dictionary<number, number> = Dictionary.load(Dictionary.Keys.Uint(8), {
        serialize: () => { throw new Error('Not implemented') },
        parse: ((slice: Slice) => {
        return slice.loadUint(16)

    }),
    }, slice);
    return {
        kind: 'HashmapEUser',
        x: x,
    }

}

export function storeHashmapEUser(hashmapEUser: HashmapEUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(hashmapEUser.x, Dictionary.Keys.Uint(8), {
            serialize: ((arg: number, builder: Builder) => {
            ((arg: number) => {
                return ((builder: Builder) => {
                    builder.storeUint(arg, 16);
                })

            })(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

// _ a:(## 1) b:a?(## 32) = ConditionalField;

export function loadConditionalField(slice: Slice): ConditionalField {
    let a: number = slice.loadUint(1);
    let b: number | undefined = (a ? slice.loadUint(32) : undefined);
    return {
        kind: 'ConditionalField',
        a: a,
        b: b,
    }

}

export function storeConditionalField(conditionalField: ConditionalField): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(conditionalField.a, 1);
        if ((conditionalField.b != undefined)) {
            builder.storeUint(conditionalField.b, 32);
        }
    })

}

// _ a:(## 6) b:(a . 2)?(## 32) = BitSelection;

export function loadBitSelection(slice: Slice): BitSelection {
    let a: number = slice.loadUint(6);
    let b: number | undefined = ((a & (1 << 2)) ? slice.loadUint(32) : undefined);
    return {
        kind: 'BitSelection',
        a: a,
        b: b,
    }

}

export function storeBitSelection(bitSelection: BitSelection): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(bitSelection.a, 6);
        if ((bitSelection.b != undefined)) {
            builder.storeUint(bitSelection.b, 32);
        }
    })

}

// _ flags:(## 10) { flags <= 100 } = ImplicitCondition;

export function loadImplicitCondition(slice: Slice): ImplicitCondition {
    let flags: number = slice.loadUint(10);
    if ((!(flags <= 100))) {
        throw new Error('Condition (flags <= 100) is not satisfied while loading "ImplicitCondition" for type "ImplicitCondition"');
    }
    return {
        kind: 'ImplicitCondition',
        flags: flags,
    }

}

export function storeImplicitCondition(implicitCondition: ImplicitCondition): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(implicitCondition.flags, 10);
        if ((!(implicitCondition.flags <= 100))) {
            throw new Error('Condition (implicitCondition.flags <= 100) is not satisfied while loading "ImplicitCondition" for type "ImplicitCondition"');
        }
    })

}

// _ a:# = MultipleEmptyConstructor 0;

// _ b:(## 5) = MultipleEmptyConstructor 1;

// a$_ x:(## 6) = MultipleEmptyConstructor 2;

export function loadMultipleEmptyConstructor(slice: Slice, arg0: number): MultipleEmptyConstructor {
    if ((arg0 == 0)) {
        let a: number = slice.loadUint(32);
        return {
            kind: 'MultipleEmptyConstructor__',
            a: a,
        }

    }
    if ((arg0 == 1)) {
        let b: number = slice.loadUint(5);
        return {
            kind: 'MultipleEmptyConstructor__1',
            b: b,
        }

    }
    if ((arg0 == 2)) {
        let x: number = slice.loadUint(6);
        return {
            kind: 'MultipleEmptyConstructor_a',
            x: x,
        }

    }
    throw new Error('Expected one of "MultipleEmptyConstructor__", "MultipleEmptyConstructor__1", "MultipleEmptyConstructor_a" in loading "MultipleEmptyConstructor", but data does not satisfy any constructor');
}

export function storeMultipleEmptyConstructor(multipleEmptyConstructor: MultipleEmptyConstructor): (builder: Builder) => void {
    if ((multipleEmptyConstructor.kind == 'MultipleEmptyConstructor__')) {
        return ((builder: Builder) => {
            builder.storeUint(multipleEmptyConstructor.a, 32);
        })

    }
    if ((multipleEmptyConstructor.kind == 'MultipleEmptyConstructor__1')) {
        return ((builder: Builder) => {
            builder.storeUint(multipleEmptyConstructor.b, 5);
        })

    }
    if ((multipleEmptyConstructor.kind == 'MultipleEmptyConstructor_a')) {
        return ((builder: Builder) => {
            builder.storeUint(multipleEmptyConstructor.x, 6);
        })

    }
    throw new Error('Expected one of "MultipleEmptyConstructor__", "MultipleEmptyConstructor__1", "MultipleEmptyConstructor_a" in loading "MultipleEmptyConstructor", but data does not satisfy any constructor');
}

// true$_ = True;

export function loadTrue(slice: Slice): True {
    return {
        kind: 'True',
    }

}

export function storeTrue(true0: True): (builder: Builder) => void {
    return ((builder: Builder) => {
    })

}

// a$0 {n:#} = ParamNamedArgInSecondConstr n;

// b$1 {n:#} = ParamNamedArgInSecondConstr (n + 1);

export function loadParamNamedArgInSecondConstr(slice: Slice, arg0: number): ParamNamedArgInSecondConstr {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        return {
            kind: 'ParamNamedArgInSecondConstr_a',
            n: arg0,
        }

    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        return {
            kind: 'ParamNamedArgInSecondConstr_b',
            n: (arg0 - 1),
        }

    }
    throw new Error('Expected one of "ParamNamedArgInSecondConstr_a", "ParamNamedArgInSecondConstr_b" in loading "ParamNamedArgInSecondConstr", but data does not satisfy any constructor');
}

export function storeParamNamedArgInSecondConstr(paramNamedArgInSecondConstr: ParamNamedArgInSecondConstr): (builder: Builder) => void {
    if ((paramNamedArgInSecondConstr.kind == 'ParamNamedArgInSecondConstr_a')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
        })

    }
    if ((paramNamedArgInSecondConstr.kind == 'ParamNamedArgInSecondConstr_b')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
        })

    }
    throw new Error('Expected one of "ParamNamedArgInSecondConstr_a", "ParamNamedArgInSecondConstr_b" in loading "ParamNamedArgInSecondConstr", but data does not satisfy any constructor');
}

// a$_ msg:^(Maybe Any) = RefCombinatorAny;

export function loadRefCombinatorAny(slice: Slice): RefCombinatorAny {
    let slice1 = slice.loadRef().beginParse(true);
    let msg: Maybe<Cell> = loadMaybe<Cell>(slice1, ((slice: Slice) => {
        return slice.asCell()

    }));
    return {
        kind: 'RefCombinatorAny',
        msg: msg,
    }

}

export function storeRefCombinatorAny(refCombinatorAny: RefCombinatorAny): (builder: Builder) => void {
    return ((builder: Builder) => {
        let cell1 = beginCell();
        storeMaybe<Cell>(refCombinatorAny.msg, ((arg: Cell) => {
            return ((builder: Builder) => {
                builder.storeSlice(arg.beginParse(true));
            })

        }))(cell1);
        builder.storeRef(cell1);
    })

}

// a$_ n:# { 5 + n = 7 } = EqualityExpression;

export function loadEqualityExpression(slice: Slice): EqualityExpression {
    let n: number = slice.loadUint(32);
    if ((!((5 + n) == 7))) {
        throw new Error('Condition ((5 + n) == 7) is not satisfied while loading "EqualityExpression" for type "EqualityExpression"');
    }
    return {
        kind: 'EqualityExpression',
        n: n,
    }

}

export function storeEqualityExpression(equalityExpression: EqualityExpression): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(equalityExpression.n, 32);
        if ((!((5 + equalityExpression.n) == 7))) {
            throw new Error('Condition ((5 + equalityExpression.n) == 7) is not satisfied while loading "EqualityExpression" for type "EqualityExpression"');
        }
    })

}

// a$_ x:(## 1) y:x?^Simple = ConditionalRef;

export function loadConditionalRef(slice: Slice): ConditionalRef {
    let x: number = slice.loadUint(1);
    let y: Simple | undefined = (x ? ((slice: Slice) => {
        let slice1 = slice.loadRef().beginParse(true);
        return loadSimple(slice1)

    })(slice) : undefined);
    return {
        kind: 'ConditionalRef',
        x: x,
        y: y,
    }

}

export function storeConditionalRef(conditionalRef: ConditionalRef): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(conditionalRef.x, 1);
        if ((conditionalRef.y != undefined)) {
            let cell1 = beginCell();
            storeSimple(conditionalRef.y)(cell1);
            builder.storeRef(cell1);

        }
    })

}

// block_info#9bc7a987 seq_no:# { prev_seq_no:# } { ~prev_seq_no + 1 = seq_no } = LoadFromNegationOutsideExpr;

export function loadLoadFromNegationOutsideExpr(slice: Slice): LoadFromNegationOutsideExpr {
    if (((slice.remainingBits >= 32) && (slice.preloadUint(32) == 0x9bc7a987))) {
        slice.loadUint(32);
        let seq_no: number = slice.loadUint(32);
        return {
            kind: 'LoadFromNegationOutsideExpr',
            prev_seq_no: (seq_no - 1),
            seq_no: seq_no,
        }

    }
    throw new Error('Expected one of "LoadFromNegationOutsideExpr" in loading "LoadFromNegationOutsideExpr", but data does not satisfy any constructor');
}

export function storeLoadFromNegationOutsideExpr(loadFromNegationOutsideExpr: LoadFromNegationOutsideExpr): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0x9bc7a987, 32);
        builder.storeUint(loadFromNegationOutsideExpr.seq_no, 32);
    })

}

// bit$_ (## 1) anon0:# = AnonymousData;

export function loadAnonymousData(slice: Slice): AnonymousData {
    let anon0: number = slice.loadUint(1);
    let anon0_0: number = slice.loadUint(32);
    return {
        kind: 'AnonymousData',
        anon0: anon0,
        anon0_0: anon0_0,
    }

}

export function storeAnonymousData(anonymousData: AnonymousData): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(anonymousData.anon0, 1);
        builder.storeUint(anonymousData.anon0_0, 32);
    })

}

// vm_stk_int#0201_ value:int257 = FalseAnonField;

export function loadFalseAnonField(slice: Slice): FalseAnonField {
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0x0201))) {
        slice.loadUint(16);
        let value: bigint = slice.loadIntBig(257);
        return {
            kind: 'FalseAnonField',
            value: value,
        }

    }
    throw new Error('Expected one of "FalseAnonField" in loading "FalseAnonField", but data does not satisfy any constructor');
}

export function storeFalseAnonField(falseAnonField: FalseAnonField): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0x0201, 16);
        builder.storeInt(falseAnonField.value, 257);
    })

}

// b$1 Simple = ConstructorOrder;

// a$0 a:Simple = ConstructorOrder;

export function loadConstructorOrder(slice: Slice): ConstructorOrder {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        let anon0: Simple = loadSimple(slice);
        return {
            kind: 'ConstructorOrder_b',
            anon0: anon0,
        }

    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        let a: Simple = loadSimple(slice);
        return {
            kind: 'ConstructorOrder_a',
            a: a,
        }

    }
    throw new Error('Expected one of "ConstructorOrder_b", "ConstructorOrder_a" in loading "ConstructorOrder", but data does not satisfy any constructor');
}

export function storeConstructorOrder(constructorOrder: ConstructorOrder): (builder: Builder) => void {
    if ((constructorOrder.kind == 'ConstructorOrder_b')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeSimple(constructorOrder.anon0)(builder);
        })

    }
    if ((constructorOrder.kind == 'ConstructorOrder_a')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
            storeSimple(constructorOrder.a)(builder);
        })

    }
    throw new Error('Expected one of "ConstructorOrder_b", "ConstructorOrder_a" in loading "ConstructorOrder", but data does not satisfy any constructor');
}

// a a:#  = CheckCrc32;

// b b:# c:# = CheckCrc32;

export function loadCheckCrc32(slice: Slice): CheckCrc32 {
    if (((slice.remainingBits >= 32) && (slice.preloadUint(32) == 0x9d97e7a))) {
        slice.loadUint(32);
        let a: number = slice.loadUint(32);
        return {
            kind: 'CheckCrc32_a',
            a: a,
        }

    }
    if (((slice.remainingBits >= 32) && (slice.preloadUint(32) == 0x2842b3f0))) {
        slice.loadUint(32);
        let b: number = slice.loadUint(32);
        let c: number = slice.loadUint(32);
        return {
            kind: 'CheckCrc32_b',
            b: b,
            c: c,
        }

    }
    throw new Error('Expected one of "CheckCrc32_a", "CheckCrc32_b" in loading "CheckCrc32", but data does not satisfy any constructor');
}

export function storeCheckCrc32(checkCrc32: CheckCrc32): (builder: Builder) => void {
    if ((checkCrc32.kind == 'CheckCrc32_a')) {
        return ((builder: Builder) => {
            builder.storeUint(0x9d97e7a, 32);
            builder.storeUint(checkCrc32.a, 32);
        })

    }
    if ((checkCrc32.kind == 'CheckCrc32_b')) {
        return ((builder: Builder) => {
            builder.storeUint(0x2842b3f0, 32);
            builder.storeUint(checkCrc32.b, 32);
            builder.storeUint(checkCrc32.c, 32);
        })

    }
    throw new Error('Expected one of "CheckCrc32_a", "CheckCrc32_b" in loading "CheckCrc32", but data does not satisfy any constructor');
}

// a$_ const:# = CheckKeyword;

export function loadCheckKeyword(slice: Slice): CheckKeyword {
    let const0: number = slice.loadUint(32);
    return {
        kind: 'CheckKeyword',
        const0: const0,
    }

}

export function storeCheckKeyword(checkKeyword: CheckKeyword): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(checkKeyword.const0, 32);
    })

}

// a$_ {X:Type} t:# y:(Maybe ^X) = RefCombinatorInRefHelper X;

export function loadRefCombinatorInRefHelper<X>(slice: Slice, loadX: (slice: Slice) => X): RefCombinatorInRefHelper<X> {
    let t: number = slice.loadUint(32);
    let y: Maybe<X> = loadMaybe<X>(slice, ((slice: Slice) => {
        let slice1 = slice.loadRef().beginParse(true);
        return loadX(slice1)

    }));
    return {
        kind: 'RefCombinatorInRefHelper',
        t: t,
        y: y,
    }

}

export function storeRefCombinatorInRefHelper<X>(refCombinatorInRefHelper: RefCombinatorInRefHelper<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(refCombinatorInRefHelper.t, 32);
        storeMaybe<X>(refCombinatorInRefHelper.y, ((arg: X) => {
            return ((builder: Builder) => {
                let cell1 = beginCell();
                storeX(arg)(cell1);
                builder.storeRef(cell1);

            })

        }))(builder);
    })

}

// a$_ msg:^(RefCombinatorInRefHelper Any) = RefCombinatorInRef;

export function loadRefCombinatorInRef(slice: Slice): RefCombinatorInRef {
    let slice1 = slice.loadRef().beginParse(true);
    let msg: RefCombinatorInRefHelper<Cell> = loadRefCombinatorInRefHelper<Cell>(slice1, ((slice: Slice) => {
        return slice.asCell()

    }));
    return {
        kind: 'RefCombinatorInRef',
        msg: msg,
    }

}

export function storeRefCombinatorInRef(refCombinatorInRef: RefCombinatorInRef): (builder: Builder) => void {
    return ((builder: Builder) => {
        let cell1 = beginCell();
        storeRefCombinatorInRefHelper<Cell>(refCombinatorInRef.msg, ((arg: Cell) => {
            return ((builder: Builder) => {
                builder.storeSlice(arg.beginParse(true));
            })

        }))(cell1);
        builder.storeRef(cell1);
    })

}

// _ a:Bool = BoolUser;

export function loadBoolUser(slice: Slice): BoolUser {
    let a: Bool = loadBool(slice);
    return {
        kind: 'BoolUser',
        a: a,
    }

}

export function storeBoolUser(boolUser: BoolUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeBool(boolUser.a)(builder);
    })

}

/*
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
*/

export function loadAnycast(slice: Slice): Anycast {
    let depth: number = slice.loadUint(bitLen(30));
    let rewrite_pfx: BitString = slice.loadBits(depth);
    if ((!(depth >= 1))) {
        throw new Error('Condition (depth >= 1) is not satisfied while loading "Anycast" for type "Anycast"');
    }
    return {
        kind: 'Anycast',
        depth: depth,
        rewrite_pfx: rewrite_pfx,
    }

}

export function storeAnycast(anycast: Anycast): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(anycast.depth, bitLen(30));
        builder.storeBits(anycast.rewrite_pfx);
        if ((!(anycast.depth >= 1))) {
            throw new Error('Condition (anycast.depth >= 1) is not satisfied while loading "Anycast" for type "Anycast"');
        }
    })

}

// _ src:MsgAddressInt = AddressUser;

export function loadAddressUser(slice: Slice): AddressUser {
    let src: Address = slice.loadAddress();
    return {
        kind: 'AddressUser',
        src: src,
    }

}

export function storeAddressUser(addressUser: AddressUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeAddress(addressUser.src);
    })

}

// _ src:MsgAddressExt = ExtAddressUser;

export function loadExtAddressUser(slice: Slice): ExtAddressUser {
    let src: ExternalAddress | null = slice.loadMaybeExternalAddress();
    return {
        kind: 'ExtAddressUser',
        src: src,
    }

}

export function storeExtAddressUser(extAddressUser: ExtAddressUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeAddress(extAddressUser.src);
    })

}

// _ src:MsgAddress = AnyAddressUser;

export function loadAnyAddressUser(slice: Slice): AnyAddressUser {
    let src: Address | ExternalAddress | null = slice.loadAddressAny();
    return {
        kind: 'AnyAddressUser',
        src: src,
    }

}

export function storeAnyAddressUser(anyAddressUser: AnyAddressUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeAddress(anyAddressUser.src);
    })

}

// _ inside:AddressUser = InsideAddressUser;

export function loadInsideAddressUser(slice: Slice): InsideAddressUser {
    let inside: AddressUser = loadAddressUser(slice);
    return {
        kind: 'InsideAddressUser',
        inside: inside,
    }

}

export function storeInsideAddressUser(insideAddressUser: InsideAddressUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeAddressUser(insideAddressUser.inside)(builder);
    })

}

// a$_ b:Bit = BitUser;

export function loadBitUser(slice: Slice): BitUser {
    let b: boolean = slice.loadBit();
    return {
        kind: 'BitUser',
        b: b,
    }

}

export function storeBitUser(bitUser: BitUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeBit(bitUser.b);
    })

}

// a$_ v:(VarUInteger 5) = VarUIntegerUser;

export function loadVarUIntegerUser(slice: Slice): VarUIntegerUser {
    let v: bigint = slice.loadVarUintBig(bitLen((5 - 1)));
    return {
        kind: 'VarUIntegerUser',
        v: v,
    }

}

export function storeVarUIntegerUser(varUIntegerUser: VarUIntegerUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeVarUint(varUIntegerUser.v, bitLen((5 - 1)));
    })

}

// a$_ v:(VarInteger 5) = VarIntegerUser;

export function loadVarIntegerUser(slice: Slice): VarIntegerUser {
    let v: bigint = slice.loadVarIntBig(5);
    return {
        kind: 'VarIntegerUser',
        v: v,
    }

}

export function storeVarIntegerUser(varIntegerUser: VarIntegerUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeVarInt(varIntegerUser.v, 5);
    })

}

// a$_ g:Grams = GramsUser;

export function loadGramsUser(slice: Slice): GramsUser {
    let g: bigint = slice.loadCoins();
    return {
        kind: 'GramsUser',
        g: g,
    }

}

export function storeGramsUser(gramsUser: GramsUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeCoins(gramsUser.g);
    })

}

// a$_ x:(HashmapE 100 VarUIntegerUser) = HashmapVUIUser;

export function loadHashmapVUIUser(slice: Slice): HashmapVUIUser {
    let x: Dictionary<bigint, VarUIntegerUser> = Dictionary.load(Dictionary.Keys.BigUint(100), {
        serialize: () => { throw new Error('Not implemented') },
        parse: loadVarUIntegerUser,
    }, slice);
    return {
        kind: 'HashmapVUIUser',
        x: x,
    }

}

export function storeHashmapVUIUser(hashmapVUIUser: HashmapVUIUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(hashmapVUIUser.x, Dictionary.Keys.BigUint(100), {
            serialize: ((arg: VarUIntegerUser, builder: Builder) => {
            storeVarUIntegerUser(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

// a$_ x:(HashmapE 100 ^TypedParam) = HashmapTPCell;

export function loadHashmapTPCell(slice: Slice): HashmapTPCell {
    let x: Dictionary<bigint, TypedParam> = Dictionary.load(Dictionary.Keys.BigUint(100), {
        serialize: () => { throw new Error('Not implemented') },
        parse: ((slice: Slice) => {
        let slice1 = slice.loadRef().beginParse(true);
        return loadTypedParam(slice1)

    }),
    }, slice);
    return {
        kind: 'HashmapTPCell',
        x: x,
    }

}

export function storeHashmapTPCell(hashmapTPCell: HashmapTPCell): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(hashmapTPCell.x, Dictionary.Keys.BigUint(100), {
            serialize: ((arg: TypedParam, builder: Builder) => {
            ((arg: TypedParam) => {
                return ((builder: Builder) => {
                    let cell1 = beginCell();
                    storeTypedParam(arg)(cell1);
                    builder.storeRef(cell1);

                })

            })(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

// a$_ {n:#} x:(HashmapE n uint5) = HashmapVarKey n;

export function loadHashmapVarKey(slice: Slice, n: number): HashmapVarKey {
    let x: Dictionary<bigint, number> = Dictionary.load(Dictionary.Keys.BigUint(n), {
        serialize: () => { throw new Error('Not implemented') },
        parse: ((slice: Slice) => {
        return slice.loadUint(5)

    }),
    }, slice);
    return {
        kind: 'HashmapVarKey',
        n: n,
        x: x,
    }

}

export function storeHashmapVarKey(hashmapVarKey: HashmapVarKey): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(hashmapVarKey.x, Dictionary.Keys.BigUint(hashmapVarKey.n), {
            serialize: ((arg: number, builder: Builder) => {
            ((arg: number) => {
                return ((builder: Builder) => {
                    builder.storeUint(arg, 5);
                })

            })(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

// a$_ x:(HashmapVarKey 5) = HashmapVarKeyUser;

export function loadHashmapVarKeyUser(slice: Slice): HashmapVarKeyUser {
    let x: HashmapVarKey = loadHashmapVarKey(slice, 5);
    return {
        kind: 'HashmapVarKeyUser',
        x: x,
    }

}

export function storeHashmapVarKeyUser(hashmapVarKeyUser: HashmapVarKeyUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeHashmapVarKey(hashmapVarKeyUser.x)(builder);
    })

}

// a$_ {n:#} x:(HashmapE (n+2) uint5) = HashmapExprKey n;

export function loadHashmapExprKey(slice: Slice, n: number): HashmapExprKey {
    let x: Dictionary<bigint, number> = Dictionary.load(Dictionary.Keys.BigUint((n + 2)), {
        serialize: () => { throw new Error('Not implemented') },
        parse: ((slice: Slice) => {
        return slice.loadUint(5)

    }),
    }, slice);
    return {
        kind: 'HashmapExprKey',
        n: n,
        x: x,
    }

}

export function storeHashmapExprKey(hashmapExprKey: HashmapExprKey): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(hashmapExprKey.x, Dictionary.Keys.BigUint((hashmapExprKey.n + 2)), {
            serialize: ((arg: number, builder: Builder) => {
            ((arg: number) => {
                return ((builder: Builder) => {
                    builder.storeUint(arg, 5);
                })

            })(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

// a$_ x:(HashmapExprKey 5) = HashmapExprKeyUser;

export function loadHashmapExprKeyUser(slice: Slice): HashmapExprKeyUser {
    let x: HashmapExprKey = loadHashmapExprKey(slice, 5);
    return {
        kind: 'HashmapExprKeyUser',
        x: x,
    }

}

export function storeHashmapExprKeyUser(hashmapExprKeyUser: HashmapExprKeyUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeHashmapExprKey(hashmapExprKeyUser.x)(builder);
    })

}

// a$_ {A: Type} x:(HashmapE 200 (OneComb A)) = HashmapOneComb A;

export function loadHashmapOneComb<A>(slice: Slice, loadA: (slice: Slice) => A): HashmapOneComb<A> {
    let x: Dictionary<bigint, OneComb<A>> = Dictionary.load(Dictionary.Keys.BigUint(200), {
        serialize: () => { throw new Error('Not implemented') },
        parse: ((slice: Slice) => {
        return loadOneComb<A>(slice, loadA)

    }),
    }, slice);
    return {
        kind: 'HashmapOneComb',
        x: x,
    }

}

export function storeHashmapOneComb<A>(hashmapOneComb: HashmapOneComb<A>, storeA: (a: A) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(hashmapOneComb.x, Dictionary.Keys.BigUint(200), {
            serialize: ((arg: OneComb<A>, builder: Builder) => {
            ((arg: OneComb<A>) => {
                return ((builder: Builder) => {
                    storeOneComb<A>(arg, storeA)(builder);
                })

            })(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

// a$_ x:(HashmapOneComb uint5) = HashmapOneCombUser;

export function loadHashmapOneCombUser(slice: Slice): HashmapOneCombUser {
    let x: HashmapOneComb<number> = loadHashmapOneComb<number>(slice, ((slice: Slice) => {
        return slice.loadUint(5)

    }));
    return {
        kind: 'HashmapOneCombUser',
        x: x,
    }

}

export function storeHashmapOneCombUser(hashmapOneCombUser: HashmapOneCombUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeHashmapOneComb<number>(hashmapOneCombUser.x, ((arg: number) => {
            return ((builder: Builder) => {
                builder.storeUint(arg, 5);
            })

        }))(builder);
    })

}

export function hashmapAug_get_l(label: HmLabel): number {
    if ((label.kind == 'HmLabel_hml_short')) {
        let n = label.n;
        return n

    }
    if ((label.kind == 'HmLabel_hml_long')) {
        let n = label.n;
        return n

    }
    if ((label.kind == 'HmLabel_hml_same')) {
        let n = label.n;
        return n

    }
    throw new Error('Expected one of "HmLabel_hml_short", "HmLabel_hml_long", "HmLabel_hml_same" for type "HmLabel" while getting "label", but data does not satisfy any constructor');
}

/*
ahm_edge#_ {n:#} {X:Type} {Y:Type} {l:#} {m:#} 
  label:(HmLabel ~l n) {n = (~m) + l} 
  node:(HashmapAugNode m X Y) = HashmapAug n X Y;
*/

export function loadHashmapAug<X, Y>(slice: Slice, n: number, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): HashmapAug<X, Y> {
    let label: HmLabel = loadHmLabel(slice, n);
    let l = hashmapAug_get_l(label);
    let node: HashmapAugNode<X, Y> = loadHashmapAugNode<X, Y>(slice, (n - l), loadX, loadY);
    return {
        kind: 'HashmapAug',
        n: n,
        m: (n - l),
        label: label,
        l: l,
        node: node,
    }

}

export function storeHashmapAug<X, Y>(hashmapAug: HashmapAug<X, Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeHmLabel(hashmapAug.label)(builder);
        storeHashmapAugNode<X, Y>(hashmapAug.node, storeX, storeY)(builder);
    })

}

// ahmn_leaf#_ {X:Type} {Y:Type} extra:Y value:X = HashmapAugNode 0 X Y;

/*
ahmn_fork#_ {n:#} {X:Type} {Y:Type} left:^(HashmapAug n X Y)
  right:^(HashmapAug n X Y) extra:Y = HashmapAugNode (n + 1) X Y;
*/

export function loadHashmapAugNode<X, Y>(slice: Slice, arg0: number, loadX: (slice: Slice) => X, loadY: (slice: Slice) => Y): HashmapAugNode<X, Y> {
    if ((arg0 == 0)) {
        let extra: Y = loadY(slice);
        let value: X = loadX(slice);
        return {
            kind: 'HashmapAugNode_ahmn_leaf',
            extra: extra,
            value: value,
        }

    }
    if (true) {
        let slice1 = slice.loadRef().beginParse(true);
        let left: HashmapAug<X, Y> = loadHashmapAug<X, Y>(slice1, (arg0 - 1), loadX, loadY);
        let slice2 = slice.loadRef().beginParse(true);
        let right: HashmapAug<X, Y> = loadHashmapAug<X, Y>(slice2, (arg0 - 1), loadX, loadY);
        let extra: Y = loadY(slice);
        return {
            kind: 'HashmapAugNode_ahmn_fork',
            n: (arg0 - 1),
            left: left,
            right: right,
            extra: extra,
        }

    }
    throw new Error('Expected one of "HashmapAugNode_ahmn_leaf", "HashmapAugNode_ahmn_fork" in loading "HashmapAugNode", but data does not satisfy any constructor');
}

export function storeHashmapAugNode<X, Y>(hashmapAugNode: HashmapAugNode<X, Y>, storeX: (x: X) => (builder: Builder) => void, storeY: (y: Y) => (builder: Builder) => void): (builder: Builder) => void {
    if ((hashmapAugNode.kind == 'HashmapAugNode_ahmn_leaf')) {
        return ((builder: Builder) => {
            storeY(hashmapAugNode.extra)(builder);
            storeX(hashmapAugNode.value)(builder);
        })

    }
    if ((hashmapAugNode.kind == 'HashmapAugNode_ahmn_fork')) {
        return ((builder: Builder) => {
            let cell1 = beginCell();
            storeHashmapAug<X, Y>(hashmapAugNode.left, storeX, storeY)(cell1);
            builder.storeRef(cell1);
            let cell2 = beginCell();
            storeHashmapAug<X, Y>(hashmapAugNode.right, storeX, storeY)(cell2);
            builder.storeRef(cell2);
            storeY(hashmapAugNode.extra)(builder);
        })

    }
    throw new Error('Expected one of "HashmapAugNode_ahmn_leaf", "HashmapAugNode_ahmn_fork" in loading "HashmapAugNode", but data does not satisfy any constructor');
}

// a$_ x:(HashmapAugE 16 Grams FixedIntParam) = HashmapAugEUser;

export function loadHashmapAugEUser(slice: Slice): HashmapAugEUser {
    let x: Dictionary<number, {value: bigint, extra: FixedIntParam}> = Dictionary.load(Dictionary.Keys.Uint(16), {
        serialize: () => { throw new Error('Not implemented') },
        parse: ((slice: Slice) => {
        return {
            extra: loadFixedIntParam(slice),
            value: slice.loadCoins(),
        }

    }),
    }, slice);
    return {
        kind: 'HashmapAugEUser',
        x: x,
    }

}

export function storeHashmapAugEUser(hashmapAugEUser: HashmapAugEUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(hashmapAugEUser.x, Dictionary.Keys.Uint(16), {
            serialize: ((arg: {value: bigint, extra: FixedIntParam}, builder: Builder) => {
            ((arg: FixedIntParam) => {
                return ((builder: Builder) => {
                    storeFixedIntParam(arg)(builder);
                })

            })(arg.extra)(builder);
            ((arg: bigint) => {
                return ((builder: Builder) => {
                    builder.storeCoins(arg);
                })

            })(arg.value)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

// message$_ {X:Type} body:(Either X ^X) = Message X;

export function loadMessage<X>(slice: Slice, loadX: (slice: Slice) => X): Message<X> {
    let body: Either<X, X> = loadEither<X, X>(slice, loadX, ((slice: Slice) => {
        let slice1 = slice.loadRef().beginParse(true);
        return loadX(slice1)

    }));
    return {
        kind: 'Message',
        body: body,
    }

}

export function storeMessage<X>(message: Message<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeEither<X, X>(message.body, storeX, ((arg: X) => {
            return ((builder: Builder) => {
                let cell1 = beginCell();
                storeX(arg)(cell1);
                builder.storeRef(cell1);

            })

        }))(builder);
    })

}

// _ (Message Any) = MessageAny;

export function loadMessageAny(slice: Slice): MessageAny {
    let anon0: Message<Cell> = loadMessage<Cell>(slice, ((slice: Slice) => {
        return slice.asCell()

    }));
    return {
        kind: 'MessageAny',
        anon0: anon0,
    }

}

export function storeMessageAny(messageAny: MessageAny): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeMessage<Cell>(messageAny.anon0, ((arg: Cell) => {
            return ((builder: Builder) => {
                builder.storeSlice(arg.beginParse(true));
            })

        }))(builder);
    })

}

// _ x:^FixedIntParam = ShardState;

export function loadShardState(slice: Slice): ShardState {
    let slice1 = slice.loadRef().beginParse(true);
    let x: FixedIntParam = loadFixedIntParam(slice1);
    return {
        kind: 'ShardState',
        x: x,
    }

}

export function storeShardState(shardState: ShardState): (builder: Builder) => void {
    return ((builder: Builder) => {
        let cell1 = beginCell();
        storeFixedIntParam(shardState.x)(cell1);
        builder.storeRef(cell1);
    })

}

// a$_ {X:Type} a:^X = InsideCell X;

export function loadInsideCell<X>(slice: Slice, loadX: (slice: Slice) => X): InsideCell<X> {
    let slice1 = slice.loadRef().beginParse(true);
    let a: X = loadX(slice1);
    return {
        kind: 'InsideCell',
        a: a,
    }

}

export function storeInsideCell<X>(insideCell: InsideCell<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
    return ((builder: Builder) => {
        let cell1 = beginCell();
        storeX(insideCell.a)(cell1);
        builder.storeRef(cell1);
    })

}

// a$_ inside_cell:^(InsideCell ShardState) = InsideCellUser;

export function loadInsideCellUser(slice: Slice): InsideCellUser {
    let slice1 = slice.loadRef().beginParse(true);
    let inside_cell: InsideCell<ShardState> = loadInsideCell<ShardState>(slice1, loadShardState);
    return {
        kind: 'InsideCellUser',
        inside_cell: inside_cell,
    }

}

export function storeInsideCellUser(insideCellUser: InsideCellUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        let cell1 = beginCell();
        storeInsideCell<ShardState>(insideCellUser.inside_cell, storeShardState)(cell1);
        builder.storeRef(cell1);
    })

}

// vm_stk_null#00 = VmStackValue;

// vm_stk_tinyint#01 value:int64 = VmStackValue;

// vm_stk_int#0201_ value:int257 = VmStackValue;

// vm_stk_nan#02ff = VmStackValue;

// vm_stk_cell#03 cell:^Cell = VmStackValue;

// vm_stk_slice#04 _:VmCellSlice = VmStackValue;

// vm_stk_builder#05 cell:^Cell = VmStackValue;

// vm_stk_cont#06 cont:VmCont = VmStackValue;

// vm_stk_tuple#07 len:(## 16) data:(VmTuple len) = VmStackValue;

export function loadVmStackValue(slice: Slice): VmStackValue {
    if (((slice.remainingBits >= 8) && (slice.preloadUint(8) == 0x00))) {
        slice.loadUint(8);
        return {
            kind: 'VmStackValue_vm_stk_null',
        }

    }
    if (((slice.remainingBits >= 8) && (slice.preloadUint(8) == 0x01))) {
        slice.loadUint(8);
        let value: bigint = slice.loadIntBig(64);
        return {
            kind: 'VmStackValue_vm_stk_tinyint',
            value: value,
        }

    }
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0x0201))) {
        slice.loadUint(16);
        let value: bigint = slice.loadIntBig(257);
        return {
            kind: 'VmStackValue_vm_stk_int',
            value: value,
        }

    }
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0x02ff))) {
        slice.loadUint(16);
        return {
            kind: 'VmStackValue_vm_stk_nan',
        }

    }
    if (((slice.remainingBits >= 8) && (slice.preloadUint(8) == 0x03))) {
        slice.loadUint(8);
        let slice1 = slice.loadRef().beginParse(true);
        let _cell: Cell = slice1.asCell();
        return {
            kind: 'VmStackValue_vm_stk_cell',
            _cell: _cell,
        }

    }
    if (((slice.remainingBits >= 8) && (slice.preloadUint(8) == 0x04))) {
        slice.loadUint(8);
        let _: VmCellSlice = loadVmCellSlice(slice);
        return {
            kind: 'VmStackValue_vm_stk_slice',
            _: _,
        }

    }
    if (((slice.remainingBits >= 8) && (slice.preloadUint(8) == 0x05))) {
        slice.loadUint(8);
        let slice1 = slice.loadRef().beginParse(true);
        let _cell: Cell = slice1.asCell();
        return {
            kind: 'VmStackValue_vm_stk_builder',
            _cell: _cell,
        }

    }
    if (((slice.remainingBits >= 8) && (slice.preloadUint(8) == 0x06))) {
        slice.loadUint(8);
        let cont: VmCont = loadVmCont(slice);
        return {
            kind: 'VmStackValue_vm_stk_cont',
            cont: cont,
        }

    }
    if (((slice.remainingBits >= 8) && (slice.preloadUint(8) == 0x07))) {
        slice.loadUint(8);
        let len: number = slice.loadUint(16);
        let data: VmTuple = loadVmTuple(slice, len);
        return {
            kind: 'VmStackValue_vm_stk_tuple',
            len: len,
            data: data,
        }

    }
    throw new Error('Expected one of "VmStackValue_vm_stk_null", "VmStackValue_vm_stk_tinyint", "VmStackValue_vm_stk_int", "VmStackValue_vm_stk_nan", "VmStackValue_vm_stk_cell", "VmStackValue_vm_stk_slice", "VmStackValue_vm_stk_builder", "VmStackValue_vm_stk_cont", "VmStackValue_vm_stk_tuple" in loading "VmStackValue", but data does not satisfy any constructor');
}

export function storeVmStackValue(vmStackValue: VmStackValue): (builder: Builder) => void {
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_null')) {
        return ((builder: Builder) => {
            builder.storeUint(0x00, 8);
        })

    }
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_tinyint')) {
        return ((builder: Builder) => {
            builder.storeUint(0x01, 8);
            builder.storeInt(vmStackValue.value, 64);
        })

    }
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_int')) {
        return ((builder: Builder) => {
            builder.storeUint(0x0201, 16);
            builder.storeInt(vmStackValue.value, 257);
        })

    }
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_nan')) {
        return ((builder: Builder) => {
            builder.storeUint(0x02ff, 16);
        })

    }
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_cell')) {
        return ((builder: Builder) => {
            builder.storeUint(0x03, 8);
            let cell1 = beginCell();
            cell1.storeSlice(vmStackValue._cell.beginParse(true));
            builder.storeRef(cell1);
        })

    }
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_slice')) {
        return ((builder: Builder) => {
            builder.storeUint(0x04, 8);
            storeVmCellSlice(vmStackValue._)(builder);
        })

    }
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_builder')) {
        return ((builder: Builder) => {
            builder.storeUint(0x05, 8);
            let cell1 = beginCell();
            cell1.storeSlice(vmStackValue._cell.beginParse(true));
            builder.storeRef(cell1);
        })

    }
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_cont')) {
        return ((builder: Builder) => {
            builder.storeUint(0x06, 8);
            storeVmCont(vmStackValue.cont)(builder);
        })

    }
    if ((vmStackValue.kind == 'VmStackValue_vm_stk_tuple')) {
        return ((builder: Builder) => {
            builder.storeUint(0x07, 8);
            builder.storeUint(vmStackValue.len, 16);
            storeVmTuple(vmStackValue.data)(builder);
        })

    }
    throw new Error('Expected one of "VmStackValue_vm_stk_null", "VmStackValue_vm_stk_tinyint", "VmStackValue_vm_stk_int", "VmStackValue_vm_stk_nan", "VmStackValue_vm_stk_cell", "VmStackValue_vm_stk_slice", "VmStackValue_vm_stk_builder", "VmStackValue_vm_stk_cont", "VmStackValue_vm_stk_tuple" in loading "VmStackValue", but data does not satisfy any constructor');
}

/*
_ cell:^Cell st_bits:(## 10) end_bits:(## 10) { st_bits <= end_bits }
  st_ref:(#<= 4) end_ref:(#<= 4) { st_ref <= end_ref } = VmCellSlice;
*/

export function loadVmCellSlice(slice: Slice): VmCellSlice {
    let slice1 = slice.loadRef().beginParse(true);
    let _cell: Cell = slice1.asCell();
    let st_bits: number = slice.loadUint(10);
    let end_bits: number = slice.loadUint(10);
    let st_ref: number = slice.loadUint(bitLen(4));
    let end_ref: number = slice.loadUint(bitLen(4));
    if ((!(st_bits <= end_bits))) {
        throw new Error('Condition (st_bits <= end_bits) is not satisfied while loading "VmCellSlice" for type "VmCellSlice"');
    }
    if ((!(st_ref <= end_ref))) {
        throw new Error('Condition (st_ref <= end_ref) is not satisfied while loading "VmCellSlice" for type "VmCellSlice"');
    }
    return {
        kind: 'VmCellSlice',
        _cell: _cell,
        st_bits: st_bits,
        end_bits: end_bits,
        st_ref: st_ref,
        end_ref: end_ref,
    }

}

export function storeVmCellSlice(vmCellSlice: VmCellSlice): (builder: Builder) => void {
    return ((builder: Builder) => {
        let cell1 = beginCell();
        cell1.storeSlice(vmCellSlice._cell.beginParse(true));
        builder.storeRef(cell1);
        builder.storeUint(vmCellSlice.st_bits, 10);
        builder.storeUint(vmCellSlice.end_bits, 10);
        builder.storeUint(vmCellSlice.st_ref, bitLen(4));
        builder.storeUint(vmCellSlice.end_ref, bitLen(4));
        if ((!(vmCellSlice.st_bits <= vmCellSlice.end_bits))) {
            throw new Error('Condition (vmCellSlice.st_bits <= vmCellSlice.end_bits) is not satisfied while loading "VmCellSlice" for type "VmCellSlice"');
        }
        if ((!(vmCellSlice.st_ref <= vmCellSlice.end_ref))) {
            throw new Error('Condition (vmCellSlice.st_ref <= vmCellSlice.end_ref) is not satisfied while loading "VmCellSlice" for type "VmCellSlice"');
        }
    })

}

// vm_tupref_nil$_ = VmTupleRef 0;

// vm_tupref_single$_ entry:^VmStackValue = VmTupleRef 1;

// vm_tupref_any$_ {n:#} ref:^(VmTuple (n + 2)) = VmTupleRef (n + 2);

export function loadVmTupleRef(slice: Slice, arg0: number): VmTupleRef {
    if ((arg0 == 0)) {
        return {
            kind: 'VmTupleRef_vm_tupref_nil',
        }

    }
    if ((arg0 == 1)) {
        let slice1 = slice.loadRef().beginParse(true);
        let entry: VmStackValue = loadVmStackValue(slice1);
        return {
            kind: 'VmTupleRef_vm_tupref_single',
            entry: entry,
        }

    }
    if (true) {
        let slice1 = slice.loadRef().beginParse(true);
        let ref: VmTuple = loadVmTuple(slice1, ((arg0 - 2) + 2));
        return {
            kind: 'VmTupleRef_vm_tupref_any',
            n: (arg0 - 2),
            ref: ref,
        }

    }
    throw new Error('Expected one of "VmTupleRef_vm_tupref_nil", "VmTupleRef_vm_tupref_single", "VmTupleRef_vm_tupref_any" in loading "VmTupleRef", but data does not satisfy any constructor');
}

export function storeVmTupleRef(vmTupleRef: VmTupleRef): (builder: Builder) => void {
    if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_nil')) {
        return ((builder: Builder) => {
        })

    }
    if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_single')) {
        return ((builder: Builder) => {
            let cell1 = beginCell();
            storeVmStackValue(vmTupleRef.entry)(cell1);
            builder.storeRef(cell1);
        })

    }
    if ((vmTupleRef.kind == 'VmTupleRef_vm_tupref_any')) {
        return ((builder: Builder) => {
            let cell1 = beginCell();
            storeVmTuple(vmTupleRef.ref)(cell1);
            builder.storeRef(cell1);
        })

    }
    throw new Error('Expected one of "VmTupleRef_vm_tupref_nil", "VmTupleRef_vm_tupref_single", "VmTupleRef_vm_tupref_any" in loading "VmTupleRef", but data does not satisfy any constructor');
}

// vm_tuple_nil$_ = VmTuple 0;

// vm_tuple_tcons$_ {n:#} head:(VmTupleRef n) tail:^VmStackValue = VmTuple (n + 1);

export function loadVmTuple(slice: Slice, arg0: number): VmTuple {
    if ((arg0 == 0)) {
        return {
            kind: 'VmTuple_vm_tuple_nil',
        }

    }
    if (true) {
        let head: VmTupleRef = loadVmTupleRef(slice, (arg0 - 1));
        let slice1 = slice.loadRef().beginParse(true);
        let tail: VmStackValue = loadVmStackValue(slice1);
        return {
            kind: 'VmTuple_vm_tuple_tcons',
            n: (arg0 - 1),
            head: head,
            tail: tail,
        }

    }
    throw new Error('Expected one of "VmTuple_vm_tuple_nil", "VmTuple_vm_tuple_tcons" in loading "VmTuple", but data does not satisfy any constructor');
}

export function storeVmTuple(vmTuple: VmTuple): (builder: Builder) => void {
    if ((vmTuple.kind == 'VmTuple_vm_tuple_nil')) {
        return ((builder: Builder) => {
        })

    }
    if ((vmTuple.kind == 'VmTuple_vm_tuple_tcons')) {
        return ((builder: Builder) => {
            storeVmTupleRef(vmTuple.head)(builder);
            let cell1 = beginCell();
            storeVmStackValue(vmTuple.tail)(cell1);
            builder.storeRef(cell1);
        })

    }
    throw new Error('Expected one of "VmTuple_vm_tuple_nil", "VmTuple_vm_tuple_tcons" in loading "VmTuple", but data does not satisfy any constructor');
}

// vm_stack#_ depth:(## 24) stack:(VmStackList depth) = VmStack;

export function loadVmStack(slice: Slice): VmStack {
    let depth: number = slice.loadUint(24);
    let stack: VmStackList = loadVmStackList(slice, depth);
    return {
        kind: 'VmStack',
        depth: depth,
        stack: stack,
    }

}

export function storeVmStack(vmStack: VmStack): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(vmStack.depth, 24);
        storeVmStackList(vmStack.stack)(builder);
    })

}

// vm_stk_nil#_ = VmStackList 0;

// vm_stk_cons#_ {n:#} rest:^(VmStackList n) tos:VmStackValue = VmStackList (n + 1);

export function loadVmStackList(slice: Slice, arg0: number): VmStackList {
    if ((arg0 == 0)) {
        return {
            kind: 'VmStackList_vm_stk_nil',
        }

    }
    if (true) {
        let slice1 = slice.loadRef().beginParse(true);
        let rest: VmStackList = loadVmStackList(slice1, (arg0 - 1));
        let tos: VmStackValue = loadVmStackValue(slice);
        return {
            kind: 'VmStackList_vm_stk_cons',
            n: (arg0 - 1),
            rest: rest,
            tos: tos,
        }

    }
    throw new Error('Expected one of "VmStackList_vm_stk_nil", "VmStackList_vm_stk_cons" in loading "VmStackList", but data does not satisfy any constructor');
}

export function storeVmStackList(vmStackList: VmStackList): (builder: Builder) => void {
    if ((vmStackList.kind == 'VmStackList_vm_stk_nil')) {
        return ((builder: Builder) => {
        })

    }
    if ((vmStackList.kind == 'VmStackList_vm_stk_cons')) {
        return ((builder: Builder) => {
            let cell1 = beginCell();
            storeVmStackList(vmStackList.rest)(cell1);
            builder.storeRef(cell1);
            storeVmStackValue(vmStackList.tos)(builder);
        })

    }
    throw new Error('Expected one of "VmStackList_vm_stk_nil", "VmStackList_vm_stk_cons" in loading "VmStackList", but data does not satisfy any constructor');
}

// _ cregs:(HashmapE 4 VmStackValue) = VmSaveList;

export function loadVmSaveList(slice: Slice): VmSaveList {
    let cregs: Dictionary<number, VmStackValue> = Dictionary.load(Dictionary.Keys.Uint(4), {
        serialize: () => { throw new Error('Not implemented') },
        parse: loadVmStackValue,
    }, slice);
    return {
        kind: 'VmSaveList',
        cregs: cregs,
    }

}

export function storeVmSaveList(vmSaveList: VmSaveList): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(vmSaveList.cregs, Dictionary.Keys.Uint(4), {
            serialize: ((arg: VmStackValue, builder: Builder) => {
            storeVmStackValue(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

/*
gas_limits#_ remaining:int64 _:^[ max_limit:int64 cur_limit:int64 credit:int64 ]
  = VmGasLimits;
*/

export function loadVmGasLimits(slice: Slice): VmGasLimits {
    let remaining: bigint = slice.loadIntBig(64);
    let slice1 = slice.loadRef().beginParse(true);
    let max_limit: bigint = slice1.loadIntBig(64);
    let cur_limit: bigint = slice1.loadIntBig(64);
    let credit: bigint = slice1.loadIntBig(64);
    return {
        kind: 'VmGasLimits',
        remaining: remaining,
        max_limit: max_limit,
        cur_limit: cur_limit,
        credit: credit,
    }

}

export function storeVmGasLimits(vmGasLimits: VmGasLimits): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeInt(vmGasLimits.remaining, 64);
        let cell1 = beginCell();
        cell1.storeInt(vmGasLimits.max_limit, 64);
        cell1.storeInt(vmGasLimits.cur_limit, 64);
        cell1.storeInt(vmGasLimits.credit, 64);
        builder.storeRef(cell1);
    })

}

// _ libraries:(HashmapE 256 ^Cell) = VmLibraries;

export function loadVmLibraries(slice: Slice): VmLibraries {
    let libraries: Dictionary<bigint, Cell> = Dictionary.load(Dictionary.Keys.BigUint(256), {
        serialize: () => { throw new Error('Not implemented') },
        parse: ((slice: Slice) => {
        let slice1 = slice.loadRef().beginParse(true);
        return slice1.asCell()

    }),
    }, slice);
    return {
        kind: 'VmLibraries',
        libraries: libraries,
    }

}

export function storeVmLibraries(vmLibraries: VmLibraries): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(vmLibraries.libraries, Dictionary.Keys.BigUint(256), {
            serialize: ((arg: Cell, builder: Builder) => {
            ((arg: Cell) => {
                return ((builder: Builder) => {
                    let cell1 = beginCell();
                    cell1.storeSlice(arg.beginParse(true));
                    builder.storeRef(cell1);

                })

            })(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })

}

/*
vm_ctl_data$_ nargs:(Maybe uint13) stack:(Maybe VmStack) save:VmSaveList
cp:(Maybe int16) = VmControlData;
*/

export function loadVmControlData(slice: Slice): VmControlData {
    let nargs: Maybe<number> = loadMaybe<number>(slice, ((slice: Slice) => {
        return slice.loadUint(13)

    }));
    let stack: Maybe<TupleItem[]> = loadMaybe<TupleItem[]>(slice, ((slice: Slice) => {
        return parseTuple(slice.asCell())

    }));
    let save: VmSaveList = loadVmSaveList(slice);
    let cp: Maybe<number> = loadMaybe<number>(slice, ((slice: Slice) => {
        return slice.loadInt(16)

    }));
    return {
        kind: 'VmControlData',
        nargs: nargs,
        stack: stack,
        save: save,
        cp: cp,
    }

}

export function storeVmControlData(vmControlData: VmControlData): (builder: Builder) => void {
    return ((builder: Builder) => {
        storeMaybe<number>(vmControlData.nargs, ((arg: number) => {
            return ((builder: Builder) => {
                builder.storeUint(arg, 13);
            })

        }))(builder);
        storeMaybe<TupleItem[]>(vmControlData.stack, ((arg: TupleItem[]) => {
            return ((builder: Builder) => {
                copyCellToBuilder(serializeTuple(arg), builder);
            })

        }))(builder);
        storeVmSaveList(vmControlData.save)(builder);
        storeMaybe<number>(vmControlData.cp, ((arg: number) => {
            return ((builder: Builder) => {
                builder.storeInt(arg, 16);
            })

        }))(builder);
    })

}

// vmc_std$00 cdata:VmControlData code:VmCellSlice = VmCont;

// vmc_envelope$01 cdata:VmControlData next:^VmCont = VmCont;

// vmc_quit$1000 exit_code:int32 = VmCont;

// vmc_quit_exc$1001 = VmCont;

// vmc_repeat$10100 count:uint63 body:^VmCont after:^VmCont = VmCont;

// vmc_until$110000 body:^VmCont after:^VmCont = VmCont;

// vmc_again$110001 body:^VmCont = VmCont;

/*
vmc_while_cond$110010 cond:^VmCont body:^VmCont
after:^VmCont = VmCont;
*/

/*
vmc_while_body$110011 cond:^VmCont body:^VmCont
after:^VmCont = VmCont;
*/

// vmc_pushint$1111 value:int32 next:^VmCont = VmCont;

export function loadVmCont(slice: Slice): VmCont {
    if (((slice.remainingBits >= 2) && (slice.preloadUint(2) == 0b00))) {
        slice.loadUint(2);
        let cdata: VmControlData = loadVmControlData(slice);
        let code: VmCellSlice = loadVmCellSlice(slice);
        return {
            kind: 'VmCont_vmc_std',
            cdata: cdata,
            code: code,
        }

    }
    if (((slice.remainingBits >= 2) && (slice.preloadUint(2) == 0b01))) {
        slice.loadUint(2);
        let cdata: VmControlData = loadVmControlData(slice);
        let slice1 = slice.loadRef().beginParse(true);
        let next: VmCont = loadVmCont(slice1);
        return {
            kind: 'VmCont_vmc_envelope',
            cdata: cdata,
            next: next,
        }

    }
    if (((slice.remainingBits >= 4) && (slice.preloadUint(4) == 0b1000))) {
        slice.loadUint(4);
        let exit_code: number = slice.loadInt(32);
        return {
            kind: 'VmCont_vmc_quit',
            exit_code: exit_code,
        }

    }
    if (((slice.remainingBits >= 4) && (slice.preloadUint(4) == 0b1001))) {
        slice.loadUint(4);
        return {
            kind: 'VmCont_vmc_quit_exc',
        }

    }
    if (((slice.remainingBits >= 5) && (slice.preloadUint(5) == 0b10100))) {
        slice.loadUint(5);
        let count: bigint = slice.loadUintBig(63);
        let slice1 = slice.loadRef().beginParse(true);
        let body: VmCont = loadVmCont(slice1);
        let slice2 = slice.loadRef().beginParse(true);
        let after: VmCont = loadVmCont(slice2);
        return {
            kind: 'VmCont_vmc_repeat',
            count: count,
            body: body,
            after: after,
        }

    }
    if (((slice.remainingBits >= 6) && (slice.preloadUint(6) == 0b110000))) {
        slice.loadUint(6);
        let slice1 = slice.loadRef().beginParse(true);
        let body: VmCont = loadVmCont(slice1);
        let slice2 = slice.loadRef().beginParse(true);
        let after: VmCont = loadVmCont(slice2);
        return {
            kind: 'VmCont_vmc_until',
            body: body,
            after: after,
        }

    }
    if (((slice.remainingBits >= 6) && (slice.preloadUint(6) == 0b110001))) {
        slice.loadUint(6);
        let slice1 = slice.loadRef().beginParse(true);
        let body: VmCont = loadVmCont(slice1);
        return {
            kind: 'VmCont_vmc_again',
            body: body,
        }

    }
    if (((slice.remainingBits >= 6) && (slice.preloadUint(6) == 0b110010))) {
        slice.loadUint(6);
        let slice1 = slice.loadRef().beginParse(true);
        let cond: VmCont = loadVmCont(slice1);
        let slice2 = slice.loadRef().beginParse(true);
        let body: VmCont = loadVmCont(slice2);
        let slice3 = slice.loadRef().beginParse(true);
        let after: VmCont = loadVmCont(slice3);
        return {
            kind: 'VmCont_vmc_while_cond',
            cond: cond,
            body: body,
            after: after,
        }

    }
    if (((slice.remainingBits >= 6) && (slice.preloadUint(6) == 0b110011))) {
        slice.loadUint(6);
        let slice1 = slice.loadRef().beginParse(true);
        let cond: VmCont = loadVmCont(slice1);
        let slice2 = slice.loadRef().beginParse(true);
        let body: VmCont = loadVmCont(slice2);
        let slice3 = slice.loadRef().beginParse(true);
        let after: VmCont = loadVmCont(slice3);
        return {
            kind: 'VmCont_vmc_while_body',
            cond: cond,
            body: body,
            after: after,
        }

    }
    if (((slice.remainingBits >= 4) && (slice.preloadUint(4) == 0b1111))) {
        slice.loadUint(4);
        let value: number = slice.loadInt(32);
        let slice1 = slice.loadRef().beginParse(true);
        let next: VmCont = loadVmCont(slice1);
        return {
            kind: 'VmCont_vmc_pushint',
            value: value,
            next: next,
        }

    }
    throw new Error('Expected one of "VmCont_vmc_std", "VmCont_vmc_envelope", "VmCont_vmc_quit", "VmCont_vmc_quit_exc", "VmCont_vmc_repeat", "VmCont_vmc_until", "VmCont_vmc_again", "VmCont_vmc_while_cond", "VmCont_vmc_while_body", "VmCont_vmc_pushint" in loading "VmCont", but data does not satisfy any constructor');
}

export function storeVmCont(vmCont: VmCont): (builder: Builder) => void {
    if ((vmCont.kind == 'VmCont_vmc_std')) {
        return ((builder: Builder) => {
            builder.storeUint(0b00, 2);
            storeVmControlData(vmCont.cdata)(builder);
            storeVmCellSlice(vmCont.code)(builder);
        })

    }
    if ((vmCont.kind == 'VmCont_vmc_envelope')) {
        return ((builder: Builder) => {
            builder.storeUint(0b01, 2);
            storeVmControlData(vmCont.cdata)(builder);
            let cell1 = beginCell();
            storeVmCont(vmCont.next)(cell1);
            builder.storeRef(cell1);
        })

    }
    if ((vmCont.kind == 'VmCont_vmc_quit')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1000, 4);
            builder.storeInt(vmCont.exit_code, 32);
        })

    }
    if ((vmCont.kind == 'VmCont_vmc_quit_exc')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1001, 4);
        })

    }
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
        })

    }
    if ((vmCont.kind == 'VmCont_vmc_until')) {
        return ((builder: Builder) => {
            builder.storeUint(0b110000, 6);
            let cell1 = beginCell();
            storeVmCont(vmCont.body)(cell1);
            builder.storeRef(cell1);
            let cell2 = beginCell();
            storeVmCont(vmCont.after)(cell2);
            builder.storeRef(cell2);
        })

    }
    if ((vmCont.kind == 'VmCont_vmc_again')) {
        return ((builder: Builder) => {
            builder.storeUint(0b110001, 6);
            let cell1 = beginCell();
            storeVmCont(vmCont.body)(cell1);
            builder.storeRef(cell1);
        })

    }
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
        })

    }
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
        })

    }
    if ((vmCont.kind == 'VmCont_vmc_pushint')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1111, 4);
            builder.storeInt(vmCont.value, 32);
            let cell1 = beginCell();
            storeVmCont(vmCont.next)(cell1);
            builder.storeRef(cell1);
        })

    }
    throw new Error('Expected one of "VmCont_vmc_std", "VmCont_vmc_envelope", "VmCont_vmc_quit", "VmCont_vmc_quit_exc", "VmCont_vmc_repeat", "VmCont_vmc_until", "VmCont_vmc_again", "VmCont_vmc_while_cond", "VmCont_vmc_while_body", "VmCont_vmc_pushint" in loading "VmCont", but data does not satisfy any constructor');
}

// _ t:VmStack = VMStackUser;

export function loadVMStackUser(slice: Slice): VMStackUser {
    let t: TupleItem[] = parseTuple(slice.asCell());
    return {
        kind: 'VMStackUser',
        t: t,
    }

}

export function storeVMStackUser(vMStackUser: VMStackUser): (builder: Builder) => void {
    return ((builder: Builder) => {
        copyCellToBuilder(serializeTuple(vMStackUser.t), builder);
    })

}

