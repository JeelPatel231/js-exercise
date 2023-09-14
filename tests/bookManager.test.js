// @ts-nocheck

import { InvalidOperationError } from "../errors.js"
import { BookManager } from "../book.js"

describe(`Book Manager`, () => {
  let bookManager = null

  beforeEach(() => {
    bookManager = new BookManager()
  })

  it(`Books are pushed as expected`, () => {
    bookManager.addBook("title1", "author1", "isbn1")
    bookManager.addBook("title2", "author2", "isbn2")
    assert.equal(bookManager.length, 2)
  })

  it(`Books are using ISBN as unique prop`, () => {
    bookManager.addBook("title1", "author1", "isbn1")
    assert.throws(() => {
      bookManager.addBook("title2", "author2", "isbn1")
    }, InvalidOperationError)
    assert.equal(bookManager.length, 1)
  })


  it(`Get Book by ISBN`, () => {
    const book1 = bookManager.addBook("title1", "author1", "isbn1")
    const book2 = bookManager.getBookByISBN("isbn1")
    assert.deepEqual(book1, book2)
  })


  it(`Search books by author`, () => {
    const book1 = bookManager.addBook("title1", "author1", "isbn1")
    const book2 = bookManager.addBook("title2", "author1", "isbn2")
    const book3 = bookManager.addBook("title2", "author2", "isbn3")


    assert.deepEqual(
      [book1, book2, book3],
      bookManager.searchBookByAuthor("auth")
    )

    assert.deepEqual(
      [book1, book2],
      bookManager.searchBookByAuthor("author1")
    )
  })

  it(`Partial search title or author`, () => {
    const book1 = bookManager.addBook("title1", "author1", "isbn1")
    const book2 = bookManager.addBook("title2", "author1", "isbn2")
    const book3 = bookManager.addBook("title2", "author2", "isbn3")

    // title
    assert.deepEqual(
      [book1, book2, book3],
      bookManager.searchBookByTitleOrAuthor("title")
    )

    assert.deepEqual(
      [book2, book3],
      bookManager.searchBookByTitleOrAuthor("title2")
    )


    // author
    assert.deepEqual(
      [book1, book2],
      bookManager.searchBookByTitleOrAuthor("author1")
    )

    assert.deepEqual(
      [book1, book2, book3],
      bookManager.searchBookByTitleOrAuthor("auth")
    )

  })


  it(`Sort Books`, () => {
    const book1 = bookManager.addBook("a", "a", "isbn1")
    const book2 = bookManager.addBook("b", "c", "isbn2")
    const book3 = bookManager.addBook("c", "b", "isbn3")

    bookManager.sortBooks("author");
    assert.deepEqual(
      [book1, book3, book2],
      bookManager
    )

    bookManager.sortBooks("title");
    assert.deepEqual(
      [book1, book2, book3],
      bookManager
    )

    bookManager.sortBooks("author", true);
    assert.deepEqual(
      [book2, book3, book1],
      bookManager
    )

    bookManager.sortBooks("title", true);
    assert.deepEqual(
      [book3, book2, book1],
      bookManager
    )
  })

})
