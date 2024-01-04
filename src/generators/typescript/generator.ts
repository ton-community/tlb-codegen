import {
  TLBCode,
  TLBConstructor,
  TLBField,
  TLBFieldType,
  TLBMathExpr,
  TLBType,
  TLBVariable,
} from "../../ast";
import {
  findNotReservedName,
  firstLower,
  getCurrentSlice,
  getSubStructName,
} from "../../utils";
import { CodeBuilder } from "../CodeBuilder";
import { CodeGenerator } from "../generator";
import { arrayedType, bitlenFunctionDecl, checkConstraintStmt, checkHasBitsForTag, checkKindStmt, checkTagExpr, coverFuncCall, inSeparateRef, loadExprForParam, loadFromNewSlice, loadFunctionParam, loadRefStmt, loadTupleExpr, negationDerivationFuncDecl, newCellStmt, returnSliceFunc, skipTagStmt, sliceLoad, storeCombinator, storeExprCond, storeExprForParam, storeExpressionNamedType, storeFunctionExpr, storeFunctionParam, storeFunctionStmt, storeInNewCell, storeRefObjectStmt, storeRefStmt, storeTagExpression, storeTupleStmt, tEqualExpression, typedSlice } from "./complex_expr";
import {
  BinaryExpression,
  Expression,
  GenDeclaration,
  ObjectProperty,
  Statement,
  StructDeclaration,
  TheNode,
  TypeExpression,
  TypeParametersExpression,
  TypedIdentifier,
  id,
  tComment,
  tExpressionStatement,
  tFunctionCall,
  tFunctionDeclaration,
  tIfStatement,
  tImportDeclaration,
  tMemberExpression,
  tObjectExpression,
  tObjectProperty,
  tReturnStatement,
  tStringLiteral,
  tStructDeclaration,
  tTernaryExpression,
  tTypeParametersExpression,
  tTypeWithParameters,
  tTypedIdentifier,
  tUnionTypeDeclaration,
  tUnionTypeExpression,
  toCode,
} from "./tsgen";
import {
  ExprForParam,
  FieldInfoType,
  addLoadProperty,
  convertToAST,
  getCondition,
  getParamVarExpr,
  getTypeParametersExpression,
  isBigInt,
} from "./utils";

export type ConstructorContext = {
  constructor: TLBConstructor;
  constructorLoadStatements: Statement[];
  constructorStoreStatements: Statement[];
  constructorProperties: TypedIdentifier[];
  constructorLoadProperties: ObjectProperty[];
  variableCombinatorName: string;
  variableSubStructName: string;
};

export class TypescriptGenerator implements CodeGenerator {
  jsCodeDeclarations: GenDeclaration[] = [];
  jsCodeConstructorDeclarations: GenDeclaration[] = [];
  jsCodeFunctionsDeclarations: GenDeclaration[] = [];
  tlbCode: TLBCode;

  constructor(tlbCode: TLBCode) {
    this.tlbCode = tlbCode;
  }

