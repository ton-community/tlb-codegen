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



export function loadBoolFalse(slice: Slice): Bool {
  if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
      slice.loadUint(1);
      return {
          kind: 'Bool',
          value: false
      }

  }
  throw new Error('Expected one of "BoolFalse" in loading "BoolFalse", but data does not satisfy any constructor');
}

export function loadBoolTrue(slice: Slice): Bool {
  if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
      slice.loadUint(1);
      return {
          kind: 'Bool',
          value: true
      }

  }
  throw new Error('Expected one of "BoolTrue" in loading "BoolTrue", but data does not satisfy any constructor');
}

export function copyCellToBuilder(from: Cell, to: Builder): void {
    let slice = from.beginParse();
    to.storeBits(slice.loadBits(slice.remainingBits));
    while (slice.remainingRefs) {
        to.storeRef(slice.loadRef());
    }
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

// nothing$0 {X:Type} = Maybe X;

// just$1 {X:Type} value:X = Maybe X;

export type Maybe<X> = Maybe_nothing<X> | Maybe_just<X>;

export interface Maybe_nothing<X> {
    readonly kind: 'Maybe_nothing';
}

export interface Maybe_just<X> {
    readonly kind: 'Maybe_just';
    readonly value: X;
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
    readonly s: number[];
}

export interface HmLabel_hml_long {
    readonly kind: 'HmLabel_hml_long';
    readonly m: number;
    readonly n: number;
    readonly s: number[];
}

export interface HmLabel_hml_same {
    readonly kind: 'HmLabel_hml_same';
    readonly m: number;
    readonly v: boolean;
    readonly n: number;
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

/*
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n) 
          {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;
*/

export interface Hashmap<X> {
    readonly kind: 'Hashmap';
    readonly n: number;
    readonly l?: number;
    readonly m?: number;
    readonly label: HmLabel;
    readonly node: HashmapNode<X>;
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

// proto_http#4854 = Protocol;

export interface Protocol {
    readonly kind: 'Protocol';
}

// proto_list_nil$0 = ProtoList;

// proto_list_next$1 head:Protocol tail:ProtoList = ProtoList;

export type ProtoList = ProtoList_proto_list_nil | ProtoList_proto_list_next;

export interface ProtoList_proto_list_nil {
    readonly kind: 'ProtoList_proto_list_nil';
}

export interface ProtoList_proto_list_next {
    readonly kind: 'ProtoList_proto_list_next';
    readonly head: Protocol;
    readonly tail: ProtoList;
}

// cap_is_wallet#2177 = SmcCapability;

export interface SmcCapability {
    readonly kind: 'SmcCapability';
}

// cap_list_nil$0 = SmcCapList;

// cap_list_next$1 head:SmcCapability tail:SmcCapList = SmcCapList;

export type SmcCapList = SmcCapList_cap_list_nil | SmcCapList_cap_list_next;

export interface SmcCapList_cap_list_nil {
    readonly kind: 'SmcCapList_cap_list_nil';
}

export interface SmcCapList_cap_list_next {
    readonly kind: 'SmcCapList_cap_list_next';
    readonly head: SmcCapability;
    readonly tail: SmcCapList;
}

/*
dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 }
  cap_list:flags . 0?SmcCapList = DNSRecord;
*/

// dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;

/*
dns_adnl_address#ad01 adnl_addr:bits256 flags:(## 8) { flags <= 1 }
  proto_list:flags . 0?ProtoList = DNSRecord;
*/

// dns_storage_address#7473 bag_id:bits256 = DNSRecord;

export type DNSRecord = DNSRecord_dns_smc_address | DNSRecord_dns_next_resolver | DNSRecord_dns_adnl_address | DNSRecord_dns_storage_address;

export interface DNSRecord_dns_smc_address {
    readonly kind: 'DNSRecord_dns_smc_address';
    readonly smc_addr: Address;
    readonly flags: number;
    readonly cap_list: SmcCapList | undefined;
}

export interface DNSRecord_dns_next_resolver {
    readonly kind: 'DNSRecord_dns_next_resolver';
    readonly resolver: Address;
}

export interface DNSRecord_dns_adnl_address {
    readonly kind: 'DNSRecord_dns_adnl_address';
    readonly adnl_addr: Buffer;
    readonly flags: number;
    readonly proto_list: ProtoList | undefined;
}

export interface DNSRecord_dns_storage_address {
    readonly kind: 'DNSRecord_dns_storage_address';
    readonly bag_id: Buffer;
}

// _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;

export interface DNS_RecordSet {
    readonly kind: 'DNS_RecordSet';
    readonly anon0: Dictionary<bigint, DNSRecord>;
}

// unary_zero$0 = Unary ~0;

export function unary_unary_succ_get_n(x: Unary): number {
    if ((x.kind == 'Unary_unary_zero')) {
        return 0
    }
    if ((x.kind == 'Unary_unary_succ')) {
        const n = x.n;
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
        const x: Unary = loadUnary(slice);
        const n = unary_unary_succ_get_n(x);
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

// nothing$0 {X:Type} = Maybe X;

// just$1 {X:Type} value:X = Maybe X;

export function loadMaybe<X>(slice: Slice, loadX: (slice: Slice) => X): Maybe<X> {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        return {
            kind: 'Maybe_nothing',
        }
    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        const value: X = loadX(slice);
        return {
            kind: 'Maybe_just',
            value: value,
        }
    }
    throw new Error('Expected one of "Maybe_nothing", "Maybe_just" in loading "Maybe", but data does not satisfy any constructor');
}

export function storeMaybe<X>(maybe: Maybe<X>, storeX: (x: X) => (builder: Builder) => void): (builder: Builder) => void {
    if ((maybe.kind == 'Maybe_nothing')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
        })
    }
    if ((maybe.kind == 'Maybe_just')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeX(maybe.value)(builder);
        })
    }
    throw new Error('Expected one of "Maybe_nothing", "Maybe_just" in loading "Maybe", but data does not satisfy any constructor');
}

