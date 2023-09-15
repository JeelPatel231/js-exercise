// @ts-nocheck

import { WebCryptoProvider } from "../cryptoprovider.js"
import { TransactionManager } from "../transaction.js"
import { BookManager } from "../book.js"
import { UserManager } from "../user.js"
import { InvalidOperationError } from "../errors.js"

describe(`User Manager`, () => {

  let tranxManager = null

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
    tranxManager = new TransactionManager(crypto, bookManager, userManager)
  })

  afterEach(() => {
    MockDate.reset()
  })

  it(`Checking Out makes an entry`, () => {
    tranxManager.checkOutBook(book1.isbn, user1.uuid)
    assert.equal(tranxManager.length, 1)
  })

  it(`checkout status of book is CheckedOut`, () => {
    tranxManager.checkOutBook(book1.isbn, user1.uuid)
    assert.equal(tranxManager.checkOutStatus(book1.isbn), 0)
  })

  it(`No Other user can return it`, () => {
    tranxManager.checkOutBook(book1.isbn, user1.uuid)
    assert.throws(() => {
      tranxManager.returnBook(book1.isbn, user2.uuid)
    }, InvalidOperationError)
  })

  it(`Book is succesfully returned`, () => {
    tranxManager.checkOutBook(book1.isbn, user1.uuid)
    tranxManager.returnBook(book1.isbn, user1.uuid)
    assert.equal(tranxManager.length, 2)
  })

  it(`Book cant be double checkedout or returned`, () => {
    tranxManager.checkOutBook(book1.isbn, user1.uuid)

    assert.throws(() => {
      tranxManager.checkOutBook(book1.isbn, user2.uuid)
    }, InvalidOperationError)

    tranxManager.returnBook(book1.isbn, user1.uuid)
    assert.throws(() => {
      tranxManager.returnBook(book1.isbn, user2.uuid)
    }, InvalidOperationError)

    assert.equal(tranxManager.length, 2)
  })

  it(`Book's checkout status are updated`, () => {
    // book is initially in library
    assert.equal(tranxManager.checkOutStatus(book1.isbn), 1)

    tranxManager.checkOutBook(book1.isbn, user1.uuid)
    assert.equal(tranxManager.checkOutStatus(book1.isbn), 0)
    assert.equal(tranxManager.length, 1)

    tranxManager.returnBook(book1.isbn, user1.uuid)
    assert.equal(tranxManager.checkOutStatus(book1.isbn), 1)
    assert.equal(tranxManager.length, 2)
  })

  it(`Book's checkout counts are updated`, () => {
    // book is initially in library
    assert.equal(tranxManager.checkOutStatus(book1.isbn), 1)

    tranxManager.checkOutBook(book1.isbn, user1.uuid)
    tranxManager.returnBook(book1.isbn, user1.uuid)

    tranxManager.checkOutBook(book2.isbn, user1.uuid)
    tranxManager.returnBook(book2.isbn, user1.uuid)

    tranxManager.checkOutBook(book1.isbn, user2.uuid)
    tranxManager.returnBook(book1.isbn, user2.uuid)

    tranxManager.checkOutBook(book1.isbn, user3.uuid)
    tranxManager.returnBook(book1.isbn, user3.uuid)

    assert.equal(tranxManager.length, 8)
    assert.equal(tranxManager.getNumberOfCheckouts(book1.isbn), 3)
    assert.equal(tranxManager.getNumberOfCheckouts(book2.isbn), 1)
    assert.equal(tranxManager.getNumberOfCheckouts(book3.isbn), 0)
  })

  it(`Book cannot be checked out after Limit`, () => {
    for (let index = 0; index < 3; index++) {
      tranxManager.checkOutBook(book1.isbn, user1.uuid)
      tranxManager.returnBook(book1.isbn, user1.uuid)
    }

    assert.throws(() => {
      tranxManager.checkOutBook(book1.isbn, user2.uuid)
    }, InvalidOperationError)
  })

  it(`Due Date of Book must be correctly set`, () => {
    MockDate.set(0); // checked out in jan 1, 1970
    tranxManager.checkOutBook(book1.isbn, user1.uuid)
    // checkout date is set to current system time
    assert.deepEqual(
      tranxManager.find(x => x.bookId === book1.isbn).date,
      new Date(0)
    )
    // due date is after a specific time interval
    assert.deepEqual(
      tranxManager.getDueDateOfBook(book1.isbn),
      new Date(TransactionManager.MAX_DUE_INTERVAL_SECONDS * 1000)
    )
    tranxManager.returnBook(book1.isbn, user1.uuid)
    // date resets to null
    assert.deepEqual(
      tranxManager.getDueDateOfBook(book1.isbn),
      null
    )
  })

  it(`Book goes overDue after specific time interval`, () => {
    MockDate.set(0); // checked out in jan 1, 1970
    tranxManager.checkOutBook(book1.isbn, user1.uuid)
    assert.equal(tranxManager.isBookOverDue(book1.isbn), false)
    MockDate.set((TransactionManager.MAX_DUE_INTERVAL_SECONDS * 1000) + 1); // jan 8, 1970
    assert.equal(tranxManager.isBookOverDue(book1.isbn), true)

    const specificTransaction = tranxManager.find(x => x.bookId === book1.isbn)
    console.log(tranxManager.getOverDueBooks(), [specificTransaction])
  })
})

