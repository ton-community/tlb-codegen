import { ast, Program } from "@ton-community/tlb-parser";
import {
  TLBCode,
  TLBType,
  TLBConstructor,
  TLBField,
  TLBFieldType,
  TLBMathExpr,
  TLBNumberExpr,
  TLBVarExpr,
  TLBBinaryOp,
  TLBParameter,
} from "../ast";
import { getTLBCodeByAST } from "../main";
import {
  Builder,
  Slice,
  Cell,
  beginCell,
  BitString,
  Address,
  ExternalAddress,
  Dictionary,
  parseTuple,
  serializeTuple,
} from "@ton/core";

// Interpreter to evaluate TLBMathExpr at runtime
export class MathExprEvaluator {
  private variables: Map<string, number>;

  constructor(variables: Map<string, number> = new Map()) {
    this.variables = variables;
  }

  evaluate(expr: TLBMathExpr): number {
    if (expr instanceof TLBNumberExpr) {
      return expr.n;
    }
    if (expr instanceof TLBVarExpr) {
      const value = this.variables.get(expr.x);
      if (value === undefined) {
        throw new Error(`Variable ${expr.x} is not defined`);
      }
      return value;
    }
    if (expr instanceof TLBBinaryOp) {
      const left = this.evaluate(expr.left);
      const right = this.evaluate(expr.right);
      switch (expr.operation) {
        case "+":
          return left + right;
        case "-":
          return left - right;
        case "*":
          return left * right;
        case "/":
          return Math.floor(left / right);
        case "%":
          return left % right;
        case "<<":
          return left << right;
        case ">>":
          return left >> right;
        case "&":
          return left & right;
        case "|":
          return left | right;
        case "^":
          return left ^ right;
        case "==":
          return left === right ? 1 : 0;
        case "!=":
          return left !== right ? 1 : 0;
        case "<":
          return left < right ? 1 : 0;
        case "<=":
          return left <= right ? 1 : 0;
        case ">":
          return left > right ? 1 : 0;
        case ">=":
          return left >= right ? 1 : 0;
        default:
          throw new Error(`Unknown operation: ${expr.operation}`);
      }
    }
    // TLBUnaryOp
    const value = this.evaluate((expr as any).value);
    const operation = (expr as any).operation;
    switch (operation) {
      case "-":
        return -value;
      case "~":
        return ~value;
      case "!":
        return value ? 0 : 1;
      default:
        throw new Error(`Unknown unary operation: ${operation}`);
    }
  }
}

// Runtime TL-B serialization/deserialization
export class TLBRuntime {
  private tlbCode: TLBCode;

  constructor(tlbCode: TLBCode) {
    this.tlbCode = tlbCode;
  }

  static fromTLB(tlbSource: string): TLBRuntime {
    const tree = ast(tlbSource);
    const tlbCode = getTLBCodeByAST(tree, tlbSource);
    return new TLBRuntime(tlbCode);
  }

  // Deserialize data from a Slice based on a TL-B type name
  deserialize(typeName: string, slice: Slice): any {
    const type = this.tlbCode.types.get(typeName);
    const types = this.tlbCode.types.keys();
    console.log(
      Array.from(types).filter((p) => p.toLowerCase().includes("transaction"))
    );
    if (!type) {
      throw new Error(`Type ${typeName} not found in TL-B schema`);
    }

    return this.deserializeType(type, slice);
  }

  // Serialize data to a Builder based on a TL-B type name
  serialize(typeName: string, data: any): Builder {
    const type = this.tlbCode.types.get(typeName);
    if (!type) {
      throw new Error(`Type ${typeName} not found in TL-B schema`);
    }

    const builder = beginCell();
    this.serializeType(type, data, builder);
    return builder;
  }

