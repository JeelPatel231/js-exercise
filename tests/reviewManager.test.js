// @ts-nocheck

import { BookManager } from "../book.js"
import { InvalidOperationError, NotFoundError } from "../errors.js"
import { WebCryptoProvider } from "../cryptoprovider.js"
import { ReviewManager } from "../review.js"
import { UserManager } from "../user.js"

describe(`Review Manager`, () => {
  let reviewManager = null

  const crypto = new WebCryptoProvider()
  const bookManager = new BookManager()
  const userManager = new UserManager(crypto)

  const book1 = bookManager.addBook("title1", "author1", "isbn1")
  const book2 = bookManager.addBook("title2", "author1", "isbn2")
  const book3 = bookManager.addBook("title2", "author2", "isbn3")

  const user1 = userManager.registerUser("user1")
  const user2 = userManager.registerUser("user2")
  const user3 = userManager.registerUser("user3")

  beforeEach(() => {
    reviewManager = new ReviewManager(bookManager, userManager)
  })

  it(`Uses UUID as unique prop`, () => {
    reviewManager.addReview(user1.uuid, book1.isbn, 1)
    assert.throws(() => {
      reviewManager.addReview(user1.uuid, book1.isbn, 1, "comment")
    }, InvalidOperationError)
  })

  it(`Cannot review book not in system`, () => {
    // both valid
    reviewManager._validateBookAndUser(book1.isbn, user1.uuid)
    // valid book, invalid user
    assert.throws(() => {
      reviewManager._validateBookAndUser(book1.isbn, "doesntexist")
    }, NotFoundError)
    // invalid book, valid user
    assert.throws(() => {
      reviewManager._validateBookAndUser("doesntexist", user1.uuid)
    }, NotFoundError)
    // both dont exist
    assert.throws(() => {
      reviewManager._validateBookAndUser("doesntexist", "doesntexist")
    }, NotFoundError)
  })

  it(`Finds review from input`, () => {
    reviewManager.addReview(user1.uuid, book1.isbn, 2)
    reviewManager.addReview(user2.uuid, book1.isbn, 2, "Good Book")
    reviewManager.addReview(user2.uuid, book2.isbn, 1, "Good Book 2")

    // both auhor and book
    assert.deepEqual(
      reviewManager.findReview({
        bookIsbn: book1.isbn,
        userId: user1.uuid
      }),
      [{
        rating: 2,
        author: user1.uuid,
        comment: null,
        bookIsbn: book1.isbn,
      }]
    )
    // only author
    assert.deepEqual(
      reviewManager.findReview({
        userId: user1.uuid
      }),
      [{
        rating: 2,
        author: user1.uuid,
        comment: null,
        bookIsbn: book1.isbn,
      }]
    )

    // only ratings
    assert.deepEqual(
      reviewManager.findReview({
        rating: 2
      }),
      [{
        rating: 2,
        author: user1.uuid,
        comment: null,
        bookIsbn: book1.isbn,
      }, {
        rating: 2,
        author: user2.uuid,
        comment: "Good Book",
        bookIsbn: book1.isbn,
      }]
    )

    // partial content
    assert.deepEqual(
      reviewManager.findReview({
        partialContent: "Good"
      }),
      [{
        rating: 2,
        author: user2.uuid,
        comment: "Good Book",
        bookIsbn: book1.isbn,
      }, {
        rating: 1,
        author: user2.uuid,
        comment: "Good Book 2",
        bookIsbn: book2.isbn,
      }]
    )

    // partial content - 2
    assert.deepEqual(
      reviewManager.findReview({
        partialContent: "2"
      }),
      [{
        rating: 1,
        author: user2.uuid,
        comment: "Good Book 2",
        bookIsbn: book2.isbn,
      }]
    )
  })

  it(`Can Edit old Review`, () => {
    reviewManager.addReview(user1.uuid, book1.isbn, 1)
    reviewManager.editReview(user1.uuid, book1.isbn, 5, "Fixed in Update")

    assert.deepEqual(
      reviewManager.findReview({
        bookIsbn: book1.isbn,
        author: user1.uuid
      }).pop(),
      {
        rating: 5,
        author: user1.uuid,
        comment: "Fixed in Update",
        bookIsbn: book1.isbn,
      }
    )
  })

  it(`Shows Correct Average rating`, () => {
    reviewManager.addReview(user1.uuid, book1.isbn, 1)
    assert.equal(reviewManager.averageRating(book1.isbn), 1)
    reviewManager.addReview(user2.uuid, book1.isbn, 2)
    assert.equal(reviewManager.averageRating(book1.isbn), 1.5)
    reviewManager.addReview(user3.uuid, book1.isbn, 3)
    assert.equal(reviewManager.averageRating(book1.isbn), 2)
    reviewManager.editReview(user2.uuid, book1.isbn, 5)
    assert.equal(reviewManager.averageRating(book1.isbn), 3)
  })

})
