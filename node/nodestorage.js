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
  save() {
    let stringified = JSON.stringify({
      books: this._library.books,
      users: this._library.users,
      reviews: this._library.reviews,
      transactions: this._library.tranx,
    }, null, 2)

    fs.writeFileSync("lib.json", stringified)
  }

  load() {
    // TODO : bugfix : functions in class dont work after loading
    const stringLib = fs.readFileSync("lib.json", "utf-8")
    // handle json decoding errors
    const decoded = JSON.parse(stringLib)
    //@ts-ignore
    this._library.books = BookManager.from(decoded.books)
    //@ts-ignore
    this._library.users = UserManager.from(decoded.users)
    //@ts-ignore
    this._library.reviews = ReviewManager.from(decoded.reviews)
    //@ts-ignore
    this._library.tranx = TransactionManager.from(decoded.transactions)
  }
}
