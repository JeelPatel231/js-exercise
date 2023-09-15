import { NotFoundError, NotImplementedError } from "./errors.js";
import { Library } from "./library.js";

export class AbstractStorage {
  /** @param {Library} library */

  constructor(library) {
    /** @protected @type {Library} */
    this._library = library
  }

  save() {
    throw new NotImplementedError()
  }

  load() {
    throw new NotImplementedError()
  }
}


/**
 * @augments {AbstractStorage}
 */
export class WebStorage extends AbstractStorage {

  save() {
    let stringified = JSON.stringify({
      books: this._library.books,
      users: this._library.users,
      reviews: this._library.reviews,
      transactions: this._library.tranx,
    })

    localStorage.setItem("library", stringified)
  }

  load() {
    const stringLib = localStorage.getItem("library")
    if (stringLib == null) {
      throw new NotFoundError("Library")
    }
    // TODO : handle json decoding errors
    const decoded = JSON.parse(stringLib)
    this._library.books.push(...decoded.books)
    this._library.users.push(...decoded.users)
    this._library.reviews.push(...decoded.reviews)
    this._library.tranx.push(...decoded.transactions)
  }
}

/** @param {Library} library  
 *  @returns {WebStorage}
 * */
export function provideWebStorage(library) {
  return new WebStorage(library)
}
