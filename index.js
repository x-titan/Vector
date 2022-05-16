'use strict';

const { freeze } = Object
const { iterator } = Symbol
const { sqrt, atan2, PI, round, cos, sin, sign, abs } = Math
const X = Symbol('AxisX')
const Y = Symbol('AxisY')
const Z = Symbol('AxisZ')
const EXEC = new Set(['add', 'sub', 'mul', 'div', 'pow', 'set'])
const { EPSILON } = Number

const isNum = (n) => (typeof n === "number" && isFinite(n))
const toRadian = (degree) => (degree * PI / 180)
const is2DVectorLike = (v) => (!!v && isNum(v.x) && isNum(v.y))
const is3DVectorLike = (v) => (is2DVectorLike(v) && isNum(v.z))

function notImp(name) {
  throw new Error(`Method ${name} is not implemented.`)
}

function isIterable(value) {
  return value
    && Array.isArray(value)
    || typeof value[iterator] === "function"
}

function valid2DVector(source) {
  if (is2DVectorLike(source)) return true

  throw new TypeError('Required a like 2D or 3D Vector style object.')
}

function valid3DVector(source) {
  if (is3DVectorLike(source)) return true

  throw new TypeError('Required a like 3D Vector style object.')
}

//#region IVector and AVector
export class IVector {
  constructor(x = 0, y = x, z = x) {
    this[X] = x || 0
    this[Y] = y || 0
    this[Z] = z || 0
  }

  get x() { return this[X] }
  get y() { return this[Y] }
  get z() { return this[Z] }

  /** @return {IVector | AVector | Vector | Vector2 | Vector3} */
  clone() { return new this.constructor(...this) }
  copy() { return this.clone() }

  print() {
    console.table(this)
    return this
  }

  /** @return {number[]} */
  toArray() { return [...this] }
  toJSON() { return { x: this.x, y: this.y, z: this.z } }

  toString() {
    return `[${this.constructor.name} ${this.x},${this.y},${this.z}]`
  }

  *[iterator]() {
    yield this.x
    yield this.y
    yield this.z
  }

  /** @return {source is IVector} */
  static isIVector(source) { return source instanceof IVector }
  static one() { return new this(1) }
  static zero() { return new this(0) }

  static toString() {
    return 'class ' + this.name + ' { [native code] }'
  }

  static from(source) {
    if (isIterable(source)) {
      return new this(...source)
    }

    if (is2DVectorLike(source)) {
      return new this(source.x, source.y, source.z || 0)
    }

    return null
  }
}

export class AVector extends IVector {
  //#region Setter Getter
  get x() { return this[X] }
  get y() { return this[Y] }
  get z() { return this[Z] }
  set x(x) { notImp('set x()') }
  set y(y) { notImp('set y()') }
  set z(z) { notImp('set z()') }
  //#endregion

  //#region Public Methods
  add(x, y, z) { notImp('add()') }
  sub(x, y, z) { notImp('sub()') }
  div(x, y, z) { notImp('div()') }
  mul(x, y, z) { notImp('mul()') }
  pow(x, y, z) { notImp('pow()') }
  set(x, y, z) { notImp('set()') }
  addVec(source) { notImp('addVec()') }
  setVec(source) { notImp('setVec()') }

  /**
   * @param {'add'|'sub'|'mul'|'div'|'pow'|'set'} exec
   * @param {IVector | { x: number, y: number, z: ?number }} source
   */
  calc(exec, source) {
    valid2DVector(source)

    if (EXEC.has(exec = exec.toLocaleLowerCase().trim())) {
      this[exec](source.x, source.y, source.z || 0)
    }
    return this
  }

  neg() { notImp('negative() or neg()') }
  norm() { notImp('normalize() or norm()') }
  clear() { notImp('clear()') }
  negative() { return this.neg() }
  normalize() { return this.norm() }
  eps() { notImp("eps") }

  dist(x = 0, y = x, z = x) {
    return sqrt(
      (this.x - x) ** 2 +
      (this.y - y) ** 2 +
      (this.z - z) ** 2
    )
  }

  get2Dgedree() {
    return (360 * round(180 * this.get2DRadian() / PI)) % 360
  }

  /** @param {IVector} source */
  distance(source) {
    valid2DVector(source)

    return this.dist(source.x, source.y, source.z || 0)
  }
  get2DRadian() { return atan2(this.y, this.x) }
  set2Ddegree(degree) { notImp('setAngle()') }
  rotate2D(degree, center) { notImp('rotate()') }
  setLen(len) { notImp('setLen()') }
  len() { return AVector.len3D(this) }
  toVector() { return new Vector(...this) }
  isOK() { return is3DVectorLike(this) }

