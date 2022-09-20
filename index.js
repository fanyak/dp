"use strict";
// type IdentityOperation = (a: number) => number;
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
// const identity: IdentityOperation = (e: number) => e;
/**
 *
 * @param {any[]} values Array of elements.
 * @return {Nodes}
 */
function createNodesFromArray(values) {
    return function (i = 0) {
        return new Nodes(values[i]);
    };
}
/**
 * Class
 */
class Nodes {
    value;
    left;
    right;
    parent;
    constructor(value, left = null, right = null, parent = null) {
        this.value = value;
        this.left = left;
        this.right = right;
        this.parent = parent;
    }
}
/**
 * Class Tree
 */
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
    findRight() {
        let root = this.root;
        let parent = null;
        let predsc = null;
        while (root?.right) {
            predsc = parent; // !SOS make sure predsc !== parent to avoid cyrcles. WE NEED A DAG!!!
            parent = root;
            root = root.right;
        }
        return { parent, predsc };
    }
    print(res = []) {
        if (!res.length) {
            res.push([this.root]);
        }
        const last = res.at(-1) || [];
        if (!last.length) {
            return res;
        }
        let nd = [];
        for (const l of last) {
            const left = l?.left ? [l?.left] : [];
            const right = l?.right ? [l?.right] : [];
            nd = nd.concat(left.concat(right));
        }
        res.push(nd);
        return this.print(res);
    }
}
// let numberValues = [7, 4, 3, 5, 10];
// let signValues = ["+", "*", "+", "+"];
const numberValues = [7, -4, 3, -5];
const signValues = ["+", "*", "+"];
const n = createNodesFromArray(numberValues);
const s = createNodesFromArray(signValues);
function deepCloneNode(node) {
    if (!node)
        return node;
    const ch = [node];
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
const parseOperation = (left, right, op) => {
    if (op === "+") {
        return add(left, right);
    }
    return multiply(left, right);
};
// const parseOperationNode = (node: Nodes) => {
//   return parseOperation(node.left?.value as number,
// node.right?.value as number, node.value as string);
// };
// @TODO
function handleError(n) {
    return 0;
}
function calculateTreeValue(n) {
    // baseCases
    if (n === null) {
        return -Infinity;
    }
    if (!n.left && !n.right) { // SOS this assumes that both children exist to a sign
        return typeof n.value === "number" ? n.value : handleError(n);
    }
    const left = calculateTreeValue(n?.left); // will return undefined if node doesn't exist
    const right = calculateTreeValue(n?.right); // will return undefined if node doesn't exist
    return parseOperation(left, right, n.value);
}
// initialization
const t = new Tree();
let curN = 0;
let curS = 0;
t.updateRoot(s(curS));
t.addNode(n(curN), t.root);
let max = n(curN).value;
let candidates = [];
function findMax() {
    if (!t.root?.right) {
        t.addNode(n(++curN), t.root);
        max = parseOperation(max, t.root?.right?.value, t.root?.value);
        console.log(t);
        console.log(max);
        candidates.push(t);
        return findMax();
    }
    else {
        // / create 2 different versions of the Tree to find the max
        let cn = [];
        candidates.forEach((t) => {
            const lroot = deepCloneNode(t.root);
            const l = new Tree(lroot);
            const rroot = deepCloneNode(t.root);
            const r = new Tree(rroot);
            const froot = deepCloneNode(t.root);
            const f = new Tree(froot);
            // first version: move existing optimum under a new root and add a right child to the root
            const rootl = s(curS + 1);
            l.addNode(lroot, rootl);
            l.updateRoot(rootl);
            l.addNode(n(curN + 1), l.root);
            // second version: add a new parent for the right child of the optimum's right child
            const rootr = s(curS + 1);
            const { parent: rightParentr } = r.findRight();
            r.addNode(rightParentr?.right, rootr); // move right under new sign as a left child
            r.addNode(n(curN + 1), rootr); // add new number as right child to new sign
            r.addNode(rootr, rightParentr); // Force update right node of optimum's root!
            // console.log(r)
            // let candidater = calculateTreeValue(r.root)
            // console.log(candidater)
            const { parent: rightParentf, predsc: rightPredscf } = f.findRight();
            if (rightPredscf) {
                const rootf = s(curS + 1);
                console.log(rightParentf?.value, rightPredscf?.value);
                f.addNode(rightParentf, rootf); // move right under new sign as a left child
                f.addNode(n(curN + 1), rootf); // add new number as right child to new sign
                f.addNode(rootf, rightPredscf); // Force update right node of optimum's root
                cn = cn.concat([f]);
            }
            cn = cn.concat([l, r]);
        });
        let mx = -Infinity;
        let mn = Infinity;
        let mxTree = new Tree();
        let minTree = new Tree();
        cn.forEach((tr) => {
            const v = calculateTreeValue(tr.root);
            if (v > mx) {
                mxTree = tr;
                mx = v;
            }
            if (v < mn) {
                minTree = tr;
                mn = v;
            }
        });
        candidates = [mxTree, minTree];
    }
    curS++;
    curN++;
    if (curN < numberValues.length - 1) {
        return findMax();
    }
    max = Math.max(...candidates.map((t) => calculateTreeValue(t.root)));
    return max;
}
console.log("max is: ", findMax());
