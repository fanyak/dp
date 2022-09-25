"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.range = void 0;
/**
 * simulate python's range
 * @param args start and end numbers
 * end is EXCLUDED
 */
function* range(...args) {
    let [start, end] = args;
    if (!Number.isInteger(start) && !Number.isInteger(end)) {
        throw new Error('not integer range');
    }
    if (end === undefined) {
        end = start;
        start = 0;
    }
    while (start < end) {
        yield start++;
    }
}
exports.range = range;
