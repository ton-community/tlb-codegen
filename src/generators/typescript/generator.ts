import {
  TLBCode,
  TLBConstructor,
  TLBField,
  TLBFieldType,
  TLBMathExpr,
  TLBNumberExpr,
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
import {
  arrayedType,
  bitlenFunctionDecl,
  checkConstraintStmt,
  checkHasBitsForTag,
  checkKindStmt,
  checkTagExpr,
  coverFuncCall,
  dictAugParse,
  dictAugTypeExpr,
  dictKeyExpr, dictLoadExpr,
  dictStoreStmt,
  dictTypeParamExpr,
  dictValueStore,
  inSeparateRef,
  loadExprForParam,
  loadFromNewSlice,
  loadFunctionParam,
  loadRefStmt,
  loadTupleExpr,
  negationDerivationFuncDecl,
  newCellStmt,
  returnSliceFunc,
  skipTagStmt,
  sliceLoad,
  storeCombinator,
  storeExprCond,
  storeExprForParam,
  storeExpressionNamedType,
  storeFunctionExpr,
  storeFunctionParam,
  storeFunctionStmt,
  storeInNewCell,
  storeRefObjectStmt,
  storeRefStmt,
  storeTagExpression,
  storeTupleStmt,
  tEqualExpression,
  typedSlice,
} from "./complex_expr";
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
  tCodeAsIs,
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
  toCode
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

/*

Example for variables location in generated code:

// bool_false$0 a:# b:(## 7) c:# = TwoConstructors;

// bool_true$1 b:# = TwoConstructors;



//---------<CodeGenerator::jsCodeDeclarations>-------------------------------------------

//---------<CodeGenerator::jsCodeConstructorDeclarations>--------------------------------
export type TwoConstructors ---<ConstructorContext::typeName>--- = TwoConstructors_bool_false ---<ConstructorContext::name>--- | TwoConstructors_bool_true ---<ConstructorContext::name>---;

//---------<TypescriptGenerator::addTlbType::constructorsDeclarations>-------------------

export interface TwoConstructors_bool_false ---<ConstructorContext::name>--- {
    //-------<ConstructorContext::Properties>--------------------------------------------
    readonly kind: 'TwoConstructors_bool_false';
    readonly a: number;
    readonly b: number;
    readonly c: number;
    //-------</ConstructorContext::Properties>-------------------------------------------
}

export interface TwoConstructors_bool_true ---<ConstructorContext::name>--- {
    //-------<ConstructorContext::Properties>--------------------------------------------
    readonly kind: 'TwoConstructors_bool_true';
    readonly b: number;
    //-------</ConstructorContext::Properties>-------------------------------------------
}
//---------</TypescriptGenerator::addTlbType::constructorsDeclarations>------------------
//---------</CodeGenerator::jsCodeConstructorDeclarations>-------------------------------

//---------<CodeGenerator::jsCodeFunctionsDeclarations>----------------------------------
export function loadTwoConstructors(slice: Slice): TwoConstructors {
    //---------<TypescriptGenerator::addTlbType::loadStatements>-------------------------
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b0))) {
        //------<ConstructorContext::LoadStatements>-------------------------------------
        slice.loadUint(1);
        let a: number = slice.loadUint(32);
        let b: number = slice.loadUint(7);
        let c: number = slice.loadUint(32);
        return {
            //------<ConstructorContext::loadProperties>---------------------------------
            kind: 'TwoConstructors_bool_false',
            a: a,
            b: b,
            c: c,
            //------</ConstructorContext::loadProperties>--------------------------------
        }
        //------</ConstructorContext::LoadStatements>------------------------------------

    }
    if (((slice.remainingBits >= 1) && (slice.preloadUint(1) == 0b1))) {
        //------<ConstructorContext::LoadStatements>-------------------------------------
        slice.loadUint(1);
        let b: number = slice.loadUint(32);
        return {
            //------<ConstructorContext::loadProperties>---------------------------------
            kind: 'TwoConstructors_bool_true',
            b: b,
            //------</ConstructorContext::loadProperties>--------------------------------

        }
        //------</ConstructorContext::LoadStatements>------------------------------------


    }
    throw new Error('Expected one of "TwoConstructors_bool_false", "TwoConstructors_bool_true" in loading "TwoConstructors", but data does not satisfy any constructor');
    //---------</TypescriptGenerator::addTlbType::loadStatements>------------------------
}


export function storeTwoConstructors(twoConstructors: TwoConstructors): (builder: Builder) => void {
    //---------<TypescriptGenerator::addTlbType::storeStatements>------------------------
    if ((twoConstructors.kind == 'TwoConstructors_bool_false')) {
        return ((builder: Builder) => {
            //--------<ConstructorContext::StoreStatements>------------------------------
            builder.storeUint(0b0, 1);
            builder.storeUint(twoConstructors.a, 32);
            builder.storeUint(twoConstructors.b, 7);
            builder.storeUint(twoConstructors.c, 32);
            //--------</ConstructorContext::StoreStatements>-----------------------------
        })

    }
    if ((twoConstructors.kind == 'TwoConstructors_bool_true')) {
        return ((builder: Builder) => {
            //--------<ConstructorContext::StoreStatements>------------------------------
            builder.storeUint(0b1, 1);
            builder.storeUint(twoConstructors.b, 32);
            //--------</ConstructorContext::StoreStatements>-----------------------------
        })

    }
    throw new Error('Expected one of "TwoConstructors_bool_false", "TwoConstructors_bool_true" in loading "TwoConstructors", but data does not satisfy any constructor');
    //---------</TypescriptGenerator::addTlbType::storeStatements>-----------------------
}

//---------</CodeGenerator::jsCodeFunctionsDeclarations>---------------------------------

//---------</CodeGenerator::jsCodeDeclarations>------------------------------------------


*/



export type ConstructorContext = {
  constructor: TLBConstructor;
  loadStatements: Statement[];
  storeStatements: Statement[];
  properties: TypedIdentifier[];
  loadProperties: ObjectProperty[];
  typeName: string;
  name: string;
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
      tImportDeclaration(id(name), tStringLiteral("@ton/core"))
    );
  }

  addBuiltinCode(): void {
    this.addBitLenFunction();
    this.addEmbeddedTypes();
    this.addCopyCellToBuilder();
  }

  addBitLenFunction() {
    this.jsCodeDeclarations.push(bitlenFunctionDecl());
  }

  addCopyCellToBuilder() {
    this.jsCodeDeclarations.push(tCodeAsIs(`export function copyCellToBuilder(from: Cell, to: Builder): void {
    let slice = from.beginParse();
    to.storeBits(slice.loadBits(slice.remainingBits));
    while (slice.remainingRefs) {
        to.storeRef(slice.loadRef());
    }
}`))  
  }

  addEmbeddedTypes() {
    this.jsCodeDeclarations.push(tCodeAsIs(`export interface Bool {
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

}`))
  }

  addTlbType(tlbType: TLBType): void {
    let typeName = findNotReservedName(
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
        name: findNotReservedName(
          firstLower(constructorTypeName),
          "_" + constructor.name
        ),
        typeName: typeName,
        loadStatements: [],
        loadProperties: [
          tObjectProperty(id("kind"), tStringLiteral(constructorTypeName)),
        ],
        properties: [
          tTypedIdentifier(id("kind"), tStringLiteral(constructorTypeName)),
        ],
        storeStatements: [],
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
        ctx.properties,
        structTypeParametersExpr
      );

      constructor.constraints.forEach((constraint) => {
        this.genCodeForConstraint(
          constraint,
          typeName,
          tlbType,
          ctx
        );
      });

      ctx.loadStatements.push(
        tReturnStatement(tObjectExpression(ctx.loadProperties))
      );
      loadStatements = this.constructorStmtsToTypeStmts(
        constructor,
        tlbType,
        ctx,
        loadStatements
      );

      if (constructor.tag.bitLen != 0) {
        ctx.storeStatements.splice(
          0,
          0,
          storeTagExpression(constructor.tag)
        );
      }

      let storeStatement: Statement = storeFunctionStmt(
        ctx.storeStatements
      );

      if (tlbType.constructors.length > 1) {
        storeStatement = checkKindStmt(
          typeName,
          constructorTypeName,
          storeStatement
        );
      }
      storeStatements.push(storeStatement);

      constructorsDeclarations.push(structX);

      this.jsCodeFunctionsDeclarations.push(tComment(constructor.declaration));
      this.jsCodeConstructorDeclarations.push(tComment(constructor.declaration));
    });

    this.addExceptionStmts(tlbType, loadStatements, storeStatements);

    let loadFunctionParameters = typedSlice();
    const currentType = tTypeWithParameters(
      id(tlbType.name),
      structTypeParametersExpr
    );
    let storeFunctionParameters = [
      tTypedIdentifier(id(typeName), currentType),
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
        ctx.loadStatements = loadBitsStatement.concat(
          ctx.loadStatements
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
        tIfStatement(getCondition(conditions), ctx.loadStatements)
      );
    } else {
      loadStatements = loadStatements.concat(ctx.loadStatements);
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
    ctx.loadStatements.push(
      checkConstraintStmt(loadConstraintAST, exceptionCommentLastPart)
    );
    ctx.storeStatements.push(
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
      ctx.properties.push(
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
      ctx.loadProperties.push(
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
        ctx.loadStatements.push(
          sliceLoad(slicePrefix, currentSlice)
        );
        ctx.storeStatements.push(newCellStmt(slicePrefix));

        field.subFields.forEach((fieldDef) => {
          this.handleField(fieldDef, slicePrefix, ctx);
        });

        ctx.storeStatements.push(
          storeRefStmt(slicePrefix, currentCell)
        );
      });
    }

    if (field.fieldType.kind == "TLBExoticType") {
      inSeparateRef(slicePrefix, () => {
        ctx.loadStatements.push(
          loadRefStmt(slicePrefix, currentSlice)
        );
        addLoadProperty(
          field.name,
          id(getCurrentSlice(slicePrefix, "cell")),
          undefined,
          ctx
        );
        ctx.properties.push(
          tTypedIdentifier(id(field.name), id("Cell"))
        );
        ctx.storeStatements.push(
          storeRefObjectStmt(currentCell, ctx, field)
        );
      });
    } else if (field.subFields.length == 0) {
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
        ctx.properties.push(
          tTypedIdentifier(id(field.name), fieldInfo.typeParamExpr)
        );
      }
      if (fieldInfo.storeStmtOutside) {
        ctx.storeStatements.push(fieldInfo.storeStmtOutside);
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
      storeStmtOutside: undefined,
      storeStmtInside: undefined,
      storeFunctionExpr: undefined,
      negatedVariablesLoads: [],
    };

    let exprForParam: ExprForParam | undefined;

    let storeParametersOutside: Expression[];

    storeParametersOutside = [
      tMemberExpression(id(ctx.typeName), id(fieldName)),
    ]; // TODO: use only field
    let storeParametersInside: Expression[] = [id("arg")];

    if (fieldType.kind == "TLBNumberType") {
      exprForParam = {
        argLoadExpr: convertToAST(fieldType.bits, ctx.constructor),
        argStoreExpr: convertToAST(
          fieldType.storeBits,
          ctx.constructor,
          id(ctx.typeName)
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
      if (fieldType.bits instanceof TLBNumberExpr && fieldType.bits.n == 1) {
        exprForParam = {
          argLoadExpr: undefined,
          argStoreExpr: undefined,
          paramType: "boolean",
          fieldLoadSuffix: "Bit",
          fieldStoreSuffix: "Bit"
        }
      } else {
        exprForParam = {
          argLoadExpr: convertToAST(fieldType.bits, ctx.constructor),
          argStoreExpr: convertToAST(
            fieldType.bits,
            ctx.constructor,
            id(ctx.name)
          ),
          paramType: "BitString",
          fieldLoadSuffix: "Bits",
          fieldStoreSuffix: "Bits",
        };
      }
    } else if (fieldType.kind == "TLBCellType") {
      exprForParam = {
        argLoadExpr: id(theSlice),
        argStoreExpr: id(theSlice),
        paramType: "Cell",
        fieldLoadSuffix: "Ref",
        fieldStoreSuffix: "Slice",
      };
      storeParametersOutside[0] = tFunctionCall(
        tMemberExpression(storeParametersOutside[0], id("beginParse")), 
        [id("true")]
      )
      storeParametersInside[0] = tFunctionCall(
        tMemberExpression(storeParametersInside[0], id("beginParse")), 
        [id("true")]
      )
    } else if (fieldType.kind == "TLBCoinsType") {
      exprForParam = {
        argLoadExpr: undefined,
        argStoreExpr: undefined,
        paramType: "bigint",
        fieldLoadSuffix: "Coins",
        fieldStoreSuffix: "Coins",
      };
    } else if (fieldType.kind == "TLBVarIntegerType") {
      exprForParam = {
        argLoadExpr: convertToAST(fieldType.n, ctx.constructor),
        argStoreExpr: convertToAST(
          fieldType.n,
          ctx.constructor,
          id(ctx.name)
        ),
        paramType: "bigint",
        fieldLoadSuffix: fieldType.signed ? "VarIntBig" : "VarUintBig",
        fieldStoreSuffix: fieldType.signed ? "VarInt" : "VarUint"
      }
    } else if (fieldType.kind == "TLBTupleType") {
      result.loadExpr = tFunctionCall(id("parseTuple"), [tFunctionCall(tMemberExpression(id("slice"), id('asCell')), [])]);
      result.typeParamExpr = id('TupleItem[]');
      result.storeStmtInside = tExpressionStatement(tFunctionCall(id('copyCellToBuilder'), [tFunctionCall(id('serializeTuple'), storeParametersInside), id('builder')]));
      result.storeStmtOutside = tExpressionStatement(tFunctionCall(id('copyCellToBuilder'), [tFunctionCall(id('serializeTuple'), storeParametersOutside), id('builder')]));
    } else if (fieldType.kind == "TLBAddressType") {
      if (fieldType.addrType == "Internal") {
        exprForParam = {
          argLoadExpr: undefined,
          argStoreExpr: undefined,
          paramType: "Address",
          fieldLoadSuffix: "Address",
          fieldStoreSuffix: "Address",
        };
      } else if (fieldType.addrType == "External") {
        exprForParam = {
          argLoadExpr: undefined,
          argStoreExpr: undefined,
          paramType: "ExternalAddress | null",
          fieldLoadSuffix: "MaybeExternalAddress",
          fieldStoreSuffix: "Address",
        };
      } else if (fieldType.addrType == "Any") {
        exprForParam = {
          argLoadExpr: undefined,
          argStoreExpr: undefined,
          paramType: "Address | ExternalAddress | null",
          fieldLoadSuffix: "AddressAny",
          fieldStoreSuffix: "Address"
        }
      } else {
        throw new Error("Address has type other than ['Internal', 'External', 'Any']")
      }
    } else if (fieldType.kind == "TLBExprMathType") {
      result.loadExpr = convertToAST(fieldType.expr, ctx.constructor);
      result.storeStmtOutside = tExpressionStatement(result.loadExpr);
    } else if (fieldType.kind == "TLBNegatedType") {
      let getParameterFunctionId = id(
        ctx.name + "_get_" + fieldType.variableName
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
        result.storeStmtOutside = storeExpressionNamedType(
          typeName,
          storeParametersOutside,
          currentCell
        );
        result.storeStmtInside = storeExpressionNamedType(
          typeName,
          storeParametersInside,
          currentCell
        );
      } else {
        result.loadExpr = id("load" + typeName);
        result.storeStmtOutside = tExpressionStatement(id("store" + typeName));
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
      let currentParamOutside = storeParametersOutside[0];
      let currentParamInside = storeParametersInside[0];
      if (currentParamOutside && currentParamInside && subExprInfo.storeStmtOutside) {
        result.storeStmtOutside = storeExprCond(currentParamOutside, subExprInfo.storeStmtOutside);
        result.storeStmtInside = storeExprCond(currentParamInside, subExprInfo.storeStmtOutside);
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
      let currentParamOutside = storeParametersOutside[0];
      let currentParamInside = storeParametersInside[0];
      if (subExprInfo.loadExpr) {
        result.loadExpr = loadTupleExpr(arrayLength, subExprInfo.loadExpr);
      }
      if (
        currentParamOutside &&
        currentParamInside &&
        subExprInfo.typeParamExpr &&
        subExprInfo.storeStmtOutside
      ) {
        if (subExprInfo.storeFunctionExpr && subExprInfo.storeStmtInside) {
          result.storeStmtOutside = storeTupleStmt(
            currentParamOutside,
            subExprInfo.storeStmtInside,
            subExprInfo.typeParamExpr
          );
          result.storeStmtInside = storeTupleStmt(
            currentParamInside,
            subExprInfo.storeStmtInside,
            subExprInfo.typeParamExpr
          );
        }
      }
      if (subExprInfo.typeParamExpr) {
        result.typeParamExpr = arrayedType(subExprInfo.typeParamExpr);
      }
    } else if (fieldType.kind == "TLBCellInsideType") {
      let currentCell = getCurrentSlice([1, 0], "cell");

      let subExprInfo: FieldInfoType = this.handleType(
        field,
        fieldType.value,
        true,
        ctx,
        [1, 0],
        argIndex
      );
      if (subExprInfo.loadExpr) {
        result.typeParamExpr = subExprInfo.typeParamExpr;
        result.storeStmtOutside = subExprInfo.storeStmtOutside;
        result.negatedVariablesLoads = subExprInfo.negatedVariablesLoads;
        result.loadFunctionExpr = loadFromNewSlice(subExprInfo.loadExpr);
        result.loadExpr = tFunctionCall(result.loadFunctionExpr, [
          id(theSlice),
        ]);
      }
      if (subExprInfo.storeStmtOutside) {
        result.storeStmtOutside = storeInNewCell(currentCell, subExprInfo.storeStmtOutside);
      }
      if (subExprInfo.storeStmtInside) {
        result.storeStmtInside = storeInNewCell(currentCell, subExprInfo.storeStmtInside);
      }
    } else if (fieldType.kind == "TLBHashmapType") {
      let keyForLoad: Expression = dictKeyExpr(fieldType.key, ctx);
      let keyForStore: Expression = dictKeyExpr(fieldType.key, ctx, ctx.typeName);
      let subExprInfo = this.handleType(field, fieldType.value, fieldType.extra != undefined, ctx, slicePrefix, argIndex);

      
      if (subExprInfo.typeParamExpr && subExprInfo.loadFunctionExpr && subExprInfo.storeFunctionExpr) {
        let valueStore: Expression;
        if (fieldType.extra && subExprInfo.loadExpr) {
          let extraInfo = this.handleType(field, fieldType.extra, true, ctx, slicePrefix, argIndex);
          if (extraInfo.typeParamExpr) {
            subExprInfo.typeParamExpr = dictAugTypeExpr(subExprInfo.typeParamExpr, extraInfo.typeParamExpr)
          }
          valueStore = dictValueStore(subExprInfo.typeParamExpr, subExprInfo.storeFunctionExpr, extraInfo.storeFunctionExpr)

          if (extraInfo.loadExpr) {
            result.loadExpr = dictLoadExpr(keyForLoad, dictAugParse(extraInfo.loadExpr, subExprInfo.loadExpr), currentSlice) 
          }
        } else {
          valueStore = dictValueStore(subExprInfo.typeParamExpr, subExprInfo.storeFunctionExpr)
          result.loadExpr = dictLoadExpr(keyForLoad, subExprInfo.loadFunctionExpr, currentSlice)  
        }
        result.typeParamExpr = dictTypeParamExpr(fieldType, subExprInfo.typeParamExpr) 
        result.storeStmtInside = dictStoreStmt(currentCell, storeParametersInside, keyForStore, valueStore)
        result.storeStmtOutside = dictStoreStmt(currentCell, storeParametersOutside, keyForStore, valueStore)
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
      result.storeStmtOutside = storeCombinator(
        typeName,
        storeParametersOutside,
        storeFunctionsArray,
        currentTypeParameters,
        theCell
      );
      result.storeStmtInside = storeCombinator(
        typeName,
        storeParametersInside,
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
        exprForParam.paramType != "Cell"
      ) {
        if (exprForParam.argStoreExpr) {
          storeParametersOutside.push(exprForParam.argStoreExpr);
          storeParametersInside.push(exprForParam.argStoreExpr);
        }
      }
      result.loadExpr = loadExprForParam(currentSlice, exprForParam);
      if (exprForParam.paramType == "Cell") {
        result.loadExpr = tFunctionCall(tMemberExpression(id(currentSlice), id('asCell')), []);
        result.loadFunctionExpr = returnSliceFunc();
      }
      result.typeParamExpr = id(exprForParam.paramType);
      result.storeStmtOutside = storeExprForParam(
        theCell,
        exprForParam,
        storeParametersOutside
      );
      result.storeStmtInside = storeExprForParam(
        theCell,
        exprForParam,
        storeParametersInside
      );
    }

    if (result.loadExpr && !result.loadFunctionExpr) {
      result.loadFunctionExpr = coverFuncCall(result.loadExpr);
    }
    if (result.storeStmtOutside && !result.storeFunctionExpr) {
      if (!result.storeStmtInside) {
        result.storeStmtInside = result.storeStmtOutside;
      }
      if (result.typeParamExpr) {
        if (
          (result.storeStmtOutside.type == "ExpressionStatement" &&
            result.storeStmtOutside.expression.type == "FunctionCall") ||
          result.storeStmtOutside.type == "MultiStatement"
        ) {
          result.storeFunctionExpr = storeFunctionExpr(
            result.typeParamExpr,
            result.storeStmtInside
          );
        } else {
          if (result.storeStmtOutside.type == "ExpressionStatement") {
            result.storeFunctionExpr = result.storeStmtOutside.expression;
          }
        }
      }
    }

    result.storeStmtInside = result.storeStmtInside;
    return result;
  }
}
