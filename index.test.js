const main = require("./index").default;
const bruteForce = require("./brute-force")

const nums = [-4, 11, -5, 6, 8, -2, 7];
const signs = ["+", "*", "+", "+", "+", "*"];

// const nums = [-4, 11, -5, 6, 8,];
// const signs = ["+", "*", "+", "+",];

test('tests parens', () => {
    expect(main(nums, signs)).toBe(bruteForce(nums,signs));
});

