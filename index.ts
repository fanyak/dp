
import lcs from "./lcs";

const s1 = "BDCABA"; // rows
const s2 = "ABCBDAB"; // columns


const mtx: number[][] = lcs(s1, s2);
console.log(mtx);


const mtxf = (mtx.flatMap((v) => v));
const colLength = s2.length;
let rowLength = s1.length;

const drawableElements = Array.from(document.querySelectorAll(".matrix span"))
    .filter((el: Element, index) => index > colLength && index % (colLength + 1 ));

let previousTimeStamp: number = 0;
let done = false;
let indx = 0;

function step(timestamp: number) {
  const elapsed = timestamp - previousTimeStamp;
  if (!previousTimeStamp || elapsed > 500) {
    drawableElements[indx].textContent = `${mtxf[indx++]}`;
    if (indx === drawableElements.length) {
      done = true;
    }
    previousTimeStamp = timestamp;
  }
  if (!done) {
    window.requestAnimationFrame(step);
  }
}

window.requestAnimationFrame(step);
