function Matches (matches, match) {
	if (!matches) return null;

	this.match = match;

	if (match instanceof RegExp && !match.global && match.length > 1) {
		this.matches = matches.slice(1);
	} else {
		this.matches = matches;
	}

	this.length = this.matches.length;
}
Matches.prototype = {
	item: function (index) {
		var string;

		if (this.matches.length === 1) {
			string = this.matches[0];
		} else if (this.matches.length > 1) {
			string = this.matches[this.match.global ? index : index + 1];
		}

		return string || '';
	},

	slice: function (begin, end) {
		var results = [];

		if (this.matches.length === 1 || this.match.global) {
			results = this.matches.slice(begin, end);
		} else if (this.matches.length > 1) {
			results = this.matches.slice(begin + 1, end);
		}

		return results;
	},

	toArray: function (begin, end) {
		var results = [];

		if (this.matches.length === 1 || this.match.global) {
			results = this.matches.slice(0);
		} else if (this.matches.length > 1) {
			results = this.matches.slice(1);
		}

		return results;
	},

	toString: function () {
		var string = '';

		if (this.matches.length === 1) {
			string = this.matches[0];
		} else {
			this.matches.forEach(function (item) {
				if (item) {
					string += item;
				}
			});
		}

		return string;
	},

	clone: function () {
		var matches = new Matches(null)
		matches.match = this.match;
		matches.matches = Array.prototype.slice.call(this.matches);
		matches.length = this.length;
		return matches;
	}
};

module.exports = Matches;