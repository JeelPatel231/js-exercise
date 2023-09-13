import { BookManager } from "./book.js"
import { nullIfEmpty, coerceBetween, UniqueArray } from "./helper.js"
import { UserManager } from "./user.js"


/**
 * @private
 */
export class Review {

  /**
   * @param {string} author
   * @param {import("./book.js").ISBN} bookIsbn
   * @param {number} rating 
   * @param {?string} [comment]
   * */
  constructor(author, bookIsbn, rating, comment = null) {
    if (typeof rating != "number") {
      throw new Error("Rating argument must be supplied as number")
    }

    if (nullIfEmpty(author) == null) {
      throw new Error("Author argument must be valid")
    }

    if (nullIfEmpty(bookIsbn) == null) {
      throw new Error("Book ISBN argument must be valid")
    }

    /** @type {number} */
    this.rating = coerceBetween(rating, 0, 5)

    /** @type {?string} */
    this.comment = nullIfEmpty(comment)

    /** @type {string} */
    this.author = author
  
    /** @type {string} */
    this.bookIsbn = bookIsbn
  }

  get reviewId(){
    return this.author + this.bookIsbn
  }
}

 /** @augments UniqueArray<Review> */
export class ReviewManager extends UniqueArray {
  /**
   * @param {BookManager} bookMgr 
   * @param {UserManager} userMgr 
   */
  constructor(bookMgr, userMgr){
    // author + bookisbn act as ID, unique
    super((review) => review.reviewId)
    /** @private */
    this._bookMgr = bookMgr
    /** @private */
    this._userMgr = userMgr
  }
 
  /**
   * @param {string} userId
   * @param {import("./book.js").ISBN} bookIsbn
   * @param {number} rating 
   * @param {?string} [comment]
   * */
  addReview(userId, bookIsbn, rating, comment = null){
    this._bookMgr.getBookByISBN(bookIsbn);
    this._userMgr.checkValid(userId);
    this.push(new Review(userId, bookIsbn, rating, comment));
  }

  deleteReview(reviewId){
    throw new Error("Unimplemented error")
  }

}

