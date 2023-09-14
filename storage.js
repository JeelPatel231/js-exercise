import { BookManager } from "./book.js";
import { NotFoundError, NotImplementedError } from "./errors.js";
import { Library } from "./library.js";
import { ReviewManager } from "./review.js";
import { TransactionManager } from "./transaction.js";
import { UserManager } from "./user.js";

export class AbstractStorage {
  /** @param {Library} library */
  save(library){
    throw new NotImplementedError()
  }

  /** @param {Library} library */
  load(library){
    throw new NotImplementedError()
  }
}


/**
 * @augments {AbstractStorage}
 */
export class WebStorage extends AbstractStorage {
  /** @param {Library} library */
  save(library){
    let stringified = JSON.stringify({
      books: library.bookManager,
      users: library.userManager,
      reviews: library.reviewManager,
      transactions: library.tranxManager,
    })

    localStorage.setItem("library", stringified)
  }

  /** @param {Library} library */
  load(library){
    const stringLib = localStorage.getItem("library")
    if(stringLib == null) {
      throw new NotFoundError("Library")
    }
    // handle json decoding errors
    const decoded = JSON.parse(stringLib)
    // @ts-ignore
    library.bookManager = BookManager.from(decoded.books)
    // @ts-ignore
    library.userManager = UserManager.from(decoded.users)
    // @ts-ignore
    library.reviewManager = ReviewManager.from(decoded.reviews)
    // @ts-ignore
    library.tranxManager = TransactionManager.from(decoded.transactions)
  }
}
