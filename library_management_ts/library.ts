import { type ISBN, Book } from "./book"

export class Library {
  private _books: Book[] = [];
  private isbn_set = new Set();
  private storage: Storage;

  // spreading to make a copy, else they can just modify the reference
  get books() { return [...this._books] }

  constructor(storage: Storage) {
    this.storage = storage
  }

  // methods
  addBook(book: Book) {
    if (this.isbn_set.has(book.isbn)) {
      throw new Error("Book already exists in the library!")
    }
    this._books.push(book)
    this.isbn_set.add(book.isbn)
  }

  private getBookByISBNSafe(isbn: ISBN): Book | null {
    return this.books.find(x => x.isbn === isbn.trim()) ?? null
  }

  private getBookByISBN(isbn: ISBN): Book {
    const book = this.getBookByISBNSafe(isbn.trim())
    if (book === null) {
      throw new Error("Book Not Found")
    }

    return book;
  }

  checkOutBook(isbn: ISBN) {
    return this.getBookByISBN(isbn).checkout()
  }

  returnBook(isbn: ISBN) {
    return this.getBookByISBN(isbn).return()
  }

  searchBookByAuthor(author: string) {
    author = author.trim().toLowerCase()
    return this.books.filter(x => x.author.toLowerCase().includes(author))
  }

  searchBookByTitleOrAuthor(authorOrTitle: string) {
    const query = authorOrTitle.trim().toLowerCase();
    return this.books.filter(x => {
      return x.author.toLowerCase().includes(query)
        || x.title.toLowerCase().includes(query)
    })
  }

  get overdueBooks() {
    return this._books.filter(x => x.isOverDue)
  }

  // sort
  sort(key: 'author' | 'duedate' | 'rating' | 'numofcheckouts' | 'title', descending: boolean = false) {
    const ordering = descending ? -1 : 1
    const key_map: Record<typeof key, (a: Book, b: Book) => number> = {
      'author': (a, b) => a.author.toLowerCase().localeCompare(b.author.toLowerCase()),
      'title': (a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      'duedate': (a, b) => (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0),
      'rating': (a, b) => a.averageRating - b.averageRating,
      'numofcheckouts': (a, b) => a.numOfCheckouts - b.numOfCheckouts,
    }

    this._books.sort((a, b) => key_map[key](a, b) * ordering)
  }

  // save
  save() {
    try {
      this.storage.setItem('library', JSON.stringify(this._books))
    } catch (e: unknown) {
      console.error(e)
    }
  }

  // load
  load() {
    const keyString = this.storage.getItem('library')
    if (keyString == null) {
      return console.error("Storage doesnt have stored library")
    }

    try {
      this._books = JSON.parse(keyString)
    } catch (e: unknown) {
      this._books = []
      console.error(e)
    }
  }
}
