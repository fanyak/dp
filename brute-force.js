function evaluate(str) {
    // let str = `-4+11*-5+6+8`;
    const res = new Function(`return ${str}`);
    return res();
}

function operation(sign) {
    const add = (a, b) => a + b;
    const multiply = (a, b) => a * b;
    if (sign === "+") {
      return add;
    }
    return multiply;
  }

function bruteForce(nums, signs) {

    let mtx = Array.from({length: nums.length}, (_) => Array.from({length: nums.length}, (_) => []));

    for (let i = 0; i < nums.length; i++) {
        mtx[i][i].push(nums[i]);    
    }

    for (let l = 1; l < nums.length; l++) {
        for (let i = 0; i < nums.length - l; i++) {
            let j = i+l;
            for (let k = i; k < j; k++) {
                for (let s of mtx[i][k]) {
                    for (let t of mtx[k+1][j]) {
                        let op = operation(signs[k]);
                        // mtx[i][j].push(op(s,t));
                        mtx[i][j].push(`(${s}${signs[k]}${t})`);
                    }
                }
                
            }
        }
    }

    // console.log(Math.max(...mtx[0].at(-1)));
    console.log( mtx[0].at(-1) );
    const evaluated = mtx[0].at(-1).map( (s) => evaluate(s) );
    return Math.max(...evaluated);
}

// bruteForce([-4,11,-5,6,8], ["+","*","+","+"])

module.exports = bruteForce;

