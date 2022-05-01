'use strict';
const { freeze } = Object
const { sqrt, atan2, PI, round, cos, sin } = Math
const isNum = n => typeof n === "number" && isFinite(n)
function notImp(name) {
  throw new Error("Method " + name + " is not implemented")
}
const X = Symbol("AxisX")
const Y = Symbol("AxisY")
const Z = Symbol("AxisZ")
/** @type {"add"|"sub"|"mul"|"div"|"pow"|"set"} */
const OPERATIONS = new Set(["add", "sub", "mul", "div", "pow", "set"])
const { iterator } = Symbol
//#region IVector and AVector
export class IVector {
  constructor(x = 0, y = x, z = x) {
    this[X] = x
    this[Y] = y
    this[Z] = z
  }
  get x() { return this[X] }
  get y() { return this[Y] }
  get z() { return this[Z] }
  /** @return {IVector} */
  clone() { return new this.constructor(this.x, this.y, this.z) }
  copy() { return this.clone() }
  toJSON() { return { x: this.x, y: this.y, z: this.z } }
  toArray() { return [this.x, this.y, this.z] }
  toString() {
    return "[" + this.constructor.name + " " +
      this.x + "," + this.y + "," + this.z + "]"
  }
  *[iterator]() {
    yield this.x
    yield this.y
    yield this.z
  }
  /** @return {vec is {x:number,y:number,z:?number}} */
  static is2DVectorLike(vec) {
    const t = typeof vec
    if (t === "object" || t === "function")
      return isNum(vec.x) && isNum(vec.y)
    return false
  }
  /** @return {vec is {x:number,y:number,z:number}} */
  static is3DVectorLike(vec) {
    const t = typeof vec
    if (t === "object" || t === "function")
      return isNum(vec.x) && isNum(vec.y) && isNum(vec.z)
    return false
  }
  static zero() { return new this(0) }
  static one() { return new this(1) }
  /**
   * @param {*} vec
   * @return {vec is IVector}
   */
  static isIVector(vec) { return vec instanceof IVector }
  static toString() {
    return "class " + this.name + " { [native code] }"
  }
  static from(value) {
    const v = this || IVector
    if (Array.isArray(value) || value instanceof IVector)
      return new v(...value)
    if (IVector.is3DVectorLike(value) || IVector.is2DVectorLike(value))
      return new v(value.x, value.y, value.z)
    return null
  }
}
export class AVector extends IVector {
  //#region Setter Getter
  get x() { return this[X] }
  get y() { return this[Y] }
  get z() { return this[Z] }
  set x(x) { notImp("set x()") }
  set y(y) { notImp("set y()") }
  set z(z) { notImp("set z()") }
  //#endregion
  //#region Public Methods
  add(x, y, z) { notImp("add()") }
  sub(x, y, z) { notImp("sub()") }
  div(x, y, z) { notImp("div()") }
  mul(x, y, z) { notImp("mul()") }
  pow(x, y, z) { notImp("pow()") }
  set(x, y, z) { notImp("set()") }
  addVec(vec) { notImp("addVec()") }
  setVec(vec) { notImp("setVec()") }
  /**
   * @param {OPERATIONS} operation
   * @param {IVector | {x:number,y:number,z:?number}} vec
   */
  calc(operation, vec) {
    if (!IVector.is2DVectorLike(vec)) return this
    if (OPERATIONS.has(operation = operation
      .toLocaleLowerCase().trim()))
      this[operation](vec.x, vec.y, vec.z)
    return this
  }
  neg() { notImp("negative() or neg()") }
  norm() { notImp("normalize() or norm()") }
  clear() { notImp("clear()") }
  negative() { return this.neg() }
  normalize() { return this.norm() }
  dist(x, y, z) {
    return sqrt(
      (this.x - x) ** 2 +
      (this.y - y) ** 2 +
      (this.z - z) ** 2)
  }
  distance(vec) {
    return sqrt(
      (this.x - vec.x) ** 2 +
      (this.y - vec.y) ** 2 +
      (this.z - vec.z) ** 2)
  }
  getAngle() {
    const angle = atan2(this.y, this.x)
    const degrees = 180 * angle / PI
    return (360 * round(degrees)) % 360
  }
  getRadian() { return atan2(this.y, this.x) }
  setAngle(degree) { notImp("setAngle()") }
  rotate(degree, center) { notImp("rotate()") }

