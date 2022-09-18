type ValueOf<T> = T[keyof T];
type emptyValues = null | undefined;

type MathOperation = (a: number, b: number) => number;
type IdentityOperation = (a: number) => number;

const add: MathOperation = (a: number, b: number) => a + b;
const multiply: MathOperation = (a: number, b: number) => a * b;
const identity: IdentityOperation = (e: number) => e;

function createNodesFromArray(values: any[]): (i: number) => Nodes {
    return function (i = 0) {
        return new Nodes(values[i]);
    }
}

type signDict = {
    '+': MathOperation,
    '*': MathOperation,
};

type Sign = keyof signDict;

class Nodes {

    value: Sign | number;
    left : Nodes | null;
    right: Nodes | null;

    constructor (value: Sign | number, left: Nodes | emptyValues = null, right: Nodes | emptyValues = null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }
}

type R =  Array<Array<(Nodes | emptyValues)> | emptyValues> 

class Tree {
    
    root: Nodes | null;
   
    constructor(root: Nodes | null = null) {
        this.root = root;
    }

    addNode(node: Nodes, parent: Nodes | null = null): Nodes {
        if (!this.root || !parent) {
            this.root = node;
            return node;
        } else {
            if(!parent.left) {
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

    updateRoot(node: Nodes | null = null) {
        this.root = node;
    }

    traverse() {

    }

    print(res: R = []): R {

        type ValuesOf<T> = T[keyof T];        
        type r = ValuesOf<typeof res>;

        if (!res.length) {
            res.push([this.root]);
        }
        let last: r = res.at(-1) || [];
        if(!last.length) {
            return res as R;
        }
        let nd: Array<(Nodes | emptyValues) | emptyValues> = []
        for (let l of last) {
           let left =  l?.left ? [l?.left] : [];
           let right = l?.right ? [l?.right] :  [];
           nd = nd.concat(left.concat(right))
        }
        res.push(nd)
        return this.print(res);       
    } 
    
}

let numberValues = [7, 4, 3, 5, 10];
let signValues = ["+", "*", "+","+"];
let n: (i: number) => Nodes = createNodesFromArray(numberValues)
let s: (i: number) => Nodes = createNodesFromArray(signValues);

function deepCloneNode(node: Nodes | null) {

    if (!node) return node;

    let ch = [node];
    let root;
    
    while (ch.length) {
        let cur: Nodes | null = ch.shift() || null;
        if (!cur) {
            return cur;
        }       
        if (!root) {
            cur = new Nodes(cur.value, cur?.left, cur?.right);
            root = cur;
        }
        if (cur?.left) {
            cur.left = new Nodes(cur.left.value, cur.left.left, cur.left.right);
            ch.push(cur.left)
        }
        if (cur?.right) {
            cur.right = new Nodes(cur.right.value, cur.right.left, cur.right.right);
            ch.push(cur.right)
        }
    }

    return root;
}

let parseOperation = (left: number, right: number, op: string): number => {
    if (op === '+') {
        return left + right;
    } return left * right;
}

let parseOperationNode = (node: Nodes) => {
  return parseOperation(node.left?.value as number, node.right?.value as number, node.value as string)
}

function calculateTreeValue (n: Nodes | null): number {

    // baseCases
    if (n === null) {
       return -Infinity;
    }
    if (!n.left && !n.right) {
        return n.value as number;
    }

    let left: number = calculateTreeValue(n?.left)
    let right: number = calculateTreeValue(n?.right);
    return parseOperation(left, right, n.value as string)
    
}

// initialization
let t = new Tree();
let curN = 0;
let curS = 0;

t.updateRoot(s(curS));
t.addNode(n(curN), t.root);
let max: number = n(curN).value as number;

function findMax(): number {
     if (!t.root?.right) {
        t.addNode(n(++curN), t.root)
        max = parseOperation(max, t.root?.right?.value as number, t.root?.value as string);
        console.log(t)
        console.log(max)
        return findMax();
    } else {
        /// create 2 different versions of the Tree to find the max

        let lroot = deepCloneNode(t.root) as Nodes;
        let l = new Tree(lroot);
        let rroot = deepCloneNode(t.root) as Nodes;
        let r = new Tree(rroot);
        
        // first version: move existing optimum under a new root and add a right child to the root
        let rootl = s(curS+1);
        l.addNode(lroot, rootl);
        l.updateRoot(rootl);
        l.addNode(n(curN+1), l.root);

        console.log(l)
        let candidatel = parseOperation(max, l.root?.right?.value as number, l.root?.value as string);
        console.log(candidatel)

        // second version: add a new parent for the right child of the optimum's right child
        let rootr =s(curS+1);
        r.addNode(rroot.right as Nodes, rootr); // move optimums's right under a new sign as a left child
        r.addNode(n(curN+1), rootr); // add new number as right child to new sign
        r.addNode(rootr, rroot); // Force update right node of optimum's root !!!!!!!!!!!!!!

        console.log(r)
        let candidater = calculateTreeValue(r.root)
        console.log(candidater)
        
        max = Math.max(candidatel, candidater);
        if (max === candidatel) t = l; else t = r;
    }

    curS++;
    curN++;

    if (curN < numberValues.length-1) {
        return findMax();
    }

    return max;
}

console.log(findMax())