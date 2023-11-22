
export type Maybe<TheType> = {
	value: TheType;
};

export function loadMaybe<TheType>(slice: Slice, loadTheType: (slice: Slice) => TheType): Maybe<TheType> {
	return {
		value: loadTheType(slice)
	};
}

export function storeMaybe<TheType>(maybe: Maybe<TheType>, storeSubType: (TheType: TheType) => ((builder: Builder) => void)): Builder {
	return (builder: Builder) => {
		storeSubType(maybe.value)(builder);
	};
}

export type TheJust = {
	x: Maybe<number>
};

function loadTheNumber(slice: Slice): number {
	return slice.loadUint(32);
}

function storeTheNumber(n: number): ((builder: Builder) => void) {
	return (builder: Builder) =>  {
		builder.storeUint(n, 32);
	}
}

export function loadTheJust(slice: Slice): TheJust {
	return {
		x: loadMaybe<number>(slice, loadTheNumber)
	};
}
export function storeTheJust(theJust: TheJust): Builder {
	return (builder: Builder) => {
		storeMaybe<number>(theJust.x, storeTheNumber)(builder);
	};
}



export type Example = {
	value: number;
	x: number;
};
export function loadExample(slice: Slice, x: number): Example {
	return {
		value: slice.loadUint(x),
		x: x
	};
}
export function storeExample(example: Example): Builder {
	return (builder: Builder) => {
		builder.storeUint(example.value, example.x)
	};
}

export type BitInteger = {
	e: Example;
};
export function loadBitInteger(slice: Slice): BitInteger {
	return {
		e: loadExample(slice, 4)
	};
}
export function storeBitInteger(bitInteger: BitInteger): Builder {
	return (builder: Builder) => {
		storeExample(bitInteger.e)(builder);
	};
}



export type Example2 = {
	value: number;
	x: number;
};
export function loadExample2(slice: Slice, x: number): Example {
	return {
		value: slice.loadUint(x / 2),
		x: x / 2
	};
}
export function storeExample2(example: Example2): Builder {
	return (builder: Builder) => {
		builder.storeUint(example.value, example.x)
	};
}

export type BitInteger2 = {
	e: Example2;
};
export function loadBitInteger2(slice: Slice): BitInteger2 {
	return {
		e: loadExample2(slice, 4)
	};
}
export function storeBitInteger2(bitInteger: BitInteger2): Builder {
	return (builder: Builder) => {
		storeExample2(bitInteger.e)(builder);
	};
}



export type Unary = Unary_unary_zero | Unary_unary_succ;
export type Unary_unary_zero = {

};
export type Unary_unary_succ = {
	n: number;
	x: Unary;
};

export function loadUnary(slice: Slice, n: number): Unary {
	if (slice.preloadUint(1) == 0b0) {
		return {

		};
	};
	if (slice.preloadUint(1) == 0b1) {
		return {
			n: n - 1,
			x: loadUnary(slice, n - 1)
		};
	};
	return {}
}
export function storeUnary(unary: Unary): Builder {
	if (unary instanceof Unary_unary_zero) {
		return (builder: Builder) => {
			builder.storeUint(0b0, 1);
		};
	};
	if (unary instanceof Unary_unary_succ) {
		return (builder: Builder) => {
			builder.storeUint(0b1, 1);
			storeUnary(unary.x)(builder);
		};
	};
}


//a$_ t:# ^[ a:(## 32) ^[e:#] ^[ b:(## 32) d:# ^[ c:(## 32) ] ] ] = A;

export function loadA(slice: Slice): A {
	let slice1 = slice.loadRef().beginParse();
	let slice11 = slice1.loadRef().beginParse();
	let slice12 = slice1.loadRef().beginParse();
	let slice121 = slice12.loadRef().beginParse();
	return {
		t: slice.loadUint(32),
		a: slice1.loadUint(32),
		e: slice11.loadUint(32),
		b: slice12.loadUint(32),
		d: slice12.loadUint(32),
		c: slice121.loadUint(32)
	};
}



<ref *1> FieldAnonymousDef {
	name: null,
	isRef: true,
	fields: [
		FieldNamedDef {
			name: 'a',
			expr: [BuiltinOneArgExpr],
			locations: [Object],
			parent: [Circular *1]
		},
		FieldAnonymousDef {
			name: null,
			isRef: true,
			fields: [Array],
			locations: [Object],
			parent: [Circular *1]
		},
		FieldAnonymousDef {
			name: null,
			isRef: true,
			fields: [Array],
			locations: [Object],
			parent: [Circular *1]
		}
	]
}



export function storeA(a: A): (builder: Builder) => void {
	return (builder: Builder) => {
		let cell1 = beginCell();
		let cell2 = beginCell();
		let cell21 = beginCell();
		let cell22 = beginCell();
		let cell221 = beginCell();

		builder.storeUint(a.t, 32);
		cell1.storeUint(a.q, 32);
		cell2.storeUint(a.a, 32);
		cell21.storeUint(a.e, 32);
		cell22.storeUint(a.b, 32);
		cell22.storeUint(a.d, 32);
		cell221.storeUint(a.c, 32);

		cell22.storeRef(cell221);
		cell2.storeRef(cell21);
		cell2.storeRef(cell22);
		builder.storeRef(cell1);
		builder.storeRef(cell2);
	};
}

