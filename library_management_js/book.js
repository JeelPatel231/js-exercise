import { UniqueArray, nullIfEmpty } from "./helper.js";

/** @typedef {string} ISBN */

/** @private */
class Book {
  /**
  * @param {string} title
  * @param {string} author 
  * @param {ISBN} isbn 
  * */
  constructor(title, author, isbn) {
    // validations
    if (nullIfEmpty(title) == null) {
      throw new Error("Title is invalid")
    }
    if (nullIfEmpty(author) == null) {
      throw new Error("Author is invalid")
    }
    if (nullIfEmpty(isbn) == null) {
      throw new Error("ISBN is invalid")
    }

    // assignments
    /** @type {string} */
    this.title = title;
    /** @type {string} */
    this.author = author;
    /** @type {ISBN} */
    this.isbn = isbn;
  }
}


/** @augments UniqueArray<Book> */
export class BookManager extends UniqueArray {
  constructor() {
    super((book) => book.isbn)
  }

  /**
   * @param {string} title
   * @param {ISBN} isbn
   * @param {string} author 
   * @returns {Book}
   * */
  addBook(title, author, isbn) {
    const book = new Book(title, author, isbn)
    this.push(book)
    return book
  }

  /** @param {ISBN} isbn */
  getBookByISBNSafe(isbn) {
    return this.find(x => x.isbn === isbn.trim()) ?? null
  }

  /** @param {ISBN} isbn 
    * @returns {Book}
    **/
  getBookByISBN(isbn) {
    const book = this.getBookByISBNSafe(isbn.trim())
    if (book === null) {
      throw new Error("Book Not Found")
    }

    return book;
  }

  /** @param {string} author  */
  searchBookByAuthor(author) {
    author = author.trim().toLowerCase()
    return this.filter(x => x.author.toLowerCase().includes(author))
  }

  /** @param {string} authorOrTitle */
  searchBookByTitleOrAuthor(authorOrTitle) {
    const query = authorOrTitle.trim().toLowerCase();
    return this.filter(x => {
      return x.author.toLowerCase().includes(query)
        || x.title.toLowerCase().includes(query)
    })
  }


  /** 
   * @param {'author' | 'title' } key 
   * @param {boolean} [descending=false]
   * */
  sortBooks(key, descending = false) {
    const ordering = descending ? -1 : 1

    /**
     * @callback Comparator
     * @param {Book} a
     * @param {Book} b
     * @returns {number}
     * @type {Record<key, Comparator>} 
     * */
    const key_map = {
      'author': (a, b) => a.author.toLowerCase().localeCompare(b.author.toLowerCase()),
      'title': (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      // 'duedate': (a, b) => (this.getDueDateOfBook(a.isbn)?.getTime() ?? 0) - (this.getDueDateOfBook(b.isbn)?.getTime() ?? 0),
      // 'rating': (a, b) => a.averageRating - b.averageRating,
      // 'numofcheckouts': (a, b) => this.getNumberOfCheckouts(a.isbn) - this.getNumberOfCheckouts(b.isbn),
    }

    if (key_map[key] == null) {
      throw new Error("Unknown sorting key")
    }

    this.sort((a, b) => key_map[key](a, b) * ordering)
  }

}
