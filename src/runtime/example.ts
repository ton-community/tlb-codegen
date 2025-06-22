import { Address, BitBuilder, BitString } from "@ton/core";
import { parseTLB, beginCell, Cell } from "./index";

// Example TL-B schema
const tlbSchema = `
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

// Example usage
async function runExample() {
  console.log("Initializing TL-B runtime parser...");
  const runtime = parseTLB(tlbSchema);

  const bitBuilder = new BitBuilder();
  bitBuilder.writeBuffer(Buffer.from("0123456789abcdef", "hex"));
  const bitString = bitBuilder.build();

  // Create a message
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

  // Serialize the message
  console.log("Serializing message...");
  const builder = runtime.serialize("TestMessage", messageData);
  const cell = builder.endCell();

  console.log("Serialized cell:", cell.toString());

  // Deserialize the message
  console.log("Deserializing message...");
  const slice = cell.beginParse();
  const deserializedMessage = runtime.deserialize("TestMessage", slice);

  console.log(
    "Deserialized message:",
    JSON.stringify(
      deserializedMessage,
      (key, value) => {
        // Handle Buffer objects in the output
        if (value instanceof Buffer) {
          return value.toString("hex");
        }
        // Handle Cell objects in the output
        if (value instanceof Cell) {
          return `Cell{${value.toString()}}`;
        }

        // Handle Address objects in the output
        if (value instanceof Address) {
          return value.toString({ urlSafe: true, bounceable: false });
        }

        // Handle BitString objects in the output
        if (value instanceof BitString) {
          return value.toString();
        }

        return value;
      },
      2
    )
  );
}

runExample().catch(console.error);
