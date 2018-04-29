import Matches from './Matches';
import escapeStringRegexp from 'escape-string-regexp';

function argumentsToArray (args) {
	var result;

	if (args.length > 1) {
		result = Array.from(args);
	} else if (Array.isArray(args[0])) {
		result = args[0];
	} else {
		result = [args[0]];
	}

	return result;
}

class Saw {
	constructor (object) {
		if (typeof object === 'number') {
			this._context = String(object);
		} else if (Array.isArray(object)) {
			this._context = object.slice(0);
		} else if (object instanceof Matches) {
			this._context = object.clone();
		} else {
			this._context = object;
		}
	}

	match (match) {
		var matchArray = argumentsToArray(arguments),
			saw = new Saw(this._context),
			context = this._contextToString(this._context);

		matchArray.some(match => {
			var matches = typeof match === 'function' ? match(context) : context.match(match);

			if (!matches) {
				saw._context = '';
			} else {
				saw._context = new Matches(matches, match);
				return true;
			}
		});

		return saw;
	}

	has (match) {
		return this.match(match).first().toBoolean();
	}

	item (index) {
		var saw = new Saw(this._context);

		if (saw._context instanceof Matches) {
			saw._context = saw._context.item(index);
		} else if (Array.isArray(saw._context)) {
			saw._context = saw._context[index] || '';
		}

		return saw;
	}

	itemFromRight (index) {
		var saw = new Saw(this._context);

		if (saw._context instanceof Matches || Array.isArray(saw._context)) {
			var length = saw._context.length;

			index = length - 1 - index;
			if (index >= 0) {
				saw = saw.item(index);
			}
		}

		return saw;
	}

	first (index) {
		var saw = new Saw(this._context);

		return saw.item(0);
	}

	last () {
		var saw = new Saw(this._context);

		return saw.itemFromRight(0);
	}

	replace (match, replacement) {
		var saw = new Saw(this._context);

		function replace(string, matches, replacement) {
			matches = Array.isArray(matches) ? matches : [matches];

			matches.some(match => {
				if (string.match(match)) {
					string = string.replace(match, replacement);
					return true;
				}
			});

			return string;
		}

		if (Array.isArray(saw._context)) {
			saw._context = saw._context.map(string => {
				return string.replace(match, replacement);
			});
		} else {
			saw._context = replace(this._contextToString(this._context), match, replacement);
		}

		return saw;
	}

	join (separator) {
		var saw = new Saw(this._context),
			array = saw.toArray();

		if (array.length) {
			var result = '';

			array.forEach((item, index, array) => {
				var currentSeparator = typeof separator == 'function' ? separator(item, index, array) : separator || '';
				result += item + (array.length - 1 == index ? '' : currentSeparator);
			});

			saw._context = result;
		}

		return saw;
	}

	each (func, thisArg) {
		var saw = new Saw(this._context);

		// Note: adds array as a third param
		var array = saw.toArray();
		array.forEach((item, index) => {
			if (item) {
				func.bind(thisArg)(item, index, array);
			}
		});

		return saw;
	}

	map (func, thisArg) {
		var saw = new Saw(this._context);

		// Note: adds array as a third param
		var array = saw.toArray();
		saw._context = array.map((item, index) => {
			return func.bind(thisArg)(item, index, array);
		});

		return saw;
	}

	reduce (func, thisArg) {
		var saw = new Saw(this._context);

		// Note: adds array as a third param
		var array = saw.toArray();
		saw._context = String(array.reduce((previousValue, currentValue, index, array) => {
			return func.bind(thisArg)(previousValue, currentValue, index, array);
		}));

		return saw;
	}

	reverse () {
		var saw = new Saw(this._context);

		if (typeof saw._context === 'string') {
			saw._context = saw._context.split('').reverse().join('');
		} else if (Array.isArray(saw._context)) {
			saw._context = saw._context.reverse();
		} else if (saw._context instanceof Matches) {
			var array = saw.toArray();
			if (array.length === 1) {
				saw._context = (array[0] || '').split('').reverse().join('');
			} else {
				saw._context = saw.toArray().reverse();
			}
		}

		return saw;
	}

	sort (func) {
		var saw = new Saw(this._context);

		if (typeof saw._context === 'string') {
			saw._context = saw._context.split('').sort(func).join('');
		} else if (Array.isArray(saw._context)) {
			saw._context = saw._context.sort(func);
		} else if (saw._context instanceof Matches) {
			var array = saw.toArray();
			if (array.length === 1) {
				saw._context = (array[0] || '').split('').sort(func).join('');
			} else {
				saw._context = saw.toArray().sort(func);
			}
		}

		return saw;
	}

