# TLB Generator
This package allows you to generate `Typescript` code for serializing and deserializing structures according to the `TLB` scheme provided. 

[Here](https://docs.ton.org/develop/data-formats/tl-b-language) you can find documentation for creating TLB schemes, and more advanced article is [here](https://docs.ton.org/develop/data-formats/tl-b-types). 

This package uses [TLB-Parser](https://github.com/ton-community/tlb-parser) to get AST of the scheme. 

## Installation 

```bash
npm install @ton-community/tlb-codegen
```

## Usage

### CLI

Create a file with TLB scheme according to the [documentation](https://docs.ton.org/develop/data-formats/tl-b-language). This is an example of such a file (call it `example.tlb`):
```
t$_ x:# y:(uint 5) = A;
```

Then do:
```bash
npx tlb example.tlb
```

It will create a file called `example.tlb.ts` with the following code:
```typescript
export interface A {
    readonly kind: 'A';
    readonly x: number;
    readonly y: number;
}
export function loadA(slice: Slice): A {
    let x: number = slice.loadUint(32);
    let y: number = slice.loadUint(5);
    return {
        kind: 'A',
        x: x,
        y: y,
    }

}
export function storeA(a: A): (builder: Builder) => void {
    return ((builder: Builder) => {
        builder.storeUint(a.x, 32);
        builder.storeUint(a.y, 5);
    })

}
```

You also can set an output file with `-o` option: `npx tlb -o other_file.ts example.tlb`.

One of the examples where you can see various abilities of the tool is [block.tlb](https://github.com/ton-blockchain/ton/blob/master/crypto/block/block.tlb). The generation result for it is [here](https://github.com/PolyProgrammist/tlbgenerator/blob/master/test/generated_files/generated_block.ts).  

### Node JS
Also you can use the tool from inside JS or TS code.

```typescript
import { generateCode } from "@ton-community/tlb-codegen"
generateCode('example.tlb', 'example.tlb.ts', "typescript")
```


## Integration with @ton/core

It is integrated with [@ton/core](https://github.com/ton-org/ton-core/) in a way it uses several built-in types from there.

Built-in types supported are:
 - `Bool` -> `boolean` (loaded with `loadBoolean`, stored with `storeBit`)
 - `MsgAddressInt` -> `Address` (loaded with `loadAddress`, stored with `storeAddress`)
 - `MsgAddressExt` -> `ExternalAddress | null` (loaded with `loadMaybeExternalAddress`, stored with `storeAddress`)
 - `MsgAddress` -> `Address | ExternalAddress | null` (loaded with `loadAddressAny`, stored with `storeAddress`)
 - `VarUInteger` -> `bigint` (loaded with `loadVarUintBig`, stored with `storeVarUint`)
 - `VarInteger` -> `bigint` (loaded with `loadVarIntBig`, stored with `storeVarInt`)
 - `Bit` -> `boolean` (loaded with `loadBit`, stored with `storeBit`)
 - `Grams` -> `bigint` (loaded with `loadCoins`, stored with `storeCoins`)
 - `HashmapE n Value` -> `Dictionary<bigint, Value>` (or `Dictionary<number, Value>` if n <= 64) (loaded with `Dictionary.load`, stored with `storeDict`)
 - `HashmapAugE n Value Extra` -> `Dictionary<bigint, {value: Value, extra: Extra}>` (or `number` instead of `bigint` if `n <= 64`) (loaded with `Dictionary.load`, stored with `storeDict`)

> Please note that the tricky thing here with `HashmapAugE` is that in `TLB` scheme extra is [stored](https://github.com/ton-blockchain/ton/blob/062b7b4a92dd67e32d963cf3f04b8bc97d8b7ed5/crypto/block/block.tlb#L49) not only with values, but in intermediate nodes as well. However `Dictionary` in [@ton/core](https://github.com/ton-org/ton-core) doesn't store the intermediate nodes. That is why `HashmapAugE` can be correctly loaded by the generated code, but storing is incorrect.  

> Please note that `BinTree` is not supported yet. In the future it will be supported as built-in type `BinTree` from [@ton/core](https://github.com/ton-org/ton-core).

## License

This package is released under the [MIT License](LICENSE).
