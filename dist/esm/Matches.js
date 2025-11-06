export default class Matches {
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
