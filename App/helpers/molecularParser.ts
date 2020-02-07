interface Node {
  type: NodeType;
  atom: string;
  count: number;
}

enum NodeType {
  Atom,
  Open,
  Close,
}

function createStack(formula: string): Node[] {
  let formatted = formula.replace(/[{(]/g, '[').replace(/[})]/g, ']');
  let stack: Node[] = [];
  let regex = /((\[)|(\])|([A-Z][a-z]*))(\d*)/g;
  let matches;

  if (formula.length === 0) {
    throw 'No text enterred';
  }
  while ((matches = regex.exec(formatted))) {
    let [, , open, close, atomName, count] = matches;

    if (open || close) {
      stack.push({
        type: open ? NodeType.Open : NodeType.Close,
        atom: '',
        count: count ? parseInt(count, 10) : 1,
      });
    } else {
      stack.push({
        type: NodeType.Atom,
        atom: atomName,
        count: count ? parseInt(count, 10) : 1,
      });
    }
  }
  return (stack);
}

function findBracket(stack: Node[], bracketType: NodeType, startPosition: number = 0): number {
  let bracketIndex = -1;

  for (let a = startPosition; a < stack.length; a++) {
    if (stack[a].type === bracketType) {
      return a;
    }
  }
  return bracketIndex;
}

function parseStack(stack: Node[], position: number = 0, bracketOpened: boolean = false): Node[] {
  let bracketIndex: number;

  console.log('Parsing stack : ', position, bracketOpened, stack.length);
  if (position === stack.length)
    throw 'Invalid molecule';
  for (let index = position; index < stack.length; index++) {
    if ((bracketIndex = findBracket(stack, NodeType.Open, position)) >= position) {
      stack = parseStack(stack, bracketIndex + 1, true);
      index--;
    } else if (bracketOpened) {
      bracketIndex = findBracket(stack, NodeType.Close, position);
      debugger;
      if (bracketIndex === -1) {
        throw 'Bracket not closed';
      } else {
        for (let a = position; a < bracketIndex; a++) {
          stack[a].count = stack[a].count * stack[bracketIndex].count;
        }
        stack.splice(position - 1, 1);
        stack.splice(bracketIndex - 1, 1);
        return stack;
      }
    }
  }
  return stack;
}

function countAtoms(stack: Node[]) {
  let atoms: { [key: string]: number } = {};

  for (let a = 0; a < stack.length; a++) {
    atoms[stack[a].atom] = atoms[stack[a].atom] ? atoms[stack[a].atom] + stack[a].count : stack[a].count;
  }
  return (atoms);
}

export function findAtoms(formula: string) {
  let stack: Node[];

  stack = createStack(formula);
  stack = parseStack(stack);
  return countAtoms(stack);
}
