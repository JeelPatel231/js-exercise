/**
 * @augments {Storage}
 */
export class LocalStorageMock {

  constructor() {
    this.store = {}
  }

  /** @prop @type {number} */
  get length() {
    return Object.keys(this.store).length
  }

  /** @param {number} index */
  key(index) {
    return Object.keys(this.store)[index] ?? null
  }

  clear() {
    this.store = {};
  }

  /** @param {string} key */
  getItem(key) {
    return this.store[key] ?? null;
  }

  /** 
   * @param {string} key 
   * @param {string} value */
  setItem(key, value) {
    this.store[key] = String(value);
  }

  /** @param {string} key */
  removeItem(key) {
    delete this.store[key];
  }
}

export function provideWebStorage() {
  return window.localStorage
}
