import { BookManager } from "./book.js"
import { IllegalArgumentException, NotFoundError } from "./errors.js"
import { nullIfEmpty, coerceBetween, UniqueArray } from "./helper.js"
import { UserManager } from "./user.js"


/**
 * @private
 */
class Review {

  /**
   * @param {?string} author
   * @param {?import("./book.js").ISBN} bookIsbn
   * @param {?number} rating 
   * @param {?string} [comment]
   * */
  constructor(author, bookIsbn, rating, comment = null) {
    if (typeof rating != "number") {
      throw new IllegalArgumentException("Rating")
    }
    author = nullIfEmpty(author)
    if (author == null) {
      throw new IllegalArgumentException("Author")
    }
    bookIsbn = nullIfEmpty(bookIsbn)
    if (bookIsbn == null) {
      throw new IllegalArgumentException("Book")
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
    super((review) => review.reviewId);
    /** @private */
    this._bookMgr = bookMgr;
    /** @private */
    this._userMgr = userMgr;
  }

  /**
   * @private
   * @param {import("./book").ISBN} bookId
   * @param {string} userId
   * */
  _validateBookAndUser(bookId, userId) {
    const book = this._bookMgr.getBookByISBN(bookId);
    const user = this._userMgr.findByUniqueProp(userId);
    if (!user) {
      throw new NotFoundError("User Doesnt Exist in System")
    }
    return { book, user }
  }
 
  /**
   * @param {string} userId
   * @param {import("./book.js").ISBN} bookIsbn
   * @param {number} rating 
   * @param {?string} [comment]
   * */
  addReview(userId, bookIsbn, rating, comment = null){
    this._validateBookAndUser(bookIsbn, userId)
    this.push(new Review(userId, bookIsbn, rating, comment));
  }

  /**
   * @param {string} userId
   * @param {import("./book.js").ISBN} bookIsbn
   * @param {number} rating 
   * @param {?string} [comment]
   * */
  editReview(userId, bookIsbn, rating, comment = null){
    this._validateBookAndUser(bookIsbn, userId);
    const review = this.findByUniqueProp(userId+bookIsbn);
    if(review == null){
      throw new NotFoundError("Review")
    }
    review.rating = rating
    review.comment = comment
  }

  /** @param {string} reviewId */
  deleteReview(reviewId){
    this.findAndDelete(reviewId)
  }

  /** 
   * @param {import("./book.js").ISBN} bookIsbn
   * @returns {number} */
  averageRating(bookIsbn){
    let numArray = this.filter((rev) => rev.bookIsbn === bookIsbn).map((x) => x.rating);
    return numArray.reduce((a,b) => a+b, 0) / numArray.length;
  }

  /**
   * @param {Object} obj
   * @param {?import("./book.js").ISBN} obj.bookIsbn 
   * @param {?string} obj.userId
   * @param {?number} obj.rating
   * @param {?string} obj.partialContent
   * @returns {Review[]}
   */
  findReview({bookIsbn, userId, rating, partialContent} = {
    bookIsbn: null,
    userId : null,
    rating : null, 
    partialContent : null
  }) {
    let bookReviews = [...this];
    if (bookIsbn != null){
      bookReviews = bookReviews.filter((r) => r.bookIsbn === bookIsbn)
    }
    if (rating != null){
      bookReviews = bookReviews.filter((r) => r.rating === rating)
    }
    if (userId != null){
      bookReviews = bookReviews.filter((r) => r.author === userId)
    }
    if (nullIfEmpty(partialContent) != null){
      bookReviews = bookReviews.filter((r) => r.comment?.includes(partialContent))
    }

    return bookReviews
  }
}

