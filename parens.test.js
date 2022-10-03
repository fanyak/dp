const main = require("./parens").default;
const bruteForce = require("./brute-force")

// const nums = [-4, 11, -5, 6, 8, -2, 7];
// const signs = ["+", "*", "+", "+", "+", "*"];

const nums = [-4, 11, -5, 6, 8,];
const signs = ["+", "*", "+", "+",];

test('tests parens with empty inputs', () => {
    expect(main([], [])).toBe(0);
});


test('tests parens', () => {
    expect(main(nums, signs)).toBe(bruteForce(nums,signs));
});