export function hmLabel_hml_short_get_n(len: Unary): number {
    if ((len.kind == 'Unary_unary_zero')) {
        return 0
    }
    if ((len.kind == 'Unary_unary_succ')) {
        const n = len.n;
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
        const len: Unary = loadUnary(slice);
        const n = hmLabel_hml_short_get_n(len);
        const s: number[] = Array.from(Array(n).keys()).map((() => {
            return slice.loadUint(1)
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
        const n: number = slice.loadUint(bitLen(m));
        const s: number[] = Array.from(Array(n).keys()).map((() => {
            return slice.loadUint(1)
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
        const v: boolean = slice.loadBit();
        const n: number = slice.loadUint(bitLen(m));
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
            hmLabel.s.forEach(((arg: number) => {
                builder.storeUint(arg, 1);
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
            hmLabel.s.forEach(((arg: number) => {
                builder.storeUint(arg, 1);
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

// hmn_leaf#_ {X:Type} value:X = HashmapNode 0 X;

/*
hmn_fork#_ {n:#} {X:Type} left:^(Hashmap n X) 
           right:^(Hashmap n X) = HashmapNode (n + 1) X;
*/

export function loadHashmapNode<X>(slice: Slice, arg0: number, loadX: (slice: Slice) => X): HashmapNode<X> {
    if ((arg0 == 0)) {
        const value: X = loadX(slice);
        return {
            kind: 'HashmapNode_hmn_leaf',
            value: value,
        }
    }
    if (true) {
        const slice1 = slice.loadRef().beginParse(true);
        const left: Hashmap<X> = loadHashmap<X>(slice1, (arg0 - 1), loadX);
        const slice2 = slice.loadRef().beginParse(true);
        const right: Hashmap<X> = loadHashmap<X>(slice2, (arg0 - 1), loadX);
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
            const cell1 = beginCell();
            storeHashmap<X>(hashmapNode.left, storeX)(cell1);
            builder.storeRef(cell1);
            const cell2 = beginCell();
            storeHashmap<X>(hashmapNode.right, storeX)(cell2);
            builder.storeRef(cell2);
        })
    }
    throw new Error('Expected one of "HashmapNode_hmn_leaf", "HashmapNode_hmn_fork" in loading "HashmapNode", but data does not satisfy any constructor');
}

export function hashmap_get_l(label: HmLabel): number {
    if ((label.kind == 'HmLabel_hml_short')) {
        const n = label.n;
        return n
    }
    if ((label.kind == 'HmLabel_hml_long')) {
        const n = label.n;
        return n
    }
    if ((label.kind == 'HmLabel_hml_same')) {
        const n = label.n;
        return n
    }
    throw new Error('Expected one of "HmLabel_hml_short", "HmLabel_hml_long", "HmLabel_hml_same" for type "HmLabel" while getting "label", but data does not satisfy any constructor');
}

/*
hm_edge#_ {n:#} {X:Type} {l:#} {m:#} label:(HmLabel ~l n) 
          {n = (~m) + l} node:(HashmapNode m X) = Hashmap n X;
*/

export function loadHashmap<X>(slice: Slice, n: number, loadX: (slice: Slice) => X): Hashmap<X> {
    const label: HmLabel = loadHmLabel(slice, n);
    const l = hashmap_get_l(label);
    const node: HashmapNode<X> = loadHashmapNode<X>(slice, (n - l), loadX);
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

/*
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
*/

export function loadAnycast(slice: Slice): Anycast {
    const depth: number = slice.loadUint(bitLen(30));
    const rewrite_pfx: BitString = slice.loadBits(depth);
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

// proto_http#4854 = Protocol;

export function loadProtocol(slice: Slice): Protocol {
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0x4854))) {
        slice.loadUint(16);
        return {
            kind: 'Protocol',
        }
    }
    throw new Error('Expected one of "Protocol" in loading "Protocol", but data does not satisfy any constructor');
}

export function storeProtocol(protocol: Protocol): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0x4854, 16);
    })
}

// proto_list_nil$0 = ProtoList;

// proto_list_next$1 head:Protocol tail:ProtoList = ProtoList;

export function loadProtoList(slice: Slice): ProtoList {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        return {
            kind: 'ProtoList_proto_list_nil',
        }
    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        const head: Protocol = loadProtocol(slice);
        const tail: ProtoList = loadProtoList(slice);
        return {
            kind: 'ProtoList_proto_list_next',
            head: head,
            tail: tail,
        }
    }
    throw new Error('Expected one of "ProtoList_proto_list_nil", "ProtoList_proto_list_next" in loading "ProtoList", but data does not satisfy any constructor');
}

export function storeProtoList(protoList: ProtoList): (builder: Builder) => void {
    if ((protoList.kind == 'ProtoList_proto_list_nil')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
        })
    }
    if ((protoList.kind == 'ProtoList_proto_list_next')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeProtocol(protoList.head)(builder);
            storeProtoList(protoList.tail)(builder);
        })
    }
    throw new Error('Expected one of "ProtoList_proto_list_nil", "ProtoList_proto_list_next" in loading "ProtoList", but data does not satisfy any constructor');
}

// cap_is_wallet#2177 = SmcCapability;

export function loadSmcCapability(slice: Slice): SmcCapability {
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0x2177))) {
        slice.loadUint(16);
        return {
            kind: 'SmcCapability',
        }
    }
    throw new Error('Expected one of "SmcCapability" in loading "SmcCapability", but data does not satisfy any constructor');
}

