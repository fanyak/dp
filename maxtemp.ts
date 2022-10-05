import { range, safeIndex } from "./helper";
/**
 * 
 * @param temps 
 * @returns 
 */
export default function maxCumulativeTemp(temps: number[]): number[] {
    const len = temps.length;
    let mt = Array.from({length: len}, (_)=> 0) as unknown as {[key: string]: number} ; 
    mt = safeIndex(mt, 0);
    temps = safeIndex(temps as unknown as {[key: string]: number}, 0) as unknown as number[];
    let p = new Map();
    for (let j of range(0, len)) {
        // Restriction: you can't have 3 consecutive values together - can't have all j-2, j-1 and j together 
        // CASES at each iteration::
        // case a: ...j-2 + j doesn't inlude j-1 but includes j-2 and everything before j-2
        // case b: ... j-3 + j-1 + j does't include j-2, but includes j-1 and j and everything before j-2
        const a = mt[j-2] + temps[j]; // previous iterations up to and not including j-1
        const b = mt[j-3] + temps[j-1] + temps[j]; // previous iterations up to and not including j-2
        // case: where we don't add the current temp[j]
        const maxIncludingYesterday = mt[j-1];     

        mt[j] = Math.max(maxIncludingYesterday, a , b);

        if (a >= b && a > maxIncludingYesterday) {
            p.set(j, [...(p.get(j-2)||[]), j])
        }
        if (b > a && b > maxIncludingYesterday) {
            p.set(j, [...(p.get(j-3)||[]), j-1, j])
        }
    }

    // console.log(mt);  
    // console.log(Array.from(p))

    //NOTE: because we are using safeIndex, mt is a proxy object. We have to transform it to array type
    return Object.values(mt);
}


// maxCumulativeTemp(temp);