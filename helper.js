"use strict";

if (!window || !("exports" in window)) {
   var exports = {}
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.identity = exports.binarySearch = exports.safeIndex = exports.evaluate = exports.range = void 0;



/**
 * simulate python's range, which calcuates a new value on every iteration,
 * not all at once
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
/**
 *
 * @param str containing digits and arithmetic signs for example `-4+11*-5+6+8`
 * @returns the number after the evalation of the string
 */
function evaluate(str) {
    if (!(new RegExp(/^((-?\d)+(\*|\+){1})+\d$/).test(str))) {
        throw Error('the string can only contain string and arithmetic operations except division');
    }
    const res = new Function(`return ${str}`);
    return res();
}
exports.evaluate = evaluate;
/**
 *
 * @param obj an object or an array
 * @param safeValue value to return when obj keyed value is not found
 * @returns the object with safeValue when key isn't found
 */
function safeIndex(obj, safeValue) {
    let proxy = new Proxy(obj, {
        get(target, key, receiver) {
            let keys = Object.keys(target);
            if (keys.includes(key)) {
                return target[key];
            }
            return safeValue;
        }
    });
    return proxy;
}
exports.safeIndex = safeIndex;
/**
 *
 * @param A a sequense to search in
 * @param start index for searching
 * @param end index for search
 * @param value to search for
 * @returns the index where the value was found in A, or undefined if the value wasn't found in A
 */
function binarySearch(A, start, end, value) {
    if ((end - start + 1) < 2) {
        if (A[end] == value) {
            return end;
        }
        return;
    }
    let medPoint = Math.floor((end + start) / 2);
    if (A[medPoint] == value) {
        return medPoint;
    }
    else {
        if (value < A[medPoint]) {
            return binarySearch(A, start, medPoint - 1, value);
        }
        return binarySearch(A, medPoint + 1, end, value);
    }
}
exports.binarySearch = binarySearch;
function identity(value) {
    return value;
}
exports.identity = identity;


    export {range};


