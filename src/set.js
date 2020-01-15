export const validSymbols = ['s', 'd', 'c', 'h', 'e', 'p', 'b'];
export const verifySymbol = (symbol) => !validSymbols.includes(symbol) && `symbol ${symbol} is invalid`;
export const verifyRowSize = (row, required = 7) => row.length !== required
  && `row ${row.join(', ')} is of invalid size (${row.length}/${required})`;
export const verifyRow = (row) => [verifyRowSize(row), ...row.map(verifySymbol)].filter(Boolean);

export class MalformedInputError extends Error {
  constructor(errors) {
    const message = 'Input Error!';
    super();
    this.message = message;
    this.errors = errors;
  }

  toString() {
    return `
${this.message}
Errors:
${this.errors.map((it) => `  ${it}`).join('\n')}
    `;
  }
}

export class Set {
  constructor(...row) {
    const errors = verifyRow(row);
    if (errors.length > 0) {
      throw new MalformedInputError(errors);
    }
    this.row = row;
  }

  get permutateRight() {
    const [l11, l12, l21, l22, l23, l31, l32] = this.row;
    return new Set(l21, l11, l31, l22, l12, l32, l23);
  }

  get permutations() {
    const permutations = new Array(5)
      .fill(0)
      .reduce(
        ([prev, ...rest]) => [prev.permutateRight, prev, ...rest],
        [this],
      )
      .reverse();
    return permutations;
  }

  toString = () => {
    const [l11, l12, l21, l22, l23, l31, l32] = this.row;
    return `
 ${l11} ${l12}
${l21} ${l22} ${l23}
 ${l31} ${l32}
`;
  }

  equals = (set) => this.row.every((it, index) => set.row[index] === 'e' || it === 'e' || set.row[index] === it)

  deepEquals = (set) => {
    const p1 = this.permutations;
    const p2 = set.permutations;
    const checks = p1.map((p1e) => p2.map((p2e) => [p1e, p2e])).flat();
    return checks.some(([a, b]) => a.equals(b));
  }
}

export default Set;
