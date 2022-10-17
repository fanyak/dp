const helper = require("./helper");

test('tests evaluate', () => {    
    expect(helper.evaluate('-4+11*-5+6+8')).toBe(-45);
});

test('tests array safeValue', () => {  
    let a = [1,2,3];
    let proxy = helper.safeIndex(a, 0)
    expect(proxy[-1]).toBe(0);
});

test('tests object safeValue', () => {  
    let a = {"1":1, "2":2, "3":3};
    let proxy = helper.safeIndex(a, 0)
    expect(proxy['5']).toBe(0);
});

test('binarySearch with valid value1', () => {  
    let a = [13,3,11,7,15].sort((a,b) => a-b);
    expect(helper.binarySearch(a,0, a.length-1, 13)).toBe(a.length-2);
});

test('binarySearch with valid value2', () => {  
    let a = [13,3,11,7,15].sort((a,b) => a-b);
    expect(helper.binarySearch(a,0, a.length-1, 3)).toBe(0);
});

test('binarySearch with valid value3', () => {  
    let a = [13,3,11,7,15].sort((a,b) => a-b);
    expect(helper.binarySearch(a,0, a.length-1, 15)).toBe(a.length-1);
});

test('binarySearch with valid value4', () => {  
    let a = [13,3,7,15].sort((a,b) => a-b);
    expect(helper.binarySearch(a,0, a.length-1, 3)).toBe(0);
});

test('binarySearch with no existent value', () => {  
    let a = [13,3,11,7,15].sort((a,b) => a-b);
    expect(helper.binarySearch(a,0, a.length-1, 12)).toBe(undefined);
});

