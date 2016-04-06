# string-saw [![Build Status](https://travis-ci.org/icodeforlove/string-saw.png?branch=master)](https://travis-ci.org/icodeforlove/string-saw)

provides an easy way to string together match/replacement operations in an error-free manner

## install

```
npm install string-saw
```

or

```
bower install string-saw
```

## methods

- match (Array/String/Saw source) -> Saw
- replace (RegExp/String match, String/Function replacement) -> Saw
- remove (String/RegExp [match]) -> Saw
- map (Function func) -> Saw
- item (Integer index) -> Saw
- itemFromRight (Integer offset) -> Saw
- first () -> Saw
- last () -> Saw
- trim () -> Saw
- join (String separator) -> Saw
- each (Function func) -> Saw
- filter(String/RegExp/Function match) -> Saw
- reduce (Function func) -> Saw
- slice (Integer start, Integer end) -> Saw
- split (String/RegExp match) -> Saw
- upperCase () -> Saw
- lowerCase () -> Saw
- reverse () -> Saw
- length () -> Integer
- has (String/RegExp match) -> Boolean
- toString () -> String
- toArray (returns an array) -> Array
- toNumber () -> Integer (0 if no match)
- toInt () -> Integer (can return NaN)
- toFloat () -> Float
- toBoolean () -> Boolean
- toObject () -> Object
- indexOf (String/RegExp/Function match) -> Integer
- indexesOf (String/RegExp/Function match) -> [Integer]

## examples

```javascript
var saw = require('string-saw');

saw('one two three four five six hello 323423 hello')
	.remove(/\d+/g, 'hello')
	.split(' ')
	.slice(3,4)
	.toString(); // returns "four"

saw('1 2 3')
	.match(/\d+$/)
	.toNumber(); // returns the number 3

saw('1 2 3')
	.split(' ')
	.last()
	.toNumber(); // returns the number 3

saw('1 2 3 4 5')
	.split(' ')
	.itemFromRight(2)
	.toNumber(); // returns the number 3

saw([' one ', ' two ', ' three '])
	.trim()
	.join(',')
	.toString(); // returns "one,two,three"

saw('John. Smith.')
	.match(/\S+/g)
	.remove('.')
	.toObject('first', 'last'); // returns {first: "John", last: "Smith"}
```