export function loadIntEx(slice: Slice): IntEx {
	let slice1 = slice.loadRef().beginParse();
	let a = slice.loadUint(257);
	let b = slice1.loadBits(1023);
	let c = slice.loadUint(256);
	let d = slice.loadInt(73);
	let e = slice.loadUint(89);
	let g = slice.loadBits(10);
	let h = slice.loadUint(e * 8);
	return {
		a: a,
		b: b,
		c: c,
		d: d,
		e: e,
		g: g,
		h: h
	};
}




export type IntexArg = {
	a: IntEx<number>;
};
export function loadIntexArg(slice: Slice): IntexArg {
	return {
		a: loadIntEx(slice, (slice: Slice) => {return slice.loadUint(22);})
	};
}


export function storeIntexArg(intexArg: IntexArg): (builder: Builder) => void {
	return (builder: Builder) => {
		storeIntEx(intexArg.a, (arg: number) => {return (builder: Builder) => {builder.storeUint(arg, 22);}})(builder);
	};
}

let x;
x = a;


export function loadUnary(slice: Slice): Unary {
	if (slice.preloadUint(1) == 0b0) {
		return {
			kind: 'Unary_unary_zero'
		};
	};
	if (slice.preloadUint(1) == 0b1) {
		let x = loadUnary(slice);
		return {
			kind: 'Unary_unary_succ',
			n: x.n + 1,
			x: x
		};
	};
	throw new Error('');
}

export type ParamDifNames = ParamDifNames_a | ParamDifNames_b | ParamDifNames_c;
export type ParamDifNames_a = {
  	kind: 'ParamDifNames_a';
  };
export type ParamDifNames_b = {
  	kind: 'ParamDifNames_b';
	n: number;
	x: ParamDifNames;
  };
export type ParamDifNames_c = {
  	kind: 'ParamDifNames_c';
	m: number;
	x: ParamDifNames;
};


function paramDifNames_b_get_n(paramDifNames: ParamDifNames): number {
	if (paramDifNames.kind == 'ParamDifNames_a') {
		return 0;
	}
	if (paramDifNames.kind == 'ParamDifNames_b') {
		return paramDifNames.n + 1;
	}
	if (paramDifNames.kind == 'ParamDifNames_c') {
		return paramDifNames.m * 2;
	}
	throw new Error('Cannot identify n for ParamDifNames:b')
}

function paramDifNames_c_get_m(paramDifNames: ParamDifNames): number {
	if (paramDifNames.kind == 'ParamDifNames_a') {
		return 0;
	}
	if (paramDifNames.kind == 'ParamDifNames_b') {
		return paramDifNames.n + 1;
	}
	if (paramDifNames.kind == 'ParamDifNames_c') {
		return paramDifNames.m * 2;
	}
	throw new Error('Cannot identify n for ParamDifNames:c')
}

export function loadParamDifNames(slice: Slice, arg0: number): ParamDifNames {
  	if (slice.preloadUint(1) == 0b0 && arg0 == 1) {
  		return {
  			kind: 'ParamDifNames_a',
  		};
  	};
	if (slice.preloadUint(1) == 0b1 && arg0 == 2) {
  		let x: ParamDifNames = loadParamDifNames(slice, 2);
		return {
  			kind: 'ParamDifNames_b',
			n: paramDifNames_b_get_n(x),
			x: x,
  		};
  	};
	if (slice.preloadUint(1) == 0b0 && arg0 == 3) {
  		let x: ParamDifNames = loadParamDifNames(slice, 3);
		return {
  			kind: 'ParamDifNames_c',
			m: paramDifNames_c_get_m(x),
			x: x,
  		};
  	};
	throw new Error('');
  }



export type ManyComb = {
	kind: 'ManyComb';
	y: OneComb<OneComb<OneComb<number>>>;
};
export function loadManyComb(slice: Slice): ManyComb {
	let uint3 = () => { return slice.loadUint(3); };
	let oneCombUint3 = () => loadOneComb(slice, uint3)
	let oneCombOneCombUint3 = () => loadOneComb(slice, oneCombUint3);
	let oneCombOneCombOneCombUint3 = loadOneComb(slice, oneCombOneCombUint3);
	let y = oneCombOneCombOneCombUint3;
	return {
		kind: 'ManyComb',
		y: y
	};
}
export function storeManyComb(manyComb: ManyComb): (builder: Builder) => void {
	return (builder: Builder) => {
		let storeUint3 = (arg: number) => {
			return (builder: Builder) => {
				builder.storeUint(arg, 3);
			};
		}
		let storeOneCombUint3 = () => {
			return (builder: Builder) => {
				storeOneComb<number>(manyComb.y.x.x, storeUint3)(builder);
			};
		}
		let storeOneCombOneCombUint3 = () => {
			return (builder: Builder) => {
				storeOneComb<OneComb<number>>(manyComb.y.x, storeOneCombUint3)(builder);
			};
		}
		let storeOneCombOneCombOneCombUint3 = () => {
			return (builder: Builder) => {
				storeOneComb<OneComb<OneComb<number>>>(manyComb.y, storeOneCombOneCombUint3)(builder);
			};
		}
		storeOneCombOneCombOneCombUint3()(builder);
	};
}