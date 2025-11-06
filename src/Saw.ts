import Matches from './Matches';

// Local escapeStringRegexp (mirrors escape-string-regexp@1 behavior)
const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
function escapeStringRegexp(str: string): string {
	return String(str || '').replace(matchOperatorsRe, '\\$&');
}

type MatcherFn = (s: string) => RegExpMatchArray | null;
type Matcher = string | RegExp | MatcherFn;
export type SawInput = number | string | string[] | Matches;

function argumentsToArray(args: IArguments | any[]): any[] {
	let result: any[];

	// mirror legacy behavior
	// more than 1 arg -> use as array
	// single arg and it's an array -> use that array
	// otherwise wrap single arg in array
	if ('length' in args && args.length > 1) {
		result = Array.from(args as any);
	} else if (Array.isArray((args as any)[0])) {
		result = (args as any)[0];
	} else {
		result = [(args as any)[0]];
	}

	return result;
}

export default class Saw {
	private _context: string | string[] | Matches | undefined;

	constructor(object: SawInput | undefined) {
		if (typeof object === 'number') {
			this._context = String(object);
		} else if (Array.isArray(object)) {
			this._context = object.slice(0);
		} else if (object instanceof Matches) {
			this._context = object.clone();
		} else {
			this._context = object as any;
		}
	}

	match(match: Matcher | Matcher[]): Saw {
		const matchArray: Matcher[] = argumentsToArray(arguments);
		const saw = new Saw(this._context);
		const context = this._contextToString(this._context);

		matchArray.some((m: Matcher) => {
			let matcher: Matcher = m;
			if (typeof matcher === 'string') {
				// prevents handling strings as regular expressions
				matcher = escapeStringRegexp(String(matcher || ''));
			}

			const matches =
				typeof matcher === 'function' ? (matcher as MatcherFn)(context) : context.match(matcher as string | RegExp);

			if (!matches) {
				saw._context = '';
			} else {
				saw._context = new Matches(matches, m as RegExp);
				return true;
			}
			return false;
		});

		return saw;
	}

	matchAll(match: RegExp): Array<Record<string, string> | string[]> {
		const saw = new Saw(this._context);
		const array = saw.toArray();

		const results: Array<Record<string, string> | string[]> = [];

		for (const string of array) {
			[...string.matchAll(match)].forEach(m => {
				if ((m as any).groups) {
					const g = (m as any).groups as Record<string, string>;
					const obj = Object.fromEntries(Object.keys(g).map(k => [k, g[k]]));
					results.push(obj as Record<string, string>);
				} else {
					results.push(m.slice(1));
				}
			});
		}

		return results;
	}

	has(match: Matcher | Matcher[]): boolean {
		return this.match(match as any).first().toBoolean();
	}

	item(index: number): Saw {
		const saw = new Saw(this._context);

		if (saw._context instanceof Matches) {
			(saw as any)._context = saw._context.item(index);
		} else if (Array.isArray(saw._context)) {
			(saw as any)._context = (saw._context[index] as string) || '';
		}

		return saw;
	}

	itemFromRight(index: number): Saw {
		let saw = new Saw(this._context);

		if (saw._context instanceof Matches || Array.isArray(saw._context)) {
			const length = (saw._context as any).length;

			index = length - 1 - index;
			if (index >= 0) {
				saw = saw.item(index);
			}
		}

		return saw;
	}

	first(): Saw {
		const saw = new Saw(this._context);
		return saw.item(0);
	}

	last(): Saw {
		const saw = new Saw(this._context);
		return saw.itemFromRight(0);
	}

	replace(match: string | RegExp | (string | RegExp)[], replacement: string | ((substring: string, ...args: any[]) => string)): Saw {
		const saw = new Saw(this._context);

		function replaceString(string: string, matches: string | RegExp | (string | RegExp)[], replacement: any) {
			const m = Array.isArray(matches) ? matches : [matches];

			m.some(match => {
				if (string.match(match)) {
					string = string.replace(match as any, replacement);
					return true;
				}
				return false;
			});

			return string;
		}

		if (Array.isArray(saw._context)) {
			(saw as any)._context = (saw._context as string[]).map(string => {
				return string.replace(match as any, replacement as any);
			});
		} else {
			(saw as any)._context = replaceString(this._contextToString(this._context), match, replacement);
		}

		return saw;
	}

	join(separator: string | ((item: string, index: number, array: string[]) => string)): Saw {
		const saw = new Saw(this._context);
		const array = saw.toArray();

		if (array.length) {
			let result = '';

			array.forEach((item, index, array) => {
				const currentSeparator = typeof separator == 'function' ? (separator as any)(item, index, array) : separator || '';
				result += item + (array.length - 1 == index ? '' : currentSeparator);
			});

			(saw as any)._context = result;
		}

		return saw;
	}

