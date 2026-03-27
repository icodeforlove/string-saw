# string-saw

[![NPM](https://nodei.co/npm/string-saw.svg?style=flat-square&data=n,v,u,d&color=brightgreen)](https://www.npmjs.com/package/string-saw)

Chainable string processing for people who are tired of juggling intermediate variables, half-broken regex code, and one-off parsing helpers.

`string-saw` lets you match, split, filter, reshape, and convert text through a fluent pipeline that stays readable even when the parsing logic gets real.

## Install

```bash
npm install string-saw
```

## What It Does

- Chains string operations into one clean pipeline
- Works with raw strings, arrays of strings, regex match results, and numbers
- Handles extraction, cleanup, reshaping, and conversion in the same flow
- Makes regex-heavy parsing less annoying
- Returns a new `Saw` at each step, so you can reuse earlier pipelines

## Quick Hit

```ts
import saw from 'string-saw';

const value = saw('one two three four five six hello 323423 hello')
	.remove(/\d+/g, 'hello')
	.split(' ')
	.slice(3, 4)
	.toString();

// "four"
```

## Why It Slaps

- Regex when you need it, plain strings when you do not
- Array-style operations after `split()` or `match()`
- Easy conversions to `string`, `number`, `boolean`, `array`, and `object`
- Named capture groups can become objects instantly
- Non-matching operations degrade safely instead of blowing up your pipeline

## Examples

### Extract Structured Data

```ts
import saw from 'string-saw';

const users = saw('joe:56, bob:57')
	.matchAll(/(?<name>\S+):(?<age>\d+)/g);

// [
//   { name: 'joe', age: '56' },
//   { name: 'bob', age: '57' }
// ]
```

### Pull Values Out Of Text

```ts
const port = saw('PORT=8080')
	.match(/PORT=(\d+)/)
	.first()
	.toNumber();

// 8080
```

### Turn Messy Tokens Into Clean Output

```ts
const headline = saw('  hello   from   string-saw  ')
	.split(/\s+/)
	.filter()
	.capitalize()
	.join(' ')
	.toString();

// "Hello From String-saw"
```

### Parse From The Right

```ts
const version = saw('release-2026-03-27')
	.split('-')
	.itemFromRight(0)
	.toNumber();

// 27
```

### Convert Captures Into Objects

```ts
const person = saw('John. Smith.')
	.match(/\S+/g)
	.remove('.')
	.toObject('first', 'last');

// { first: 'John', last: 'Smith' }
```

### Reuse A Pipeline Without Mutating It

```ts
const words = saw('one two three').split(' ');

const reversed = words
	.map(word => word.split('').reverse().join(''))
	.join(' ')
	.toString();

const uppercased = words
	.upperCase()
	.join(' ')
	.toString();

// reversed   => "eno owt eerht"
// uppercased => "ONE TWO THREE"
```

## Core Flow

Most pipelines look like this:

1. Start with `saw(input)`
2. Narrow or reshape with `match()`, `split()`, `filter()`, `slice()`, or `map()`
3. Clean or format with `trim()`, `remove()`, `replace()`, `capitalize()`, `upperCase()`, `lowerCase()`, `join()`
4. Finish with `toString()`, `toArray()`, `toNumber()`, `toObject()`, or another terminal check

## API Overview

### Matching And Search

- `match(string | RegExp | function | Array<matcher>)`
- `matchAll(RegExp)`
- `has(string | RegExp | function)`
- `find(string | RegExp | function)`
- `filter(string | RegExp | function)`
- `filterNot(string | RegExp | function)`
- `indexOf(string | RegExp | function)`
- `indexesOf(string | RegExp | function)`
- `startsWith(string)`
- `endsWith(string)`

### Selection And Reshaping

- `split(string | RegExp)`
- `slice(start?, end?)`
- `item(index)`
- `itemFromRight(offset)`
- `first()`
- `last()`
- `map(fn)`
- `each(fn)`
- `reduce(fn)`
- `transform(fn)`
- `sort(compareFn?)`
- `reverse()`
- `uniq()`
- `length()`

### Cleanup And Formatting

- `replace(match, replacement)`
- `remove(...matches)`
- `trim()`
- `join(separator | separatorFn)`
- `prepend(string)`
- `append(string)`
- `capitalize()`
- `upperCase()`
- `lowerCase()`

### Conversion

- `toString()`
- `toArray()`
- `toBoolean()`
- `toNumber()`
- `toInt()`
- `toFloat()`
- `toObject(...keys)`

## Input Types

`saw()` accepts:

- `string`
- `number`
- `string[]`

That means you can start from raw text, parsed tokens, or numeric input and keep using the same fluent API.

## Notes

- `match()` accepts plain strings, regular expressions, matcher functions, or an array/list of matchers
- `matchAll()` returns arrays for unnamed groups and objects for named groups
- `toNumber()` returns `0` when conversion fails
- `toInt()` and `toFloat()` can return `NaN`
- CommonJS and TypeScript consumers are supported by the published package exports

## License

MIT
