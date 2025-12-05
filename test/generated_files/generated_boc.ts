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

/*
serialized_boc_idx#68ff65f3 size:(## 8) { size <= 4 }
  off_bytes:(## 8) { off_bytes <= 8 }
  cells:(##(size * 8))
  roots:(##(size * 8)) { roots = 1 }
  absent:(##(size * 8)) { roots + absent <= cells }
  tot_cells_size:(##(off_bytes * 8))
  index:(cells * ##(off_bytes * 8))
  cell_data:(tot_cells_size * [ uint8 ])
  = BagOfCells;
*/

/*
serialized_boc_idx_crc32c#acc3a728 size:(## 8) { size <= 4 }
  off_bytes:(## 8) { off_bytes <= 8 }
  cells:(##(size * 8))
  roots:(##(size * 8)) { roots = 1 }
  absent:(##(size * 8)) { roots + absent <= cells }
  tot_cells_size:(##(off_bytes * 8))
  index:(cells * ##(off_bytes * 8))
  cell_data:(tot_cells_size * [ uint8 ])
  crc32c:uint32 = BagOfCells;
*/

/*
serialized_boc#b5ee9c72 has_idx:(## 1) has_crc32c:(## 1)
  has_cache_bits:(## 1) flags:(## 2) { flags = 0 }
  size:(## 3) { size <= 4 }
  off_bytes:(## 8) { off_bytes <= 8 }
  cells:(##(size * 8))
  roots:(##(size * 8)) { roots >= 1 }
  absent:(##(size * 8)) { roots + absent <= cells }
  tot_cells_size:(##(off_bytes * 8))
  root_list:(roots * ##(size * 8))
  index:has_idx?(cells * ##(off_bytes * 8))
  cell_data:(tot_cells_size * [ uint8 ])
  crc32c:has_crc32c?uint32
  = BagOfCells;
*/

export type BagOfCells = BagOfCells_serialized_boc_idx | BagOfCells_serialized_boc_idx_crc32c | BagOfCells_serialized_boc;

export interface BagOfCells_serialized_boc_idx {
    readonly kind: 'BagOfCells_serialized_boc_idx';
    readonly size: number;
    readonly off_bytes: number;
    readonly cells: bigint;
    readonly roots: bigint;
    readonly absent: bigint;
    readonly tot_cells_size: bigint;
    readonly index: Slice;
    readonly cell_data: Buffer;
}

export interface BagOfCells_serialized_boc_idx_crc32c {
    readonly kind: 'BagOfCells_serialized_boc_idx_crc32c';
    readonly size: number;
    readonly off_bytes: number;
    readonly cells: bigint;
    readonly roots: bigint;
    readonly absent: bigint;
    readonly tot_cells_size: bigint;
    readonly index: Slice;
    readonly cell_data: Buffer;
    readonly crc32c: number;
}

export interface BagOfCells_serialized_boc {
    readonly kind: 'BagOfCells_serialized_boc';
    readonly has_idx: number;
    readonly has_crc32c: number;
    readonly has_cache_bits: number;
    readonly flags: number;
    readonly size: number;
    readonly off_bytes: number;
    readonly cells: bigint;
    readonly roots: bigint;
    readonly absent: bigint;
    readonly tot_cells_size: bigint;
    readonly root_list: Slice;
    readonly index: Slice | undefined;
    readonly cell_data: Buffer;
    readonly crc32c: number | undefined;
}

/*
compiled_smart_contract
  compiled_at:uint32 code:^Cell data:^Cell
  description:(Maybe ^TinyString)
  ^[ source_file:(Maybe ^TinyString)
       compiler_version:(Maybe ^TinyString) ]
  = CompiledSmartContract;
*/

export interface CompiledSmartContract {
    readonly kind: 'CompiledSmartContract';
    readonly compiled_at: number;
    readonly code: Cell;
    readonly data: Cell;
    readonly description: Maybe<TinyString>;
    readonly source_file: Maybe<TinyString>;
    readonly compiler_version: Maybe<TinyString>;
}

// tiny_string#_ len:(#<= 126) str:(len * [ uint8 ]) = TinyString;

