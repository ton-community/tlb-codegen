import fs from "fs";
import path from "path";
import { Address, BitBuilder, BitString } from "@ton/core";
import { parseTLB, beginCell, Cell } from "./index";

const tlbSchema = fs.readFileSync(
  path.join(__dirname, "../../test/tlb/block.tlb"),
  "utf-8"
);

const bocHex = `b5ee9c7241020c010002db0003b571150b518b2626ad51899f98887f8824b70065456455f7fe2813f012699a4061f00003170944a5e838b4a644280b36b2f8c91af45f2b14584905b78da479d38b1c065c2a7270d245900003170944a5e8167be15a500034656dc6c80108090201e0020401b168008c282d687003c5ec69eb255e1e6e5a9cbadc04f984c87812f182161fb40692b50004542d462c989ab546267e6221fe2092dc0195159157dff8a04fc049a6690187d122dee4000614564c000062e1281aab04cf7c2b3cc00301b00f8a7ea5001607f0035281c143b9aca00800ef3b9902a271b2a01c8938a523cfe24e71847aaeb6a620001ed44a77ac0e709d00118505ad0e0078bd8d3d64abc3cdcb53975b809f30990f025e3042c3f680d256881443fd01070101df0501b1680022a16a3164c4d5aa3133f3110ff10496e00ca8ac8abeffc5027e024d33480c3f001de77320544e365403912714a479fc49ce308f55d6d4c40003da894ef581ce139027b687400611dcf4000062e12894bd08cf7c2b4ac00601647362d09c001607f0035281c143e95ba808008c282d687003c5ec69eb255e1e6e5a9cbadc04f984c87812f182161fb40692b5070095259385618009dd924373a9aad41b28cec02da9384d67363af2034fc2a7ccc067e28d4110de8664e59b00118505ad0e0078bd8d3d64abc3cdcb53975b809f30990f025e3042c3f680d256900082726af9126668b51f937ff31d208014efccc4346c70a2a054b01f0916adfe4ab16589678c93fee6b07c3bb46c4e8327c68f07e4a15d79d15319df5dbfca15ad785a02150409122dee401864dee0110a0b009e431e0c3d090000000000000000009300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006fc986b2d84c11dcd80000000000040002000000037ba8af338008108cf83d5f51feef8a8a6a5f58c33eee48b2e0bfea55da18c21a40d0352433cca987`;

// Example usage
async function runExample() {
  console.log("Initializing TL-B runtime parser...");
  const runtime = parseTLB(tlbSchema);

  const cell = Cell.fromBoc(Buffer.from(bocHex, "hex"))[0];

  console.log("Serialized cell:", cell.toString());

  // Deserialize the message
  console.log("Deserializing message...");
  const slice = cell.beginParse();
  const deserializedMessage = runtime.deserialize("Transaction", slice);

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

        // Handle BigInt objects in the output
        if (value instanceof BigInt) {
          return value.toString();
        }

        return value;
      },
      2
    )
  );
}

runExample().catch(console.error);
