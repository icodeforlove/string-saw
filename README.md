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

- match (functions just like string match method: context will run .join('') if its still in array format)
- replace (functions just like string replace method: context will run .join('') if its still in array format)
- remove (helper for .replace(/abc/g, ''))
- map (easy way to run map on matches)
- item (run after match to get a specific index)
- itemFromRight (run after match to get a specific index)
- first (run after match to get a specific index)
- last (run after match to get a specific index)
- trim (can trim against array, or single match)
- join (works normally if context is an array)
- each (works normally if context is an array)
- filter (works normally if context is an array)
- reduce (works normally if context is an array)
- slice (works normally if context is an array)
- split (works normally if context is an array)
- upperCase
- lowerCase
- reverse 

- toString (returns a string)
- toArray (returns an array)
- toNumber (returns a number, returns 0 of no match)
- toInt (returns a int)
- toFloat (returns a float)
- toBoolean (returns a boolean value)
- toObject (returns a hashmap of the current context, based on the provided arg names)

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