  fix() {
    if (!this.isOK()) {
      if (!isNum(this.x)) this.x = 0
      if (!isNum(this.y)) this.y = 0
      if (!isNum(this.z)) this.z = 0
    }
    return this
  }

  /** @param {IVector} source */
  same(source) {
    valid2DVector(source)

    return this.x === source.x
      && this.y === source.y
      && this.z === source.z
  }
  //#endregion

  //#region Static Methods
  /**
   * @param {IVector} vecFrom
   * @param {IVector} vecTo
   */
  static distance2D(vecFrom, vecTo) {
    valid2DVector(vecFrom)
    valid2DVector(vecTo)

    return sqrt(
      (vecFrom.x - vecTo.x) ** 2
      + (vecFrom.y - vecTo.y) ** 2
    )
  }

  /**
   * @param {IVector} vecFrom
   * @param {IVector} vecTo
   */
  static distance3D(vecFrom, vecTo) {
    valid3DVector(vecFrom)
    valid3DVector(vecTo)

    return sqrt(
      (vecFrom.x - vecTo.x) ** 2
      + (vecFrom.y - vecTo.y) ** 2
      + (vecFrom.z - vecTo.z) ** 2
    )
  }

  /** @return {source is AVector} */
  static isAVector(source) { return source instanceof AVector }

  /**
   * @param {IVector} vecFrom
   * @param {IVector} vecTo
   */
  static direction2D(vecFrom, vecTo) {
    valid2DVector(vecFrom)
    valid2DVector(vecTo)

    const d = Vector.distance2D(vecFrom, vecTo)
    const x = (vecTo.x - vecFrom.x) / d
    const y = (vecTo.y - vecFrom.y) / d
    const z = 0

    return new this(x, y, z)
  }

  /**
   * @param {IVector} vecFrom
   * @param {IVector} vecTo
   */
  static direction3D(vecFrom, vecTo) {
    valid3DVector(vecFrom)
    valid3DVector(vecTo)

    const d = Vector.distance3D(vecFrom, vecTo)
    const x = (vecTo.x - vecFrom.x) / d
    const y = (vecTo.y - vecFrom.y) / d
    const z = (vecTo.z - vecFrom.z) / d

    return new this(x, y, z)
  }

  /**
   * @param {IVector} vec1
   * @param {IVector} vec2
   */
  static assign(vec1, vec2) {
    valid2DVector(vec1)
    valid2DVector(vec2)

    const x = (vec1.x + vec2.x)
    const y = (vec1.y + vec2.y)
    const z = (vec1.z + vec2.z) || 0

    return new this(x, y, z)
  }

  /**
   * @param {IVector} source
   * @param {IVector} [out]
   */
  static normalize2D(source, out) {
    valid2DVector(source)

    const len = AVector.len2D(source) || 1
    const x = source.x / len
    const y = source.y / len
    const z = 0

    return AVector.isAVector(out) ? out.set(x, y, z) : new this(x, y, z)
  }

  /**
   * @param {IVector} source
   * @param {IVector} [out]
   */
  static normalize3D(source, out) {
    valid3DVector(source)

    const len = AVector.len2D(source) || 1
    const x = source.x / len
    const y = source.y / len
    const z = source.z / len

    return AVector.isAVector(out) ? out.set(x, y, z) : new this(x, y, z)
  }

  static len2D(source) {
    return sqrt(source.x ** 2 + source.y ** 2)
  }

  static len3D(source) {
    return sqrt(source.x ** 2 + source.y ** 2 + source.z ** 2)
  }

  static dot2D(vec1, vec2) {
    valid2DVector(vec1)
    valid2DVector(vec2)

    return vec1.x * vec2.x + vec1.y * vec2.y
  }

  static dot3D(vec1, vec2) {
    valid3DVector(vec1)
    valid3DVector(vec2)

    return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z
  }

  static cross2D(vec1, vec2) {
    valid2DVector(vec1)
    valid2DVector(vec2)

    return (vec1.x * vec2.y) - (vec1.y * vec2.x)
  }

  static cross2D_3(vec1, vec2, vec3) {
    valid2DVector(vec1)
    valid2DVector(vec2)
    valid2DVector(vec3)

    return (vec2.x - vec1.x)
      * (vec3.y - vec1.y)
      - (vec2.y - vec1.y)
      * (vec3.x - vec1.x)
  }

  static cross3DVec(vec1, vec2) {
    valid3DVector(vec1)
    valid3DVector(vec2)

    const x = vec2.z * vec1.y - vec1.z * vec2.y
    const y = vec2.x * vec1.z - vec1.x * vec2.z
    const z = vec2.y * vec1.x - vec1.y * vec2.x

    return new this(x, y, z)
  }
  // #endregion
}
//#endregion

