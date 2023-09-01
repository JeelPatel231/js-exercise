let library = [
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

  const book = library.find(x => x.isbn === isbn)

  if (book === undefined) {
    throw new Error("Book doesnt exist in library!")
  }

  return book;
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

  if (library.find(x => x.isbn === isbn) !== undefined) {
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

  book.ratings.set(userId, rating)
}

function getAverage(iterator) {
  const arr = Array.from(iterator.values())
  return arr.reduce((a, b) => a + b, 0) / arr.length
}

function getAverageRating(isbn) {
  const book = getBookByISBN(isbn)
  return getAverage(book.ratings)
}


function searchBooks(partialAuthorOrName) {
  if (typeof partialAuthorOrName !== "string") {
    throw new Error("partialAuthororName must be string")
  }
  const query = Utils.notNull(Utils.nullIfEmpty(partialAuthorOrName))


  return library.filter(x => {
    return x.author.toLowerCase().includes(query.toLowerCase())
      || x.title.toLowerCase().includes(query.toLowerCase())
  })
}

function sortLibrary({ title, author, rating, checkouts, dueDate, descending }) {
  // TODO, implement multi dimensional sorting
  // convert all to boolean
  title = !!title
  author = !!author
  rating = !!rating
  checkouts = !!checkouts
  dueDate = !!dueDate

  const factor = descending ? -1 : 1
  /// 
  if (title) {
    console.log("sorting by title")
    library.sort((a, b) => a.title.localeCompare(b.title) * factor)
  }

  if (author) {
    console.log("sorting by author")
    library.sort((a, b) => a.author.localeCompare(b.author) * factor)
  }

  if (rating) {
    console.log("sorting by rating")
    library.sort((a, b) => (getAverage(a.ratings) - getAverage(b.ratings)) * factor)
  }

  if (checkouts) {
    console.log("sorting by checkouts")
    library.sort((a, b) => (a.numOfCheckouts - b.numOfCheckouts) * factor)
  }

  if (dueDate) {
    console.log("sorting by duedate")
    library.sort((a, b) => (a.dueDate - b.dueDate) * factor)
  }
}

// should be private in real world
// storage agnostic save/load functions
function _saveToStorage(storage) {
  storage.setItem("library", JSON.stringify(library))
}

function _loadFromStorage(storage) {
  try {
    library = JSON.parse(storage.getItem("library"))
  } catch (e) {
    console.error(e, "Failed to Load Library from localstorage. The library is reset")
    storage.setItem("library", JSON.stringify([]))
  }
}

// public storage options
function saveLibrary() {
  _saveToStorage(window.localStorage)
}

function loadLibrary() {
  _loadFromStorage(window.localStorage)
}

