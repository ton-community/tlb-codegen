
import { BuiltinOneArgExpr, BuiltinZeroArgs, CellRefExpr, CombinatorExpr, CondExpr, Declaration, FieldAnonymousDef, FieldDefinition, FieldExprDef, FieldNamedDef, MathExpr, NameExpr } from '@igorivaniuk/tlb-parser/dist/ast/nodes';
import { TLBField } from "../ast";
import { firstLower, getSubStructName, goodVariableName } from "../utils";
import { getType } from "./handle_type";
import { TLBConstructorBuild, TLBTypeBuild } from "./utils";

export function getField(field: FieldDefinition, constructor: TLBConstructorBuild, fieldIndex: string): TLBField | undefined {
  if (field instanceof FieldAnonymousDef) {
    let result: TLBField = { name: '', anonymous: true, fieldType: { kind: 'TLBBoolType' }, subFields: [] };
    let currentFieldIndex = 0;
    field.fields.forEach(field => {
      let theFieldIndex = fieldIndex + '_' + currentFieldIndex.toString();
      let subfield = getField(field, constructor, theFieldIndex);
      if (subfield) {
        result.subFields.push(subfield)
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
      fieldName = 'anon' + fieldIndex;
    }
    if (field instanceof FieldExprDef && field.expr instanceof NameExpr && field.expr.name == '_') {
      return undefined;
    }

    if (field.expr instanceof CellRefExpr) {
      if (field.expr.expr instanceof CombinatorExpr && (field.expr.expr.name == 'MERKLE_UPDATE' || field.expr.expr.name == 'MERKLE_ROOT')) {
        return { name: fieldName, anonymous: true, fieldType: { kind: 'TLBExoticType' }, subFields: [] };
      } else {
        let theFieldIndex = fieldIndex + '_' + '0';
        let subfield = getField(new FieldNamedDef(fieldName, field.expr.expr), constructor, theFieldIndex)
        if (subfield) {
          let result: TLBField = { name: fieldName, anonymous: true, fieldType: { kind: 'TLBBoolType' }, subFields: [subfield] };
          return result;
        }
        return subfield
      }
    }

    if (field.expr instanceof CombinatorExpr || field.expr instanceof NameExpr || field.expr instanceof BuiltinZeroArgs || field.expr instanceof BuiltinOneArgExpr || field.expr instanceof MathExpr || field.expr instanceof CondExpr) {
      let tmpTypeName: string;
      if (field.expr instanceof MathExpr || field.expr instanceof CondExpr) {
        tmpTypeName = ''
      } else {
        tmpTypeName = field.expr.name;
      }
      let fieldInfo = getType(field.expr, constructor, tmpTypeName);
      return { name: fieldName, anonymous: !(field instanceof FieldNamedDef), fieldType: fieldInfo, subFields: [] };
    }
  }
  return undefined
}

export function fillFields(typeItem: { declaration: Declaration, constructor: TLBConstructorBuild }, tlbType: TLBTypeBuild) {
  let constructor = typeItem.constructor;
  let declaration = typeItem.declaration;

  let fieldIndex = -1;

  declaration.fields.forEach(fieldDecl => {
    fieldIndex++;
    let field = getField(fieldDecl, constructor, fieldIndex.toString())
    if (field != undefined) {
      constructor.fields.push(field)
    }
  })
}