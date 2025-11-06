import saw from '..';

// Type-only checks (compiled by tsc with noEmit)
// Ensures basic shapes are as expected when consumed by TS users.

const s = saw('one two three');
const arr: string[] = s.split(' ').toArray();
const n: number = s.match(/(\d+)/).first().toNumber();
const b: boolean = s.has('one');
const obj: Record<string, string> = saw('1999-20').match(/(?<year>[0-9]{4})-(?<month>[0-9]{2})/).toObject();

// avoid runtime usage; purely type conformance
void arr;
void n;
void b;
void obj;