export function storeSmcCapability(smcCapability: SmcCapability): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0x2177, 16);
    })
}

// cap_list_nil$0 = SmcCapList;

// cap_list_next$1 head:SmcCapability tail:SmcCapList = SmcCapList;

export function loadSmcCapList(slice: Slice): SmcCapList {
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        slice.loadUint(1);
        return {
            kind: 'SmcCapList_cap_list_nil',
        }
    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        slice.loadUint(1);
        const head: SmcCapability = loadSmcCapability(slice);
        const tail: SmcCapList = loadSmcCapList(slice);
        return {
            kind: 'SmcCapList_cap_list_next',
            head: head,
            tail: tail,
        }
    }
    throw new Error('Expected one of "SmcCapList_cap_list_nil", "SmcCapList_cap_list_next" in loading "SmcCapList", but data does not satisfy any constructor');
}

export function storeSmcCapList(smcCapList: SmcCapList): (builder: Builder) => void {
    if ((smcCapList.kind == 'SmcCapList_cap_list_nil')) {
        return ((builder: Builder) => {
            builder.storeUint(0b0, 1);
        })
    }
    if ((smcCapList.kind == 'SmcCapList_cap_list_next')) {
        return ((builder: Builder) => {
            builder.storeUint(0b1, 1);
            storeSmcCapability(smcCapList.head)(builder);
            storeSmcCapList(smcCapList.tail)(builder);
        })
    }
    throw new Error('Expected one of "SmcCapList_cap_list_nil", "SmcCapList_cap_list_next" in loading "SmcCapList", but data does not satisfy any constructor');
}

/*
dns_smc_address#9fd3 smc_addr:MsgAddressInt flags:(## 8) { flags <= 1 }
  cap_list:flags . 0?SmcCapList = DNSRecord;
*/

// dns_next_resolver#ba93 resolver:MsgAddressInt = DNSRecord;

/*
dns_adnl_address#ad01 adnl_addr:bits256 flags:(## 8) { flags <= 1 }
  proto_list:flags . 0?ProtoList = DNSRecord;
*/

// dns_storage_address#7473 bag_id:bits256 = DNSRecord;

