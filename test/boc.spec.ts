import { Cell, Builder, BitString, BitReader, Slice } from '@ton/core';

import { genCodeForTest } from './generate';
import { loadBagOfCells, loadCompiledSmartContract, storeCompiledSmartContract } from './generated_files/generated_boc';

describe('Generating boc.tlb code', () => {
    beforeAll(async () => {
        await genCodeForTest('boc');
    });

    test('CompiledSmartContract', () => {
        const builder = new Builder();
        storeCompiledSmartContract({
            kind: 'CompiledSmartContract',
            compiled_at: 0,
            code: Cell.EMPTY,
            data: Cell.EMPTY,
            compiler_version: {
                kind: 'Maybe_nothing',
            },
            description: {
                kind: 'Maybe_nothing',
            },
            source_file: {
                kind: 'Maybe_just',
                value: {
                    kind: 'TinyString',
                    len: 0,
                    str: Buffer.alloc(0),
                },
            },
        })(builder);
        const cell = builder.endCell();
        const data = loadCompiledSmartContract(cell.asSlice());
        expect(data.kind).toEqual('CompiledSmartContract');
    });

    test('BagOfCells_serialized_boc', () => {
        const u8 = (v: number) => new Builder().storeUint(v, 8).endCell();
        const boc = u8(42).toBoc();
        const slice = new Slice(new BitReader(new BitString(boc, 0, boc.length * 8)), []);
        const data = loadBagOfCells(slice);
        expect(data.kind).toEqual('BagOfCells_serialized_boc');
    });
});