//#region Vector
export class Vector extends AVector {
  //#region Setter Getter
  get x() { return this[X] }
  get y() { return this[Y] }
  get z() { return this[Z] }
  set x(x) { this[X] = x || 0 }
  set y(y) { this[Y] = y || 0 }
  set z(z) { this[Z] = z || 0 }
  //#endregion

  //#region Public Methods

  //#region Math
  add(x = 0, y = x, z = x) {
    this.x += x
    this.y += y
    this.z += z
    return this
  }

  sub(x = 0, y = x, z = x) {
    this.x -= x
    this.y -= y
    this.z -= z
    return this
  }

  div(x = 1, y = x, z = x) {
    this.x /= x
    this.y /= y
    this.z /= z
    return this
  }

  mul(x = 1, y = x, z = x) {
    this.x *= x
    this.y *= y
    this.z *= z
    return this
  }

  pow(x = 1, y = x, z = x) {
    this.x **= x
    this.y **= y
    this.z **= z
    return this
  }

  set(x = 0, y = x, z = x) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }
  //#endregion

  //#region Math with Vector
  /** @param {IVector} source */
  setVec(source) {
    this.x = source.x
    this.y = source.y
    this.z = source.z
    return this
  }

  /** @param {IVector} source */
  addVec(source) {
    this.x += source.x
    this.y += source.y
    this.z += source.z
    return this
  }
  //#endregion

  //#region Angle
  set2Ddegree(degree) {
    if (degree === 0 || degree === 360) return this

    const len = AVector.len2D(this)
    const radian = toRadian(degree)

    this.x = cos(radian) * len
    this.y = sin(radian) * len

    return this
  }

  /**
   * @param {number} degree
   * @param {IVector} center
   */
  rotate2D(degree, center) {
    if (degree === 0 || degree === 360) return this

    if (is2DVectorLike(center)) this.calc("sub", center)

    const radian = toRadian(degree)
    const sin_ = sin(radian)
    const cos_ = cos(radian)
    const x = this.x * cos_ - this.y * sin_
    const y = this.x * sin_ + this.y * cos_
    this.x = x
    this.y = y

    if (is2DVectorLike(center)) this.addVec(center)

    return this
  }
  //#endregion


  /** @param {number} len */
  setLen(len) { return this.norm().mul(len || 0) }
  norm() { return this.div(this.len() || 1) }
  len() { return AVector.len3D(this) }
  neg() { return this.mul(-1) }
  clear() { return this.set(0) }
  abs() { return this.set(abs(this.x), abs(this.y), abs(this.z)) }

  //! fix it
  eps() {
    let x = abs(this.x)
    let y = abs(this.y)
    let z = abs(this.z)
    if (EPSILON > (x % 1)) x = x - (x % 1)
    if (EPSILON > (y % 1)) y = y - (y % 1)
    if (EPSILON > (z % 1)) z = z - (z % 1)
    this.x = x * sign(this.x)
    this.y = y * sign(this.y)
    this.z = z * sign(this.z)
  }
  //#endregion

  /** @return {source is Vector} */
  static isVector(source) { return source instanceof Vector }
}

export class Vector2 extends Vector {
  constructor(x, y) { super(x, y, 0) }
  get x() { return this[X] }
  get y() { return this[Y] }
  get z() { return 0 }
  set x(x) { this[X] = x || 0 }
  set y(y) { this[Y] = y || 0 }
  set z(z) { }
  len() { return AVector.len2D(this) }
}

export class Vector3 extends Vector {
  get x() { return this[X] }
  get y() { return this[Y] }
  get z() { return this[Z] }
  set x(x) { this[X] = x || 0 }
  set y(y) { this[Y] = y || 0 }
  set z(z) { this[Z] = z || 0 }
  len() { return AVector.len3D(this) }
}
//#endregion

//#region Constants
const ZERO = new AVector(0, 0, 0)

export const VECTOR_CONSTANTS = freeze({
  ZERO,
  ONE: new AVector(1, 1, 1),
  RIGHT: new AVector(1, 0, 0),
  BACK: new AVector(0, 1, 0),
  BOTTOM: new AVector(0, 0, 1),
  LEFT: new AVector(-1, 0, 0),
  FORWARD: new AVector(0, -1, 0),
  TOP: new AVector(0, 0, -1)
})
//#endregion

//#region Export functions
export function vec(x = 0, y = x, z = x) { return new Vector(x, y, z) }

vec.one = Vector.one
vec.zero = Vector.zero
vec.from = Vector.from
vec.self = Vector

export function v2(x = 0, y = x) { return new Vector2(x, y) }

v2.one = Vector2.one
v2.zero = Vector2.zero
v2.from = Vector2.from
v2.self = Vector2

export function v3(x = 0, y = x, z = x) { return new Vector3(x, y, z) }

v3.one = Vector3.one
v3.zero = Vector3.zero
v3.from = Vector3.from
v3.self = Vector3
//#endregion