	each(func: (item: string, index: number, array: string[]) => any, thisArg?: unknown): Saw {
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

	map<T = string>(func: (item: string, index: number, array: string[]) => T, thisArg?: unknown): Saw {
		const saw = new Saw(this._context);

		// Note: adds array as a third param
		const array = saw.toArray();
		(saw as any)._context = array.map((item, index) => {
			return func.bind(thisArg)(item, index, array);
		});

		return saw;
	}

	reduce(func: (previousValue: any, currentValue: string, index: number, array: string[]) => any, thisArg?: unknown): Saw {
		const saw = new Saw(this._context);

		// Note: adds array as a third param
		const array = saw.toArray();
		(saw as any)._context = String(array.reduce((previousValue: any, currentValue, index, array) => {
			return func.bind(thisArg)(previousValue, currentValue, index, array);
		}));

		return saw;
	}

	reverse(): Saw {
		const saw = new Saw(this._context);

		if (typeof saw._context === 'string') {
			(saw as any)._context = (saw._context as string).split('').reverse().join('');
		} else if (Array.isArray(saw._context)) {
			(saw as any)._context = (saw._context as string[]).reverse();
		} else if (saw._context instanceof Matches) {
			const array = saw.toArray();
			if (array.length === 1) {
				(saw as any)._context = (array[0] || '').split('').reverse().join('');
			} else {
				(saw as any)._context = saw.toArray().reverse();
			}
		}

		return saw;
	}

	sort(func?: (a: string, b: string) => number): Saw {
		const saw = new Saw(this._context);

		if (typeof saw._context === 'string') {
			(saw as any)._context = (saw._context as string).split('').sort(func).join('');
		} else if (Array.isArray(saw._context)) {
			(saw as any)._context = (saw._context as string[]).sort(func);
		} else if (saw._context instanceof Matches) {
			const array = saw.toArray();
			if (array.length === 1) {
				(saw as any)._context = (array[0] || '').split('').sort(func).join('');
			} else {
				(saw as any)._context = saw.toArray().sort(func);
			}
		}

		return saw;
	}

	prepend(string: string): Saw {
		const saw = new Saw(this._context);

		const array = saw.toArray();
		(saw as any)._context = array.map(item => string + String(item));

		return saw;
	}

	append(string: string): Saw {
		const saw = new Saw(this._context);

		const array = saw.toArray();
		(saw as any)._context = array.map(item => String(item) + string);

		return saw;
	}

	capitalize(): Saw {
		const saw = new Saw(this._context);

		const array = saw.toArray();
		(saw as any)._context = array.map((item) => {
			return new Saw(item).replace(/\b./g, (match: string) => match.toUpperCase()).toString();
		});

		return saw;
	}

	lowerCase(): Saw {
		return this.mapStringMethodAgainstContext('toLowerCase');
	}

	upperCase(): Saw {
		return this.mapStringMethodAgainstContext('toUpperCase');
	}

	private mapStringMethodAgainstContext(methodName: 'toLowerCase' | 'toUpperCase', _func?: unknown): Saw {
		const saw = new Saw(this._context);

		// Note: adds array as a third param
		const array = saw.toArray();
		(saw as any)._context = array.map(item => {
			return item ? (String(item) as any)[methodName]() : (item as any);
		});

		return saw;
	}

	find(match?: Matcher, thisArg?: unknown): Saw {
		const saw = new Saw(this._context);

		// properly escape strings that will be interpreted as regular expressions
		match = typeof match == 'string' ? escapeStringRegexp(String(match || '')) : match;

		// default find
		match = (match as any) || ((item: string) => item);

		// Note: adds array as a third param
		const array = saw.toArray();
		(saw as any)._context = array.find((item, index) => {
			if (typeof match === 'function') {
				return (match as any).bind(thisArg)(item, index, array);
			} else {
				return item.match(match as any);
			}
		});

		return saw;
	}

	filter(match?: Matcher, thisArg?: unknown): Saw {
		const saw = new Saw(this._context);

		// properly escape strings that will be interpreted as regular expressions
		match = typeof match == 'string' ? escapeStringRegexp(String(match || '')) : match;

		// default filter
		match = (match as any) || ((item: string) => item);

		// Note: adds array as a third param
		const array = saw.toArray();
		(saw as any)._context = array.filter((item, index) => {
			if (typeof match === 'function') {
				return (match as any).bind(thisArg)(item, index, array);
			} else {
				return item.match(match as any);
			}
		});

		return saw;
	}

	filterNot(match?: Matcher, thisArg?: unknown): Saw {
		const saw = new Saw(this._context);

		// properly escape strings that will be interprited as regular expressions
		match = typeof match == 'string' ? escapeStringRegexp(String(match || '')) : match;

		// Note: adds array as a third param
		const array = saw.toArray();
		(saw as any)._context = array.filter((item, index) => {
			if (typeof match === 'function') {
				return !(match as any).bind(thisArg)(item, index, array);
			} else {
				return !item.match(match as any);
			}
		});

		return saw;
	}

	remove(...matchesToRemove: Array<string | RegExp>): Saw {
		const saw = new Saw(this._context);

		let context = saw.toArray();
		const matches = Array.from(arguments);

		context = context.map(context => {
			matches.forEach(match => {
				match = typeof match === 'string' ? new RegExp(escapeStringRegexp(String(match || '')), 'g') : match;
				context = context.replace(match as any, '');
			});

			return context;
		});

		(saw as any)._context = context;

		return saw;
	}

	uniq(): Saw {
		const saw = new Saw(this._context);
		const array = saw.toArray();

		if (array.length) {
			(saw as any)._context = array.filter((value, index) => array.indexOf(value) === index);
		}

		return saw;
	}

	trim(): Saw {
		const saw = new Saw(this._context);

		const context = Array.isArray(saw._context) ? (saw._context as string[]) : saw.toArray();

		(saw as any)._context = context.map(item => {
			return item ? item.trim() : (item as any);
		});

		return saw;
	}

	split(separator: string | RegExp): Saw {
		const saw = new Saw(this._context);

		(saw as any)._context = saw._contextToString(saw._context).split(separator as any);

		return saw;
	}

	slice(begin?: number, end?: number): Saw {
		const saw = new Saw(this._context);

		const context = Array.isArray(saw._context) ? (saw._context as string[]) : this._contextToString(saw._context);

		(saw as any)._context = (context as any).slice(begin, end);

		return saw;
	}

	transform<T = unknown>(func: (context: any) => T): Saw {
		const saw = new Saw(this._context);

		(saw as any)._context = func((saw as any)._context);

		return saw;
	}

	toString(): string {
		return this._contextToString(this._context);
	}

	toArray(): string[] {
		if (Array.isArray(this._context)) {
			return Array.from(this._context);
		} else if (this._context instanceof Matches) {
			return this._context.toArray();
		} else {
			return this.toBoolean() ? [this._context as string] : [];
		}
	}

	toNumber(): number {
		const result = this.toFloat();

		return isNaN(result) ? 0 : (result as number);
	}

	toFloat(): number {
		const string = this.trim().toString();
		const result = parseFloat(string as any);

		if (isNaN(result) || ((String(string).replace(/\.0+$/, '').length != String(result).length) && (string as any) != result)) {
			return NaN;
		} else {
			return result;
		}
	}

	toInt(): number {
		const string = this.trim().toString();
		const result = parseInt(string as any, 10);

		if (isNaN(result) || string.length != String(result).length) {
			return NaN as any;
		} else {
			return result;
		}
	}

	toBoolean(): boolean {
		return !!this.toString();
	}

	toObject(...props: Array<string> | [string[]]): Record<string, string> {
		const propsArray = argumentsToArray(arguments);
		const array = this.toArray();
		let object: Record<string, string> = {};

		if (arguments.length) {
			propsArray.forEach((value: string, index: number) => {
				if (typeof value !== 'undefined' && typeof array[index] != 'undefined') {
					object[value] = array[index];
				}
			});
		} else if (
			(this as any)._context &&
			(this as any)._context.matches &&
			(this as any)._context.matches.groups
		) {
			const g = (this as any)._context.matches.groups as Record<string, string>;
			object = Object.fromEntries(Object.keys(g).map(k => [k, g[k]]));
		}

		return object;
	}

	startsWith(match?: string): boolean {
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

	endsWith(match?: string): boolean {
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

	indexOf(match: string | RegExp | ((item: string) => boolean)): number {
		const saw = new Saw(this._context);
		const index = this.indexesOf(match).shift();

		return typeof index !== 'undefined' ? index : -1;
	}

	indexesOf(match: string | RegExp | ((item: string) => boolean)): number[] {
		const saw = new Saw(this._context);
		const indexes: number[] = [];

		if (Array.isArray(this._context)) {
			(this._context as string[]).forEach((item, i) => {
				if (String(item).match(match instanceof RegExp ? match : escapeStringRegexp(String(match as any || ''))) || typeof match === 'function' && (match as any)(item)) {
					indexes.push(i);
				}
			});
		} else if (typeof this._context === 'string') {
			const pattern = new RegExp(
				match instanceof RegExp ? match.source : escapeStringRegexp(String(match as any || '')),
				match instanceof RegExp ? (String((match as RegExp).flags).match(/g/) ? ((match as RegExp).flags || '') : ((match as RegExp).flags || '') + 'g') : 'g'
			);

			let m: RegExpExecArray | null;
			// eslint-disable-next-line no-cond-assign
			while (m = pattern.exec(this._context as string)) {
				indexes.push(m.index);
			}
		}

		return indexes;
	}

	length(): number {
		if (!(this as any)._context) {
			return 0;
		} else {
			return (this as any)._context.length;
		}
	}

	private _contextToString(context: string | string[] | Matches | undefined): string {
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


