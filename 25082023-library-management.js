const library = [
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    checkedOut: false
  },
  {
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    checkedOut: true
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    isbn: "978-0-06-085052-4",
    checkedOut: false
  }
];

class Utils {
  static nullIfEmpty(str) {
    if (str === '' || str == null) {
      return null
    }

    return str
  }

  static notNull(data) {
    if (data === null) throw new Error("Data Must not be Null")
    return data
  }
}


function createBook(title, author, isbn) {
  title = Utils.notNull(Utils.nullIfEmpty(title))
  author = Utils.notNull(Utils.nullIfEmpty(author))
  isbn = Utils.notNull(Utils.nullIfEmpty(isbn))

  if (library.find(x => x.isbn === isbn) !== undefined) {
    throw new Error("Book with ISBN already exists!")
  }
  return {
    title,
    author,
    isbn,
    checkedOut: false
  }
}

function addBookToLibrary(book) {
  const title = Utils.notNull(Utils.nullIfEmpty(book.title))
  const author = Utils.notNull(Utils.nullIfEmpty(book.author))
  const isbn = Utils.notNull(Utils.nullIfEmpty(book.isbn))
  const checkedOut = !!book.checkedOut

  library.push({ title, author, isbn, checkedOut })
}

function checkoutBook(isbn) {
  const book = library.find(x => x.isbn === isbn)

  if (book === undefined) {
    throw new Error("Book does not exist in library")
  }

  if (book.checkedOut) {
    throw new Error("Book already checked out")
  }

  book.checkedOut = true
}

function returnBook(isbn) {
  const book = library.find(x => x.isbn === isbn)

  if (book === undefined) {
    throw new Error("Book not available in library")
  }

  if (!book.checkedOut) {
    throw new Error("Book was not checked Out, ILLEGAL STATE")
  }

  book.checkedOut = false;
}

function findBooksByAuthor(author) {
  return library.filter(x => x.author === author)
}



// -------------- //
// MOCHA TEST CASES
describe("Library Management", () => {
  const libraryBackup = structuredClone(library)

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
    assert.deepEqual(book1, { title: "title1", author: "author1", isbn: "isbn1", checkedOut: false })
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

  it("Get book by author", () => {
    const bookMock = createBook("TS > JS", "Jeel", "mockisbn")
    addBookToLibrary(bookMock)
    const foundBook = findBooksByAuthor("Jeel").pop()

    assert.deepEqual(bookMock, foundBook)
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

});