  private deserializeType(
    type: TLBType,
    slice: Slice,
    args: TLBFieldType[] = []
  ): any {
    // Try each constructor in the type
    console.log(type.constructors);
    for (const constructor of type.constructors) {
      try {
        // Save position to restore if the constructor doesn't match
        const bits = slice.remainingBits;
        const refs = slice.remainingRefs;

        // Check tag if present
        if (constructor.tag.bitLen > 0) {
          const preloadedTag = slice.preloadUint(constructor.tag.bitLen);
          const expectedTag = parseInt(constructor.tag.binary.slice(2), 2);
          if (preloadedTag !== expectedTag) {
            // Restore position and try next constructor
            // Reset bit position
            slice.skip(-bits + slice.remainingBits);

            // Reset refs by loading them if needed
            const refsToReset = -refs + slice.remainingRefs;
            for (let i = 0; i < refsToReset; i++) {
              slice.loadRef();
            }
            continue;
          }
          // Consume the tag
          slice.loadUint(constructor.tag.bitLen);
        }

        // Initialize variables map for constraint evaluation
        const variables = new Map<string, number>();

        // Deserialize fields
        let result: any = {
          kind: `${type.name}_${constructor.name}`,
        };

        for (const field of constructor.fields) {
          console.log(
            "result",
            result,
            "remaining bits",
            slice.remainingBits,
            "remaining refs",
            slice.remainingRefs,
            "field",
            field
          );

          // field.subFields.length
          if (field.subFields.length > 0) {
            const ref = slice.loadRef();
            const refSlice = ref.beginParse(true);
            const subfields: any = {};
            for (const subfield of field.subFields) {
              subfields[subfield.name] = this.deserializeField(
                subfield,
                refSlice,
                variables
              );
            }

            if (!field.anonymous) {
              result[field.name] = subfields;
            } else {
              result = { ...result, ...subfields };
            }
          } else {
            if (
              field.fieldType.kind === "TLBNamedType" &&
              constructor.parametersMap.get(field.fieldType.name)
            ) {
              const param = constructor.parametersMap.get(
                field.fieldType.name
              ) as TLBParameter;
              const paramIndex = constructor.parameters.findIndex(
                (p) => p.variable.name === param.variable.name
              );
              field.fieldType = args[paramIndex];
            }

            const fieldValue = this.deserializeField(field, slice, variables);

            if (!field.anonymous) {
              result[field.name] = fieldValue;
            }
          }
        }

        // Check constraints
        const evaluator = new MathExprEvaluator(variables);
        for (const constraint of constructor.constraints) {
          console.log("constraint", constraint);
          if (evaluator.evaluate(constraint) !== 1) {
            // Constraint failed, try next constructor
            // Reset bit position
            slice.skip(-bits + slice.remainingBits);

            // Reset refs by loading them if needed
            const refsToReset = -refs + slice.remainingRefs;
            for (let i = 0; i < refsToReset; i++) {
              slice.loadRef();
            }
            continue;
          }
        }

        return result;
      } catch (e) {
        // If deserialization fails, try the next constructor

        console.error(e);
        continue;
      }
    }

    throw new Error(
      `Failed to deserialize type ${type.name}: no matching constructor found`
    );
  }

  private deserializeField(
    field: TLBField,
    slice: Slice,
    variables: Map<string, number>
  ): any {
    return this.deserializeFieldType(field.fieldType, slice, variables);
  }

  private deserializeFieldType(
    fieldType: TLBFieldType,
    slice: Slice,
    variables: Map<string, number>
  ): any {
    const evaluator = new MathExprEvaluator(variables);

    switch (fieldType.kind) {
      case "TLBNumberType": {
        const bits = evaluator.evaluate(fieldType.bits);
        const value = slice.loadUint(bits);
        return fieldType.signed ? this.toSignedNumber(value, bits) : value;
      }

      case "TLBBoolType": {
        if (fieldType.value !== undefined) {
          return fieldType.value;
        }
        return slice.loadBit() === true;
      }

      case "TLBBitsType": {
        const bits = evaluator.evaluate(fieldType.bits);
        return slice.loadBits(bits);
      }

      case "TLBNamedType": {
        const type = this.tlbCode.types.get(fieldType.name);

        if (fieldType.name === "Bool") {
          return slice.loadBit() === true;
        }

        if (!type) {
          throw new Error(`Type ${fieldType.name} not found in TL-B schema`);
        }

        return this.deserializeType(type, slice, fieldType.arguments);
      }

      case "TLBCoinsType": {
        return slice.loadCoins();
      }

      case "TLBAddressType": {
        return slice.loadAddress();
      }

      case "TLBCellType": {
        return slice.loadRef();
      }

      case "TLBCellInsideType": {
        const ref = slice.loadRef();
        const refSlice = ref.beginParse();
        return this.deserializeFieldType(fieldType.value, refSlice, variables);
      }

      case "TLBHashmapType": {
        const keySize = evaluator.evaluate(fieldType.key.expr);
        const dict = slice.loadDict(Dictionary.Keys.BigInt(keySize), {
          serialize: () => {
            /* NO_USED */
          },
          parse: (slice) =>
            this.deserializeFieldType(
              fieldType.value,
              slice,
              new Map(variables)
            ),
        });
        return dict;
      }

      case "TLBVarIntegerType": {
        const size = evaluator.evaluate(fieldType.n);
        if (fieldType.signed) {
          return slice.loadVarIntBig(size);
        } else {
          return slice.loadVarUintBig(size);
        }
      }

      case "TLBMultipleType": {
        const times = evaluator.evaluate(fieldType.times);
        const result = [];
        for (let i = 0; i < times; i++) {
          result.push(
            this.deserializeFieldType(fieldType.value, slice, variables)
          );
        }
        return result;
      }

      case "TLBCondType": {
        const condition = evaluator.evaluate(fieldType.condition);
        if (condition) {
          return this.deserializeFieldType(fieldType.value, slice, variables);
        }
        return null;
      }

      case "TLBTupleType": {
        const cell = slice.loadRef();
        return parseTuple(cell);
      }

      default:
        throw new Error(`Unsupported field type: ${fieldType.kind}`);
    }
  }

