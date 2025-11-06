## string-saw

Provides an easy way to string together match/replacement operations in an error-free manner.

### Install

```bash
npm install string-saw
```

### Usage (ESM)

```ts
import saw from 'string-saw';

const value = saw('one two three four five six hello 323423 hello')
	.remove(/\d+/g, 'hello')
	.split(' ')
	.slice(3,4)
	.toString(); // "four"
```

CommonJS consumers can use `require('string-saw').default`.

### Single-file browser include (IIFE)

```html
<script src="https://cdn.jsdelivr.net/npm/string-saw@0.0.46/dist/browser/saw.js"></script>
<script>
  // global function: window.stringSaw
  const out = stringSaw('one two').split(' ').join('-').toString();
  console.log(out); // "one-two"
  // or locally alias:
  const saw = window.stringSaw;
  console.log(saw('hello world').match('hello').toBoolean()); // true
</script>
```

### Methods

- match (Array/String/Function/RegExp) -> Saw
- matchAll (RegExp) -> [Array|Object]
- replace (Array|RegExp|String match, String|Function replacement) -> Saw
- remove (String|RegExp [match]) -> Saw
- map (Function func) -> Saw
- item (Integer index) -> Saw
- itemFromRight (Integer offset) -> Saw
- first () -> Saw
- last () -> Saw
- trim () -> Saw
- uniq () -> Saw
- join (String separator|Function separator) -> Saw
- each (Function func) -> Saw
- find (String|RegExp|Function match) -> Saw
- filter (String|RegExp|Function match) -> Saw
- filterNot (String|RegExp|Function match) -> Saw
- reduce (Function func) -> Saw
- slice (Integer start, Integer end) -> Saw
- split (String|RegExp match) -> Saw
- transform (Function context) -> Saw
- upperCase () -> Saw
- lowerCase () -> Saw
- prepend (String) -> Saw
- append (String) -> Saw
- capitalize () -> Saw
- reverse () -> Saw
- sort (Function func) -> Saw
- length () -> Integer
- has (String|RegExp|Function match) -> Boolean
- startsWith (String|[String]) -> Boolean
- endsWith (String|[String]) -> Boolean
- toString () -> String
- toArray () -> Array
- toNumber () -> Integer (0 if no match)
- toInt () -> Integer (can return NaN)
- toFloat () -> Float
- toBoolean () -> Boolean
- toObject () -> Object
- indexOf (String|RegExp|Function match) -> Integer
- indexesOf (String|RegExp|Function match) -> [Integer]

### Examples

```ts
import saw from 'string-saw';

saw('1 2 3')
	.match(/\d+$/)
	.toNumber(); // 3

saw('joe:56, bob:57')
	.matchAll(/(?<name>(\S+)):(?<age>(\d+))/g)
// [
//   { name: 'joe', age: '56' },
//   { name: 'bob', age: '57' }
// ]

saw('1 2 3 4 5')
	.split(' ')
	.itemFromRight(2)
	.toNumber(); // 3

saw([' one ', ' two ', ' three '])
	.trim()
	.join(',')
	.toString(); // "one,two,three"

saw('John. Smith.')
	.match(/\S+/g)
	.remove('.')
	.toObject('first', 'last'); // { first: "John", last: "Smith" }
```
