import { InvalidOperationError, NotFoundError } from "./errors.js";

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
   * @returns {boolean}
   * */
  findUnique(item) {
    return this.find(x => this._getUniqueProp(item) === this._getUniqueProp(x))
  }

  /**
   * @param {string} uniqueParam
   * @returns {T}
   */
  findByUniqueProp(uniqueParam) {
    return this.find(x => this._getUniqueProp(x) === uniqueParam)
  }

  /** @param {...T} item 
   * @returns number */
  push(...item) {
    if (item.some(x => !!this.findUnique(x))) {
      throw new InvalidOperationError("Item Already Exists in Array")
    }
    return super.push(...item)
  }

  /** 
   * @param {string} uniquePropValue
   * @returns {T[]}
   */
  findAndDelete(uniquePropValue) {
    const index = this.findIndex((x) => this._getUniqueProp(x) === uniquePropValue)
    if (index == -1) {
      throw new NotFoundError("Item")
    }
    return this.splice(index, 1)
  }

}
