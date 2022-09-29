const main = require("./lcs").default;

// let mtx = Array.from({length: nums.length}, (_) => Array.from({length: nums.length}, (_) => 0));

test('test largest common substring with empty strings',() => {
    expect(main('', '')).toBe(0);
});

test('test largest common substring with 1 empty string',() => {
    expect(main('', 'a')).toBe(0);
});

test('test largest common substring with 1 empty string',() => {
    expect(main('b', '')).toBe(0);
});

test('test largest common substring with 1 char',() => {
    expect(main('b', 'a')).toBe(0);
});

test('test largest common substring with 1 char',() => {
    let s1 = "ACCGGTCGAGTGCGCGGAAGCCGGCCGAA";
    let s2 = "GTCGTTCGGAATGCCGTTGCTCTGTAAA";
    expect(main(s1, s2)).toBe(20);
});