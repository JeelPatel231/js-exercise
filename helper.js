import { InvalidOperationError } from "./errors.js";

/** 
 * @param {?string | undefined} str 
 * @returns {?string}
 * */
export function nullIfEmpty(str) {
  str = str?.trim()
  if (str == null || str == '') {
    return null
  }

  return str;
}



/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 * */
export function coerceBetween(num, min, max) {
  if (+num < min) {
    return min;
  }
  if (+num > max) {
    return max;
  }

  return +num;
}


/** @template T 
   * @callback GetUniquePropCallback 
   * @param {T} a
   * @returns {string}
   */

/** @template T */
export class UniqueArray extends Array {

  /** @param {GetUniquePropCallback<T>} getUniqueProp */
  constructor(getUniqueProp) {
    super();
    /** @private @type {GetUniquePropCallback<T>} */
    this._getUniqueProp = getUniqueProp
  }

  /** 
   * @param {T} item 
   * */
  alreadyExists(item) {
    if (this.find(x => this._getUniqueProp(item) === this._getUniqueProp(x))) {
      throw new InvalidOperationError("Item Already Exists in Array")
    }
  }

  /** @param {...T} item 
   * @returns number */
  push(...item) {
    item.forEach(x => this.alreadyExists(x))
    return super.push(...item)
  }

  /** 
   * @param {string} uniquePropValue
   * @returns {T[]}
   */
  findAndDelete(uniquePropValue) {
    return this.splice(this.findIndex((x) => this._getUniqueProp(x) === uniquePropValue), 1)
  }

}
