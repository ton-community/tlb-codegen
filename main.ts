#!/usr/bin/env node
import meow from 'meow';
import { generateCode } from './src/main';

const cli = meow(`
	Usage
	  $ tlbgen <tlbpath>

	Options
	  --output, -o Output file, defult = tlbpath + ".ts"
	  --language, -l Programming language result. Supported languages: ["typescript"]. Default: "typescript"
`, {
	flags: {
		output: {
			type: 'string',
			alias: 'o'
		},
		language: {
			type: 'string',
			alias: 'l'
		}
	}
});


let input = cli.input.at(0)
if (input) {
	let output = input + '.ts'
	if (cli.flags.output) {
		output = cli.flags.output;
	}
	let language = 'typescript'
	if (cli.flags.language) {
		language = cli.flags.language
	}
	generateCode(input, output, language);
}
