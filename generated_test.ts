import { Builder } from 'ton'
import { Slice } from 'ton'
import { beginCell } from 'ton'
import { BitString } from 'ton'
export type X = {
  	kind: 'X';
	a: number;
	b: number;
  };
export function loadX(slice: Slice): X {
  	let a: number;
	(a = slice.loadUint(32));
	let b: number;
	(b = slice.loadUint(32));
	return {
  		kind: 'X',
		a: a,
		b: b
  	};
  }
export function storeX(x: X): (builder: Builder) => void {
  	return (builder: Builder) => {
  		builder.storeUint(x.a, 32);
		builder.storeUint(x.b, 32);
  	};
  }
