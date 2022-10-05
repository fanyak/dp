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

