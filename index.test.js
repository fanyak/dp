const main = require("./index.js").default;

const nums = [-4, 11, -5, 6, 8, -2, 7];
const signs = ["+", "*", "+", "+", "+", "*"];

test('tests parens', () => {
    expect(main(nums, signs)).toBe(865);
});