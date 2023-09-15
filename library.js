import { BookManager } from "./book.js"
import { CryptoProvider } from "./cryptoprovider.js";
import { ReviewManager } from "./review.js";
import { AbstractStorage } from "./storage.js";
import { TransactionManager } from "./transaction.js";
import { UserManager } from "./user.js"

/** @typedef {import("./book").ISBN} ISBN */

/** 
 * @callback StorageProviderCallback
 * @param {Library} library 
 * @returns {AbstractStorage}
 * */

export class Library {

  /**
   * @param {StorageProviderCallback} storage
   * @param {CryptoProvider} crypto
   */
  constructor(storage, crypto) {
    /** @private @type {CryptoProvider} */
    this._cryptoObject = crypto;

    /** @type {BookManager} */
    this.books = new BookManager();

    /** @type {UserManager} */
    this.users = new UserManager(this._cryptoObject);

    /** @type {AbstractStorage} */
    this.storage = storage(this);

    /** @type {TransactionManager} */
    this.tranx = new TransactionManager(this._cryptoObject, this.books, this.users);

    /** @type {ReviewManager} */
    this.reviews = new ReviewManager(this.books, this.users);

  }
}

