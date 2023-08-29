const library = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    checkedOut: false,
    numOfCheckouts: 0,
    dueDate: null,
    ratings: new Map()
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    checkedOut: true,
    numOfCheckouts: 0,
    dueDate: new Date(),
    ratings: new Map()
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "978-0-06-085052-4",
    checkedOut: false,
    numOfCheckouts: 0,
    dueDate: null,
    ratings: new Map(),
  }
];

// maximium number of checkouts for a single book
const MAX_CHECKOUTS = 3
const DUE_DAY_LIMIT = 7

class Utils {
  static nullIfEmpty(str) {
    if (typeof str !== "string") {
      throw new Error(`Data must be string, got ${str} of type ${typeof str} instead.`)
    }

    const trimmedStr = str?.trim();
    if (trimmedStr == null || trimmedStr == '') {
      return null
    }

    return trimmedStr
  }

  static notNull(data) {
    if (data === null) throw new Error("Data Must not be Null")
    return data
  }

  static createDueDate(date) {
    const k = new Date()
    k.setDate(date.getDate() + DUE_DAY_LIMIT)
    return k
  }
}

function getBookByISBN(isbn) {
  isbn = Utils.notNull(Utils.nullIfEmpty(isbn))

  // we dont care if its undefined or defined
  return library.find(x => x.isbn === isbn)
}


function createBook(title, author, isbn) {
  title = Utils.notNull(Utils.nullIfEmpty(title))
  author = Utils.notNull(Utils.nullIfEmpty(author))
  isbn = Utils.notNull(Utils.nullIfEmpty(isbn))

  return {
    title,
    author,
    isbn,
  }
}

function addBookToLibrary(book) {
  const title = Utils.notNull(Utils.nullIfEmpty(book.title))
  const author = Utils.notNull(Utils.nullIfEmpty(book.author))
  const isbn = Utils.notNull(Utils.nullIfEmpty(book.isbn))

  // Anomaly : how can a checkedout book be added to library
  // const checkedOut = !!book.checkedOut

  if (getBookByISBN(isbn) !== undefined) {
    throw new Error("Book with ISBN already exists!")
  }

  library.push({
    title,
    author,
    isbn,
    checkedOut: false,
    numOfCheckouts: 0,
    dueDate: null,
    ratings: new Map(),
  })
}

function checkoutBook(isbn) {
  const book = getBookByISBN(isbn)

  if (book === undefined) {
    throw new Error("Book does not exist in library")
  }

  if (book.checkedOut) {
    throw new Error("Book already checked out")
  }

  // greater than situation should not even occur, but its a guard rail
  if (book.numOfCheckouts >= MAX_CHECKOUTS) {
    throw new Error("Book checkout limit reached")
  }

  book.checkedOut = true
  book.numOfCheckouts += 1
  book.dueDate = Utils.createDueDate(new Date())
}

function returnBook(isbn) {
  const book = getBookByISBN(isbn)

  if (book === undefined) {
    throw new Error("Book not available in library")
  }

  if (!book.checkedOut) {
    throw new Error("Book was not checked Out, ILLEGAL STATE")
  }

  book.checkedOut = false;
  book.dueDate = null;
}

function findBooksByAuthor(author) {
  if (typeof author !== "string") {
    throw new Error("Author must be string")
  }
  author = Utils.notNull(Utils.nullIfEmpty(author))

  // could use regex, but not worth it
  return library.filter(x => x.author.toLowerCase().includes(author.toLowerCase()))
}

// ADVANCED TASKS 1
function listOverdueBooks() {
  const now = Date.now()
  return library.filter(x => x.dueDate?.getTime() <= now)
}

function rateBook(isbn, rating, userId) {
  /* since user system is not implemented, 
   * we dont care if the user exists in the system 
   * and is valid or not. There is no way to find out. 
   * we assume userID is unique and exists in system.
   * */
  userId = Utils.notNull(Utils.nullIfEmpty(userId))

  rating = +rating
  if (isNaN(rating) || rating < 0 || rating > 5) {
    throw Error("Enter a Valid Number between 0 to 5")
  }

  const book = getBookByISBN(isbn)
  if (book === undefined) {
    throw new Error("Book doesnt exist in library!")
  }

  book.ratings.set(userId, rating)
}

function getAverageRating(isbn) {
  const book = getBookByISBN(isbn)
  if (book === undefined) {
    throw new Error("Book doesnt exist in library!")
  }

  const sum = Array.from(book.ratings.values()).reduce((a, b) => a + b, 0)
  return sum / book.ratings.size
}

