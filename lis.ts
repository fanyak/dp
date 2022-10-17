
import { numpy } from "./numpy";
import { identity, range } from "./helper";

export default function lis<T>(A: T[]): number {
    // x[i] is the longest increasing sequence that INCLUDES i === it has at least a value of 1!!!!!!!
    const x = numpy.array({x:1, y:A.length}, 1).flatMap(identity);
    for (let i of range(-(A.length-1), 1)) {
        i = (Math.abs(i));
        for (let j of range(i, A.length)) {
            if (A[j] > A[i]) {
                x[i] = Math.max(x[i], x[j]+1); 
            }
        }
    }
    console.log(x)
    // @NOTE: this will return -infinity for empty array: Math.max(...[]) = -infinity
    return Math.max(...x); 
}  
// lis([13,3,11,7,15]);

function lisPrefix<T>(A:T[]): number {
    // x[i] is the largest increasing subsequence that INCLUDES i == has minimum value of 1!!!!! 
    const x = numpy.array({x:1, y:A.length}, 1).flatMap(identity);
    for (let i of range(A.length)) {
        for (let j of range(-i, 1)) {
            j = Math.abs(j);
            if (A[i] > A[j]) {
                x[i] = Math.max(x[i], x[j] + 1)
            }
        }
    }
     // @NOTE: this will return -infinity for empty array: Math.max(...[]) = -infinity
     return Math.max(...x); 
}

// console.log(lisPrefix([13,3,11,7,15]));
console.log(lisPrefix([0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]))