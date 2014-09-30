var Matches = require('./Matches');

/**
 * Escapes a string to be used within a RegExp
 * 
 * @param  {String} string
 * @return {String}
 */
function escapeRegExp (string) {
  return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Converts an array like object to a fresh array
 * 
 * @param  {Array} array
 * @return {Array}
 */
function toArray (object) {
	return Array.prototype.slice.call(object);
}

function Saw (object) {
	if (Array.isArray(object)) {
		this._context = object.slice(0);
	} else if (object instanceof Matches) {
		this._context = object.clone();
	} else {
		this._context = object;
	}
}
Saw.prototype = {
	match: function (match) {
		var saw = new Saw(this._context);

		var context = this._contextToString(saw._context),
			matches = context.match(match);

		if (!matches) {
			saw._context = '';
		} else {
			saw._context = new Matches(matches, match);
		}

		return saw;
	},

	item: function (index) {
		var saw = new Saw(this._context);

		if (saw._context instanceof Matches) {
			saw._context = saw._context.item(index);
		} else if (Array.isArray(saw._context)) {
			saw._context = saw._context[index] || '';
		}

		return saw;
	},

	itemFromRight: function (index) {
		var saw = new Saw(this._context);

		if (saw._context instanceof Matches || Array.isArray(saw._context)) {
			var length = saw._context.length;

			index = length - 1 - index;
			if (index >= 0) {
				saw = saw.item(index);
			}
		}

		return saw;
	},

	first: function (index) {
		var saw = new Saw(this._context);

		return saw.item(0);
	},

	last: function () {
		var saw = new Saw(this._context);
	
		return saw.itemFromRight(0);
	},

	replace: function (match, replacement) {
		var saw = new Saw(this._context);

		var context = this._contextToString(saw._context);

		saw._context = context.replace(match, replacement);

		return saw;
	},

	join: function (separator) {
		var saw = new Saw(this._context);

		if (Array.isArray(saw._context)) {
			saw._context = saw._context.join(separator || '');
		}

		return saw;
	},

	map: function (func) {
		var saw = new Saw(this._context);

		saw._context = saw.toArray().map(func);

		return saw;
	},

	filter: function (func) {
		var saw = new Saw(this._context);

		saw._context = saw.toArray().filter(func);

		return saw;
	},

	remove: function () {
		var saw = new Saw(this._context);

		var context = this._contextToString(saw._context),
			matches = toArray(arguments);
		
		matches.forEach(function (match) {
			match = typeof match === 'string' ? new RegExp(escapeRegExp(match), 'g') : match;
			context = context.replace(match, '');
		});
		
		saw._context = context;
		
		return saw;
	},

	trim: function () {
		var saw = new Saw(this._context);

		var context = Array.isArray(saw._context) ? saw._context : saw.toArray(saw._context);

		saw._context = context.map(function (item) {
			return item.trim();
		});

		return saw;
	},

	split: function (separator) {
		var saw = new Saw(this._context);

		saw._context = saw._contextToString(saw._context).split(separator);

		return saw;
	},

	slice: function (begin, end) {
		var saw = new Saw(this._context);

		if (saw._context instanceof Matches || Array.isArray(saw._context)) {
			saw._context = saw._context.slice(begin, end);
		}

		return saw;
	},

	toString: function () {
		return this._contextToString(this._context);
	},

	toArray: function () {
		if (Array.isArray(this._context)) {
			return toArray(this._context);
		} else if (this._context instanceof Matches) {
			return toArray(this._context.matches);
		} else {
			return [this._context];
		}
	},

	toNumber: function () {
		return parseInt(this.toString(), 10);
	},

	toBoolean: function () {
		return !!this.toString();
	},

	_contextToString: function (context) {
		if (typeof context === 'string') {
			return context;
		} else if (context instanceof Matches) {
			return context.toString();
		} else if (Array.isArray(context)) {
			return context.join('');
		}

		return '';
	}
};

module.exports = Saw;