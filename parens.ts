import { numpy as np } from "./numpy";
import { range } from "./helper";

// const nums: number[] = [-4, 11, -5, 6, 8, -2, 7];
// const signs = ["+", "*", "+", "+", "+", "*"] as const;

// type ValueOf<T> = T[keyof T];

// const nums: number[] = [7, -4, 3, -5];
// const signs = ["+", "*", "+"];

const nums: number[] = [-4, 11, -5, 6, 8];
const signs = ["+", "*", "+", "+"];

function operation(sign: string): (n1: number, n2: number) => number {
  const add = (a: number, b: number) => a + b;
  const multiply = (a: number, b: number) => a * b;
  if (sign === "+") {
    return add;
  }
  return multiply;
}
export default function main(nums: number[], signs: string[]) {
  const n = nums.length;
  // const s = signs.length;

  const max: number[][] = np.array({x: n, y: n}, 0);
  const min: number[][] = np.array({x: n, y: n}, 0);

  // create all prefixes for length 1
  for (const i of range(n)) {
    max[i][i] = nums[i];
    min[i][i] = nums[i];
  }

  // create rest of prefixes for length > 1
  for (const diff of range(1, n)) {
    for (const i of range(n-diff)) {
      const j:number = i + diff;
      max[i][j] = -Infinity;
      min[i][j] = Infinity;
      // find k!!
      for (const k of range(i, j)) {
        const op = operation(signs[k]);
        const q = op(max[i][k], max[k+1][j]);
        const r = op(min[i][k], min[k+1][j]);
        if (q > max[i][j]) max[i][j] = q;
        if (r > max[i][j]) max[i][j] = r;
        if (r < min[i][j]) min[i][j] = r;
      }
    }
  }

  console.log(max);
  return max[0]?.at(-1) || 0;
  // console.log(min);
}

main(nums, signs);
