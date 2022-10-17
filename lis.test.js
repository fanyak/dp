const lis = require("./lis").default;

test('test largest increasing subsequence',() => {
    expect(lis([0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15])).toBe(6);
});

test('test largest increasing subsequence with epmty list',() => {
    expect(lis([])).toBe(-Infinity);
});