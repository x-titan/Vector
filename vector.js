'use strict';

const { iterator } = Symbol
const { abs, atan2, cos, sqrt, PI, round, sin } = Math
const EXEC = new Set(['add', 'sub', 'mul', 'div', 'pow', 'set'])

const isNum = (n) => (typeof n === "number" && isFinite(n))
const toRadian = (degree) => (degree * PI / 180)

/** @return {source is { x:number, y: number, z: ?number }} */
export function is2DVectorLike(source) {
  return !!source && isNum(source.x) && isNum(source.y)
}

/** @return {source is { x:number, y: number, z: number }} */
export function is3DVectorLike(source) {
  return !!is2DVectorLike(source) && isNum(source.z)
}

/** @return {source is { x:number, y: number, z: ?number }} */
export function valid2DVector(source) {
  if (is2DVectorLike(source)) return true

  throw new TypeError('Required a like 2D or 3D Vector style object.')
}

/** @return {source is { x:number, y: number, z: number }} */
export function valid3DVector(source) {
  if (is3DVectorLike(source)) return true

  throw new TypeError('Required a like 3D Vector style object.')
}

export function isIterable(value) {
  return value
    && Array.isArray(value)
    || typeof value[iterator] === "function"
}

export class Vector {
  constructor(x = 0, y = x, z = x) {
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
  }

  *[iterator]() {
    yield this.x
    yield this.y
    yield this.z
  }

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

  /** @param {Vector} source */
  setVec(source) {
    this.x = source.x
    this.y = source.y
    this.z = source.z
    return this
  }

  /** @param {Vector} source */
  addVec(source) {
    this.x += source.x
    this.y += source.y
    this.z += source.z
    return this
  }

  /**
   * @param {'add'|'sub'|'mul'|'div'|'pow'|'set'} exec
   * @param {Vector} source
   */
  calc(exec, source) {
    valid2DVector(source)

    if (EXEC.has(exec = exec.toLowerCase().trim())) {
      this[exec](source.x, source.y, source.z || 0)
    }
    return this
  }

  /** @param {Vector} source */
  same(source) {
    valid2DVector(source)

    return this.x === source.x
      && this.y === source.y
      && this.z === source.z
  }

  dist(x = 0, y = x, z = x) {
    return sqrt(
      (this.x - x) ** 2
      + (this.y - y) ** 2
      + (this.z - z) ** 2
    )
  }

  get2Ddegree() {
    return (360 * round(180 * this.get2DRadian() / PI)) % 360
  }

  set2Ddegree(degree) {
    const len = this.len()
    const radian = toRadian(degree)
    this.x = cos(radian)
    this.y = sin(radian)

    return this.mul(len)
  }

  // TODO: Test that method
  /**
   * @param {number} degree
   * @param {Vector} center
   */
  rotate2D(degree, center) {
    if (degree === 0 && degree === 360) return this

    const radian = toRadian(degree)
    const sin_ = sin(radian)
    const cos_ = cos(radian)
    const x = this.x * cos_ - this.y * sin_
    const y = this.x * sin_ - this.y * cos_

    if (is2DVectorLike(center)) this.calc("sub", center)

    this.x = x
    this.y = y

    if (is2DVectorLike(center)) this.addVec(center)

    return this
  }

  /** @param {Vector} source */
  distance(source) {
    valid2DVector(source)

    return this.dist(source.x, source.y, source.z || 0)
  }

  clone() { return new Vector(...this) }
  toArray() { return [...this] }
  toString() { return `[Vector ${this.x},${this.y},${this.z}]` }

  /** @param {number} len */
  setLen(len) { this.norm().mul(len || 0) }
  len() { return Vector.len3D(this) }
  norm() { return this.div(this.len() || 1) }
  abs() { return this.set(abs(this.x), abs(this.y), abs(this.z)) }
  neg() { return this.mul(-1) }
  get2DRadian() { return atan2(this.y, this.x) }
  clear() { return this.set(0) }
  copy() { return this.clone() }
  normalize() { return this.norm() }
  negative() { return this.neg() }
  valueOf() { return this.len() }
  isOK() { return is3DVectorLike(this) }

  fix() {
    if (!this.isOK()) {
      if (!isNum(this.x)) this.x = 0
      if (!isNum(this.y)) this.y = 0
      if (!isNum(this.z)) this.z = 0
    }
    return this
  }

