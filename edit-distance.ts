import { range } from "./helper";

let A = ["st", "sta", "stb", "stk"];
let B = ["st", "stb", "stc", "stk"];

/// EDIT DISTANCE
 // https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/8d33b3dd726982ae22e109c8ad6a718b_MIT6_006S20_prob8sol.pdf
 // https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/487dc976eabd0f9bcd6a3c385203ea27_MIT6_006S20_r16.pdf
// https://en.wikipedia.org/wiki/Edit_distance
 // https://en.wikipedia.org/wiki/Wagner%E2%80%93Fischer_algorithm

function createHashTable(s: string[]): Map<string, number> {
    let hashTable: Map<string, number> = new Map();
    let hash = 0;
    for (let str of s) { // O(2*n*k) == O(k*n) where k = maxlen(s)
        if (!hashTable.has(str)) { 
            hashTable.set(str, hash++);
        }   
    }
    return hashTable;
}

function toHashTable(hashTable: Map<string, number>): (str:string) => number {  
    return function(str: string) {
        let mappedS = hashTable.get(str);
        if (mappedS === undefined) {
            throw new Error('string has not been hashed');
        }
        return mappedS;
    }
}

// create hashTable so that compare takes 0(1) time for each compare pair
const hashTable = createHashTable(A.concat(B));

let hashedA = A.map(toHashTable(hashTable)); // O(n)
let hashedB = B.map(toHashTable(hashTable));

export default function editDistance(A:string | any[], B: string | any[]) {
    // for all i and j, x[i,j] will hold the distance between
    // the first i characters of A and the first j characters of B
    // note that x has (m+1)*(n+1) value
  
    let m = A.length + 1; // source
    let n =  B.length + 1; // target
    let x: number[][] = Array.from({length: m}, (_) => Array.from({length: n}, (_) => 0)); // memo

    // # initialization

    // source prefixes (prefixes of A in the matrix rows) can be transformed into empty string by
    // dropping all characters
    for (let i of range (1, m)) {
        x[i][0] = i;  // delete operation for A[i]
    }

    // target prefixes can be reached from empty source prefix
    // by inserting every character
    for (let j of range(1, n)) {
        x[0][j] = j // insert B[j] into A
    }

    // # flood fill in O(|A||B|)
    for (let j of range(1, n)) {
        for (let i of range(1, m)) {
            let substitutionCost = 1
          if (A[i-1] == B[j-1]) { // correct indices as it assumed starting from 1
            substitutionCost = 0     
          }
          x[i][j] = Math.min(
            x[i-1][j] + 1, // deletion
            x[i][j-1] + 1,  // insertion
            x[i-1][j-1] + substitutionCost // substitution
          );          
        }
    }
    return x[A.length][B.length];
}  
 
// console.log(editDistance("sitting", "kitten"));

// console.log(editDistance(hashedA, hashedB));
