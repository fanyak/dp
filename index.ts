import { numpy as np } from "./numpy";
import { range } from "./helper";

// const nums: number[] = [-4, 11, -5, 6, 8, -2, 7];
// const signs = ["+", "*", "+", "+", "+", "*"] as const;

const nums: number[] = [7, -4, 3, -5];
const signs = ["+", "*", "+"] as const;

const signValues = Object.values(signs);
type ValueOf<T> = T[keyof T];
type Sign = ValueOf<typeof signValues>;

function operation (sign: Sign): (n1: number, n2: number) => number {
  const add = (a: number, b: number) => a + b;
  const multiply = (a: number, b: number) => a * b;
  if (sign === "+") {
    return add;
  }
  return multiply;
}

const n = nums.length;
const s = signs.length;

const max: number[][] = np.array({x: n, y: n}, 0);
const min: number[][] = np.array({x: n, y: n}, 0);

// create all prefixes for length 1
for (let i of range(n)) {
  max[i][i] = nums[i];
  min[i][i] = nums[i];
}

// create rest of prefixes for length > 1
for (let diff of range(1, n)) {
  for (let i of range(n-diff)) {
    let j:number = i + diff;
    max[i][j] = -Infinity;
    min[i][j] = Infinity;
    // find k!!
    for (let k of range(i,j)) {
      let op = operation(signs[k]);
      let q = op(max[i][k], max[k+1][j]);
      let r = op(min[i][k], min[k+1][j]);
      if (q > max[i][j]) max[i][j] = q;
      if (r > max[i][j]) max[i][j] = r;
      if (r < min[i][j]) min[i][j] = r;
    }
  }
}

console.log(max);
// console.log(min);
