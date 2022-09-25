/**
 * simulate python's range
 * @param args start and end numbers
 * end is EXCLUDED
 */
export function* range(...args: number[]): Generator<number> {    
    let [start, end] = args;
    if (!Number.isInteger(start) && !Number.isInteger(end)) {
        throw new Error('not integer range')
    }    
    if (end === undefined) {
        end = start;
        start = 0;        
    }   
    while (start < end) {
        yield start++;
    }
}