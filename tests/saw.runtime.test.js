const assert = require('node:assert/strict');
const test = require('node:test');

const saw = require('..').default;

test.describe('string-saw runtime', () => {
	test('can perform a simple match', () => {
		assert.equal(saw('hello world').match('hello').toBoolean(), true);
		assert.equal(saw('hell world').match('hello').toBoolean(), false);
		assert.equal(saw('hell world').match(string => {
			return string.match('hell');
		}).toBoolean(), true);
		assert.equal(saw('hell world').match(string => {
			return string.match('hello');
		}).toBoolean(), false);
	});

	test('can use each method', () => {
		let results = [];

		saw('hello world hello').match(/\b\S+\b/g).each((value, index, array) => {
			results.push([value, index, array]);
		});

		assert.deepEqual(results, [["hello",0,["hello","world","hello"]],["world",1,["hello","world","hello"]],["hello",2,["hello","world","hello"]]]);

		results = [];

		saw('hello world hello').match(/foobar/g).each((value, index, array) => {
			results.push([value, index, array]);
		});

		assert.deepEqual(results, []);
	});

	test('can perform an array of matches', () => {
		assert.equal(saw('hello world').match('whattt', 'hello').toBoolean(), true);
		assert.equal(saw('hell world').match('whattt', 'hello').toBoolean(), false);
		assert.equal(saw('hello world').match('whattt', /hel(lo)/).first().toString(), 'lo');
		assert.equal(saw('hello world').match(/(hel)lo/, /hel(lo)/).first().toString(), 'hel');
		assert.equal(saw('hello world').match([/(hel)lo/, /hel(lo)/]).first().toString(), 'hel');
	});

	test('can get a item result', () => {
		assert.equal(saw('one two three').split(' ').item(0).toString(), 'one');
		assert.equal(saw('one two three').split(' ').item(1).toString(), 'two');
		assert.equal(saw('one two three').split(' ').item(2).toString(), 'three');
	});

	test('can get the last result', () => {
		assert.equal(saw('one two three').split(' ').last().toString(), 'three');
		assert.equal(saw('one two three').match(/one|two|three/g).last().toString(), 'three');
	});

	test('can get the first result', () => {
		assert.equal(saw('one two three').split(' ').first().toString(), 'one');
	});

	test('can get an itemFromRight result', () => {
		assert.equal(saw('one two three').split(' ').itemFromRight(0).toString(), 'three');
		assert.equal(saw('one two three').split(' ').itemFromRight(1).toString(), 'two');
		assert.equal(saw('one two three').split(' ').itemFromRight(2).toString(), 'one');
		assert.equal(saw('one two three').match(/one|two|three/g).itemFromRight(0).toString(), 'three');
	});

	test('can replace an item', () => {
		assert.equal(saw('one two three').replace(' two', '').itemFromRight(0).toString(), 'one three');
	});

	test('can replace with a match set', () => {
		assert.equal(saw('one two three').replace([
			/(one) (two) (four)/,
			/(one) (two) (three)/
		], '$1 $3').toString(), 'one three');
	});

	test('can transform the context', () => {
		assert.equal(saw('one two three').match(/\S+/g).transform(context => {
			if (context.length === 3) {
				return 'pass';
			} else {
				return 'fail';
			}
		}).toString(), 'pass');
	});

	test('can replace an array of items', () => {
		assert.equal(saw('two two two').split(' ').replace(/two/g, 'three').join('-').toString(), 'three-three-three');
	});

	test('can get length', () => {
		assert.equal(saw('one two three').length(), 13);
		assert.equal(saw('one two three').split(' ').length(), 3);
	});

	test('can use join', () => {
		assert.equal(saw('one two three').split(' ').join('-').toString(), 'one-two-three');
	});

	test('can use join function that returns different delimiters', () => {
		assert.equal(saw('one two three four five six').split(' ').join((item, index) => {
			return index % 2 == 1 ? ' ' : '-';
		}).toString(), 'one-two three-four five-six');
	});

	test('can use join on match sets', () => {
		assert.equal(saw('1902 foo bar 2010').match(/\d{4}/g).join(' - ').toString(), '1902 - 2010');
	});

	test('can use uniq', () => {
		assert.deepEqual(saw('10-20-30-40-40-10').match(/[0-9]{2}/g).uniq().toArray(), [ '10', '20', '30', '40' ]);
	});

	test('can use map', () => {
		assert.equal(saw('one two three').split(' ').map(item => {
			return '(' + item + ')';
		}).join(' ').toString(), '(one) (two) (three)');

		assert.equal(saw('one two three').split(' ').map((value, index, array) => {
			if (value === 'three') {
				return array.slice(index - 1, index);
			} else {
				return -1;
			}
		}).filter(value => {
			return value !== -1;
		}).first().toString(), 'two');
	});

	test('can use join', () => {
		assert.equal(saw('one two three').split(' ').join('-').toString(), 'one-two-three');
	});

	test('can use find', () => {
		assert.equal(saw('one two three').split(' ').find(item => {
			return item === 'two';
		}).toString(), 'two');

		assert.equal(saw('one two three').split(' ').find((item, index, array) => {
			return item === 'two' && array[index + 1] === 'three';
		}).toString(), 'two');

		assert.equal(saw('one two three').split(' ').find(/one|three/).toString(), 'one');
		assert.equal(saw('one two three').split(' ').find('two').toString(), 'two');
		assert.equal(saw('one two  three').split(' ').find().toString(), 'one');
		assert.equal(saw('one two (foo three').split(' ').find('(').toString(), '(foo');
	});

	test('can use filter', () => {
		assert.equal(saw('one two three').split(' ').filter(item => {
			return item === 'two';
		}).toString(), 'two');

		assert.equal(saw('one two three').split(' ').filter((item, index, array) => {
			return item === 'two' && array[index + 1] === 'three';
		}).toString(), 'two');

		assert.deepEqual(saw('one two three').split(' ').filter(/one|three/).toArray(), ['one', 'three']);
		assert.deepEqual(saw('one two three').split(' ').filter('two').toArray(), ['two']);
		assert.deepEqual(saw('one two  three').split(' ').filter().toArray(), ['one', 'two', 'three']);
		assert.deepEqual(saw('one two (foo three').split(' ').filter('(').toArray(), ['(foo']);
	});

	test('can use filterNot', () => {
		assert.equal(saw('one two three').split(' ').filterNot(item => {
			return item === 'two';
		}).join(' ').toString(), 'one three');

		assert.equal(saw('one two three').split(' ').filterNot((item, index, array) => {
			return item === 'two' && array[index + 1] === 'three';
		}).join(' ').toString(), 'one three');

		assert.deepEqual(saw('one two three').split(' ').filterNot(/one|three/).toArray(), ['two']);
		assert.deepEqual(saw('one two three').split(' ').filterNot('two').toArray(), ['one', 'three']);
	});

	test('can use reduce', () => {
		assert.equal(saw('0 1 2 3 4').split(' ').reduce(function(previousValue, currentValue, index, array) {
		  return parseInt(previousValue, 10) + parseInt(currentValue, 10);
		}).toString(), '10');
	});

	test('can use remove', () => {
		assert.equal(saw('one two three').remove('one', 'two').trim().toString(), 'three');
		//expect(saw('test-one test-two').match(/\S+/g).remove('es', /-/).toArray()).toEqual(["ttone", "tttwo"]);
	});

	test('can trim results', () => {
		assert.equal(saw('one two three').match(/\S+\s*/g).trim().toString(), 'onetwothree');
		assert.deepEqual(saw(' one two ').match(/(\s*one\s*)(\s*two\s*)?/).trim().toArray(), ["one", "two"]);
		assert.deepEqual(saw(' one tw ').match(/(\s*one\s*)(\s*two\s*)?/).trim().toArray(), ["one", undefined]);
	});

	test('can split string', () => {
		assert.equal(saw('one two three').split(' ').join('').toString(), 'onetwothree');
	});

	test('can slice array and strings and handle falsy values', () => {
		assert.equal(saw('one two three').split(' ').slice(1).join(' ').toString(), 'two three');
		assert.equal(saw('one two three').slice(0,3).toString(), 'one');
		assert.equal(saw(null).slice(0,3).toString(), '');
		assert.equal(saw(undefined).slice(0,3).toString(), '');
		assert.equal(saw(false).slice(0,3).toString(), '');
	});

	test('can use toString', () => {
		assert.equal(saw('hello world').toString(), 'hello world');
	});

	test('can use toArray', () => {
		assert.deepEqual(saw('one two three').split(' ').toArray(), ['one', 'two', 'three']);
		assert.deepEqual(saw('one two three').match(/\d{3}/).toArray(), []);
	});

	test('can use matchAll', () => {
		assert.deepEqual(saw('joe:56, bob:57').matchAll(/(?<name>(\S+)):(?<age>(\d+))/g), [{name: 'joe', age: '56'}, {name: 'bob', age: '57'}]);
		assert.deepEqual(saw('joe:56, bob:57').split(', ').matchAll(/(?<name>(\S+)):(?<age>(\d+))/g), [{name: 'joe', age: '56'}, {name: 'bob', age: '57'}]);
		assert.deepEqual(saw('joe:56, bob:57').matchAll(/(\S+):(\d+)/g), [['joe', '56'], ['bob', '57']]);
		assert.deepEqual(saw('joe:56, bob:57').split(', ').matchAll(/(\S+):(\d+)/g), [['joe', '56'], ['bob', '57']]);
	});

	test('can operate on a number', () => {
		assert.equal(saw(2).match(/^\d+/).first().toNumber(), 2);
		assert.equal(saw(2).match(/^\d+/).first().toString(), '2');
	});

	test('can use toNumber', () => {
		assert.equal(saw('number 1234').match(/number (\d+)/).first().toNumber(), 1234);
		assert.equal(saw('number 12.34').match(/number ([0-9.]+)/).first().toNumber(), 12.34);
		assert.equal(saw('number 12.34').match(/number/).first().toNumber(), 0);
		assert.equal(saw('number 12.34').match(/number/).first().toNumber(), 0);
	});

	test('can use toInt', () => {
		assert.equal(saw('number 12.34').match(/number ([0-9]+)/).first().toInt(), 12);
		assert.ok(Number.isNaN(saw('number 12.34').match(/number ([0-9.]+)/).first().toInt()));
		assert.ok(Number.isNaN(saw('number 12.34').match(/number/).first().toInt()));
		assert.equal(saw("\t 12").toInt(), 12);
	});

	test('can use toFloat', () => {
		assert.equal(saw('number 12.34').match(/number ([0-9.]+)/).first().toFloat(), 12.34);
		assert.ok(Number.isNaN(saw('number 12.34').match(/number/).first().toFloat()));
		assert.equal(saw("\t  12.34").toFloat(), 12.34);
		assert.equal(saw("\t  3.0").toFloat(), 3.0);
		assert.equal(saw("3.832").toFloat(), 3.832);
		assert.equal(saw("1756.20").toFloat(), 1756.20);
	});

	test('can use toBoolean', () => {
		assert.equal(saw('number 1234').match(/number (\d+)/).first().toBoolean(), true);
		assert.equal(saw('number 1234').match(/numbers (\d+)/).first().toBoolean(), false);
	});

	test('can use has', () => {
		assert.equal(saw('number 1234').has(/number (\d+)/), true);
		assert.equal(saw('number 1234').has('number'), true);
		assert.equal(saw('foo 1234').has(/number (\d+)/), false);
		assert.equal(saw('bar 1234').has('number'), false);
		assert.equal(saw('bar 1234').has(string => {
			return string.match(/bar/);
		}), true);
		assert.equal(saw('bar 1234').has(string => {
			return string.match(/number/);
		}), false);
	});

	test('can use startsWith', () => {
		assert.equal(saw('foobar').startsWith('foo'), true);
		assert.equal(saw('barfoo').startsWith('foo'), false);
		assert.equal(saw(['barfoo', 'foobar']).startsWith('foo'), false);
		assert.equal(saw(['foobarfoo', 'foobar']).startsWith('foo'), true);
		assert.equal(saw(['foobarfoo', 'foobar']).startsWith(), false);
		assert.equal(saw(['foobarfoo', 'foobar']).startsWith(''), false);
		assert.equal(saw(['foobarfoo', 'foobar']).startsWith(undefined), false);
		assert.equal(saw(undefined).startsWith('foobar'), false);
		assert.equal(saw(42).startsWith('foobar'), false);
		assert.equal(saw(42).startsWith(4), true);
	});

	test('can use endsWith', () => {
		assert.equal(saw('foobar').endsWith('bar'), true);
		assert.equal(saw('barfoo').endsWith('bar'), false);
		assert.equal(saw(['barfoo', 'foobar']).endsWith('bar'), false);
		assert.equal(saw(['barfoobar', 'foobar']).endsWith('bar'), true);
		assert.equal(saw(['barfoobar', 'foobar']).endsWith(), false);
		assert.equal(saw(['barfoobar', 'foobar']).endsWith(''), false);
		assert.equal(saw(['barfoobar', 'foobar']).endsWith(undefined), false);
		assert.equal(saw(undefined).endsWith('foobar'), false);
		assert.equal(saw(42).endsWith('foobar'), false);
		assert.equal(saw(42).endsWith(2), true);
	});

	test('can use toObject', () => {
		assert.deepEqual(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject(), {});
		assert.deepEqual(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject('one', 'two'), {one: '12', two: '34'});
		assert.deepEqual(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject(['one', 'two']), {one: '12', two: '34'});
		assert.deepEqual(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject(['one', 'two', 'two']), {one: '12', two: '34'});
		assert.deepEqual(saw('number 123456').match(/number (\d{2})(\d{2})(\d{2})?/).toObject(['one', 'two', 'two']), {one: '12', two: '56'});
		assert.deepEqual(saw('12').match(/(\d{2})/g).map(string => {
			return '\"' + string + '\"';
		}).toObject('one', 'two'), { one : '\"12\"' });
		assert.deepEqual(saw('1234').match(/(\d{2})/g).map(string => {
			return '\"' + string + '\"';
		}).toObject('one', 'two'), { one : '\"12\"', two : '\"34\"' });
		assert.deepEqual(saw('1999-20').match(/(?<year>[0-9]{4})-(?<month>[0-9]{2})/).toObject(), { year: '1999', month: '20' });
	});

	test('can use lowerCase', () => {
		assert.equal(saw('One TWO').lowerCase().toString(), 'one two');
		assert.deepEqual(saw('One TWO').match(/(\S{3})/g).map(string => {
			return '\"' + string + '\"';
		}).lowerCase().toObject('one', 'two'), { one : '\"one\"', two: '\"two\"' });
		assert.deepEqual(saw('One TWO ThReE').match(/\s*\S+\s*/g).lowerCase().trim().map(string => {
			return '\"' + string + '\"';
		}).toObject('one', 'two', 'three'), { one : '\"one\"', two : '\"two\"', three : '\"three\"' });
	});

	test('can use reverse', () => {
		assert.equal(saw('hello world').reverse().toString(), 'dlrow olleh');
		assert.equal(saw(['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']).reverse().toString(), 'dlrow olleh');
		assert.equal(saw('hello world').match(/(h)(e)(l)(l)(o)( )(w)(o)(r)(l)(d)/).reverse().toString(), 'dlrow olleh');
		assert.equal(saw('hello world').match(/hello world/).reverse().toString(), 'dlrow olleh');
	});

	test('can use sort', () => {
		assert.equal(saw('a ccc bb').split(' ').sort((a,b) => {return b.length - a.length;}).join(' ').toString(), 'ccc bb a');
		assert.equal(saw('a ccc bb').split(' ').sort((a,b) => {return a.length - b.length;}).join(' ').toString(), 'a bb ccc');
	});

	test('can use capitalize', () => {
		assert.equal(saw('hello world').capitalize().toString(), 'Hello World');
		assert.deepEqual(saw('hello world').split(' ').capitalize().toArray(), ['Hello', 'World']);
	});

	test('can prepend', () => {
		assert.equal(saw('world').prepend('hello ').toString(), 'hello world');
		assert.deepEqual(saw(['world', 'world']).prepend('hello ').toArray(), ['hello world', 'hello world']);
	});

	test('can append', () => {
		assert.equal(saw('hello').append(' world').toString(), 'hello world');
		assert.deepEqual(saw(['hello', 'hello']).append(' world').toArray(), ['hello world', 'hello world']);
	});

	test('can use upperCase', () => {
		assert.equal(saw('One TWO').upperCase().toString(), 'ONE TWO');
		assert.deepEqual(saw('One TWO').match(/(\S{3})/g).map(string => {
			return '\"' + string + '\"';
		}).upperCase().toObject('one', 'two'), { one : '\"ONE\"', two: '\"TWO\"' });
		assert.deepEqual(saw('a b c').split(' ').map(() => {return 9;}).upperCase().toArray(), ['9', '9', '9']);
		assert.deepEqual(saw('One TWO ThReE').match(/\s*\S+\s*/g).upperCase().trim().map(string => {
			return '\"' + string + '\"';
		}).toObject('one', 'two', 'three'), { one : '\"ONE\"', two : '\"TWO\"', three : '\"THREE\"' });
	});

	test('can use this with array methods', () => {
		assert.deepEqual(saw('one two').split(' ').map(function (item) {return this[item];}, {one: 'ONE', two: 'TWO'}).toArray(), ['ONE', 'TWO']);
		assert.deepEqual(saw('one two').split(' ').filter(function (item) {return this[item];}, {one: 'ONE', two: 'TWO'}).toArray(), ['one', 'two']);
		let items = {};
		saw('one two').split(' ').each(function (item) {items[item] = this[item];}, {one: 'ONE', two: 'TWO'}).toArray();
		assert.deepEqual(items, {one: 'ONE', two: 'TWO'});
		assert.equal(saw('0 1 2 3 4').split(' ').reduce(function(previousValue, currentValue, index, array) {
			return parseInt(previousValue, 10) + parseInt(this[index], 10);
		}, {'0': 0, '1': 2, '2': 4, '3': 6, '4': 8}).toString(), '20');
	});

	test('can use existing sawed object', () => {
		const sawed = saw('one two three').split(' ');

		const reversed = sawed.map(string => {
			return string.split('').reverse().join('');
		}).join(' ').toString();

		const uppercase = sawed.map(string => {
			return string.toUpperCase();
		}).join(' ').toString();

		assert.equal(reversed, 'eno owt eerht');
		assert.equal(uppercase, 'ONE TWO THREE');
	});

	test('can find indexes of strings in array', () => {
		assert.equal(saw('hello world').indexOf('hello'), 0);
		assert.equal(saw('hello world foo').indexOf('foo'), 12);
		assert.equal(saw('hello world foo').indexOf('bar'), -1);
		assert.deepEqual(saw('hello world foo').indexesOf(/hello|world/), [0, 6]);
		assert.equal(saw('hello world').split(' ').indexOf('hello'), 0);
		assert.equal(saw('hello world foo').split(' ').indexOf('foo'), 2);
		assert.equal(saw('hello world').split(' ').indexOf('bar'), -1);
		assert.deepEqual(saw('hello world').split(' ').indexesOf(/hello|world/), [0,1]);
		assert.deepEqual(saw('hello world').split(' ').indexesOf(/bar/), []);
		assert.deepEqual(saw('hello world').split(' ').indexesOf(item => {
			return item === 'hello';
		}), [0]);
		assert.equal(saw('hello world foo').split(' ').indexOf(item => {
			return item === 'foo';
		}), 2);
		assert.equal(saw(['some', 'text', 'with', '(this']).indexOf('(this'), 3);
	});

	test('can match unescaped strings', () => {
		assert.equal(saw('(').match('(').first().toString(), '(');
	});
});


