/**
 * Seperates the molecule into a stack of atoms and brackets associated with their count
 * @param molecule
 */
function createStack(molecule: string): Node[] {
  let formatted = molecule.replace(/[{(]/g, '[').replace(/[})]/g, ']');
  let stack: Node[] = [];
  let regex = /((\[)|(\])|([A-Z][a-z]*))(\d*)/g;
  let matches;

  if (molecule.length === 0) {
    throw MoleculeError.EMPTY;
  }
  while ((matches = regex.exec(formatted))) {
    let [, , openingBracket, closingBracket, atomName, count] = matches;

    if (openingBracket || closingBracket) {
      stack.push({
        type: openingBracket ? NodeType.Open : NodeType.Close,
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

function findFirstBracket(stack: Node[], bracketType: NodeType, startPosition: number = 0): number {
  let bracketIndex = -1;

  for (let a = startPosition; a < stack.length; a++) {
    if (stack[a].type === bracketType) {
      return a;
    }
  }
  return bracketIndex;
}

/**
 * Recursively goes through all the brackets in the stack to multiply the atoms within them
 * @param stack
 * @param position
 * @param bracketOpened
 */
function parseStack(stack: Node[], position: number = 0, bracketOpened: boolean = false): Node[] {
  let bracketIndex: number;

  if (position === stack.length) {
    throw MoleculeError.INVALID;
  }
  for (let index = position; index < stack.length; index++) {
    if ((bracketIndex = findFirstBracket(stack, NodeType.Open, position)) >= position) {
      stack = parseStack(stack, bracketIndex + 1, true);
      index--;
    } else if (bracketOpened) {
      bracketIndex = findFirstBracket(stack, NodeType.Close, position);
      if (bracketIndex === -1) {
        throw MoleculeError.BRACKET_NOT_CLOSED;
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
  let atoms: {[key: string]: number} = {};

  for (let a = 0; a < stack.length; a++) {
    atoms[stack[a].atom] = atoms[stack[a].atom] ? atoms[stack[a].atom] + stack[a].count : stack[a].count;
  }
  return atoms;
}

export function findAtoms(molecule: string) {
  let stack: Node[];

  stack = createStack(molecule);
  stack = parseStack(stack);
  return countAtoms(stack);
}

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

export enum MoleculeError {
  INVALID,
  EMPTY,
  BRACKET_NOT_CLOSED,
}
