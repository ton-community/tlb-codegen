export abstract class ASTRootBase {
  // If the `parent` field is `null` it means that we've reached the root node.
  // only `Program` has `parent` as null.
  // All other nodes have valid node parents.
  // We define `parent` while building the tree
  // in the intermediate represtantation.
  readonly parent!: ASTBase | null

  // Node locations, start with `{ 1, 1 }`
  readonly locations!: {
    readonly line: number,
    readonly column: number,
  }

  // Attributes of this node, required for `walk` function, don't use directly.
  static readonly _attributes: string[] = []
}

export abstract class ASTBase extends ASTRootBase {
  override readonly parent!: ASTBase
}

export class Program extends ASTRootBase {
  static override readonly _attributes: string[] = ['declarations']
  override readonly parent: null = null

  constructor(
    readonly declarations: Declaration[],
  ) {
    super()
  }
}

export class Declaration extends ASTBase {
  static override readonly _attributes: string[] = [
    'constructorDef', 'fields', 'combinator',
  ]

  constructor(
    readonly constructorDef: Constructor,
    readonly fields: FieldDefinition[],
    readonly combinator: Combinator,
  ) {
    super()
  }
}

export class Constructor extends ASTBase {
  constructor(
    readonly name: string,
    readonly tag: string | null,
  ) {
    super()
  }

  getTagType(): 'binary' | 'hex' | null {
    if (this.tag === null) {
      return null
    }
    return this.tag.startsWith('$') ? 'binary' : 'hex'
  }
}

// Fields
// ------

export type FieldDefinition =
  | FieldBuiltinDef
  | FieldCurlyExprDef
  | FieldAnonymousDef
  | FieldNamedDef
  | FieldExprDef

export abstract class Field extends ASTBase {}

export const FieldBuiltinType = ['#', 'Type'] as const

export class FieldBuiltinDef extends Field {
  constructor(
    readonly name: string,
    readonly type: typeof FieldBuiltinType[number],
  ) {
    super()
  }
}

export class FieldCurlyExprDef extends Field {
  static override readonly _attributes: string[] = ['expr']

  constructor(
    readonly expr: Expression,
  ) {
    super()
  }
}

// TODO: I am not sure that `name` is allowed. Maybe it can only be `_`
// See https://github.com/ton-blockchain/ton/issues/540
export class FieldAnonymousDef extends Field {
  static override readonly _attributes: string[] = ['fields']

  constructor(
    readonly name: string | null,
    readonly isRef: boolean,
    readonly fields: FieldDefinition[],
  ) {
    super()
  }
}

export class FieldNamedDef extends Field {
  static override readonly _attributes: string[] = ['expr']

  constructor(
    readonly name: string,
    readonly expr: CondExpr | TypeExpr,
  ) {
    super()
  }
}

export class FieldExprDef extends Field {
  static override readonly _attributes: string[] = ['expr']

  constructor(
    readonly expr: CondExpr,
  ) {
    super()
  }
}

// Combinators
// -----------

export class Combinator extends ASTBase {
  static override readonly _attributes: string[] = ['args']

  constructor(
    readonly name: string,
    readonly args: TypeExpr[],
  ) {
    super()
  }
}

// Expressions
// -----------

export abstract class Expression extends ASTBase {}

// TODO: add validation that `dotExpr` cannot be set without `condExpr`
export class CondExpr extends Expression {
  static override readonly _attributes: string[] = ['left', 'condExpr']

  constructor(
    readonly left: TypeExpr,
    readonly dotExpr: number | null,
    readonly condExpr: TypeExpr,
  ) {
    super()
  }
}

export const CompareOperator = ['<=', '>=', '!=', '=', '<', '>'] as const

export class CompareExpr extends Expression {
  static override readonly _attributes: string[] = ['left', 'right']

  constructor(
    readonly left: SimpleExpr,
    readonly op: typeof CompareOperator[number],
    readonly right: SimpleExpr,
  ) {
    super()
  }
}

// TypeExpr

export type TypeExpr =
  | CellRefExpr
  | BuiltinExpr
  | CombinatorExpr
  | SimpleExpr

export class CellRefExpr extends Expression {
  static override readonly _attributes: string[] = ['expr']

  constructor(
    readonly expr: Expression,
  ) {
    super()
  }
}

export class BuiltinExpr extends Expression {}

export const BuiltinOneArgOperators = ['#<=', '#<', '##'] as const

export class BuiltinOneArgExpr extends BuiltinExpr {
  static override readonly _attributes: string[] = ['arg']

  constructor(
    readonly name: typeof BuiltinOneArgOperators[number],
    readonly arg: Reference,
  ) {
    super()
  }
}

export const BuiltinZeroArgsOperators = ['#'] as const

export class BuiltinZeroArgs extends BuiltinExpr {
  constructor(
    readonly name: typeof BuiltinZeroArgsOperators[number],
  ) {
    super()
  }
}

export class CombinatorExpr extends Expression {
  static override readonly _attributes: string[] = ['args']

  constructor(
    readonly name: string,
    readonly args: TypeExpr[],
  ) {
    super()
  }
}

// SimpleExpr

export type SimpleExpr =
  | NegateExpr
  | MathExpr
  | Reference

export const MathOperator = ['*', '+'] as const

export class MathExpr extends Expression {
  static override readonly _attributes: string[] = ['left', 'right']

  // TODO: narrower type for `left` and `right`?
  // TODO: use `SimpleExpr` and `number`?
  constructor(
    readonly left: SimpleExpr,
    readonly op: typeof MathOperator[number],
    readonly right: SimpleExpr,
  ) {
    super()
  }
}

export class NegateExpr extends Expression {
  static override readonly _attributes: string[] = ['expr']

  constructor(
    readonly expr: Expression,
  ) {
    super()
  }
}

export class RefExpr extends Expression {}

export type Reference = NameExpr | NumberExpr

export class NameExpr extends RefExpr {
  constructor(
    readonly name: string,
  ) {
    super()
  }
}

export class NumberExpr extends RefExpr {
  constructor(
    readonly num: number,
  ) {
    super()
  }
}
