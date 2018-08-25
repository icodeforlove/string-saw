let saw = require('../dist/node/saw');

describe('General', () => {
	it('can perform a simple match', () => {
		expect(saw('hello world').match('hello').toBoolean()).toEqual(true);
		expect(saw('hell world').match('hello').toBoolean()).toEqual(false);
		expect(saw('hell world').match(string => {
			return string.match('hell');
		}).toBoolean()).toEqual(true);
		expect(saw('hell world').match(string => {
			return string.match('hello');
		}).toBoolean()).toEqual(false);
	});

	it('can use each method', () => {
		let results = [];

		saw('hello world hello').match(/\b\S+\b/g).each((value, index, array) => {
			results.push([value, index, array]);
		});

		expect(results).toEqual([["hello",0,["hello","world","hello"]],["world",1,["hello","world","hello"]],["hello",2,["hello","world","hello"]]]);

		results = [];

		saw('hello world hello').match(/foobar/g).each((value, index, array) => {
			results.push([value, index, array]);
		});

		expect(results).toEqual([]);
	});

	it('can perform an array of matches', () => {
		expect(saw('hello world').match('whattt', 'hello').toBoolean()).toEqual(true);
		expect(saw('hell world').match('whattt', 'hello').toBoolean()).toEqual(false);
		expect(saw('hello world').match('whattt', /hel(lo)/).first().toString()).toEqual('lo');
		expect(saw('hello world').match(/(hel)lo/, /hel(lo)/).first().toString()).toEqual('hel');
		expect(saw('hello world').match([/(hel)lo/, /hel(lo)/]).first().toString()).toEqual('hel');
	});

	it('can get a item result', () => {
		expect(saw('one two three').split(' ').item(0).toString()).toEqual('one');
		expect(saw('one two three').split(' ').item(1).toString()).toEqual('two');
		expect(saw('one two three').split(' ').item(2).toString()).toEqual('three');
	});

	it('can get the last result', () => {
		expect(saw('one two three').split(' ').last().toString()).toEqual('three');
		expect(saw('one two three').match(/one|two|three/g).last().toString()).toEqual('three');
	});

	it('can get the first result', () => {
		expect(saw('one two three').split(' ').first().toString()).toEqual('one');
	});

	it('can get an itemFromRight result', () => {
		expect(saw('one two three').split(' ').itemFromRight(0).toString()).toEqual('three');
		expect(saw('one two three').split(' ').itemFromRight(1).toString()).toEqual('two');
		expect(saw('one two three').split(' ').itemFromRight(2).toString()).toEqual('one');
		expect(saw('one two three').match(/one|two|three/g).itemFromRight(0).toString()).toEqual('three');
	});

	it('can replace an item', () => {
		expect(saw('one two three').replace(' two', '').itemFromRight(0).toString()).toEqual('one three');
	});

	it('can replace with a match set', () => {
		expect(saw('one two three').replace([
			/(one) (two) (four)/,
			/(one) (two) (three)/
		], '$1 $3').toString()).toEqual('one three');
	});

	it('can transform the context', () => {
		expect(saw('one two three').match(/\S+/g).transform(context => {
			if (context.length === 3) {
				return 'pass';
			} else {
				return 'fail';
			}
		}).toString()).toEqual('pass');
	});

	it('can replace an array of items', () => {
		expect(saw('two two two').split(' ').replace(/two/g, 'three').join('-').toString()).toEqual('three-three-three');
	});

	it('can get length', () => {
		expect(saw('one two three').length()).toEqual(13);
		expect(saw('one two three').split(' ').length()).toEqual(3);
	});

	it('can use join', () => {
		expect(saw('one two three').split(' ').join('-').toString()).toEqual('one-two-three');
	});

	it('can use join function that returns different delimiters', () => {
		expect(saw('one two three four five six').split(' ').join((item, index) => {
			return index % 2 == 1 ? ' ' : '-';
		}).toString()).toEqual('one-two three-four five-six');
	});

	it('can use join on match sets', () => {
		expect(saw('1902 foo bar 2010').match(/\d{4}/g).join(' - ').toString()).toEqual('1902 - 2010');
	});

	it('can use map', () => {
		expect(saw('one two three').split(' ').map(item => {
			return '(' + item + ')';
		}).join(' ').toString()).toEqual('(one) (two) (three)');

		expect(saw('one two three').split(' ').map((value, index, array) => {
			if (value === 'three') {
				return array.slice(index - 1, index);
			} else {
				return -1;
			}
		}).filter(value => {
			return value !== -1;
		}).first().toString()).toEqual('two');
	});

	it('can use join', () => {
		expect(saw('one two three').split(' ').join('-').toString()).toEqual('one-two-three');
	});

	it('can use filter', () => {
		expect(saw('one two three').split(' ').filter(item => {
			return item === 'two';
		}).toString()).toEqual('two');

		expect(saw('one two three').split(' ').filter((item, index, array) => {
			return item === 'two' && array[index + 1] === 'three';
		}).toString()).toEqual('two');

		expect(saw('one two three').split(' ').filter(/one|three/).toArray()).toEqual(['one', 'three']);
		expect(saw('one two three').split(' ').filter('two').toArray()).toEqual(['two']);
		expect(saw('one two  three').split(' ').filter().toArray()).toEqual(['one', 'two', 'three']);
	});

	it('can use filterNot', () => {
		expect(saw('one two three').split(' ').filterNot(item => {
			return item === 'two';
		}).join(' ').toString()).toEqual('one three');

		expect(saw('one two three').split(' ').filterNot((item, index, array) => {
			return item === 'two' && array[index + 1] === 'three';
		}).join(' ').toString()).toEqual('one three');

		expect(saw('one two three').split(' ').filterNot(/one|three/).toArray()).toEqual(['two']);
		expect(saw('one two three').split(' ').filterNot('two').toArray()).toEqual(['one', 'three']);
	});

	it('can use reduce', () => {
		expect(saw('0 1 2 3 4').split(' ').reduce(function(previousValue, currentValue, index, array) {
		  return parseInt(previousValue, 10) + parseInt(currentValue, 10);
		}).toString()).toEqual('10');
	});

	it('can use remove', () => {
		expect(saw('one two three').remove('one', 'two').trim().toString()).toEqual('three');
		//expect(saw('test-one test-two').match(/\S+/g).remove('es', /-/).toArray()).toEqual(["ttone", "tttwo"]);
	});

	it('can trim results', () => {
		expect(saw('one two three').match(/\S+\s*/g).trim().toString()).toEqual('onetwothree');
		expect(saw(' one two ').match(/(\s*one\s*)(\s*two\s*)?/).trim().toArray()).toEqual(["one", "two"]);
		expect(saw(' one tw ').match(/(\s*one\s*)(\s*two\s*)?/).trim().toArray()).toEqual(["one", undefined]);
	});

	it('can split string', () => {
		expect(saw('one two three').split(' ').join('').toString()).toEqual('onetwothree');
	});

	// it('can split string and rejoin using its matched delimiter', () => {
	// 	expect(saw('one-two three four-five').split(/-| /).join('').toString()).toEqual('onetwothree');
	// });

	it('can slice array', () => {
		expect(saw('one two three').split(' ').slice(1).join(' ').toString()).toEqual('two three');
		expect(saw('one two three').slice(0,3).toString()).toEqual('one');
	});

	it('can use toString', () => {
		expect(saw('hello world').toString()).toEqual('hello world');
	});

	it('can use toArray', () => {
		expect(saw('one two three').split(' ').toArray()).toEqual(['one', 'two', 'three']);
		expect(saw('one two three').match(/\d{3}/).toArray()).toEqual([]);
	});

	it('can operate on a number', () => {
		expect(saw(2).match(/^\d+/).first().toNumber()).toEqual(2);
		expect(saw(2).match(/^\d+/).first().toString()).toEqual('2');
	});

	it('can use toNumber', () => {
		expect(saw('number 1234').match(/number (\d+)/).first().toNumber()).toEqual(1234);
		expect(saw('number 12.34').match(/number ([0-9.]+)/).first().toNumber()).toEqual(12.34);
		expect(saw('number 12.34').match(/number/).first().toNumber()).toEqual(0);
		expect(saw('number 12.34').match(/number/).first().toNumber()).toEqual(0);
	});

	it('can use toInt', () => {
		expect(saw('number 12.34').match(/number ([0-9]+)/).first().toInt()).toEqual(12);
		expect(saw('number 12.34').match(/number ([0-9.]+)/).first().toInt()).toBeNaN();
		expect(saw('number 12.34').match(/number/).first().toInt()).toBeNaN();
		expect(saw("\t 12").toInt()).toEqual(12);
	});

	it('can use toFloat', () => {
		expect(saw('number 12.34').match(/number ([0-9.]+)/).first().toFloat()).toEqual(12.34);
		expect(saw('number 12.34').match(/number/).first().toFloat()).toBeNaN();
		expect(saw("\t  12.34").toFloat()).toEqual(12.34);
	});

	it('can use toBoolean', () => {
		expect(saw('number 1234').match(/number (\d+)/).first().toBoolean()).toEqual(true);
		expect(saw('number 1234').match(/numbers (\d+)/).first().toBoolean()).toEqual(false);
	});

	it('can use has', () => {
		expect(saw('number 1234').has(/number (\d+)/)).toEqual(true);
		expect(saw('number 1234').has('number')).toEqual(true);
		expect(saw('foo 1234').has(/number (\d+)/)).toEqual(false);
		expect(saw('bar 1234').has('number')).toEqual(false);
		expect(saw('bar 1234').has(string => {
			return string.match(/bar/);
		})).toEqual(true);
		expect(saw('bar 1234').has(string => {
			return string.match(/number/);
		})).toEqual(false);
	});

	it('can use toObject', () => {
		expect(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject()).toEqual({});
		expect(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject('one', 'two')).toEqual({one: '12', two: '34'});
		expect(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject(['one', 'two'])).toEqual({one: '12', two: '34'});
		expect(saw('number 1234').match(/number (\d{2})(\d{2})(\d{2})?/).toObject(['one', 'two', 'two'])).toEqual({one: '12', two: '34'});
		expect(saw('number 123456').match(/number (\d{2})(\d{2})(\d{2})?/).toObject(['one', 'two', 'two'])).toEqual({one: '12', two: '56'});
		expect(saw('12').match(/(\d{2})/g).map(string => {
			return '"' + string + '"';
		}).toObject('one', 'two')).toEqual({ one : '"12"' });
		expect(saw('1234').match(/(\d{2})/g).map(string => {
			return '"' + string + '"';
		}).toObject('one', 'two')).toEqual({ one : '"12"', two : '"34"' });
	});

	it('can use lowerCase', () => {
		expect(saw('One TWO').lowerCase().toString()).toEqual('one two');
		expect(saw('One TWO').match(/(\S{3})/g).map(string => {
			return '"' + string + '"';
		}).lowerCase().toObject('one', 'two')).toEqual({ one : '"one"', two: '"two"' });
		expect(saw('One TWO ThReE').match(/\s*\S+\s*/g).lowerCase().trim().map(string => {
			return '"' + string + '"';
		}).toObject('one', 'two', 'three')).toEqual({ one : '"one"', two : '"two"', three : '"three"' });
	});

	it('can use reverse', () => {
		expect(saw('hello world').reverse().toString()).toEqual('dlrow olleh');
		expect(saw(['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']).reverse().toString()).toEqual('dlrow olleh');
		expect(saw('hello world').match(/(h)(e)(l)(l)(o)( )(w)(o)(r)(l)(d)/).reverse().toString()).toEqual('dlrow olleh');
		expect(saw('hello world').match(/hello world/).reverse().toString()).toEqual('dlrow olleh');
	});

	it('can use sort', () => {
		expect(saw('a ccc bb').split(' ').sort((a,b) => {return b.length - a.length;}).join(' ').toString()).toEqual('ccc bb a');
		expect(saw('a ccc bb').split(' ').sort((a,b) => {return a.length - b.length;}).join(' ').toString()).toEqual('a bb ccc');
	});

	it('can use capitalize', () => {
		expect(saw('hello world').capitalize().toString()).toEqual('Hello World');
		expect(saw('hello world').split(' ').capitalize().toArray()).toEqual(['Hello', 'World']);
	});

	it('can prepend', () => {
		expect(saw('world').prepend('hello ').toString()).toEqual('hello world');
		expect(saw(['world', 'world']).prepend('hello ').toArray()).toEqual(['hello world', 'hello world']);
	});

	it('can append', () => {
		expect(saw('hello').append(' world').toString()).toEqual('hello world');
		expect(saw(['hello', 'hello']).append(' world').toArray()).toEqual(['hello world', 'hello world']);
	});

	it('can use upperCase', () => {
		expect(saw('One TWO').upperCase().toString()).toEqual('ONE TWO');
		expect(saw('One TWO').match(/(\S{3})/g).map(string => {
			return '"' + string + '"';
		}).upperCase().toObject('one', 'two')).toEqual({ one : '"ONE"', two: '"TWO"' });
		expect(saw('a b c').split(' ').map(() => {return 9;}).upperCase().toArray()).toEqual(['9', '9', '9']);
		expect(saw('One TWO ThReE').match(/\s*\S+\s*/g).upperCase().trim().map(string => {
			return '"' + string + '"';
		}).toObject('one', 'two', 'three')).toEqual({ one : '"ONE"', two : '"TWO"', three : '"THREE"' });
	});

	it('can use this with array methods', () => {
		expect(saw('one two').split(' ').map(function (item) {return this[item];}, {one: 'ONE', two: 'TWO'}).toArray()).toEqual(['ONE', 'TWO']);
		expect(saw('one two').split(' ').filter(function (item) {return this[item];}, {one: 'ONE', two: 'TWO'}).toArray()).toEqual(['one', 'two']);
		let items = {};
		expect(saw('one two').split(' ').each(function (item) {items[item] = this[item];}, {one: 'ONE', two: 'TWO'}).toArray());
		expect(items).toEqual({one: 'ONE', two: 'TWO'});
		expect(saw('0 1 2 3 4').split(' ').reduce(function(previousValue, currentValue, index, array) {
			return parseInt(previousValue, 10) + parseInt(this[index], 10);
		}, {'0': 0, '1': 2, '2': 4, '3': 6, '4': 8}).toString()).toEqual('20');
	});

	it('can use existing sawed object', () => {
		let sawed = saw('one two three').split(' ');

		let reversed = sawed.map(string => {
			return string.split('').reverse().join('');
		}).join(' ').toString();

		let uppercase = sawed.map(string => {
			return string.toUpperCase();
		}).join(' ').toString();

		expect(reversed).toEqual('eno owt eerht');
		expect(uppercase).toEqual('ONE TWO THREE');
	});

	it('can find indexes of strings in array', () => {
		expect(saw('hello world').indexOf('hello')).toEqual(0);
		expect(saw('hello world foo').indexOf('foo')).toEqual(12);
		expect(saw('hello world foo').indexOf('bar')).toEqual(-1);
		expect(saw('hello world foo').indexesOf(/hello|world/)).toEqual([0, 6]);
		expect(saw('hello world').split(' ').indexOf('hello')).toEqual(0);
		expect(saw('hello world foo').split(' ').indexOf('foo')).toEqual(2);
		expect(saw('hello world').split(' ').indexOf('bar')).toEqual(-1);
		expect(saw('hello world').split(' ').indexesOf(/hello|world/)).toEqual([0,1]);
		expect(saw('hello world').split(' ').indexesOf(/bar/)).toEqual([]);
		expect(saw('hello world').split(' ').indexesOf(item => {
			return item === 'hello';
		})).toEqual([0]);
		expect(saw('hello world foo').split(' ').indexOf(item => {
			return item === 'foo';
		})).toEqual(2);
	});

	it('can match unescaped strings', () => {
		expect(saw('(').match('(').first().toString()).toEqual('(');
	});
});