export interface TinyString {
    readonly kind: 'TinyString';
    readonly len: number;
    readonly str: Buffer;
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

/*
serialized_boc_idx#68ff65f3 size:(## 8) { size <= 4 }
  off_bytes:(## 8) { off_bytes <= 8 }
  cells:(##(size * 8))
  roots:(##(size * 8)) { roots = 1 }
  absent:(##(size * 8)) { roots + absent <= cells }
  tot_cells_size:(##(off_bytes * 8))
  index:(cells * ##(off_bytes * 8))
  cell_data:(tot_cells_size * [ uint8 ])
  = BagOfCells;
*/

/*
serialized_boc_idx_crc32c#acc3a728 size:(## 8) { size <= 4 }
  off_bytes:(## 8) { off_bytes <= 8 }
  cells:(##(size * 8))
  roots:(##(size * 8)) { roots = 1 }
  absent:(##(size * 8)) { roots + absent <= cells }
  tot_cells_size:(##(off_bytes * 8))
  index:(cells * ##(off_bytes * 8))
  cell_data:(tot_cells_size * [ uint8 ])
  crc32c:uint32 = BagOfCells;
*/

/*
serialized_boc#b5ee9c72 has_idx:(## 1) has_crc32c:(## 1)
  has_cache_bits:(## 1) flags:(## 2) { flags = 0 }
  size:(## 3) { size <= 4 }
  off_bytes:(## 8) { off_bytes <= 8 }
  cells:(##(size * 8))
  roots:(##(size * 8)) { roots >= 1 }
  absent:(##(size * 8)) { roots + absent <= cells }
  tot_cells_size:(##(off_bytes * 8))
  root_list:(roots * ##(size * 8))
  index:has_idx?(cells * ##(off_bytes * 8))
  cell_data:(tot_cells_size * [ uint8 ])
  crc32c:has_crc32c?uint32
  = BagOfCells;
*/

export function loadBagOfCells(slice: Slice): BagOfCells {
    if (((slice.remainingBits >= 32) && (slice.preloadUint(32) == 0x68ff65f3))) {
        slice.loadUint(32);
        const size: number = slice.loadUint(8);
        const off_bytes: number = slice.loadUint(8);
        const cells: bigint = slice.loadUintBig((size * 8));
        const roots: bigint = slice.loadUintBig((size * 8));
        const absent: bigint = slice.loadUintBig((size * 8));
        const tot_cells_size: bigint = slice.loadUintBig((off_bytes * 8));
        const index: Slice = ((slice: Slice) => {
            const subslice = slice.clone();
            const tempCell = beginCell();
            tempCell.storeBits(subslice.loadBits((Number(cells) * Number((off_bytes * 8)))));
            return tempCell.endCell().beginParse(true)
        })(slice);
        const cell_data: Buffer = slice.loadBuffer(Number(tot_cells_size));
        if ((!(size <= 4))) {
            throw new Error('Condition (size <= 4) is not satisfied while loading "BagOfCells_serialized_boc_idx" for type "BagOfCells"');
        }
        if ((!(off_bytes <= 8))) {
            throw new Error('Condition (off_bytes <= 8) is not satisfied while loading "BagOfCells_serialized_boc_idx" for type "BagOfCells"');
        }
        if ((!(Number(roots) == 1))) {
            throw new Error('Condition (Number(roots) == 1) is not satisfied while loading "BagOfCells_serialized_boc_idx" for type "BagOfCells"');
        }
        if ((!((Number(roots) + Number(absent)) <= Number(cells)))) {
            throw new Error('Condition ((Number(roots) + Number(absent)) <= Number(cells)) is not satisfied while loading "BagOfCells_serialized_boc_idx" for type "BagOfCells"');
        }
        return {
            kind: 'BagOfCells_serialized_boc_idx',
            size: size,
            off_bytes: off_bytes,
            cells: cells,
            roots: roots,
            absent: absent,
            tot_cells_size: tot_cells_size,
            index: index,
            cell_data: cell_data,
        }
    }
    if (((slice.remainingBits >= 32) && (slice.preloadUint(32) == 0xacc3a728))) {
        slice.loadUint(32);
        const size: number = slice.loadUint(8);
        const off_bytes: number = slice.loadUint(8);
        const cells: bigint = slice.loadUintBig((size * 8));
        const roots: bigint = slice.loadUintBig((size * 8));
        const absent: bigint = slice.loadUintBig((size * 8));
        const tot_cells_size: bigint = slice.loadUintBig((off_bytes * 8));
        const index: Slice = ((slice: Slice) => {
            const subslice = slice.clone();
            const tempCell = beginCell();
            tempCell.storeBits(subslice.loadBits((Number(cells) * Number((off_bytes * 8)))));
            return tempCell.endCell().beginParse(true)
        })(slice);
        const cell_data: Buffer = slice.loadBuffer(Number(tot_cells_size));
        const crc32c: number = slice.loadUint(32);
        if ((!(size <= 4))) {
            throw new Error('Condition (size <= 4) is not satisfied while loading "BagOfCells_serialized_boc_idx_crc32c" for type "BagOfCells"');
        }
        if ((!(off_bytes <= 8))) {
            throw new Error('Condition (off_bytes <= 8) is not satisfied while loading "BagOfCells_serialized_boc_idx_crc32c" for type "BagOfCells"');
        }
        if ((!(Number(roots) == 1))) {
            throw new Error('Condition (Number(roots) == 1) is not satisfied while loading "BagOfCells_serialized_boc_idx_crc32c" for type "BagOfCells"');
        }
        if ((!((Number(roots) + Number(absent)) <= Number(cells)))) {
            throw new Error('Condition ((Number(roots) + Number(absent)) <= Number(cells)) is not satisfied while loading "BagOfCells_serialized_boc_idx_crc32c" for type "BagOfCells"');
        }
        return {
            kind: 'BagOfCells_serialized_boc_idx_crc32c',
            size: size,
            off_bytes: off_bytes,
            cells: cells,
            roots: roots,
            absent: absent,
            tot_cells_size: tot_cells_size,
            index: index,
            cell_data: cell_data,
            crc32c: crc32c,
        }
    }
    if (((slice.remainingBits >= 32) && (slice.preloadUint(32) == 0xb5ee9c72))) {
        slice.loadUint(32);
        const has_idx: number = slice.loadUint(1);
        const has_crc32c: number = slice.loadUint(1);
        const has_cache_bits: number = slice.loadUint(1);
        const flags: number = slice.loadUint(2);
        const size: number = slice.loadUint(3);
        const off_bytes: number = slice.loadUint(8);
        const cells: bigint = slice.loadUintBig((size * 8));
        const roots: bigint = slice.loadUintBig((size * 8));
        const absent: bigint = slice.loadUintBig((size * 8));
        const tot_cells_size: bigint = slice.loadUintBig((off_bytes * 8));
        const root_list: Slice = ((slice: Slice) => {
            const subslice = slice.clone();
            const tempCell = beginCell();
            tempCell.storeBits(subslice.loadBits((Number(roots) * Number((size * 8)))));
            return tempCell.endCell().beginParse(true)
        })(slice);
        const index: Slice | undefined = (has_idx ? ((slice: Slice) => {
            const subslice = slice.clone();
            const tempCell = beginCell();
            tempCell.storeBits(subslice.loadBits((Number(cells) * Number((off_bytes * 8)))));
            return tempCell.endCell().beginParse(true)
        })(slice) : undefined);
        const cell_data: Buffer = slice.loadBuffer(Number(tot_cells_size));
        const crc32c: number | undefined = (has_crc32c ? slice.loadUint(32) : undefined);
        if ((!(flags == 0))) {
            throw new Error('Condition (flags == 0) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
        }
        if ((!(size <= 4))) {
            throw new Error('Condition (size <= 4) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
        }
        if ((!(off_bytes <= 8))) {
            throw new Error('Condition (off_bytes <= 8) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
        }
        if ((!(Number(roots) >= 1))) {
            throw new Error('Condition (Number(roots) >= 1) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
        }
        if ((!((Number(roots) + Number(absent)) <= Number(cells)))) {
            throw new Error('Condition ((Number(roots) + Number(absent)) <= Number(cells)) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
        }
        return {
            kind: 'BagOfCells_serialized_boc',
            has_idx: has_idx,
            has_crc32c: has_crc32c,
            has_cache_bits: has_cache_bits,
            flags: flags,
            size: size,
            off_bytes: off_bytes,
            cells: cells,
            roots: roots,
            absent: absent,
            tot_cells_size: tot_cells_size,
            root_list: root_list,
            index: index,
            cell_data: cell_data,
            crc32c: crc32c,
        }
    }
    throw new Error('Expected one of "BagOfCells_serialized_boc_idx", "BagOfCells_serialized_boc_idx_crc32c", "BagOfCells_serialized_boc" in loading "BagOfCells", but data does not satisfy any constructor');
}

export function storeBagOfCells(bagOfCells: BagOfCells): (builder: Builder) => void {
    if ((bagOfCells.kind == 'BagOfCells_serialized_boc_idx')) {
        return ((builder: Builder) => {
            builder.storeUint(0x68ff65f3, 32);
            builder.storeUint(bagOfCells.size, 8);
            builder.storeUint(bagOfCells.off_bytes, 8);
            builder.storeUint(bagOfCells.cells, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.roots, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.absent, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.tot_cells_size, (bagOfCells.off_bytes * 8));
            builder.storeSlice(bagOfCells.index);
            builder.storeBuffer(bagOfCells.cell_data);
            if ((!(bagOfCells.size <= 4))) {
                throw new Error('Condition (bagOfCells.size <= 4) is not satisfied while loading "BagOfCells_serialized_boc_idx" for type "BagOfCells"');
            }
            if ((!(bagOfCells.off_bytes <= 8))) {
                throw new Error('Condition (bagOfCells.off_bytes <= 8) is not satisfied while loading "BagOfCells_serialized_boc_idx" for type "BagOfCells"');
            }
            if ((!(Number(bagOfCells.roots) == 1))) {
                throw new Error('Condition (Number(bagOfCells.roots) == 1) is not satisfied while loading "BagOfCells_serialized_boc_idx" for type "BagOfCells"');
            }
            if ((!((Number(bagOfCells.roots) + Number(bagOfCells.absent)) <= Number(bagOfCells.cells)))) {
                throw new Error('Condition ((Number(bagOfCells.roots) + Number(bagOfCells.absent)) <= Number(bagOfCells.cells)) is not satisfied while loading "BagOfCells_serialized_boc_idx" for type "BagOfCells"');
            }
        })
    }
    if ((bagOfCells.kind == 'BagOfCells_serialized_boc_idx_crc32c')) {
        return ((builder: Builder) => {
            builder.storeUint(0xacc3a728, 32);
            builder.storeUint(bagOfCells.size, 8);
            builder.storeUint(bagOfCells.off_bytes, 8);
            builder.storeUint(bagOfCells.cells, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.roots, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.absent, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.tot_cells_size, (bagOfCells.off_bytes * 8));
            builder.storeSlice(bagOfCells.index);
            builder.storeBuffer(bagOfCells.cell_data);
            builder.storeUint(bagOfCells.crc32c, 32);
            if ((!(bagOfCells.size <= 4))) {
                throw new Error('Condition (bagOfCells.size <= 4) is not satisfied while loading "BagOfCells_serialized_boc_idx_crc32c" for type "BagOfCells"');
            }
            if ((!(bagOfCells.off_bytes <= 8))) {
                throw new Error('Condition (bagOfCells.off_bytes <= 8) is not satisfied while loading "BagOfCells_serialized_boc_idx_crc32c" for type "BagOfCells"');
            }
            if ((!(Number(bagOfCells.roots) == 1))) {
                throw new Error('Condition (Number(bagOfCells.roots) == 1) is not satisfied while loading "BagOfCells_serialized_boc_idx_crc32c" for type "BagOfCells"');
            }
            if ((!((Number(bagOfCells.roots) + Number(bagOfCells.absent)) <= Number(bagOfCells.cells)))) {
                throw new Error('Condition ((Number(bagOfCells.roots) + Number(bagOfCells.absent)) <= Number(bagOfCells.cells)) is not satisfied while loading "BagOfCells_serialized_boc_idx_crc32c" for type "BagOfCells"');
            }
        })
    }
    if ((bagOfCells.kind == 'BagOfCells_serialized_boc')) {
        return ((builder: Builder) => {
            builder.storeUint(0xb5ee9c72, 32);
            builder.storeUint(bagOfCells.has_idx, 1);
            builder.storeUint(bagOfCells.has_crc32c, 1);
            builder.storeUint(bagOfCells.has_cache_bits, 1);
            builder.storeUint(bagOfCells.flags, 2);
            builder.storeUint(bagOfCells.size, 3);
            builder.storeUint(bagOfCells.off_bytes, 8);
            builder.storeUint(bagOfCells.cells, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.roots, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.absent, (bagOfCells.size * 8));
            builder.storeUint(bagOfCells.tot_cells_size, (bagOfCells.off_bytes * 8));
            builder.storeSlice(bagOfCells.root_list);
            if ((bagOfCells.has_idx && (bagOfCells.index != undefined))) {
                builder.storeSlice(bagOfCells.index);
            }
            builder.storeBuffer(bagOfCells.cell_data);
            if ((bagOfCells.has_crc32c && (bagOfCells.crc32c != undefined))) {
                builder.storeUint((bagOfCells.crc32c!), 32);
            }
            if ((!(bagOfCells.flags == 0))) {
                throw new Error('Condition (bagOfCells.flags == 0) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
            }
            if ((!(bagOfCells.size <= 4))) {
                throw new Error('Condition (bagOfCells.size <= 4) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
            }
            if ((!(bagOfCells.off_bytes <= 8))) {
                throw new Error('Condition (bagOfCells.off_bytes <= 8) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
            }
            if ((!(Number(bagOfCells.roots) >= 1))) {
                throw new Error('Condition (Number(bagOfCells.roots) >= 1) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
            }
            if ((!((Number(bagOfCells.roots) + Number(bagOfCells.absent)) <= Number(bagOfCells.cells)))) {
                throw new Error('Condition ((Number(bagOfCells.roots) + Number(bagOfCells.absent)) <= Number(bagOfCells.cells)) is not satisfied while loading "BagOfCells_serialized_boc" for type "BagOfCells"');
            }
        })
    }
    throw new Error('Expected one of "BagOfCells_serialized_boc_idx", "BagOfCells_serialized_boc_idx_crc32c", "BagOfCells_serialized_boc" in loading "BagOfCells", but data does not satisfy any constructor');
}

/*
compiled_smart_contract
  compiled_at:uint32 code:^Cell data:^Cell
  description:(Maybe ^TinyString)
  ^[ source_file:(Maybe ^TinyString)
       compiler_version:(Maybe ^TinyString) ]
  = CompiledSmartContract;
*/

export function loadCompiledSmartContract(slice: Slice): CompiledSmartContract {
    if (((slice.remainingBits >= 32) && (slice.preloadUint(32) == 0x5da77277))) {
        slice.loadUint(32);
        const compiled_at: number = slice.loadUint(32);
        const slice1 = slice.loadRef().beginParse(true);
        const code: Cell = slice1.asCell();
        const slice2 = slice.loadRef().beginParse(true);
        const data: Cell = slice2.asCell();
        const description: Maybe<TinyString> = loadMaybe<TinyString>(slice, ((slice: Slice) => {
            const slice1 = slice.loadRef().beginParse(true);
            return loadTinyString(slice1)
        }));
        const slice3 = slice.loadRef().beginParse(true);
        const source_file: Maybe<TinyString> = loadMaybe<TinyString>(slice3, ((slice: Slice) => {
            const slice1 = slice.loadRef().beginParse(true);
            return loadTinyString(slice1)
        }));
        const compiler_version: Maybe<TinyString> = loadMaybe<TinyString>(slice3, ((slice: Slice) => {
            const slice1 = slice.loadRef().beginParse(true);
            return loadTinyString(slice1)
        }));
        return {
            kind: 'CompiledSmartContract',
            compiled_at: compiled_at,
            code: code,
            data: data,
            description: description,
            source_file: source_file,
            compiler_version: compiler_version,
        }
    }
    throw new Error('Expected one of "CompiledSmartContract" in loading "CompiledSmartContract", but data does not satisfy any constructor');
}

export function storeCompiledSmartContract(compiledSmartContract: CompiledSmartContract): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(0x5da77277, 32);
        builder.storeUint(compiledSmartContract.compiled_at, 32);
        const cell1 = beginCell();
        cell1.storeSlice(compiledSmartContract.code.beginParse(true));
        builder.storeRef(cell1);
        const cell2 = beginCell();
        cell2.storeSlice(compiledSmartContract.data.beginParse(true));
        builder.storeRef(cell2);
        storeMaybe<TinyString>(compiledSmartContract.description, ((arg: TinyString) => {
            return ((builder: Builder) => {
                const cell1 = beginCell();
                storeTinyString(arg)(cell1);
                builder.storeRef(cell1);
            })
        }))(builder);
        const cell3 = beginCell();
        storeMaybe<TinyString>(compiledSmartContract.source_file, ((arg: TinyString) => {
            return ((builder: Builder) => {
                const cell1 = beginCell();
                storeTinyString(arg)(cell1);
                builder.storeRef(cell1);
            })
        }))(cell3);
        storeMaybe<TinyString>(compiledSmartContract.compiler_version, ((arg: TinyString) => {
            return ((builder: Builder) => {
                const cell1 = beginCell();
                storeTinyString(arg)(cell1);
                builder.storeRef(cell1);
            })
        }))(cell3);
        builder.storeRef(cell3);
    })
}

// tiny_string#_ len:(#<= 126) str:(len * [ uint8 ]) = TinyString;

export function loadTinyString(slice: Slice): TinyString {
    const len: number = slice.loadUint(bitLen(126));
    const str: Buffer = slice.loadBuffer(Number(len));
    return {
        kind: 'TinyString',
        len: len,
        str: str,
    }
}

export function storeTinyString(tinyString: TinyString): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(tinyString.len, bitLen(126));
        builder.storeBuffer(tinyString.str);
    })
}

