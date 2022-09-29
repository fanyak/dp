"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper_1 = require("./helper");
const numpy_1 = require("./numpy");
function main(s1, s2) {
    if (!s1.length || !s2.length) {
        return 0;
    }
    let m = numpy_1.numpy.array({ x: s1.length, y: s2.length }, 0);
    // compare all the lengths of s1 to all the lengths of s2 => O(s1.length*s2.length)    
    // initialize corner values
    for (let i of (0, helper_1.range)(s1.length)) {
        if (s1[i] === s2[0]) {
            m[i][0] = 1;
        }
        else {
            m[i][0] = m[i - 1] ? m[i - 1][0] : 0;
        }
    }
    for (let j of (0, helper_1.range)(s2.length)) {
        if (s1[0] === s2[j]) {
            m[0][j] = 1;
        }
        else {
            m[0][j] = m[0][j - 1] || 0;
        }
    }
    // after initialization
    for (let i of (0, helper_1.range)(1, s1.length)) {
        for (let j of (0, helper_1.range)(1, s2.length)) {
            if (s1[i] === s2[j]) {
                m[i][j] = m[i - 1][j - 1] + 1;
            }
            else {
                m[i][j] = Math.max(m[i - 1][j], m[i][j - 1]);
            }
        }
    }
    console.log(m);
    return m.at(-1)?.at(-1) || 0;
}
exports.default = main;
let s1 = 'ABCBDAB';
let s2 = 'BDCABA';
console.log(main(s1, s2));
