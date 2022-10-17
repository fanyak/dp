"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numpy_1 = require("./numpy");
const helper_1 = require("./helper");
function lis(A) {
    // x[i] is the longest increasing sequence that INCLUDES i === it has at least a value of 1!!!!!!!
    const x = numpy_1.numpy.array({ x: 1, y: A.length }, 1).flatMap(helper_1.identity);
    for (let i of (0, helper_1.range)(-(A.length - 1), 1)) {
        i = (Math.abs(i));
        for (let j of (0, helper_1.range)(i, A.length)) {
            if (A[j] > A[i]) {
                x[i] = Math.max(x[i], x[j] + 1);
            }
        }
    }
    console.log(x);
    // @NOTE: this will return -infinity for empty array: Math.max(...[]) = -infinity
    return Math.max(...x);
}
exports.default = lis;
// lis([13,3,11,7,15]);
function lisPrefix(A) {
    // x[i] is the largest increasing subsequence that INCLUDES i == has minimum value of 1!!!!! 
    const x = numpy_1.numpy.array({ x: 1, y: A.length }, 1).flatMap(helper_1.identity);
    for (let i of (0, helper_1.range)(A.length)) {
        for (let j of (0, helper_1.range)(-i, 1)) {
            j = Math.abs(j);
            if (A[i] > A[j]) {
                x[i] = Math.max(x[i], x[j] + 1);
            }
        }
    }
    // @NOTE: this will return -infinity for empty array: Math.max(...[]) = -infinity
    return Math.max(...x);
}
// console.log(lisPrefix([13,3,11,7,15]));
console.log(lisPrefix([0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]));
