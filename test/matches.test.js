var saw = require('../index');

describe('General', function() {
	it('can perform a simple match', function() {
		expect(saw('hello world').match('hello').toBoolean()).toEqual(true);
		expect(saw('hell world').match('hello').toBoolean()).toEqual(false);
	});

	it('can perform an array of matches', function () {
		expect(saw('hello world').match('whattt', 'hello').toBoolean()).toEqual(true);
		expect(saw('hell world').match('whattt', 'hello').toBoolean()).toEqual(false);
		expect(saw('hello world').match('whattt', /hel(lo)/).first().toString()).toEqual('lo');
		expect(saw('hello world').match(/(hel)lo/, /hel(lo)/).first().toString()).toEqual('hel');
		expect(saw('hello world').match([/(hel)lo/, /hel(lo)/]).first().toString()).toEqual('hel');
	});

	it('can get a item result', function() {
		expect(saw('one two three').split(' ').item(0).toString()).toEqual('one');
		expect(saw('one two three').split(' ').item(1).toString()).toEqual('two');
		expect(saw('one two three').split(' ').item(2).toString()).toEqual('three');
	});

	it('can get the last result', function () {
		expect(saw('one two three').split(' ').last().toString()).toEqual('three');
		expect(saw('one two three').match(/one|two|three/g).last().toString()).toEqual('three');
	});

	it('can get the first result', function () {
		expect(saw('one two three').split(' ').first().toString()).toEqual('one');
	});

	it('can get an itemFromRight result', function () {
		expect(saw('one two three').split(' ').itemFromRight(0).toString()).toEqual('three');
		expect(saw('one two three').split(' ').itemFromRight(1).toString()).toEqual('two');
		expect(saw('one two three').split(' ').itemFromRight(2).toString()).toEqual('one');
		expect(saw('one two three').match(/one|two|three/g).itemFromRight(0).toString()).toEqual('three');
	});

	it('can replace an item', function () {
		expect(saw('one two three').replace(' two', '').itemFromRight(0).toString()).toEqual('one three');
	});

	it('can replace an array of items', function () {
		expect(saw('two two two').split(' ').replace(/two/g, 'three').join('-').toString()).toEqual('three-three-three');
	});

	it('can use join', function () {
		expect(saw('one two three').split(' ').join('-').toString()).toEqual('one-two-three');
	});

	it('can use map', function () {
		expect(saw('one two three').split(' ').map(function (item) {
			return '(' + item + ')';
		}).join(' ').toString()).toEqual('(one) (two) (three)');

		expect(saw('one two three').split(' ').map(function (value, index, array) {
			if (value === 'three') {
				return array.slice(index - 1, index);
			} else {
				return -1;
			}
		}).filter(function (value) {
			return value !== -1;
		}).first().toString()).toEqual('two');
	});

	it('can use join', function () {
		expect(saw('one two three').split(' ').join('-').toString()).toEqual('one-two-three');
	});

	it('can use filter', function () {
		expect(saw('one two three').split(' ').filter(function (item) {
			return item === 'two';
		}).toString()).toEqual('two');

		expect(saw('one two three').split(' ').filter(function (item, index, array) {
			return item === 'two' && array[index + 1] === 'three';
		}).toString()).toEqual('two');
	});

	it('can use remove', function () {
		expect(saw('one two three').remove('one', 'two').trim().toString()).toEqual('three');
		expect(saw('test-one test-two').match(/\S+/g).remove('es', /-/).toArray()).toEqual(["ttone", "tttwo"]);
	});

	it('can trim results', function () {
		expect(saw('one two three').match(/\S+\s*/g).trim().toString()).toEqual('onetwothree');
	});

	it('can split string', function () {
		expect(saw('one two three').split(' ').join('').toString()).toEqual('onetwothree');
	});

	it('can slice array', function () {
		expect(saw('one two three').split(' ').slice(1).join(' ').toString()).toEqual('two three');
	});

	it('can use toString', function () {
		expect(saw('hello world').toString()).toEqual('hello world');
	});

	it('can use toArray', function () {
		expect(saw('one two three').split(' ').toArray()).toEqual(['one', 'two', 'three']);
		expect(saw('one two three').match(/\d{3}/).toArray()).toEqual([]);
	});

	it('can use toNumber', function () {
		expect(saw('number 1234').match(/number (\d+)/).first().toNumber()).toEqual(1234);
	});

	it('can use toBoolean', function () {
		expect(saw('number 1234').match(/number (\d+)/).first().toBoolean()).toEqual(true);
		expect(saw('number 1234').match(/numbers (\d+)/).first().toBoolean()).toEqual(false);
	});

	it('can use toObject', function () {
		expect(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject()).toEqual({});
		expect(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject('one', 'two')).toEqual({one: '12', two: '34'});
		expect(saw('number 1234').match(/number (\d{2})(\d{2})/).toObject(['one', 'two'])).toEqual({one: '12', two: '34'});
		expect(saw('number 1234').match(/number (\d{2})(\d{2})(\d{2})?/).toObject(['one', 'two', 'two'])).toEqual({one: '12', two: '34'});
		expect(saw('number 123456').match(/number (\d{2})(\d{2})(\d{2})?/).toObject(['one', 'two', 'two'])).toEqual({one: '12', two: '56'});
	});

	it('can use existing sawed object', function () {
		var sawed = saw('one two three').split(' ');

		var reversed = sawed.map(function (string) {
			return string.split('').reverse().join('');
		}).join(' ').toString();

		var uppercase = sawed.map(function (string) {
			return string.toUpperCase();
		}).join(' ').toString();

		expect(reversed).toEqual('eno owt eerht');
		expect(uppercase).toEqual('ONE TWO THREE');
	});
});