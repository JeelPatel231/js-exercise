import { BookManager } from "./book.js"
import { CryptoProvider } from "./cryptoprovider.js"
import { IllegalArgumentException, InvalidOperationError, NotFoundError } from "./errors.js";
import { UniqueArray } from "./helper.js"
import { UserManager } from "./user.js"

/** @typedef {import("./book").ISBN} ISBN */

/** @readonly @enum {number} */
export const TransactionTypes = {
  CHECKOUT: 0,
  RETURN: 1,
}
Object.freeze(TransactionTypes)

class Transaction {
  /** 
   * @param {TransactionTypes} type 
   * @param {import("./book").ISBN} bookId
   * @param {string} userId
   * @param {string} tranxId
   * */
  constructor(type, bookId, userId, tranxId) {
    this.transactionType = type;
    this.bookId = bookId;
    this.userId = userId;
    this.date = new Date();
    this.transactionId = tranxId;
  }

}

/** @augments UniqueArray<Transaction> */
export class TransactionManager extends UniqueArray {
  // holds history internally and handles transactions
  // no modification on transactions because they will be managed internally

  /**
   * @param {CryptoProvider} cryptoprovider 
   * @param {BookManager} bookMgr 
   * @param {UserManager} userMgr
   */
  constructor(cryptoprovider, bookMgr, userMgr) {
    super((t) => t.transactionId);
    /** @private */
    this._crypto = cryptoprovider;

    /** @private */
    this._bookMgr = bookMgr;

    /** @private */
    this._userMgr = userMgr;
  }

  static get MAX_DUE_DAYS() {
    return 7
  }

  static get MAX_DUE_INTERVAL_SECONDS() {
    return TransactionManager.MAX_DUE_DAYS * 24 * 60 * 60
  }

  static get MAX_CHECKOUTS() {
    return 3
  }

  /**
   * @private
   * @param {import("./book").ISBN} bookId
   * @param {string} userId
   * */
  _validateBookAndUser(bookId, userId) {
    const book = this._bookMgr.getBookByISBN(bookId);
    const user = this._userMgr.findByUniqueProp(userId)
    if (!user) {
      throw new NotFoundError("User")
    }
    return { book, user }
  }

  /**
   * @private
   * @param {TransactionTypes} type 
   * @param {import("./book").ISBN} bookId
   * @param {string} userId
   * */
  _addTransaction(type, bookId, userId) {
    if (!(type in Object.values(TransactionTypes))) {
      throw new IllegalArgumentException("Transaction Type")
    }

    this._validateBookAndUser(bookId, userId);

    const tranx = new Transaction(type, bookId, userId, this._crypto.genUUID())
    console.log(tranx)
    this.push(tranx)
    return tranx
  }

  /** @param {string} transactionId */
  getTransaction(transactionId) {
    this.find(x => x.transactionId === transactionId)
  }


  /** @param {ISBN} isbn 
   *  @returns {TransactionTypes} */
  checkOutStatus(isbn) {
    const lastTranx = this.filter(x => x.bookId === isbn).pop()
    return lastTranx?.transactionType ?? TransactionTypes.RETURN
  }

  /** @param {ISBN} isbn 
   *  @returns {number} */
  getNumberOfCheckouts(isbn) {
    const checkoutsOfBook = this.filter((x) =>
      x.bookId === isbn && x.transactionType === TransactionTypes.CHECKOUT
    )
    return checkoutsOfBook.length
  }

  /** @param {ISBN} isbn
    * @param {string} userId  */
  checkOutBook(isbn, userId) {
    const { book } = this._validateBookAndUser(isbn, userId);

    if (this.checkOutStatus(isbn) === TransactionTypes.CHECKOUT) {
      throw new InvalidOperationError("Book already Checked out");
    }
    if (this.getNumberOfCheckouts(book.isbn) >= TransactionManager.MAX_CHECKOUTS) {
      throw new InvalidOperationError("Book cannot be checked out anymore. Limit Reached!");
    }
    this._addTransaction(TransactionTypes.CHECKOUT, isbn, userId);
  }

  /** 
   * @param {ISBN} isbn
   * @param {string} userId  */
  returnBook(isbn, userId) {
    const { book } = this._validateBookAndUser(isbn, userId);

    const lastTranxOfBook = this.filter(x => x.bookId === book.isbn).pop()

    if (this.checkOutStatus(isbn) === TransactionTypes.RETURN) {
      throw new InvalidOperationError("Book already in library")
    }

    if (lastTranxOfBook?.userId !== userId) {
      throw new InvalidOperationError("Book was NOT checked out by the same user")
    }

    this._addTransaction(TransactionTypes.RETURN, isbn, userId)
  }

  /**
   * @param {ISBN} isbn 
   * @returns {?Date}
   */
  getDueDateOfBook(isbn) {
    const lastTranxOfBook = this.filter(x => x.bookId === isbn).pop();
    if (lastTranxOfBook?.transactionType !== TransactionTypes.CHECKOUT) {
      return null
    }
    return new Date(lastTranxOfBook.date.getTime() + (TransactionManager.MAX_DUE_INTERVAL_SECONDS * 1000))
  }

  /**
   * @param {ISBN} isbn 
   * @returns {boolean}
   */
  isBookOverDue(isbn) {
    const dueDateOfBook = this.getDueDateOfBook(isbn)
    if (dueDateOfBook == null) { return false }

    return dueDateOfBook < new Date()
  }

  /** @returns {Transaction[]} */
  getOverDueBooks() {
    return [...this.filter(x => this.isBookOverDue(x.bookId))];
  }

}
