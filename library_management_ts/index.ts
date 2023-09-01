import { Book } from "./book";
import { LocalStorageMock } from "./helper";
import { Library } from "./library";

const lib = new Library(new LocalStorageMock())

const b1 = new Book("a", "c", "isbn1")
const b2 = new Book("b", "b", "isbn2")
const b3 = new Book("c", "a", "isbn3")

b1.rateBook("1", 1)
b2.rateBook("1", 2)
b3.rateBook("1", 3)


lib.addBook(b1)
lib.addBook(b2)
lib.addBook(b3)

lib.sort('rating', true)
console.log(lib.books)
