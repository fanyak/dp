const { textSpanContainsPosition } = require("typescript");
const helper = require("./helper");


test('tests evaluate', () => {    
    expect(helper.evaluate('-4+11*-5+6+8')).toBe(-45);
});