	lowerCase (func) {
		return this.mapStringMethodAgainstContext('toLowerCase', func);
	}

	upperCase (func) {
		return this.mapStringMethodAgainstContext('toUpperCase', func);
	}

	mapStringMethodAgainstContext (methodName, func) {
		var saw = new Saw(this._context);

		// Note: adds array as a third param
		var array = saw.toArray();
		saw._context = array.map((item, index) => {
			return item ? String(item)[methodName]() : item;
		});

		return saw;
	}

	filter (match, thisArg) {
		var saw = new Saw(this._context);

		// default filter
		match = match || (item => item);

		// Note: adds array as a third param
		var array = saw.toArray();
		saw._context = array.filter((item, index) => {
			if (typeof match === 'function') {
				return match.bind(thisArg)(item, index, array);
			} else {
				return item.match(match);
			}
		});

		return saw;
	}

	filterNot (match, thisArg) {
		var saw = new Saw(this._context);

		// Note: adds array as a third param
		var array = saw.toArray();
		saw._context = array.filter((item, index) => {
			if (typeof match === 'function') {
				return !match.bind(thisArg)(item, index, array);
			} else {
				return !item.match(match);
			}
		});

		return saw;
	}

	remove () {
		var saw = new Saw(this._context);

		var context = saw.toArray(),
			matches = Array.from(arguments);

		context = context.map(context => {
			matches.forEach(match => {
				match = typeof match === 'string' ? new RegExp(escapeStringRegexp(match), 'g') : match;
				context = context.replace(match, '');
			});

			return context;
		});

		saw._context = context;

		return saw;
	}

	trim () {
		var saw = new Saw(this._context);

		var context = Array.isArray(saw._context) ? saw._context : saw.toArray(saw._context);

		saw._context = context.map(item => {
			return item ? item.trim() : item;
		});

		return saw;
	}

	split (separator) {
		var saw = new Saw(this._context);

		saw._context = saw._contextToString(saw._context).split(separator);

		return saw;
	}

	slice (begin, end) {
		var saw = new Saw(this._context);

		saw._context = saw._context.slice(begin, end);

		return saw;
	}

	transform (func) {
		var saw = new Saw(this._context);

		saw._context = func(saw._context);

		return saw;
	}

	toString () {
		return this._contextToString(this._context);
	}

	toArray () {
		if (Array.isArray(this._context)) {
			return Array.from(this._context);
		} else if (this._context instanceof Matches) {
			return this._context.toArray();
		} else {
			return this.toBoolean() ? [this._context] : [];
		}
	}

	toNumber () {
		var result = this.toFloat();

		return isNaN(result) ? 0 : result;
	}

	toFloat () {
		var string = this.trim().toString(),
			result = parseFloat(string, 10);

		if (isNaN(result) || string.length != String(result).length) {
			return NaN;
		} else {
			return result;
		}
	}

	toInt () {
		var string = this.trim().toString(),
			result = parseInt(string, 10);

		if (isNaN(result) || string.length != String(result).length) {
			return NaN;
		} else {
			return result;
		}
	}

	toBoolean () {
		return !!this.toString();
	}

	toObject () {
		var props = argumentsToArray(arguments),
			array = this.toArray(),
			object = {};

		props.forEach((value, index) => {
			if (typeof value !== 'undefined' && typeof array[index] != 'undefined') {
				object[value] = array[index] ;
			}
		});

		return object;
	}

	indexOf (match) {
		var saw = new Saw(this._context),
			index = this.indexesOf(match).shift();

		return typeof index !== 'undefined' ? index : -1;
	}

	indexesOf (match) {
		var saw = new Saw(this._context),
			indexes = [];

		if (Array.isArray(this._context)) {
			this._context.forEach((item, i) => {
				if (String(item).match(match) || typeof match === 'function' && match(item)) {
					indexes.push(i);
				}
			});
		} else if (typeof this._context === 'string') {
			var pattern = new RegExp(
				match instanceof RegExp ? match.source : escapeStringRegexp(match),
				match instanceof RegExp ? (String(match.flags).match(/g/) ? (match.flags || '') :(match.flags || '') + 'g') : 'g'
			);

			while (match = pattern.exec(this._context)) {
				indexes.push(match.index);
			}
		}

		return indexes;
	}

	length () {
		if (!this._context) {
			return 0;
		} else {
			return this._context.length;
		}
	}

	_contextToString (context) {
		if (typeof context === 'string') {
			return context;
		} else if (context instanceof Matches) {
			return context.toString();
		} else if (Array.isArray(context)) {
			return context.join('');
		}

		return '';
	}
}

export default Saw;