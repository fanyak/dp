/**
 * 
 * @param {*} str example str = `-4+11*-5+6+8`; 
 * @returns number after evaluating the string
 */
function evaluate(str) {    
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

  /**
   * 
   * @param {*} nums numbers array
   * @param {*} signs signs array
   * @returns max of parenthesized strings
   *  example usage bruteForce([-4,11,-5,6,8], ["+","*","+","+"])
   */

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

                        // add the evaluated number
                        // let op = operation(signs[k]);
                        // mtx[i][j].push(op(s,t));

                        // add the parethesized string
                        mtx[i][j].push(`(${s}${signs[k]}${t})`);
                    }
                }
            }
        }
    }

    // if we have added the evaluated number:
    // console.log(Math.max(...mtx[0].at(-1)));

    // parenthesized strings
    console.log(mtx[0].at(-1) );
    const evaluated = mtx[0].at(-1).map( (s) => evaluate(s) );
    return Math.max(...evaluated);
}


module.exports = bruteForce;

