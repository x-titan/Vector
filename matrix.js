const MATRIX = Symbol("matrix")
const isArr = Array.isArray

export const shape = m => {
  const lens = [];
  let temp = m;
  while (temp && isArr(temp)) {
    lens.push(temp.length);
    temp = (temp.length && [...temp][0]) || null;
  }
  return lens;
}

const validateNumber = n => {
  if (typeof n !== "number" || n % 1 !== 0 || n < 0)
    throw new Error("Invalid type. Required a integer. Over zero")
}

const validateType = m => {
  if (!m || !isArr(m) || !isArr(m[0]))
    throw new Error("Invalid matrix format")
}
const validate2D = m => {
  validateType(m)
  if (shape(m) !== 2)
    throw new Error("Matrix is not of 2D shape")
}
/**
 * Validates that matrices are of the same shape.
 *
 * @param {Matrix} a
 * @param {Matrix} b
 * @throws {Error}
 */
export const validateSameShape = (a, b) => {
  validateType(a);
  validateType(b);

  const aShape = shape(a);
  const bShape = shape(b);

  if (aShape.length !== bShape.length)
    throw new Error('Matrices have different dimensions')

  while (aShape.length && bShape.length)
    if (aShape.pop() !== bShape.pop())
      throw new Error('Matrices have different shapes')
};
const generate = (mShape, fill) => {
  const genRec = (rShape, recI) => {
    if (rShape.length === 1) {
      return new Array(rShape[0])
        .fill(null)
        .map((cellValue, cellIndex) => fill([...recI, cellIndex]));
    }
    const m = [];
    for (let i = 0; i < rShape[0]; i++)
      m.push(genRec(rShape.slice(1), [...recI, i]));

    return m;
  };

  return genRec(mShape, []);
};

const validateLen = (a, b) => {
  if (a.length !== b.length)
    throw new Error("Invalid shape")
  let i = 0
  const len = a.length
  while (i < len) {
    const val = a[i]
    if (val > b[i] || val % 1 !== 0 || val < 0)
      throw new Error("Invalid index of shape")
    i++
  }
}

export class Matrix {
  #shape
  constructor(x, y, z) {
    const args = [...arguments]
    if (args.length === 0) args[0] = 1
    args.forEach(validateNumber)
    this[MATRIX] = generate(this.#shape = args, () => null)
  }
  getShape() { return [...this.#shape] }
  get lenght() {
    let len = 0
    for (const n of this.#shape) len += n
    return len
  }
  get matrix() { return this[MATRIX] }
  get(x, y, z) {
    const args = [...arguments]
    validateLen(args, this.#shape)
    const len = args.length
    let i = 0
    let m = this[MATRIX]
    while (i < len) m = m[args[i++]]
    return m
  }
  set(value, x, y, z) {
    const args = [...arguments].slice(1)
    validateLen(args, this.#shape)
    const len = args.length - 1
    let i = 0
    let m = this[MATRIX]
    while (i < len)
      m = m[args[i++]]
    m[args.pop()] = value
  }
  each(fn) {
    const m = this[MATRIX]
    const slen = this.#shape.length
    const recWalk = (recM, cellIndices, deep) => {
      if (deep === slen) {
        for (let i = 0; i < recM.length; i += 1)
          fn(recM[i], [...cellIndices, i])
      }
      for (let i = 0; i < recM.length; i += 1)
        recWalk(recM[i], [...cellIndices, i], deep + 1)
    }
    recWalk(m, [], 1);
  }

  static generate(...mShape) {
    if (mShape.length === 0) mShape[0] = 1
    return new Matrix(...mShape)
  }
}