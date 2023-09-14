import { NodeStorage } from "./node/nodestorage.js";
import { Library } from "./library.js";
import { NodeCryptoProvider } from "./node/nodecrytoprovider.js";
import { TransactionTypes } from "./transaction.js";

const lib = new Library((lib) => new NodeStorage(lib), new NodeCryptoProvider())
const lib2 = new Library((lib) => new NodeStorage(lib), new NodeCryptoProvider())

const book1 = lib.books.addBook("a", "c", "isbn1")
const book2 = lib.books.addBook("b", "b", "isbn2")
const book3 = lib.books.addBook("c", "a", "isbn3")

let uJeel = lib.users.registerUser("Jeel")
let uLeej = lib.users.registerUser("Leej")

let rating1 = lib.reviews.addReview(uJeel.uuid, book1.isbn, 1, "very good")
let rating2 = lib.reviews.addReview(uLeej.uuid, book1.isbn, 2, "very cool")

lib.tranx.checkOutBook(book1.isbn, uJeel.uuid)
lib.tranx.returnBook(book1.isbn, uJeel.uuid)

lib.tranx.checkOutBook(book1.isbn, uJeel.uuid)
lib.tranx.returnBook(book1.isbn, uJeel.uuid)

lib.tranx.checkOutBook(book1.isbn, uJeel.uuid)
lib.tranx.returnBook(book1.isbn, uJeel.uuid)

console.log(
 lib.tranx.filter((x) => x.userId === uJeel.uuid && x.transactionType === TransactionTypes.CHECKOUT)
)
