/** @param {number} seed */
export function randomSeed(seed) {
  seed = seed || 0
  /**
   * @param {number} min
   * @param {number} max
   */
  return function (min, max) {
    min = (typeof min !== "undefined") ? min : 0
    max = (typeof max !== "undefined") ? max : 1
    seed = (seed * 9301 + 49297) % 233280
    return min + (seed / 233280) * (max - min)
  }
}
export function random(min, max) {
  min = (typeof min !== "undefined") ? min : 0
  max = (typeof max !== "undefined") ? max : 1
  return min + Math.random() * (max - min)
}
export function constraints(value, min, max) {
  if (value < min) return min
  if (value > max) return max
  return value
}
export function sign(value) { return value < 0 ? -1 : 1 }
const { PI, E, SQRT2 } = Math
export const CONST = {
  /** @type {3.141592653589793} */
  PI: PI,
  /** @type {6.283185307179586} */
  PI2: PI * 2,
  /** @type {6.283185307179586} */
  TAU: PI * 2,
  /** @type {2.718281828459045} */
  E,
  PHI: 1.6180339887498948,
  /** @type {1.4142135623730951} */
  SQRT2
}