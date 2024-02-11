import {
  BuiltinOneArgExpr,
  BuiltinZeroArgs,
  CellRefExpr,
  CombinatorExpr,
  CondExpr,
  Declaration,
  FieldAnonymousDef,
  FieldDefinition,
  FieldExprDef,
  FieldNamedDef,
  MathExpr,
  NameExpr,
} from "@ton-community/tlb-parser";
import { TLBField } from "../ast";
import { getType } from "./handle_type";
import { TLBConstructorBuild, TLBTypeBuild } from "./utils";

function getField(
  field: FieldDefinition,
  constructor: TLBConstructorBuild,
  fieldIndex: string
): TLBField | undefined {
  if (field instanceof FieldAnonymousDef) {
    let result: TLBField = {
      name: "",
      anonymous: true,
      fieldType: { kind: "TLBBoolType" },
      subFields: [],
    };
    let currentFieldIndex = 0;
    field.fields.forEach((field) => {
      let subField = getField(
        field,
        constructor,
        fieldIndex + "_" + currentFieldIndex.toString()
      );
      if (subField) {
        result.subFields.push(subField);
      }
      currentFieldIndex++;
    });
    return result;
  }

  if (field instanceof FieldNamedDef || field instanceof FieldExprDef) {
    let fieldName: string;
    if (field instanceof FieldNamedDef) {
      fieldName = field.name;
    } else {
      fieldName = "anon" + fieldIndex;
    }
    if (
      field instanceof FieldExprDef &&
      field.expr instanceof NameExpr &&
      field.expr.name == "_"
    ) {
      return undefined;
    }

    if (field.expr instanceof CellRefExpr) {
      if (
        field.expr.expr instanceof CombinatorExpr &&
        (field.expr.expr.name == "MERKLE_UPDATE" ||
          field.expr.expr.name == "MERKLE_ROOT")
      ) {
        return {
          name: fieldName,
          anonymous: true,
          fieldType: { kind: "TLBExoticType" },
          subFields: [],
        };
      } else {
        let subField = getField(
          new FieldNamedDef(fieldName, field.expr.expr),
          constructor,
          fieldIndex + "_" + "0"
        );
        if (subField) {
          let result: TLBField = {
            name: fieldName,
            anonymous: true,
            fieldType: { kind: "TLBBoolType" },
            subFields: [subField],
          };
          return result;
        }
        return subField;
      }
    }

    if (
      field.expr instanceof CombinatorExpr ||
      field.expr instanceof NameExpr ||
      field.expr instanceof BuiltinZeroArgs ||
      field.expr instanceof BuiltinOneArgExpr ||
      field.expr instanceof MathExpr ||
      field.expr instanceof CondExpr
    ) {
      let fieldTypeName: string;
      if (field.expr instanceof MathExpr || field.expr instanceof CondExpr) {
        fieldTypeName = "";
      } else {
        fieldTypeName = field.expr.name;
      }
      let fieldInfo = getType(field.expr, constructor, fieldTypeName);
      return {
        name: fieldName,
        anonymous: !(field instanceof FieldNamedDef),
        fieldType: fieldInfo,
        subFields: [],
      };
    }
  }
  return undefined;
}

export function fillFields(
  typeItem: { declaration: Declaration; constructor: TLBConstructorBuild },
  tlbType: TLBTypeBuild
) {
  let constructor = typeItem.constructor;
  let declaration = typeItem.declaration;

  let fieldIndex = -1;

  declaration.fields.forEach((fieldDecl) => {
    fieldIndex++;
    let field = getField(fieldDecl, constructor, fieldIndex.toString());
    if (field != undefined) {
      constructor.fields.push(field);
    }
  });
}
