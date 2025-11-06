export default class Matches {
    match: RegExp;
    matches: any[];
    length: number;
    constructor(matches: RegExpMatchArray | string[], match: RegExp);
    item(index: number): string;
    slice(begin?: number, end?: number): any[];
    toArray(): any[];
    toString(): string;
    clone(): Matches;
}