  private serializeType(type: TLBType, data: any, builder: Builder): void {
    // Find matching constructor by kind
    const constructorName = data.kind.substring(type.name.length + 1); // Remove TypeName_ prefix

    const constructor = type.constructors.find(
      (c) => c.name === constructorName
    );
    if (!constructor) {
      throw new Error(
        `Constructor ${constructorName} not found for type ${type.name}`
      );
    }

    // Store tag if present
    if (constructor.tag.bitLen > 0) {
      const tag = parseInt(constructor.tag.binary, 2);
      builder.storeUint(tag, constructor.tag.bitLen);
    }

    // Initialize variables map for constraint evaluation
    const variables = new Map<string, number>();

    // Serialize fields
    for (const field of constructor.fields) {
      if (!field.anonymous) {
        this.serializeField(field, data[field.name], builder, variables);
      } else {
        // For anonymous fields, we need to extract from constraints or use default
        // This is a simplified approach, would need more complex logic for real cases
        this.serializeField(field, null, builder, variables);
      }
    }

    // Check constraints
    const evaluator = new MathExprEvaluator(variables);
    for (const constraint of constructor.constraints) {
      if (evaluator.evaluate(constraint) !== 1) {
        throw new Error(
          `Constraint failed for type ${type.name}, constructor ${constructor.name}`
        );
      }
    }
  }

  private serializeField(
    field: TLBField,
    value: any,
    builder: Builder,
    variables: Map<string, number>
  ): void {
    this.serializeFieldType(field.fieldType, value, builder, variables);
  }

  private serializeFieldType(
    fieldType: TLBFieldType,
    value: any,
    builder: Builder,
    variables: Map<string, number>
  ): void {
    const evaluator = new MathExprEvaluator(variables);

    switch (fieldType.kind) {
      case "TLBNumberType": {
        const bits = evaluator.evaluate(fieldType.bits);
        builder.storeUint(value, bits);
        break;
      }

      case "TLBBoolType": {
        if (fieldType.value !== undefined) {
          // Fixed value, nothing to store
          break;
        }
        builder.storeBit(value ? 1 : 0);
        break;
      }

      case "TLBBitsType": {
        const bits = evaluator.evaluate(fieldType.bits);
        // TODO: check if value is a bitstring
        // builder.storeBits(value, bits);
        builder.storeBits(value);
        break;
      }

      case "TLBNamedType": {
        const type = this.tlbCode.types.get(fieldType.name);
        if (!type) {
          throw new Error(`Type ${fieldType.name} not found in TL-B schema`);
        }
        this.serializeType(type, value, builder);
        break;
      }

      case "TLBCoinsType": {
        builder.storeCoins(value);
        break;
      }

      case "TLBAddressType": {
        builder.storeAddress(value);
        break;
      }

      case "TLBCellType": {
        builder.storeRef(value);
        break;
      }

      case "TLBCellInsideType": {
        const nestedBuilder = beginCell();
        this.serializeFieldType(
          fieldType.value,
          value,
          nestedBuilder,
          variables
        );
        builder.storeRef(nestedBuilder.endCell());
        break;
      }

      case "TLBHashmapType": {
        const keySize = evaluator.evaluate(fieldType.key.expr);
        const dict = Dictionary.empty(
          Dictionary.Keys.BigInt(keySize),
          Dictionary.Values.Cell()
        );

        if (value) {
          for (const [key, dictValue] of Object.entries(value)) {
            const valueBuilder = beginCell();
            this.serializeFieldType(
              fieldType.value,
              dictValue,
              valueBuilder,
              new Map(variables)
            );
            dict.set(BigInt(key), valueBuilder.endCell());
          }
        }

        builder.storeDict(dict);
        break;
      }

      case "TLBVarIntegerType": {
        const size = evaluator.evaluate(fieldType.n);
        if (fieldType.signed) {
          builder.storeVarInt(value, size);
        } else {
          builder.storeVarUint(value, size);
        }
        break;
      }

      case "TLBMultipleType": {
        const times = evaluator.evaluate(fieldType.times);
        for (let i = 0; i < times; i++) {
          this.serializeFieldType(
            fieldType.value,
            value[i],
            builder,
            variables
          );
        }
        break;
      }

      case "TLBCondType": {
        const condition = evaluator.evaluate(fieldType.condition);
        if (condition) {
          this.serializeFieldType(fieldType.value, value, builder, variables);
        }
        break;
      }

      case "TLBTupleType": {
        const cell = serializeTuple(value);
        builder.storeRef(cell);
        break;
      }

      default:
        throw new Error(`Unsupported field type: ${fieldType.kind}`);
    }
  }

  private toSignedNumber(value: number, bits: number): number {
    const maxUnsigned = 1 << bits;
    const signBit = 1 << (bits - 1);

    if (value & signBit) {
      return value - maxUnsigned;
    }

    return value;
  }
}

// Export a simple API for users
export function parseTLB(schema: string): TLBRuntime {
  return TLBRuntime.fromTLB(schema);
}

export { Builder, Slice, Cell, beginCell };
