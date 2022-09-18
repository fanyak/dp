"use strict";
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const identity = (e) => e;
function createNodesFromArray(values) {
    return function (i = 0) {
        return new Nodes(values[i]);
    };
}
class Nodes {
    value;
    left;
    right;
    constructor(value, left = null, right = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}
class Tree {
    root;
    constructor(root = null) {
        this.root = root;
    }
    addNode(node, parent = null) {
        if (!this.root || !parent) {
            this.root = node;
            return node;
        }
        else {
            if (!parent.left) {
                parent.left = node;
                return node;
            }
            else { // if(!parent.right)
                // FORCE UPDATE Right
                parent.right = node;
                return node;
            }
            // else {
            //     throw(new Error('child already exists'))
            // }
        }
    }
    updateRoot(node = null) {
        this.root = node;
    }
    traverse() {
    }
    print(res = []) {
        if (!res.length) {
            res.push([this.root]);
        }
        let last = res.at(-1) || [];
        if (!last.length) {
            return res;
        }
        let nd = [];
        for (let l of last) {
            let left = l?.left ? [l?.left] : [];
            let right = l?.right ? [l?.right] : [];
            nd = nd.concat(left.concat(right));
        }
        res.push(nd);
        return this.print(res);
    }
}
let numberValues = [7, 4, 3, 5, 10];
let signValues = ["+", "*", "+", "+"];
let n = createNodesFromArray(numberValues);
let s = createNodesFromArray(signValues);
function deepCloneNode(node) {
    if (!node)
        return node;
    let ch = [node];
    let root;
    while (ch.length) {
        let cur = ch.shift() || null;
        if (!cur) {
            return cur;
        }
        if (!root) {
            cur = new Nodes(cur.value, cur?.left, cur?.right);
            root = cur;
        }
        if (cur?.left) {
            cur.left = new Nodes(cur.left.value, cur.left.left, cur.left.right);
            ch.push(cur.left);
        }
        if (cur?.right) {
            cur.right = new Nodes(cur.right.value, cur.right.left, cur.right.right);
            ch.push(cur.right);
        }
    }
    return root;
}
let parseOperation = (left, right, op) => {
    if (op === '+') {
        return left + right;
    }
    return left * right;
};
let parseOperationNode = (node) => {
    return parseOperation(node.left?.value, node.right?.value, node.value);
};
function calculateTreeValue(n) {
    // baseCases
    if (n === null) {
        return -Infinity;
    }
    if (!n.left && !n.right) {
        return n.value;
    }
    let left = calculateTreeValue(n?.left);
    let right = calculateTreeValue(n?.right);
    return parseOperation(left, right, n.value);
}
// initialization
let t = new Tree();
let curN = 0;
let curS = 0;
t.updateRoot(s(curS));
t.addNode(n(curN), t.root);
let max = n(curN).value;
function findMax() {
    if (!t.root?.right) {
        t.addNode(n(++curN), t.root);
        max = parseOperation(max, t.root?.right?.value, t.root?.value);
        console.log(t);
        console.log(max);
        return findMax();
    }
    else {
        /// create 2 different versions of the Tree to find the max
        let lroot = deepCloneNode(t.root); // new Nodes(t.root?.value, deepCloneNode(t.root.left), deepCloneNode(t.root.right));
        let l = new Tree(lroot);
        let rroot = deepCloneNode(t.root); // new Nodes(t.root?.value, deepCloneNode(t.root.left), deepCloneNode(t.root.right))
        let r = new Tree(rroot);
        // first version: move existing optimum under a new root and add a right child to the root
        let rootl = s(curS + 1);
        l.addNode(lroot, rootl);
        l.updateRoot(rootl);
        l.addNode(n(curN + 1), l.root);
        console.log(l);
        let candidatel = parseOperation(max, l.root?.right?.value, l.root?.value);
        console.log(candidatel);
        // second version: add a new parent for the right child of the optimum's right child
        let rootr = s(curS + 1);
        r.addNode(rroot.right, rootr); // move optimums's right under a new sign as a left child
        r.addNode(n(curN + 1), rootr); // add new number as right child to new sign
        r.addNode(rootr, rroot); // Force update right node of optimum's root !!!!!!!!!!!!!!
        console.log(r);
        let candidater = calculateTreeValue(r.root);
        console.log(candidater);
        max = Math.max(candidatel, candidater);
        if (max === candidatel)
            t = l;
        else
            t = r;
    }
    curS++;
    curN++;
    if (curN < numberValues.length - 1) {
        return findMax();
    }
    return max;
}
console.log(findMax());
