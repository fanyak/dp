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
    parent: Nodes | null;

    constructor (value: Sign | number, left: Nodes | emptyValues = null, right: Nodes | emptyValues = null, parent: Nodes | emptyValues = null) {
        this.value = value;
        this.left = left;
        this.right = right;
        this.parent = parent;
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

    updateRoot(node: Nodes | null = null) {
        this.root = node;
    }

    traverse() {

    }

    findRight (): {[key: string]: Nodes | null} {
       let root: Nodes | null = this.root;
       let parent = null;
       let predsc: Nodes | null = null;
       while (root?.right) {
            predsc = parent; // !SOS make sure predsc !== parent to avoid cyrcles. WE NEED A DAG!!!
            parent = root;            
            root = root.right;
       }
       return {parent, predsc};
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

// let numberValues = [7, 4, 3, 5, 10];
// let signValues = ["+", "*", "+", "+"];
let numberValues = [7, -4, 3, -5];
let signValues = ["+", "*", "+"];
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
        return add(left,right);
    } return multiply(left, right);
}

let parseOperationNode = (node: Nodes) => {
  return parseOperation(node.left?.value as number, node.right?.value as number, node.value as string)
}

// @TODO
function handleError(n: Nodes) {
    return 0;
}

function calculateTreeValue (n: Nodes | null): number {

    // baseCases
    if (n === null) {
       return -Infinity;
    }
    if (!n.left && !n.right) { // SOS this assumes that both children exist to a sign
        return typeof n.value === 'number' ? n.value : handleError(n);
    }

    let left: number = calculateTreeValue(n?.left); // SOS this will return undefined if node doesn't exist
    let right: number = calculateTreeValue(n?.right);  // SOS this will return undefined if node doesn't exist
    return parseOperation(left, right, n.value as string)
    
}

// initialization
let t = new Tree();
let curN = 0;
let curS = 0;

t.updateRoot(s(curS));
t.addNode(n(curN), t.root);
let max: number = n(curN).value as number;
let candidates: Tree[] = [];

function findMax(): number {
     if (!t.root?.right) {
        t.addNode(n(++curN), t.root)
        max = parseOperation(max, t.root?.right?.value as number, t.root?.value as string);
        console.log(t)
        console.log(max)
        candidates.push(t);
        return findMax();
    } else {
        /// create 2 different versions of the Tree to find the max
        let cn: Tree[] = [];
        candidates.forEach((t: Tree) => {
            let lroot = deepCloneNode(t.root) as Nodes;
            let l = new Tree(lroot);
            let rroot = deepCloneNode(t.root) as Nodes;
            let r = new Tree(rroot);
            let froot = deepCloneNode(t.root) as Nodes;
            let f = new Tree(froot);
            
            // first version: move existing optimum under a new root and add a right child to the root
            let rootl = s(curS+1);
            l.addNode(lroot, rootl);
            l.updateRoot(rootl);
            l.addNode(n(curN+1), l.root);

            // console.log(l)
            // let candidatel = parseOperation(max, l.root?.right?.value as number, l.root?.value as string);
            // console.log(candidatel)

            // second version: add a new parent for the right child of the optimum's right child
            let rootr = s(curS+1);
            let {parent: rightParentr, predsc: rightPredscr} = r.findRight();
            r.addNode(rightParentr?.right as Nodes, rootr); // move optimums's right under a new sign as a left child
            r.addNode(n(curN+1), rootr); // add new number as right child to new sign
            r.addNode(rootr, rightParentr); // Force update right node of optimum's root !!!!!!!!!!!!!!

            // console.log(r)
            // let candidater = calculateTreeValue(r.root)
            // console.log(candidater)

            
            let {parent: rightParentf, predsc: rightPredscf} = f.findRight();
            if (rightPredscf) {
                let rootf = s(curS+1);            
                console.log(rightParentf?.value, rightPredscf?.value)
                f.addNode(rightParentf as Nodes, rootf); // move optimums's right under a new sign as a left child
                f.addNode(n(curN+1), rootf); // add new number as right child to new sign
                f.addNode(rootf, rightPredscf); // Force update right node of optimum's root !!!!!!!!!!!!!!

                cn = cn.concat([f]);
            }
        
            cn = cn.concat([l, r]);

        });

        let mx = - Infinity, mn = Infinity;        
        let mxTree: Tree = new Tree();
        let minTree: Tree = new Tree();
   
        cn.forEach((tr: Tree) => {
            let v = calculateTreeValue(tr.root);
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

    if (curN < numberValues.length-1) {
        return findMax();
    }
    max = Math.max(...candidates.map((t) =>calculateTreeValue(t.root)))
    return max;
}

console.log('max is: ', findMax())
