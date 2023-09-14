import { BookManager } from "./book.js";
import { NotFoundError, NotImplementedError } from "./errors.js";
import { Library } from "./library.js";
import { ReviewManager } from "./review.js";
import { TransactionManager } from "./transaction.js";
import { UserManager } from "./user.js";

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
    // handle json decoding errors
    const decoded = JSON.parse(stringLib)
    // @ts-ignore
    this._library.books = BookManager.from(decoded.books)
    // @ts-ignore
    this._library.users = UserManager.from(decoded.users)
    // @ts-ignore
    this._library.reviews = ReviewManager.from(decoded.reviews)
    // @ts-ignore
    this._library.tranx = TransactionManager.from(decoded.transactions)
  }
}

/** @param {Library} library  
 *  @returns {WebStorage}
 * */
export function provideWebStorage(library) {
  return new WebStorage(library)
}