  addTonCoreClassUsage(name: string) {
    this.jsCodeDeclarations.push(
      tImportDeclaration(id(name), tStringLiteral("ton"))
    );
  }
  addBitLenFunction() {
    this.jsCodeDeclarations.push(bitlenFunctionDecl());
  }
  addTlbType(tlbType: TLBType): void {
    let variableCombinatorName = findNotReservedName(
      firstLower(tlbType.name),
      "0"
    );
    let typeUnion: TypeExpression[] = [];
    let constructorsDeclarations: StructDeclaration[] = [];

    let loadStatements: Statement[] = [];
    let storeStatements: Statement[] = [];

    let structTypeParametersExpr: TypeParametersExpression =
      tTypeParametersExpression([]);

    tlbType.constructors.forEach((constructor) => {
      let constructorTypeName: string = getSubStructName(tlbType, constructor);

      let ctx: ConstructorContext = {
        constructor: constructor,
        variableSubStructName: findNotReservedName(
          firstLower(constructorTypeName),
          "_" + constructor.name
        ),
        variableCombinatorName: variableCombinatorName,
        constructorLoadStatements: [],
        constructorLoadProperties: [
          tObjectProperty(id("kind"), tStringLiteral(constructorTypeName)),
        ],
        constructorProperties: [
          tTypedIdentifier(id("kind"), tStringLiteral(constructorTypeName)),
        ],
        constructorStoreStatements: [],
      };

      structTypeParametersExpr = getTypeParametersExpression(
        constructor.parameters
      );

      let slicePrefix: number[] = [0];

      constructor.variables.forEach((variable) => {
        this.addVarToConstructorLoadProperty(variable, ctx, constructor);
      });

      constructor.fields.forEach((field) => {
        this.handleField(field, slicePrefix, ctx);
      });

      typeUnion.push(
        tTypeWithParameters(id(constructorTypeName), structTypeParametersExpr)
      );

      let structX = tStructDeclaration(
        id(constructorTypeName),
        ctx.constructorProperties,
        structTypeParametersExpr
      );

      constructor.constraints.forEach((constraint) => {
        this.genCodeForConstraint(
          constraint,
          variableCombinatorName,
          tlbType,
          ctx
        );
      });

      ctx.constructorLoadStatements.push(
        tReturnStatement(tObjectExpression(ctx.constructorLoadProperties))
      );
      loadStatements = this.constructorStmtsToTypeStmts(
        constructor,
        tlbType,
        ctx,
        loadStatements
      );

      if (constructor.tag.bitLen != 0) {
        ctx.constructorStoreStatements.splice(
          0,
          0,
          storeTagExpression(constructor.tag)
        );
      }

      let storeStatement: Statement = storeFunctionStmt(
        ctx.constructorStoreStatements
      );

      if (tlbType.constructors.length > 1) {
        storeStatement = checkKindStmt(
          variableCombinatorName,
          constructorTypeName,
          storeStatement
        );
      }
      storeStatements.push(storeStatement);

      constructorsDeclarations.push(structX);

      this.jsCodeFunctionsDeclarations.push(tComment(constructor.declaration));
    });

    this.addExceptionStmts(tlbType, loadStatements, storeStatements);

    let loadFunctionParameters = typedSlice();
    const currentType = tTypeWithParameters(
      id(tlbType.name),
      structTypeParametersExpr
    );
    let storeFunctionParameters = [
      tTypedIdentifier(id(variableCombinatorName), currentType),
    ];

    this.addFunctionParameters(
      tlbType,
      loadFunctionParameters,
      storeFunctionParameters
    );

    let loadFunction = tFunctionDeclaration(
      id("load" + tlbType.name),
      structTypeParametersExpr,
      currentType,
      loadFunctionParameters,
      loadStatements
    );

    let storeFunction = tFunctionDeclaration(
      id("store" + tlbType.name),
      structTypeParametersExpr,
      id("(builder: Builder) => void"),
      storeFunctionParameters,
      storeStatements
    );

    if (tlbType.constructors.length > 1) {
      this.jsCodeConstructorDeclarations.push(
        tUnionTypeDeclaration(currentType, tUnionTypeExpression(typeUnion))
      );
    }
    constructorsDeclarations.forEach((element) => {
      this.jsCodeConstructorDeclarations.push(element);
    });

    this.jsCodeFunctionsDeclarations.push(loadFunction);
    this.jsCodeFunctionsDeclarations.push(storeFunction);
  }

  private addFunctionParameters(
    tlbType: TLBType,
    loadFunctionParameters: TypedIdentifier[],
    storeFunctionParameters: TypedIdentifier[]
  ) {
    let anyConstructor = tlbType.constructors[0];
    if (anyConstructor) {
      anyConstructor.parameters.forEach((element) => {
        if (element.variable.type == "Type") {
          loadFunctionParameters.push(loadFunctionParam(element.variable.name));

          storeFunctionParameters.push(
            storeFunctionParam(element.variable.name)
          );
        }
        if (element.variable.type == "#" && !element.variable.negated) {
          if (element.argName) {
            loadFunctionParameters.push(
              tTypedIdentifier(id(element.argName), id("number"))
            );
          } else {
            loadFunctionParameters.push(
              tTypedIdentifier(id(element.variable.name), id("number"))
            );
          }
        }
      });
    } else {
      throw new Error(
        `Type ${tlbType.name} should have at least one constructor`
      );
    }
  }

  private addExceptionStmts(
    tlbType: TLBType,
    loadStatements: Statement[],
    storeStatements: Statement[]
  ) {
    let exceptionTypesComment = tlbType.constructors
      .map((constructor) => {
        return `"${getSubStructName(tlbType, constructor)}"`;
      })
      .join(", ");
    let exceptionComment = tExpressionStatement(
      id(
        "throw new Error('" +
          `Expected one of ${exceptionTypesComment} in loading "${tlbType.name}", but data does not satisfy any constructor` +
          "')"
      )
    );
    if (
      tlbType.constructors.length > 1 ||
      tlbType.constructors.at(0)?.tag.bitLen != 0
    ) {
      loadStatements.push(exceptionComment);
    }
    if (tlbType.constructors.length > 1) {
      storeStatements.push(exceptionComment);
    }
  }