// -------------- //
// MOCHA TEST CASES
describe("Library Management", () => {
  const libraryBackup = structuredClone(library)

  const autoAddedParams = {
    checkedOut: false,
    numOfCheckouts: 0,
    dueDate: null,
    ratings: new Map()
  }

  beforeEach(() => {
    // truncate library
    library.length = 0;
  })

  after(() => {
    // reset library after tests
    library.length = 0;
    library.push(...libraryBackup)
  })

  it("Create some books", () => {
    const book1 = createBook("title1", "author1", "isbn1")

    // checkedOut must be false
    assert.deepEqual(book1, {
      title: "title1",
      author: "author1",
      isbn: "isbn1",
    })
  })

  it("Fail on arbitrary parameters", () => {
    // undefined
    assert.throws(() => {
      createBook()
    })

    // empty string MUST fail
    assert.throws(() => {
      createBook("1", "2", '')
    })
  })

  it("Test Helper function", () => {
    const bookMock = createBook("TS > JS", "Jeel", "mockisbn")
    addBookToLibrary(bookMock)
    assert.deepEqual({ ...bookMock, ...autoAddedParams }, getBookByISBN(bookMock.isbn))
  })

  it("Fail on repeating ISBN", () => {
    const bookMock = createBook("TS > JS", "Jeel", "mockisbn")
    const bookMock2 = structuredClone(bookMock)
    addBookToLibrary(bookMock)
    assert.throws(() => {
      addBookToLibrary(bookMock2)
    })
  });

  it("Fail on non-string author argument", () => {
    assert.throws(() => {
      findBooksByAuthor(1)
    })
  });

  it("Get book by author", () => {
    const bookMock = createBook("TS > JS", "Jeel", "mockisbn")
    addBookToLibrary(bookMock)
    const foundBook = findBooksByAuthor("Jeel").pop()

    assert.deepEqual({ ...bookMock, ...autoAddedParams }, foundBook)
  });

  it("Get book by partial author name", () => {
    const bookMock = createBook("TS > JS", "Jeel Patel", "mockisbn")
    addBookToLibrary(bookMock)
    const foundBook = findBooksByAuthor("eel").pop()

    assert.deepEqual({ ...bookMock, ...autoAddedParams }, foundBook)
  });

  it("Checkout Books", () => {
    const bookMock = createBook("TS > JS", "Jeel", "mockisbn")
    addBookToLibrary(bookMock)
    const foundBook = findBooksByAuthor("Jeel").pop()
    checkoutBook(foundBook.isbn)
    assert.equal(foundBook.checkedOut, true)


    // CHECKOUT AGAIN, AND IT SHOULD THROW
    assert.throws(() => {
      checkoutBook(foundBook.isbn)
    })

  })

  it("Return Book", () => {
    const bookMock = createBook("TS > JS", "Jeel", "mockisbn")
    addBookToLibrary(bookMock)
    const foundBook = findBooksByAuthor("Jeel").pop()
    checkoutBook(foundBook.isbn)

    // return book
    returnBook(foundBook.isbn)

    assert.equal(foundBook.checkedOut, false)

    // CHECKOUT AGAIN, AND IT SHOULD THROW
    assert.throws(() => {
      returnBook(foundBook.isbn)
    })

  })

  // ADVANCED TASKS 1

  // limited checkouts
  it("Checkout Books Over Limit", () => {
    const bookMock = createBook("TS > JS", "Jeel", "mockisbn")
    addBookToLibrary(bookMock)
    const foundBook = findBooksByAuthor("Jeel").pop()
    checkoutBook(foundBook.isbn)
    assert.equal(foundBook.checkedOut, true)
    assert.equal(foundBook.numOfCheckouts, 1)
    returnBook(foundBook.isbn)

    checkoutBook(foundBook.isbn)
    assert.equal(foundBook.checkedOut, true)
    assert.equal(foundBook.numOfCheckouts, 2)
    returnBook(foundBook.isbn)

    checkoutBook(foundBook.isbn)
    assert.equal(foundBook.checkedOut, true)
    assert.equal(foundBook.numOfCheckouts, 3)
    returnBook(foundBook.isbn)

    assert.throws(() => {
      checkoutBook(foundBook.isbn)
    }, "Book checkout limit reached")
  })

  // OverDue books
  it("Should list overdue book", () => {
    addBookToLibrary(createBook("TS > JS", "Jeel", "mockisbn1"))
    addBookToLibrary(createBook("TS > JS", "Jeel", "mockisbn2"))
    // make book1 overDue
    library[0].dueDate = new Date(Date.now() - (DUE_DAY_LIMIT + 1) * 24 * 60 * 60 * 1000)

    const overDueBooks = listOverdueBooks()
    assert.deepEqual(overDueBooks.pop().isbn, "mockisbn1")
    assert.equal(overDueBooks.pop(), undefined)
    assert.equal(library.length, 2)

  })

  // book rating system
  it("Should rate book only once", () => {
    const isbn = "mockisbn"
    addBookToLibrary(createBook("TS > JS", "Jeel", isbn))
    // make book1 overDue
    rateBook(isbn, 5, "user1")
    assert.equal(getBookByISBN(isbn).ratings.get("user1"), 5)
    assert.equal(getAverageRating(isbn), 5)

    rateBook(isbn, 1, "user1")
    assert.equal(getBookByISBN(isbn).ratings.get("user1"), 1)
    assert.equal(getAverageRating(isbn), 1)
  })

  it("Should get average rating correctly", () => {
    const isbn = "mockisbn"
    addBookToLibrary(createBook("TS > JS", "Jeel", isbn))
    // make book1 overDue
    rateBook(isbn, 5, "user1")
    assert.equal(getBookByISBN(isbn).ratings.get("user1"), 5)
    assert.equal(getAverageRating(isbn), 5)

    rateBook(isbn, 4, "user2")
    assert.equal(getBookByISBN(isbn).ratings.get("user2"), 4)
    assert.equal(getAverageRating(isbn), 4.5)
  })

});

