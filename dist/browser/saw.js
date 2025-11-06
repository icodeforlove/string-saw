var stringSaw = (function () {
    'use strict';

    class Matches {
        constructor(matches, match) {
            if (!matches) {
                // Constructor is never called with falsy matches in our flow; keep guard to mirror legacy.
                // Create a benign empty state if it ever happens.
                this.match = match;
                this.matches = [];
                this.length = 0;
                return;
            }
            this.match = match;
            // Preserve legacy behavior (using RegExp.length as in original code)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const regExpAny = match;
            if (match instanceof RegExp && !match.global && regExpAny.length > 1) {
                this.matches = matches.slice(1);
            }
            else {
                this.matches = matches;
            }
            this.length = this.matches.length;
        }
        item(index) {
            let string;
            if (this.matches.length === 1) {
                string = this.matches[0];
            }
            else if (this.matches.length > 1) {
                string = this.matches[this.match.global ? index : index + 1];
            }
            return string || '';
        }
        slice(begin, end) {
            let results = [];
            if (this.matches.length === 1 || this.match.global) {
                results = this.matches.slice(begin, end);
            }
            else if (this.matches.length > 1) {
                results = this.matches.slice((begin || 0) + 1, end);
            }
            return results;
        }
        toArray() {
            let results = [];
            if (this.matches.length === 1 || this.match.global) {
                results = this.matches.slice(0);
            }
            else if (this.matches.length > 1) {
                results = this.matches.slice(1);
            }
            return results;
        }
        toString() {
            let string = '';
            if (this.matches.length === 1) {
                string = this.matches[0];
            }
            else {
                this.matches.forEach(item => {
                    if (item) {
                        string += item;
                    }
                });
            }
            return string;
        }
        clone() {
            // Avoid running constructor logic; copy fields
            const cloned = Object.create(Matches.prototype);
            cloned.match = this.match;
            cloned.matches = Array.prototype.slice.call(this.matches);
            cloned.length = this.length;
            return cloned;
        }
    }

    // Local escapeStringRegexp (mirrors escape-string-regexp@1 behavior)
    const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    function escapeStringRegexp(str) {
        return String(str || '').replace(matchOperatorsRe, '\\$&');
    }
    function argumentsToArray(args) {
        let result;
        // mirror legacy behavior
        // more than 1 arg -> use as array
        // single arg and it's an array -> use that array
        // otherwise wrap single arg in array
        if ('length' in args && args.length > 1) {
            result = Array.from(args);
        }
        else if (Array.isArray(args[0])) {
            result = args[0];
        }
        else {
            result = [args[0]];
        }
        return result;
    }
    class Saw {
        constructor(object) {
            if (typeof object === 'number') {
                this._context = String(object);
            }
            else if (Array.isArray(object)) {
                this._context = object.slice(0);
            }
            else if (object instanceof Matches) {
                this._context = object.clone();
            }
            else {
                this._context = object;
            }
        }
        match(match) {
            const matchArray = argumentsToArray(arguments);
            const saw = new Saw(this._context);
            const context = this._contextToString(this._context);
            matchArray.some((m) => {
                let matcher = m;
                if (typeof matcher === 'string') {
                    // prevents handling strings as regular expressions
                    matcher = escapeStringRegexp(String(matcher || ''));
                }
                const matches = typeof matcher === 'function' ? matcher(context) : context.match(matcher);
                if (!matches) {
                    saw._context = '';
                }
                else {
                    saw._context = new Matches(matches, m);
                    return true;
                }
                return false;
            });
            return saw;
        }
        matchAll(match) {
            const saw = new Saw(this._context);
            const array = saw.toArray();
            const results = [];
            for (const string of array) {
                [...string.matchAll(match)].forEach(m => {
                    if (m.groups) {
                        const g = m.groups;
                        const obj = Object.fromEntries(Object.keys(g).map(k => [k, g[k]]));
                        results.push(obj);
                    }
                    else {
                        results.push(m.slice(1));
                    }
                });
            }
            return results;
        }
        has(match) {
            return this.match(match).first().toBoolean();
        }
        item(index) {
            const saw = new Saw(this._context);
            if (saw._context instanceof Matches) {
                saw._context = saw._context.item(index);
            }
            else if (Array.isArray(saw._context)) {
                saw._context = saw._context[index] || '';
            }
            return saw;
        }
        itemFromRight(index) {
            let saw = new Saw(this._context);
            if (saw._context instanceof Matches || Array.isArray(saw._context)) {
                const length = saw._context.length;
                index = length - 1 - index;
                if (index >= 0) {
                    saw = saw.item(index);
                }
            }
            return saw;
        }
        first() {
            const saw = new Saw(this._context);
            return saw.item(0);
        }
        last() {
            const saw = new Saw(this._context);
            return saw.itemFromRight(0);
        }
        replace(match, replacement) {
            const saw = new Saw(this._context);
            function replaceString(string, matches, replacement) {
                const m = Array.isArray(matches) ? matches : [matches];
                m.some(match => {
                    if (string.match(match)) {
                        string = string.replace(match, replacement);
                        return true;
                    }
                    return false;
                });
                return string;
            }
            if (Array.isArray(saw._context)) {
                saw._context = saw._context.map(string => {
                    return string.replace(match, replacement);
                });
            }
            else {
                saw._context = replaceString(this._contextToString(this._context), match, replacement);
            }
            return saw;
        }
        join(separator) {
            const saw = new Saw(this._context);
            const array = saw.toArray();
            if (array.length) {
                let result = '';
                array.forEach((item, index, array) => {
                    const currentSeparator = typeof separator == 'function' ? separator(item, index, array) : separator || '';
                    result += item + (array.length - 1 == index ? '' : currentSeparator);
                });
                saw._context = result;
            }
            return saw;
        }
        each(func, thisArg) {
            const saw = new Saw(this._context);
            // Note: adds array as a third param
            const array = saw.toArray();
            array.forEach((item, index) => {
                if (item) {
                    func.bind(thisArg)(item, index, array);
                }
            });
            return saw;
        }
        map(func, thisArg) {
            const saw = new Saw(this._context);
            // Note: adds array as a third param
            const array = saw.toArray();
            saw._context = array.map((item, index) => {
                return func.bind(thisArg)(item, index, array);
            });
            return saw;
        }
        reduce(func, thisArg) {
            const saw = new Saw(this._context);
            // Note: adds array as a third param
            const array = saw.toArray();
            saw._context = String(array.reduce((previousValue, currentValue, index, array) => {
                return func.bind(thisArg)(previousValue, currentValue, index, array);
            }));
            return saw;
        }
        reverse() {
            const saw = new Saw(this._context);
            if (typeof saw._context === 'string') {
                saw._context = saw._context.split('').reverse().join('');
            }
            else if (Array.isArray(saw._context)) {
                saw._context = saw._context.reverse();
            }
            else if (saw._context instanceof Matches) {
                const array = saw.toArray();
                if (array.length === 1) {
                    saw._context = (array[0] || '').split('').reverse().join('');
                }
                else {
                    saw._context = saw.toArray().reverse();
                }
            }
            return saw;
        }
        sort(func) {
            const saw = new Saw(this._context);
            if (typeof saw._context === 'string') {
                saw._context = saw._context.split('').sort(func).join('');
            }
            else if (Array.isArray(saw._context)) {
                saw._context = saw._context.sort(func);
            }
            else if (saw._context instanceof Matches) {
                const array = saw.toArray();
                if (array.length === 1) {
                    saw._context = (array[0] || '').split('').sort(func).join('');
                }
                else {
                    saw._context = saw.toArray().sort(func);
                }
            }
            return saw;
        }
        prepend(string) {
            const saw = new Saw(this._context);
            const array = saw.toArray();
            saw._context = array.map(item => string + String(item));
            return saw;
        }
        append(string) {
            const saw = new Saw(this._context);
            const array = saw.toArray();
            saw._context = array.map(item => String(item) + string);
            return saw;
        }
        capitalize() {
            const saw = new Saw(this._context);
            const array = saw.toArray();
            saw._context = array.map((item) => {
                return new Saw(item).replace(/\b./g, (match) => match.toUpperCase()).toString();
            });
            return saw;
        }
        lowerCase() {
            return this.mapStringMethodAgainstContext('toLowerCase');
        }
        upperCase() {
            return this.mapStringMethodAgainstContext('toUpperCase');
        }
        mapStringMethodAgainstContext(methodName, _func) {
            const saw = new Saw(this._context);
            // Note: adds array as a third param
            const array = saw.toArray();
            saw._context = array.map(item => {
                return item ? String(item)[methodName]() : item;
            });
            return saw;
        }
        find(match, thisArg) {
            const saw = new Saw(this._context);
            // properly escape strings that will be interpreted as regular expressions
            match = typeof match == 'string' ? escapeStringRegexp(String(match || '')) : match;
            // default find
            match = match || ((item) => item);
            // Note: adds array as a third param
            const array = saw.toArray();
            saw._context = array.find((item, index) => {
                if (typeof match === 'function') {
                    return match.bind(thisArg)(item, index, array);
                }
                else {
                    return item.match(match);
                }
            });
            return saw;
        }
        filter(match, thisArg) {
            const saw = new Saw(this._context);
            // properly escape strings that will be interpreted as regular expressions
            match = typeof match == 'string' ? escapeStringRegexp(String(match || '')) : match;
            // default filter
            match = match || ((item) => item);
            // Note: adds array as a third param
            const array = saw.toArray();
            saw._context = array.filter((item, index) => {
                if (typeof match === 'function') {
                    return match.bind(thisArg)(item, index, array);
                }
                else {
                    return item.match(match);
                }
            });
            return saw;
        }
        filterNot(match, thisArg) {
            const saw = new Saw(this._context);
            // properly escape strings that will be interprited as regular expressions
            match = typeof match == 'string' ? escapeStringRegexp(String(match || '')) : match;
            // Note: adds array as a third param
            const array = saw.toArray();
            saw._context = array.filter((item, index) => {
                if (typeof match === 'function') {
                    return !match.bind(thisArg)(item, index, array);
                }
                else {
                    return !item.match(match);
                }
            });
            return saw;
        }
        remove(...matchesToRemove) {
            const saw = new Saw(this._context);
            let context = saw.toArray();
            const matches = Array.from(arguments);
            context = context.map(context => {
                matches.forEach(match => {
                    match = typeof match === 'string' ? new RegExp(escapeStringRegexp(String(match || '')), 'g') : match;
                    context = context.replace(match, '');
                });
                return context;
            });
            saw._context = context;
            return saw;
        }
        uniq() {
            const saw = new Saw(this._context);
            const array = saw.toArray();
            if (array.length) {
                saw._context = array.filter((value, index) => array.indexOf(value) === index);
            }
            return saw;
        }
        trim() {
            const saw = new Saw(this._context);
            const context = Array.isArray(saw._context) ? saw._context : saw.toArray();
            saw._context = context.map(item => {
                return item ? item.trim() : item;
            });
            return saw;
        }
        split(separator) {
            const saw = new Saw(this._context);
            saw._context = saw._contextToString(saw._context).split(separator);
            return saw;
        }
        slice(begin, end) {
            const saw = new Saw(this._context);
            const context = Array.isArray(saw._context) ? saw._context : this._contextToString(saw._context);
            saw._context = context.slice(begin, end);
            return saw;
        }
        transform(func) {
            const saw = new Saw(this._context);
            saw._context = func(saw._context);
            return saw;
        }
        toString() {
            return this._contextToString(this._context);
        }
        toArray() {
            if (Array.isArray(this._context)) {
                return Array.from(this._context);
            }
            else if (this._context instanceof Matches) {
                return this._context.toArray();
            }
            else {
                return this.toBoolean() ? [this._context] : [];
            }
        }
        toNumber() {
            const result = this.toFloat();
            return isNaN(result) ? 0 : result;
        }
        toFloat() {
            const string = this.trim().toString();
            const result = parseFloat(string);
            if (isNaN(result) || ((String(string).replace(/\.0+$/, '').length != String(result).length) && string != result)) {
                return NaN;
            }
            else {
                return result;
            }
        }
        toInt() {
            const string = this.trim().toString();
            const result = parseInt(string, 10);
            if (isNaN(result) || string.length != String(result).length) {
                return NaN;
            }
            else {
                return result;
            }
        }
        toBoolean() {
            return !!this.toString();
        }
        toObject(...props) {
            const propsArray = argumentsToArray(arguments);
            const array = this.toArray();
            let object = {};
            if (arguments.length) {
                propsArray.forEach((value, index) => {
                    if (typeof value !== 'undefined' && typeof array[index] != 'undefined') {
                        object[value] = array[index];
                    }
                });
            }
            else if (this._context &&
                this._context.matches &&
                this._context.matches.groups) {
                const g = this._context.matches.groups;
                object = Object.fromEntries(Object.keys(g).map(k => [k, g[k]]));
            }
            return object;
        }
        startsWith(match) {
            const saw = new Saw(this._context);
            const array = saw.toArray();
            const regExp = match ? new RegExp(`^${escapeStringRegexp(String(match || ''))}`) : null;
            let matches = array.length ? true : false;
            for (const item of array) {
                if (!match || !item || !regExp || !regExp.test(item)) {
                    matches = false;
                    break;
                }
            }
            return matches;
        }
        endsWith(match) {
            const saw = new Saw(this._context);
            const array = saw.toArray();
            const regExp = match ? new RegExp(`${escapeStringRegexp(String(match || ''))}$`) : null;
            let matches = array.length ? true : false;
            for (const item of array) {
                if (!match || !item || !regExp || !regExp.test(item)) {
                    matches = false;
                    break;
                }
            }
            return matches;
        }
        indexOf(match) {
            const saw = new Saw(this._context);
            const index = this.indexesOf(match).shift();
            return typeof index !== 'undefined' ? index : -1;
        }
        indexesOf(match) {
            const saw = new Saw(this._context);
            const indexes = [];
            if (Array.isArray(this._context)) {
                this._context.forEach((item, i) => {
                    if (String(item).match(match instanceof RegExp ? match : escapeStringRegexp(String(match || ''))) || typeof match === 'function' && match(item)) {
                        indexes.push(i);
                    }
                });
            }
            else if (typeof this._context === 'string') {
                const pattern = new RegExp(match instanceof RegExp ? match.source : escapeStringRegexp(String(match || '')), match instanceof RegExp ? (String(match.flags).match(/g/) ? (match.flags || '') : (match.flags || '') + 'g') : 'g');
                let m;
                // eslint-disable-next-line no-cond-assign
                while (m = pattern.exec(this._context)) {
                    indexes.push(m.index);
                }
            }
            return indexes;
        }
        length() {
            if (!this._context) {
                return 0;
            }
            else {
                return this._context.length;
            }
        }
        _contextToString(context) {
            if (typeof context === 'string') {
                return context;
            }
            else if (context instanceof Matches) {
                return context.toString();
            }
            else if (Array.isArray(context)) {
                return context.join('');
            }
            return '';
        }
    }

    function saw(input) {
        return new Saw(input);
    }

    return saw;

})();