  private constructorStmtsToTypeStmts(
    constructor: TLBConstructor,
    tlbType: TLBType,
    ctx: ConstructorContext,
    loadStatements: Statement[]
  ) {
    if (constructor.tag.bitLen != 0 || tlbType.constructors.length > 1) {
      let conditions: Array<BinaryExpression> = [];
      if (constructor.tag.bitLen != 0) {
        conditions.push(checkHasBitsForTag(constructor.tag.bitLen));
        conditions.push(checkTagExpr(constructor.tag));
        let loadBitsStatement: Statement[] = [
          skipTagStmt(constructor.tag.bitLen),
        ];
        ctx.constructorLoadStatements = loadBitsStatement.concat(
          ctx.constructorLoadStatements
        );
      }
      constructor.parameters.forEach((param) => {
        if (param.variable.isConst && !param.variable.negated) {
          let argName = param.variable.name;
          if (param.argName) {
            argName = param.argName;
          }
          conditions.push(
            tEqualExpression(id(argName), getParamVarExpr(param, constructor))
          );
        }
      });
      loadStatements.push(
        tIfStatement(getCondition(conditions), ctx.constructorLoadStatements)
      );
    } else {
      loadStatements = loadStatements.concat(ctx.constructorLoadStatements);
    }
    return loadStatements;
  }

  private genCodeForConstraint(
    constraint: TLBMathExpr,
    variableCombinatorName: string,
    tlbType: TLBType,
    ctx: ConstructorContext
  ) {
    let loadConstraintAST = convertToAST(constraint, ctx.constructor);
    let storeConstraintAST = convertToAST(
      constraint,
      ctx.constructor,
      id(variableCombinatorName)
    );
    let exceptionCommentLastPart = ` is not satisfied while loading "${getSubStructName(
      tlbType,
      ctx.constructor
    )}" for type "${tlbType.name}"`;
    ctx.constructorLoadStatements.push(
      checkConstraintStmt(loadConstraintAST, exceptionCommentLastPart)
    );
    ctx.constructorStoreStatements.push(
      checkConstraintStmt(storeConstraintAST, exceptionCommentLastPart)
    );
  }

  private addVarToConstructorLoadProperty(
    variable: TLBVariable,
    ctx: ConstructorContext,
    constructor: TLBConstructor
  ) {
    let varExpr = undefined;

    if (variable.negated) {
      if (variable.deriveExpr) {
        varExpr = convertToAST(variable.deriveExpr, constructor);
      }
    }

    if (variable.type == "#" && !variable.isField) {
      ctx.constructorProperties.push(
        tTypedIdentifier(id(variable.name), id("number"))
      );
      let parameter = constructor.parametersMap.get(variable.name);
      if (
        parameter &&
        !parameter.variable.isConst &&
        !parameter.variable.negated
      ) {
        varExpr = getParamVarExpr(parameter, constructor);
      }
    }

    if (varExpr) {
      ctx.constructorLoadProperties.push(
        tObjectProperty(id(variable.name), varExpr)
      );
    }
  }

  toCode(node: TheNode, code: CodeBuilder = new CodeBuilder()): CodeBuilder {
    return toCode(node, code);
  }

