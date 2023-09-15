import { AbstractStorage } from "../storage.js"
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
    const stringLib = fs.readFileSync("lib.json", "utf-8")
    // TODO : handle json decoding errors
    const decoded = JSON.parse(stringLib)
    this._library.books.push(...decoded.books)
    this._library.users.push(...decoded.users)
    this._library.reviews.push(...decoded.reviews)
    this._library.tranx.push(...decoded.transactions)
  }
}
