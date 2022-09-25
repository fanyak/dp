"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const numpy_1 = require("./numpy");
const helper_1 = require("./helper");
// const nums: number[] = [-4, 11, -5, 6, 8, -2, 7];
// const signs = ["+", "*", "+", "+", "+", "*"] as const;
const nums = [7, -4, 3, -5];
const signs = ["+", "*", "+"];
const signValues = Object.values(signs);
function operation(sign) {
    const add = (a, b) => a + b;
    const multiply = (a, b) => a * b;
    if (sign === "+") {
        return add;
    }
    return multiply;
}
const n = nums.length;
const s = signs.length;
const max = numpy_1.numpy.array({ x: n, y: n }, 0);
const min = numpy_1.numpy.array({ x: n, y: n }, 0);
// create all prefixes for length 1
for (let i of (0, helper_1.range)(n)) {
    max[i][i] = nums[i];
    min[i][i] = nums[i];
}
// create rest of prefixes for length > 1
for (let diff of (0, helper_1.range)(1, n)) {
    for (let i of (0, helper_1.range)(n - diff)) {
        let j = i + diff;
        max[i][j] = -Infinity;
        min[i][j] = Infinity;
        // find k!!
        for (let k of (0, helper_1.range)(i, j)) {
            let op = operation(signs[k]);
            let q = op(max[i][k], max[k + 1][j]);
            let r = op(min[i][k], min[k + 1][j]);
            if (q > max[i][j])
                max[i][j] = q;
            if (r > max[i][j])
                max[i][j] = r;
            if (r < min[i][j])
                min[i][j] = r;
        }
    }
}
console.log(max);
// console.log(min);
