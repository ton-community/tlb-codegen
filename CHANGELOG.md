# Changelog

## Unreleased

### Fixed

- Fix generate code for cell as ref [issues #59](https://github.com/ton-community/tlb-codegen/issues/59)
- Fix generator code correct behavior for store method for Bit selection expression [issues #56](https://github.com/ton-community/tlb-codegen/issues/56)

### Chore

- Upgrade develop dependencies

## [2.0.0-beta.3] – 2025-08-25

- Remove node dependency form exports
- Make export friendly use in web

## [2.0.0-beta.2] – 2025-08-25

- Make friendly for use in web 
- Fixed and optimization crc32 computation

## [2.0.0-beta.1] – 2025-04-01

- Generate typescript code with functions `loadType` and `storeType` for TL-B scheme according to the [documentation TL-B](https://docs.ton.org/develop/data-formats/tl-b-language)
- Integration with [@ton/core](https://github.com/ton-org/ton-core/) in a way it uses several built-in types from there
