#!/usr/bin/env node
import meow from 'meow';
import { generateCode } from './src/main';

const cli = meow(`
	Usage
	  $ tlb <tlbpath>

	Options
	  --output, -o Output file, default = tlbpath with .ts extension e.g. ./path/to/file.tlb -> ./path/to/file.ts
	  --language, -l Programming language result. Supported languages: ["typescript"]. Default: "typescript"
	  
	Examples
	  $ tlb ./path/to/file.tlb
	  > Output: ./path/to/file.ts

	  $ tlb -o ./path/to/output.ts ./path/to/file.tlb
	  > Output: ./path/to/output.ts

	  $ tlb -l typescript ./path/to/file.tlb
	  > Output: ./path/to/file.ts
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
	if (input.match(/\.tlb$/) == null) {
		console.error('Input file must have .tlb extension')
		process.exit(1)
	}

	let output = input.replace('.tlb', '.ts')
	if (cli.flags.output) {
		output = cli.flags.output;
	}
	let language = 'typescript'
	if (cli.flags.language) {
		language = cli.flags.language
	}
	generateCode(input, output, language);
}
