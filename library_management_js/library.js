import { BookManager } from "./book.js"
import { CryptoProvider, NodeCryptoProvider } from "./cryptoprovider.js";
import { ReviewManager } from "./review.js";
import { TransactionManager } from "./transaction.js";
import { UserManager } from "./user.js"

/** @typedef {import("./book").ISBN} ISBN */

export class Library {

  /** 
   * @param {Storage} storage
   * @param {CryptoProvider} crypto
   */
  constructor(storage, crypto) {
    /** @private @type {CryptoProvider} */
    this._cryptoObject = crypto;
   
    /** @type {BookManager} */
    this.bookManager = new BookManager();
    
    /** @type {UserManager} */
    this.userManager = new UserManager(this._cryptoObject);

    /** @type {Storage} */
    this.storage = storage;

    /** @type {TransactionManager} */
    this.tranxManager = new TransactionManager(this._cryptoObject, this.bookManager, this.userManager);

    /** @type {ReviewManager} */
    this.reviewManager = new ReviewManager(this.bookManager, this.userManager)
  }

  // save
  save() {
    throw new Error("Unimplemented")
    // try {
    //   this.storage.setItem('library', JSON.stringify(this.bookManager));
    // } catch (e) {
    //   console.error(e)
    // }
  }

  // load
  load() {
    const keyString = this.storage.getItem('library');
    if (keyString == null) {
      return console.error("Storage doesnt have stored library");
    }

    throw new Error("UNIMPLEMENTED");

    // try {
    //   this._books = JSON.parse(keyString)
    // } catch (e) {
    //   this.bookManager.length = 0
    //   console.error(e)
    // }
  }
}