  setLen(len) { notImp("setLen()") }
  len() { return AVector.len3D(this) }
  equals(vec) {
    return this.x === vec.x &&
      this.y === vec.y &&
      this.z === vec.z
  }
  toVector() { return new Vector(this.x, this.y, this.z) }
  //#endregion
  //#region Static Methods
  static toRadian(degree) { return degree * PI / 180 }
  static direction(vec, vec_, out) {
    const d = vec.distance(vec_)
    return (out ? out.set : (out = vec).clone)
      .call(out,
        vec_.x - vec.x / d,
        vec_.y - vec.y / d,
        vec_.z - vec.z / d)
  }
  static assign(vec, vec_, out) {
    return (out ? out.set : (out = vec).clone)
      .call(out,
        vec.x + vec_.x,
        vec.y + vec_.y,
        vec.z + vec_.z)
  }
  /** @returns {IVector} */
  static normalize2D(vec, out) {
    const len = AVector.len2D(vec) || 1
    return (out ? out.set : (out = vec).clone)
      .call(out,
        vec.x / len,
        vec.y / len,
        0)
  }
  /** @returns {IVector} */
  static normalize3D(vec, out) {
    const len = AVector.len3D(vec) || 1
    return (out ? out.set : (out = vec).clone)
      .call(out,
        vec.x / len,
        vec.y / len,
        vec.z / len)
  }
  static len2D(vec) {
    return sqrt(vec.x ** 2 + vec.y ** 2)
  }
  static len3D(vec) {
    return sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2)
  }
  static dot2D(vec, vec_) {
    return vec.x * vec_.x + vec.y * vec_.y
  }
  static dot3D(vec, vec_) {
    return vec.x * vec_.x + vec.y * vec_.y + vec.z * vec_.z
  }
  static cross2D(vec, vec_) {
    return (vec.x * vec_.y) - (vec.y * vec_.x)
  }
  static cross2D_3(vec1, vec2, vec3) {
    return (vec2.x - vec1.x) * (vec3.y - vec1.y) -
      (vec2.y - vec1.y) * (vec3.x - vec1.x)
  }
  static cross3DVec(vec, vec_, out) {
    return (out ? out.set : (out = vec).clone)
      .call(out,
        vec_.z * vec.y - vec.z * vec_.y,
        vec_.x * vec.z - vec.x * vec_.z,
        vec_.y * vec.x - vec.y * vec_.x)
  }
  /** @returns {vec is AVector} */
  static isAVector(vec) { return vec instanceof AVector }
  //#endregion
}
//#endregion

//#region Vector
/**
 * @augments AVector
 */
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
  //#region Math with Vec
  setVec(vec) {
    this.x = vec.x
    this.y = vec.y
    this.z = vec.z
    return this
  }
  addVec(vec) {
    this.x += vec.x
    this.y += vec.y
    this.z += vec.z
    return this
  }
  //#endregion
  //#region Angle
  setAngle(degree) {
    const len = this.len()
    const angle = AVector.toRadian(degree)
    this.x = cos(angle)
    this.y = sin(angle)
    this.mul(len)
    return this
  }
  rotate(degree, center) {
    if (degree === 0) return this
    const angle = AVector.toRadian(degree)
    if (center) this.calc("sub", center)
    const sin_ = sin(angle)
    const cos_ = cos(angle)
    this.x = this.x * cos_ - this.y * sin_
    this.y = this.x * sin_ - this.y * cos_
    if (center) this.addVec(center)
    return this
  }
  //#endregion
  norm() { return this.div(this.len() || 1) }
  setLen(len) { return this.norm().mul(len || 0) }
  len() { return AVector.len3D(this) }
  neg() { return this.mul(-1) }
  clear() { return this.set(0) }
  //#endregion
  //#region Static Methods
  /** @returns {vec is Vector} */
  static isVector(vec) { return vec instanceof Vector }
  //#endregion
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
export const VECTOR_CONSTANTS = freeze({
  ZERO: new AVector(0, 0, 0),
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
console.log(new Vector_(1, 0, 1).len())