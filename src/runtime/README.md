# TL-B Runtime Parser

This module provides functionality to parse TL-B schemas and perform serialization/deserialization at runtime without code generation.

## Features

- Parse TL-B schemas at runtime
- Serialize JavaScript objects to TON cells according to TL-B specifications
- Deserialize TON cells to JavaScript objects according to TL-B specifications
- No code generation required
- No `eval` used - safe for all environments including browser and Node.js
- Support for common TL-B types and constructs

## Usage

```typescript
import { parseTLB } from 'tlb-codegen';

// 1. Define your TL-B schema
const schema = `
unit$_ = Unit;
true$_ = True;
// EMPTY False;
bool_false$0 = Bool;
bool_true$1 = Bool;
bool_false$0 = BoolFalse;
bool_true$1 = BoolTrue;
nothing$0 {X:Type} = Maybe X;
just$1 {X:Type} value:X = Maybe X;
left$0 {X:Type} {Y:Type} value:X = Either X Y;
right$1 {X:Type} {Y:Type} value:Y = Either X Y;
pair$_ {X:Type} {Y:Type} first:X second:Y = Both X Y;

bit$_ (## 1) = Bit;

addr_none$00 = MsgAddressExt;
addr_extern$01 len:(## 9) external_address:(bits len) 
             = MsgAddressExt;
anycast_info$_ depth:(#<= 30) { depth >= 1 }
   rewrite_pfx:(bits depth) = Anycast;
addr_std$10 anycast:(Maybe Anycast) 
   workchain_id:int8 address:bits256  = MsgAddressInt;
addr_var$11 anycast:(Maybe Anycast) addr_len:(## 9) 
   workchain_id:int32 address:(bits addr_len) = MsgAddressInt;
_ _:MsgAddressInt = MsgAddress;
_ _:MsgAddressExt = MsgAddress;

custom_address$00 address:MsgAddress = CustomAddress;

test_message#00000001 x:Bool y:Bool z:CustomAddress b:(bits 64) = TestMessage;
`;

// 2. Create a runtime parser for this schema
const runtime = parseTLB(schema);

// 3. Create your data object
const bitBuilder = new BitBuilder();
bitBuilder.writeBuffer(Buffer.from("0123456789abcdef", "hex"));
const bitString = bitBuilder.build();

const messageData = {
  kind: "TestMessage_test_message",
  x: true,
  y: false,
  z: {
    kind: "CustomAddress_custom_address",
    address: Address.parse(
      "UQBmlELoEEWfmh81Yxt7Wci7pZCH1B0k5fWc1p3MvzohVIEI"
    ),
  },
  b: bitString,
};

// 4. Serialize to a cell
const builder = runtime.serialize("TestMessage", messageData);
const cell = builder.endCell();

// 5. Deserialize from a cell
const slice = cell.beginParse();
const deserializedMessage = runtime.deserialize("TestMessage", slice);
```

## Performance Considerations

The runtime parser is designed for flexibility and convenience rather than maximum performance. For high-performance applications, consider:

1. Using the code generation approach when possible
2. Caching the `TLBRuntime` instance when parsing the same schema multiple times
3. Being aware that runtime parsing adds overhead compared to pre-generated code 