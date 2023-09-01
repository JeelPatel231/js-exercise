import "./helper"

export type ISBN = string;

const MAX_DUE_DAYS = 7;
const MAX_CHECKOUTS = 3;

export class Book {
  private _checkedOut: boolean;
  private _numOfCheckouts: number;
  private _dueDate: Date | null;
  private ratings: Map<string, number>;

  title: string
  author: string
  isbn: ISBN

  constructor(title: string, author: string, isbn: ISBN) {
    // validations
    if (title.nullIfEmpty() == null) {
      throw new Error("Title is invalid")
    }
    if (author.nullIfEmpty() == null) {
      throw new Error("Author is invalid")
    }

    if (isbn.nullIfEmpty() == null) {
      throw new Error("ISBN is invalid")
    }

    // assignments
    this.title = title;
    this.author = author;
    this.isbn = isbn;

    this._checkedOut = false;
    this._numOfCheckouts = 0;
    this._dueDate = null;
    this.ratings = new Map();
  }

  setDueDate() {
    this._dueDate = new Date(Date.now() + (MAX_DUE_DAYS * 24 * 60 * 60 * 1000))
  }

  get numOfCheckouts() {
    return this._numOfCheckouts
  }

  get dueDate() {
    return this._dueDate
  }

  get checkedOut() { return this._checkedOut }

  checkout() {
    if (this.numOfCheckouts >= MAX_CHECKOUTS) {
      throw new Error("Book cannot be checked out anymore. Limit Reached!")
    }

    if (this._checkedOut) {
      throw new Error("Book is already checked out. Illegal Operation")
    }
    this._checkedOut = true
    this._numOfCheckouts += 1
  }

  return() {
    if (!this._checkedOut) {
      throw new Error("Book is already in the library. Illegal Operation")
    }
    this._checkedOut = false
  }

  rateBook(userId: string, rating: number) {
    this.ratings.set(userId, rating.coerceBetween(0, 5))
  }

  get averageRating() {
    const allRatings = Array.from(this.ratings.values())
    return allRatings.reduce((a, b) => a + b, 0) / allRatings.length
  }

  get isOverDue(): boolean {
    return this.dueDate !== null && this.dueDate.getTime() < Date.now()
  }

}

