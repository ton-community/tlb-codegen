const base = require('@ton/toolchain');

module.exports = [...base, { ignores: ['test/generated_files*'] }];
