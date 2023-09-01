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
    library = [];
  })

  after(() => {
    // reset library after tests
    library = libraryBackup
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

  // search functionality
  it("Should search with both author and book name", () => {
    addBookToLibrary(createBook("TS > JS", "Jeel", "mockisbn"))
    const bookNeeded = getBookByISBN("mockisbn")
    assert.deepEqual(searchBooks("eel"), [bookNeeded])
    assert.deepEqual(searchBooks("ts"), [bookNeeded])
    assert.throws(() => {
      searchBooks(" ")
    }, "Data Must not be Null")
  })

  // SORT BOOKS
  it("Should sort books with given criterias", () => {
    const b1 = createBook("a", "d", "mockisbn1");
    const b2 = createBook("b", "c", "mockisbn2");
    const b3 = createBook("c", "b", "mockisbn3");
    const b4 = createBook("d", "a", "mockisbn4");

    const baseArray = [
      { ...b1, ...autoAddedParams, numOfCheckouts: 0 },
      { ...b2, ...autoAddedParams, numOfCheckouts: 1 },
      { ...b3, ...autoAddedParams, numOfCheckouts: 2 },
      { ...b4, ...autoAddedParams, numOfCheckouts: 3 },
    ];

    debugger;
    baseArray.forEach(x => addBookToLibrary(x));
    library.forEach((x, idx) => x.numOfCheckouts = idx)

    sortLibrary({ title: true })
    assert.deepEqual(library, baseArray)

    sortLibrary({ author: true, descending: true })
    assert.deepEqual(library, baseArray)

    sortLibrary({ checkouts: true })
    assert.deepEqual(library, baseArray)

    baseArray.reverse()
    sortLibrary({ title: true, descending: true })
    assert.deepEqual(library, baseArray)

    sortLibrary({ author: true })
    assert.deepEqual(library, baseArray)

    sortLibrary({ checkouts: true, descending: true })
    assert.deepEqual(library, baseArray)

    library = [
      createBook("a", "a", "isbn1"),
      createBook("a", "a", "isbn1"),
      createBook("d", "a", "isbn1"),
      createBook("c", "a", "isbn1")
    ]
    library[0].numOfCheckouts = 1
    library[1].numOfCheckouts = 0
    library[2].numOfCheckouts = 2
    library[3].numOfCheckouts = 3

    sortLibrary({ title: true, checkouts: true })

  })

  // advanced storage
  it("should save in localStorage", () => {
    let localStorageMock = storageMock();
    addBookToLibrary(createBook("abc", "def", "mockisbn1"));

    let stringValue = JSON.stringify(library)
    _saveToStorage(localStorageMock)
    assert.equal(localStorageMock.getItem("library"), stringValue)
    _loadFromStorage(localStorageMock)

    assert.deepEqual(library, JSON.parse(stringValue))

  })
});

function storageMock() {
  let storage = {};

  return {
    setItem: function(key, value) {
      storage[key] = value ?? '';
    },
    getItem: function(key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function(key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}
