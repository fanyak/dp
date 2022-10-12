// import editDistance from "./edit-distance"

const editDistance = require("./edit-distance").default;

test('edit distance of 2 strings', () => { 
    expect(editDistance("sitting","kitten")).toBe(3);
});

