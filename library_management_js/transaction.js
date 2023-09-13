import { BookManager } from "./book.js"
import { CryptoProvider } from "./cryptoprovider.js"
import { UniqueArray } from "./helper.js"
import { UserManager } from "./user.js"

/** @typedef {import("./book").ISBN} ISBN */

const MAX_DUE_DAYS = 7;
const MAX_CHECKOUTS = 3;

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
  constructor(cryptoprovider,bookMgr, userMgr){
    super((t) => t.transactionId);
    /** @private */
    this._crypto = cryptoprovider;

    /** @private */
    this._bookMgr = bookMgr;

    /** @private */
    this._userMgr = userMgr;
  }

  /**
   * @param {TransactionTypes} type 
   * @param {import("./book").ISBN} bookId
   * @param {string} userId
   * */
  addTransaction(type, bookId, userId) {
    if (!(type in Object.values(TransactionTypes))) {
      throw new Error("Invalid argument : Transaction Type not valid")
    }

    this._bookMgr.getBookByISBN(bookId);
    this._userMgr.checkValid(userId);

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
    const book = this._bookMgr.getBookByISBN(isbn);
    this._userMgr.checkValid(userId);
    
    if (this.checkOutStatus(isbn) === TransactionTypes.CHECKOUT) {
      throw new Error("Book already Checked out");
    }
    if (this.getNumberOfCheckouts(book.isbn) >= MAX_CHECKOUTS) {
      throw new Error("Book cannot be checked out anymore. Limit Reached!");
    }
    this.addTransaction(TransactionTypes.CHECKOUT, isbn, userId);
  }

  /** 
   * @param {ISBN} isbn
   * @param {string} userId  */
  returnBook(isbn, userId) {
    const book = this._bookMgr.getBookByISBN(isbn)
    this._userMgr.checkValid(userId)
    const lastTranxOfBook = this.filter(x => x.bookId === book.isbn).pop()
    
    if (this.checkOutStatus(isbn) === TransactionTypes.RETURN) {
      throw new Error("Illegal State Exception : Book already in library")
    }

    if (lastTranxOfBook?.userId !== userId) {
      throw new Error("Illegal State Exception : you didnt checkout this book last time")
    }

    this.addTransaction(TransactionTypes.RETURN, isbn, userId)
  }

  /**
   * @param {ISBN} isbn 
   * @returns {?Date}
   */
  getDueDateOfBook(isbn){
    const lastTranxOfBook = this.filter(x => x.bookId === isbn).pop();
    if(lastTranxOfBook.transactionType !== TransactionTypes.CHECKOUT) {
      return null
    }
    return new Date(Date.now() + (MAX_DUE_DAYS * 24 * 60 * 60 * 1000))
  }

}
