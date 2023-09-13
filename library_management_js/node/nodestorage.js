import { Library } from "../library.js"
import { AbstractStorage } from "../storage.js"
import { BookManager } from "../book.js"
import { TransactionManager } from "../transaction.js"
import { ReviewManager } from "../review.js"
import { UserManager } from "../user.js"
import * as fs from "node:fs"

/**
 * @augments {AbstractStorage}
 */
export class NodeStorage extends AbstractStorage {
  /** @param {Library} library */
  save(library){
    let stringified = JSON.stringify({
      books: library.bookManager,
      users: library.userManager,
      reviews: library.reviewManager,
      transactions: library.tranxManager,
    }, null, 2)

    fs.writeFileSync("lib.json",stringified)
  }

  /** @param {Library} library */
  load(library){
   // TODO : bugfix : functions in class dont work after loading
    const stringLib = fs.readFileSync("lib.json", "utf-8")
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