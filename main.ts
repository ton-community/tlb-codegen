#!/usr/bin/env node
import meow from 'meow';
import { generateCode } from './src/main';

const cli = meow(`
	Usage
	  $ foo <tlbpath>

	Options
	  --output, -o Output file, defult = tlbpath + ".tst"
`, {
	flags: {
		output: {
			type: 'string',
			shortFlag: 'o'
		}
	}
});


let input = cli.input.at(0)
if (input) {
	generateCode(input, input + ".ts");
}
