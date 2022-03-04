const { seal, freeze } = Object
const { sqrt, atan2, PI, round, cos, sin } = Math
const isNum = n => typeof n === "number" || n instanceof Number
const notImp = name => new Error("Method " + name + " is not implemented")
const AXIS = Symbol("axis")
const X = 0
const Y = 1
const Z = 2
function clamp(value, min, max) {
  if (value < min)
    return min;
  if (value > max)
    return max;
  return value;
}
let _seed = 0
function random(min, max) {
  min = (typeof min !== "undefined") ? min : 0;
  max = (typeof max !== "undefined") ? max : 1;
  return min + _seededRandom() * (max - min);
};
function _seededRandom() {
  _seed = (_seed * 9301 + 49297) % 233280;
  return _seed / 233280;
};
function sign(value) {
  return value < 0 ? -1 : 1;
};
/**
 * @type {"add"|"sub"|"mul"|"div"|"set"}
 */
const OPERATIONS = new Set(["add", "sub", "mul", "div", "set"])

//#region IVector and AVector
export class IVector {
  constructor(x = 0, y = x, z = x) {
    this[AXIS] = seal([
      x || 0,
      y || 0,
      z || 0])
  }
  get x() { return this[AXIS][X] }
  get y() { return this[AXIS][Y] }
  get z() { return this[AXIS][Z] }
  /**
   * @param {*} vec
   * @returns {vec is {x:number,y:number,z:?number}}
   */
  static is2DVectorLike(vec) {
    const t = typeof vec
    if (t === "object" || t === "function")
      return isNum(vec?.x) && isNum(vec?.y)
    return false
  }
  static is3DVectorLike(vec) {
    const t = typeof vec
    if (t === "object" || t === "function")
      return isNum(vec?.x) && isNum(vec?.y) && isNum(vec?.z)
    return false
  }
  static zero() { return new IVector(0) }
  static one() { return new IVector(1) }
  toJSON() { return { x: this.x, y: this.y, z: this.z } }
  toArray() { return [this.x, this.y, this.z] }
  toString() { return "[" + this.constructor.name + " " + this.x + "," + this.y + "," + this.z + "]" }
  /**
   * @param {*} vec
   * @returns {vec is IVector}
   */
  static isIVector(vec) { return vec instanceof IVector }
}
export class AVector extends IVector {
  constructor(x = 0, y = x, z = x) { super(x, y, z) }
  //#region Setter Getter
  get x() { return this[AXIS][X] }
  get y() { return this[AXIS][Y] }
  get z() { return this[AXIS][Z] }
  set x(x) { throw notImp("set x()") }
  set y(y) { throw notImp("set y()") }
  set z(z) { throw notImp("set z()") }
  //#endregion
  //#region Public Methods
  add(x, y, z) { throw notImp("add()") }
  sub(x, y, z) { throw notImp("sub()") }
  div(x, y, z) { throw notImp("div()") }
  mul(x, y, z) { throw notImp("mul()") }
  set(x, y, z) { throw notImp("set()") }
  addVec(vec) { throw notImp("addVec()") }
  setVec(vec) { throw notImp("setVec()") }
  calc(operation, vec) { throw notImp("calc()") }
  neg() { throw notImp("negative()") }
  negative() { return this.neg() }
  norm() { throw notImp("normalize()") }
  normalize() { return this.norm() }
  clear() { throw notImp("clear()") }
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
  /** @returns {IVector} */
  clone() { return new this.constructor(this.x, this.y, this.z) }
  len() { return AVector.len4D(this) }
  copy() { this.clone() }
  equals(vec) {
    return this.x === vec.x &&
      this.y === vec.y &&
      this.z === vec.z
  }
  toVector() { return new Vector(this.x, this.y, this.z) }
  //#endregion
  //#region Static Methods
  static direction(vec, vec_) {
    const d = vec.distance(vec_)
    return new vec
      .constructor(
        vec_.x - vec.x / d,
        vec_.y - vec.y / d,
        vec_.z - vec.z / d)
  }
  static assign(vec, vec_) {
    return new vec
      .constructor(
        vec.x + vec_.x,
        vec.y + vec_.y,
        vec.z + vec_.z)
  }
  /** @returns {IVector} */
  static normalize2D(vec) {
    let len = AVector.len2D(vec)
    if (len === 0) len = 1
    return new vec
      .constructor(
        vec.x / len,
        vec.y / len,
        0)
  }
  /** @returns {IVector} */
  static normalize3D(vec) {
    let len = AVector.len3D(vec)
    if (len === 0) len = 1
    return new vec
      .constructor(
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
    return (vec2.x - vec1.x) * (vec3.y - vec1.y) - (vec2.y - vec1.y) * (vec3.x - vec1.x)
  }
  static cross3D(vec, vec_, out) {
    if (!out) out = new vec.constructor()
    return out.set(
      vec_.z * vec.y - vec.z * vec_.y,
      vec_.x * vec.z - vec.x * vec_.z,
      vec_.y * vec.x - vec.y * vec_.x)
  }
  /** @returns {vec is AVector} */
  static isAVector(vec) { vec instanceof AVector }
  static zero() { return new AVector(0) }
  static one() { return new AVector(1) }
  //#endregion
}
//#endregion

//#region Vector
export class Vector extends AVector {
  constructor(x, y, z) { super(x, y, z) }
  //#region Setter Getter
  get x() { return this[AXIS][X] }
  get y() { return this[AXIS][Y] }
  get z() { return this[AXIS][Z] }
  set x(x) { this[AXIS][X] = x || 0 }
  set y(y) { this[AXIS][Y] = y || 0 }
  set z(z) { this[AXIS][Z] = z || 0 }
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
    this.x += x
    this.y += y
    this.z += z
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
  /**
   * 
   * @param {OPERATIONS} operation 
   * @param {IVector | {x:number,y:number,z:?number}} vec 
   * @returns 
   */
  calc(operation, vec) {
    if (!IVector.is2DVectorLike(vec)) return this
    if (OPERATIONS.has(operation = operation.trim()))
      this[operation](vec.x, vec.y, vec.z)
    return this
  }
  //#endregion
  //#region Angle
  getAngle() {
    const angle = atan2(this.y, this.x)
    const degrees = 180 * angle / PI
    return (360 * round(degrees)) % 360
  }
  setAngle(degree) {
    const l = this.len()
    const angle = degree * PI / 180
    this.x = cos(angle)
    this.y = sin(angle)
    this.mul(l)
    return this
  }
  //#endregion
  norm() {
    let len = this.len()
    if (len === 0) len = 1
    this.x /= len
    this.y /= len
    this.z /= len
    return this
  }
  len() { return AVector.len3D(this) }
  neg() { return this.mul(-1) }
  clear() { return this.set(0) }
  //#endregion
  //#region Static Methods
  /** @returns {vec is Vector} */
  static isVector(vec) { return vec instanceof Vector }
  static zero() { return new Vector(0) }
  static one() { return new Vector(1) }
  //#endregion
}
export class Vector2 extends Vector {
  constructor(x, y) { super(x, y, 0, 0) }
  get x() { return this[AXIS][X] }
  get y() { return this[AXIS][Y] }
  get z() { return 0 }
  set x(x) { this[AXIS][X] = x || 0 }
  set y(y) { this[AXIS][Y] = y || 0 }
  set z(z) { }
  len() { return sqrt(this.x ** 2 + this.y ** 2) }
  static zero() { return new Vector2(0) }
  static one() { return new Vector2(1) }
}
export class Vector3 extends Vector {
  constructor(x, y) { super(x, y, 0, 0) }
  get x() { return this[AXIS][X] }
  get y() { return this[AXIS][Y] }
  get z() { return this[AXIS][Z] }
  set x(x) { this[AXIS][X] = x || 0 }
  set y(y) { this[AXIS][Y] = y || 0 }
  set z(z) { this[AXIS][Z] = z || 0 }
  len() { return sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2) }
  static zero() { return new Vector3(0) }
  static one() { return new Vector3(1) }
}
//#endregion

//#region Constants
export const VECTOR_CONSTANTS = freeze({
  ZERO: new AVector(0, 0, 0),
  ONE: new AVector(1, 1, 1),
  LEFT: new AVector(-1, 0, 0),
  RIGHT: new AVector(1, 0, 0),
  FORWARD: new AVector(0, -1, 0),
  BACK: new AVector(0, 1, 0),
  TOP: new AVector(0, 0, -1),
  BOTTOM: new AVector(0, 0, 1)
})
//#endregion

//#region Export functions
export function avec(x = 0, y = x, z = x) { return new AVector(x, y, z) }
avec.one = () => VECTOR_CONSTANTS.ONE
avec.zero = () => VECTOR_CONSTANTS.ZERO
export function vec(x = 0, y = x, z = x) { return new Vector(x, y, z) }
vec.one = Vector.one
vec.zero = Vector.zero
export function v2(x = 0, y = x) { return new Vector2(x, y) }
v2.one = Vector2.one
v2.zero = Vector2.zero
export function v3(x = 0, y = x, z = x) { return new Vector3(x, y, z) }
v3.one = Vector3.one
v3.zero = Vector3.zero
//#endregion