const maxCumulativeTemp = require("./maxtemp").default;

test('tests maxtemp with no negative values', () => { 
    expect(maxCumulativeTemp([3,8,6,10,7,20]).at(-1)).toBe(41);
});

test('tests maxtemp with negative values', () => { 
    expect(maxCumulativeTemp([3,8,6,-10,7,-20]).at(-1)).toBe(21);
});

test('tests maxtemp with negative values at the beginning', () => { 
    expect(maxCumulativeTemp([-3,8,6,10,7,-20]).at(-1)).toBe(25);
});

test('tests maxtemp with negative values at the beginning1', () => { 
    expect(maxCumulativeTemp([-3,-8,6,10,7,-20]).at(-1)).toBe(17);
});

test('tests maxtemp with negative values at the beginning2', () => { 
    expect(maxCumulativeTemp([1,-8,100,-10,-7,-20]).at(-1)).toBe(101);
});

test('tests maxtemp with 2 values', () => { 
    expect(maxCumulativeTemp([100,-10]).at(-1)).toBe(100);
});

test('tests maxtemp with negative values at the beginning', () => { 
    expect(maxCumulativeTemp([-100]).at(-1)).toBe(0);
});