export function loadDNSRecord(slice: Slice): DNSRecord {
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0x9fd3))) {
        slice.loadUint(16);
        const smc_addr: Address = slice.loadAddress();
        const flags: number = slice.loadUint(8);
        const cap_list: SmcCapList | undefined = ((flags & (1 << 0)) ? loadSmcCapList(slice) : undefined);
        if ((!(flags <= 1))) {
            throw new Error('Condition (flags <= 1) is not satisfied while loading "DNSRecord_dns_smc_address" for type "DNSRecord"');
        }
        return {
            kind: 'DNSRecord_dns_smc_address',
            smc_addr: smc_addr,
            flags: flags,
            cap_list: cap_list,
        }
    }
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0xba93))) {
        slice.loadUint(16);
        const resolver: Address = slice.loadAddress();
        return {
            kind: 'DNSRecord_dns_next_resolver',
            resolver: resolver,
        }
    }
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0xad01))) {
        slice.loadUint(16);
        const adnl_addr: Buffer = slice.loadBuffer((256 / 8));
        const flags: number = slice.loadUint(8);
        const proto_list: ProtoList | undefined = ((flags & (1 << 0)) ? loadProtoList(slice) : undefined);
        if ((!(flags <= 1))) {
            throw new Error('Condition (flags <= 1) is not satisfied while loading "DNSRecord_dns_adnl_address" for type "DNSRecord"');
        }
        return {
            kind: 'DNSRecord_dns_adnl_address',
            adnl_addr: adnl_addr,
            flags: flags,
            proto_list: proto_list,
        }
    }
    if (((slice.remainingBits >= 16) && (slice.preloadUint(16) == 0x7473))) {
        slice.loadUint(16);
        const bag_id: Buffer = slice.loadBuffer((256 / 8));
        return {
            kind: 'DNSRecord_dns_storage_address',
            bag_id: bag_id,
        }
    }
    throw new Error('Expected one of "DNSRecord_dns_smc_address", "DNSRecord_dns_next_resolver", "DNSRecord_dns_adnl_address", "DNSRecord_dns_storage_address" in loading "DNSRecord", but data does not satisfy any constructor');
}

export function storeDNSRecord(dNSRecord: DNSRecord): (builder: Builder) => void {
    if ((dNSRecord.kind == 'DNSRecord_dns_smc_address')) {
        return ((builder: Builder) => {
            builder.storeUint(0x9fd3, 16);
            builder.storeAddress(dNSRecord.smc_addr);
            builder.storeUint(dNSRecord.flags, 8);
            if (((dNSRecord.flags & (1 << 0)) && (dNSRecord.cap_list != undefined))) {
                storeSmcCapList((dNSRecord.cap_list!))(builder);
            }
            if ((!(dNSRecord.flags <= 1))) {
                throw new Error('Condition (dNSRecord.flags <= 1) is not satisfied while loading "DNSRecord_dns_smc_address" for type "DNSRecord"');
            }
        })
    }
    if ((dNSRecord.kind == 'DNSRecord_dns_next_resolver')) {
        return ((builder: Builder) => {
            builder.storeUint(0xba93, 16);
            builder.storeAddress(dNSRecord.resolver);
        })
    }
    if ((dNSRecord.kind == 'DNSRecord_dns_adnl_address')) {
        return ((builder: Builder) => {
            builder.storeUint(0xad01, 16);
            builder.storeBuffer(dNSRecord.adnl_addr, (256 / 8));
            builder.storeUint(dNSRecord.flags, 8);
            if (((dNSRecord.flags & (1 << 0)) && (dNSRecord.proto_list != undefined))) {
                storeProtoList((dNSRecord.proto_list!))(builder);
            }
            if ((!(dNSRecord.flags <= 1))) {
                throw new Error('Condition (dNSRecord.flags <= 1) is not satisfied while loading "DNSRecord_dns_adnl_address" for type "DNSRecord"');
            }
        })
    }
    if ((dNSRecord.kind == 'DNSRecord_dns_storage_address')) {
        return ((builder: Builder) => {
            builder.storeUint(0x7473, 16);
            builder.storeBuffer(dNSRecord.bag_id, (256 / 8));
        })
    }
    throw new Error('Expected one of "DNSRecord_dns_smc_address", "DNSRecord_dns_next_resolver", "DNSRecord_dns_adnl_address", "DNSRecord_dns_storage_address" in loading "DNSRecord", but data does not satisfy any constructor');
}

// _ (HashmapE 256 ^DNSRecord) = DNS_RecordSet;

export function loadDNS_RecordSet(slice: Slice): DNS_RecordSet {
    const anon0: Dictionary<bigint, DNSRecord> = Dictionary.load(Dictionary.Keys.BigUint(256), {
        serialize: () => { throw new Error('Not implemented') },
        parse: ((slice: Slice) => {
        const slice1 = slice.loadRef().beginParse(true);
        return loadDNSRecord(slice1)
    }),
    }, slice);
    return {
        kind: 'DNS_RecordSet',
        anon0: anon0,
    }
}

export function storeDNS_RecordSet(dNS_RecordSet: DNS_RecordSet): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeDict(dNS_RecordSet.anon0, Dictionary.Keys.BigUint(256), {
            serialize: ((arg: DNSRecord, builder: Builder) => {
            ((arg: DNSRecord) => {
                return ((builder: Builder) => {
                    const cell1 = beginCell();
                    storeDNSRecord(arg)(cell1);
                    builder.storeRef(cell1);
                })
            })(arg)(builder);
        }),
            parse: () => { throw new Error('Not implemented') },
        });
    })
}