  handleField(
    field: TLBField,
    slicePrefix: Array<number>,
    ctx: ConstructorContext
  ) {
    let currentSlice = getCurrentSlice(slicePrefix, "slice");
    let currentCell = getCurrentSlice(slicePrefix, "cell");

    if (field.subFields.length > 0) {
      inSeparateRef(slicePrefix, () => {
        ctx.constructorLoadStatements.push(
          sliceLoad(slicePrefix, currentSlice)
        );
        ctx.constructorStoreStatements.push(newCellStmt(slicePrefix));

        field.subFields.forEach((fieldDef) => {
          this.handleField(fieldDef, slicePrefix, ctx);
        });

        ctx.constructorStoreStatements.push(
          storeRefStmt(slicePrefix, currentCell)
        );
      });
    }

    if (field.fieldType.kind == "TLBExoticType") {
      inSeparateRef(slicePrefix, () => {
        ctx.constructorLoadStatements.push(
          loadRefStmt(slicePrefix, currentSlice)
        );
        addLoadProperty(
          field.name,
          id(getCurrentSlice(slicePrefix, "cell")),
          undefined,
          ctx
        );
        ctx.constructorProperties.push(
          tTypedIdentifier(id(field.name), id("Cell"))
        );
        ctx.constructorStoreStatements.push(
          storeRefObjectStmt(currentCell, ctx, field)
        );
      });
    } else if (field.subFields.length == 0) {
      if (field == undefined) {
        throw new Error("");
      }
      let fieldInfo = this.handleType(
        field,
        field.fieldType,
        true,
        ctx,
        slicePrefix,
        0
      );
      if (fieldInfo.loadExpr) {
        addLoadProperty(
          field.name,
          fieldInfo.loadExpr,
          fieldInfo.typeParamExpr,
          ctx
        );
      }
      if (fieldInfo.typeParamExpr) {
        ctx.constructorProperties.push(
          tTypedIdentifier(id(field.name), fieldInfo.typeParamExpr)
        );
      }
      if (fieldInfo.storeExpr) {
        ctx.constructorStoreStatements.push(fieldInfo.storeExpr);
      }
      fieldInfo.negatedVariablesLoads.forEach((element) => {
        addLoadProperty(element.name, element.expression, undefined, ctx);
      });
    }
  }