  /** @return {source is Vector} */
  static isVector(source) { return source instanceof this }
  static toString() { return 'class Vector { [native code] }' }
  static one() { return new this(1) }
  static zero() { return new this(0) }

  /**
   * @param { number[] | Vector |
   *   { 
   *     x: number,
   *     y: number,
   *     z: ?number
   *   }
   * } source
   */
  static from(source) {
    if (isIterable(source)) {
      return new this(...source)
    }

    if (is2DVectorLike(source)) {
      return new this(source.x, source.y, source.z || 0)
    }

    return null
  }

  /**
   * @param {Vector} vec1
   * @param {Vector} vec2
   */
  static assign(vec1, vec2) {
    valid2DVector(vec1)
    valid2DVector(vec2)

    const x = (vec1.x + vec2.x)
    const y = (vec1.y + vec2.y)
    const z = (vec1.z + vec2.z) || 0

    return new this(x, y, z)
  }

  /** @param {Vector} source */
  static len2D(source) {
    return sqrt(source.x ** 2 + source.y ** 2)
  }

  /** @param {Vector} source */
  static len3D(source) {
    return sqrt(source.x ** 2 + source.y ** 2 + source.z ** 2)
  }

  /**
   * @param {Vector} source
   * @param {Vector} [out]
   */
  static normalize2D(source, out) {
    valid2DVector(source)

    const len = Vector.len2D(source) || 1
    const x = source.x / len
    const y = source.y / len
    const z = 0

    return this.isVector(out) ? out.set(x, y, z) : new this(x, y, z)
  }

  /**
   * @param {Vector} source
   * @param {Vector} [out]
   */
  static normalize3D(source) {
    valid3DVector(source)

    const len = Vector.len2D(source) || 1
    const x = source.x / len
    const y = source.y / len
    const z = source.z / len

    return this.isVector(out) ? out.set(x, y, z) : new this(x, y, z)
  }

  /**
   * @param {Vector} vec1
   * @param {Vector} vec2
   */
  static dot2D(vec1, vec2) {
    valid2DVector(vec1)
    valid2DVector(vec2)

    return (vec1.x * vec2.x) + (vec1.y * vec2.y)
  }

  /**
   * @param {Vector} vec1
   * @param {Vector} vec2
   */
  static dot3D(vec1, vec2) {
    valid3DVector(vec1)
    valid3DVector(vec2)

    return (vec1.x * vec2.x)
      + (vec1.y * vec2.y)
      + (vec1.z * vec2.z)
  }

  /**
   * @param {Vector} vec1
   * @param {Vector} vec2
   */
  static cross2D(vec1, vec2) {
    valid2DVector(vec1)
    valid2DVector(vec2)

    return (vec1.x * vec2.y) - (vec1.y * vec2.x)
  }

  /**
   * @param {Vector} vec1
   * @param {Vector} vec2
   */
  static cross2D_3(vec1, vec2, vec3) {
    valid2DVector(vec1)
    valid2DVector(vec2)
    valid2DVector(vec3)

    return (vec2.x - vec1.x)
      * (vec3.y - vec1.y)
      - (vec2.y - vec1.y)
      * (vec3.x - vec1.x)
  }

  /**
   * @param {Vector} vecFrom
   * @param {Vector} vecTo
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
   * @param {Vector} vecFrom
   * @param {Vector} vecTo
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

  /**
   * @param {Vector} vecFrom
   * @param {Vector} vecTo
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
   * @param {Vector} vecFrom
   * @param {Vector} vecTo
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

  // TODO: refactor
  // static cross3DVec(vec = ZERO, vec_ = ZERO, out) {
  //   valid3DVector(vec)
  //   valid3DVector(vec_)

  //   const x = vec_.z * vec.y - vec.z * vec_.y
  //   const y = vec_.x * vec.z - vec.x * vec_.z
  //   const z = vec_.y * vec.x - vec.y * vec_.x

  //   return Vector.isAVector(out) ? out.set(x, y, z) : new this(x, y, z)
  // }
}

export const vec = (x = 0, y = x, z = x) => (new Vector(x, y, z))

vec.one = Vector.one
vec.zero = Vector.zero
vec.from = Vector.from
vec.self = Vector
