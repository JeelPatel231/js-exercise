import { BookManager } from "./book.js"
import { CryptoProvider } from "./cryptoprovider.js";
import { ReviewManager } from "./review.js";
import { AbstractStorage, WebStorage } from "./storage.js";
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
    this.bookManager = new BookManager();
    
    /** @type {UserManager} */
    this.userManager = new UserManager(this._cryptoObject);

    /** @type {AbstractStorage} */
    this.storage = storage(this);

    /** @type {TransactionManager} */
    this.tranxManager = new TransactionManager(this._cryptoObject, this.bookManager, this.userManager);

    /** @type {ReviewManager} */
    this.reviewManager = new ReviewManager(this.bookManager, this.userManager);
  
  }
}