  handleType(
    field: TLBField,
    fieldType: TLBFieldType,
    isField: boolean,
    ctx: ConstructorContext,
    slicePrefix: Array<number>,
    argIndex: number
  ): FieldInfoType {
    let currentSlice = getCurrentSlice(slicePrefix, "slice");
    let currentCell = getCurrentSlice(slicePrefix, "cell");

    let fieldName = field.name;
    let theSlice = "slice";
    let theCell = "builder";
    if (isField) {
      theSlice = currentSlice;
      theCell = currentCell;
    }
    let result: FieldInfoType = {
      typeParamExpr: undefined,
      loadExpr: undefined,
      loadFunctionExpr: undefined,
      storeExpr: undefined,
      storeExpr2: undefined,
      storeFunctionExpr: undefined,
      negatedVariablesLoads: [],
    };

    let exprForParam: ExprForParam | undefined;

    let storeExpr2: Statement | undefined;

    let insideStoreParameters: Expression[];

    insideStoreParameters = [
      tMemberExpression(id(ctx.variableCombinatorName), id(fieldName)),
    ]; // TODO: use only field
    let insideStoreParameters2: Expression[] = [id("arg")];

    if (fieldType.kind == "TLBNumberType") {
      exprForParam = {
        argLoadExpr: convertToAST(fieldType.bits, ctx.constructor),
        argStoreExpr: convertToAST(
          fieldType.storeBits,
          ctx.constructor,
          id(ctx.variableCombinatorName)
        ),
        paramType: "number",
        fieldLoadSuffix: fieldType.signed ? "Int" : "Uint",
        fieldStoreSuffix: fieldType.signed ? "Int" : "Uint",
      };
      if (isBigInt(fieldType)) {
        exprForParam.fieldLoadSuffix += "Big";
        exprForParam.paramType = "bigint";
      }
    } else if (fieldType.kind == "TLBBitsType") {
      exprForParam = {
        argLoadExpr: convertToAST(fieldType.bits, ctx.constructor),
        argStoreExpr: convertToAST(
          fieldType.bits,
          ctx.constructor,
          id(ctx.variableSubStructName)
        ),
        paramType: "BitString",
        fieldLoadSuffix: "Bits",
        fieldStoreSuffix: "Bits",
      };
    } else if (fieldType.kind == "TLBCellType") {
      exprForParam = {
        argLoadExpr: id(theSlice),
        argStoreExpr: id(theSlice),
        paramType: "Slice",
        fieldLoadSuffix: "Slice",
        fieldStoreSuffix: "Slice",
      };
    } else if (fieldType.kind == "TLBBoolType") {
      exprForParam = {
        argLoadExpr: undefined,
        argStoreExpr: undefined,
        paramType: "boolean",
        fieldLoadSuffix: "Boolean",
        fieldStoreSuffix: "Bit",
      };
    } else if (fieldType.kind == "TLBAddressType") {
      exprForParam = {
        argLoadExpr: undefined,
        argStoreExpr: undefined,
        paramType: "Address",
        fieldLoadSuffix: "Address",
        fieldStoreSuffix: "Address",
      };
    } else if (fieldType.kind == "TLBExprMathType") {
      result.loadExpr = convertToAST(fieldType.expr, ctx.constructor);
      result.storeExpr = tExpressionStatement(result.loadExpr);
    } else if (fieldType.kind == "TLBNegatedType") {
      let getParameterFunctionId = id(
        ctx.variableSubStructName + "_get_" + fieldType.variableName
      );
      if (field.fieldType.kind == "TLBNamedType") {
        let fieldTypeName = field.fieldType.name;
        this.jsCodeFunctionsDeclarations.push(
          negationDerivationFuncDecl(
            this.tlbCode,
            getParameterFunctionId,
            fieldName,
            fieldTypeName,
            argIndex
          )
        );
      }
      result.negatedVariablesLoads.push({
        name: fieldType.variableName,
        expression: tFunctionCall(getParameterFunctionId, [id(fieldName)]),
      });
    } else if (
      fieldType.kind == "TLBNamedType" &&
      fieldType.arguments.length == 0
    ) {
      let typeName = fieldType.name;
      result.typeParamExpr = id(typeName);
      if (isField) {
        result.loadExpr = tFunctionCall(id("load" + typeName), [id(theSlice)]);
        result.storeExpr = storeExpressionNamedType(
          typeName,
          insideStoreParameters,
          currentCell
        );
        storeExpr2 = storeExpressionNamedType(
          typeName,
          insideStoreParameters2,
          currentCell
        );
      } else {
        result.loadExpr = id("load" + typeName);
        result.storeExpr = tExpressionStatement(id("store" + typeName));
      }
    } else if (fieldType.kind == "TLBCondType") {
      let subExprInfo: FieldInfoType;
      let conditionExpr: Expression;
      subExprInfo = this.handleType(
        field,
        fieldType.value,
        true,
        ctx,
        slicePrefix,
        argIndex
      );
      conditionExpr = convertToAST(fieldType.condition, ctx.constructor);
      if (subExprInfo.typeParamExpr) {
        result.typeParamExpr = tUnionTypeExpression([
          subExprInfo.typeParamExpr,
          id("undefined"),
        ]);
      }
      if (subExprInfo.loadExpr) {
        result.loadExpr = tTernaryExpression(
          conditionExpr,
          subExprInfo.loadExpr,
          id("undefined")
        );
      }
      let currentParam = insideStoreParameters[0];
      let currentParam2 = insideStoreParameters2[0];
      if (currentParam && currentParam2 && subExprInfo.storeExpr) {
        result.storeExpr = storeExprCond(currentParam, subExprInfo.storeExpr);
        storeExpr2 = storeExprCond(currentParam2, subExprInfo.storeExpr);
      }
    } else if (fieldType.kind == "TLBMultipleType") {
      let arrayLength: Expression;
      let subExprInfo: FieldInfoType;
      arrayLength = convertToAST(fieldType.times, ctx.constructor);
      subExprInfo = this.handleType(
        field,
        fieldType.value,
        false,
        ctx,
        slicePrefix,
        argIndex
      );
      let currentParam = insideStoreParameters[0];
      let currentParam2 = insideStoreParameters2[0];
      if (subExprInfo.loadExpr) {
        result.loadExpr = loadTupleExpr(arrayLength, subExprInfo.loadExpr);
      }
      if (
        currentParam &&
        currentParam2 &&
        subExprInfo.typeParamExpr &&
        subExprInfo.storeExpr
      ) {
        if (subExprInfo.storeFunctionExpr && subExprInfo.storeExpr2) {
          result.storeExpr = storeTupleStmt(
            currentParam,
            subExprInfo.storeExpr2,
            subExprInfo.typeParamExpr
          );
          storeExpr2 = storeTupleStmt(
            currentParam2,
            subExprInfo.storeExpr2,
            subExprInfo.typeParamExpr
          );
        }
      }
      if (subExprInfo.typeParamExpr) {
        result.typeParamExpr = arrayedType(subExprInfo.typeParamExpr);
      }
    } else if (fieldType.kind == "TLBCellInsideType") {
      let currentCell = getCurrentSlice([1, 0], "cell");

      let subExprInfo: FieldInfoType;
      subExprInfo = this.handleType(
        field,
        fieldType.value,
        true,
        ctx,
        [1, 0],
        argIndex
      );
      if (subExprInfo.loadExpr) {
        result.typeParamExpr = subExprInfo.typeParamExpr;
        result.storeExpr = subExprInfo.storeExpr;
        result.negatedVariablesLoads = subExprInfo.negatedVariablesLoads;
        result.loadFunctionExpr = loadFromNewSlice(subExprInfo.loadExpr);
        result.loadExpr = tFunctionCall(result.loadFunctionExpr, [
          id(theSlice),
        ]);
      }
      if (subExprInfo.storeExpr) {
        result.storeExpr = storeInNewCell(currentCell, subExprInfo.storeExpr);
      }
      if (subExprInfo.storeExpr2) {
        storeExpr2 = storeInNewCell(currentCell, subExprInfo.storeExpr2);
      }
    } else if (fieldType.kind == "TLBNamedType" && fieldType.arguments.length) {
      let typeName = fieldType.name;

      let typeExpression: TypeParametersExpression = tTypeParametersExpression(
        []
      );
      let loadFunctionsArray: Array<Expression> = [];
      let storeFunctionsArray: Array<Expression> = [];
      let argIndex = -1;
      fieldType.arguments.forEach((arg) => {
        argIndex++;
        let subExprInfo = this.handleType(
          field,
          arg,
          false,
          ctx,
          slicePrefix,
          argIndex
        );
        if (subExprInfo.typeParamExpr) {
          typeExpression.typeParameters.push(subExprInfo.typeParamExpr);
        }
        if (subExprInfo.loadFunctionExpr) {
          loadFunctionsArray.push(subExprInfo.loadFunctionExpr);
        }
        if (subExprInfo.storeFunctionExpr) {
          storeFunctionsArray.push(subExprInfo.storeFunctionExpr);
        }
        result.negatedVariablesLoads = result.negatedVariablesLoads.concat(
          subExprInfo.negatedVariablesLoads
        );
      });
      result.typeParamExpr = tTypeWithParameters(id(typeName), typeExpression);

      let currentTypeParameters = typeExpression;

      let insideLoadParameters: Array<Expression> = [id(theSlice)];

      result.loadExpr = tFunctionCall(
        id("load" + typeName),
        insideLoadParameters.concat(loadFunctionsArray),
        currentTypeParameters
      );
      result.storeExpr = storeCombinator(
        typeName,
        insideStoreParameters,
        storeFunctionsArray,
        currentTypeParameters,
        theCell
      );
      storeExpr2 = storeCombinator(
        typeName,
        insideStoreParameters2,
        storeFunctionsArray,
        currentTypeParameters,
        theCell
      );
      if (exprForParam) {
        result.typeParamExpr = id(exprForParam.paramType);
      }
    }

    if (exprForParam) {
      if (
        exprForParam.paramType != "BitString" &&
        exprForParam.paramType != "Slice"
      ) {
        if (exprForParam.argStoreExpr) {
          insideStoreParameters.push(exprForParam.argStoreExpr);
          insideStoreParameters2.push(exprForParam.argStoreExpr);
        }
      }
      result.loadExpr = loadExprForParam(currentSlice, exprForParam);
      if (exprForParam.paramType == "Slice") {
        result.loadExpr = id(currentSlice);
        result.loadFunctionExpr = returnSliceFunc();
      }
      result.typeParamExpr = id(exprForParam.paramType);
      result.storeExpr = storeExprForParam(theCell, exprForParam, insideStoreParameters);
      storeExpr2 = storeExprForParam(theCell, exprForParam, insideStoreParameters2);
    }

    if (result.loadExpr && !result.loadFunctionExpr) {
        result.loadFunctionExpr = coverFuncCall(result.loadExpr);
    }
    if (result.storeExpr && !result.storeFunctionExpr) {
      if (!storeExpr2) {
        storeExpr2 = result.storeExpr;
      }
      if (result.typeParamExpr) {
        if (
          (result.storeExpr.type == "ExpressionStatement" &&
            result.storeExpr.expression.type == "FunctionCall") ||
          result.storeExpr.type == "MultiStatement"
        ) {
          result.storeFunctionExpr = storeFunctionExpr(result.typeParamExpr, storeExpr2);
        } else {
          if (result.storeExpr.type == "ExpressionStatement") {
            result.storeFunctionExpr = result.storeExpr.expression;
          }
        }
      }
    }

    result.storeExpr2 = storeExpr2;
    return result;
  }
}
