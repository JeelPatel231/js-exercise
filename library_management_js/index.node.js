import { NodeStorage } from "./node/nodestorage.js";
import { Library } from "./library.js";
import { NodeCryptoProvider } from "./node/nodecrytoprovider.js";

const lib = new Library(new NodeStorage(), new NodeCryptoProvider())
const lib2 = new Library(new NodeStorage(), new NodeCryptoProvider())

const book1 = lib.bookManager.addBook("a", "c", "isbn1")
const book2 = lib.bookManager.addBook("b", "b", "isbn2")
const book3 = lib.bookManager.addBook("c", "a", "isbn3")

let uJeel = lib.userManager.registerUser("Jeel")
let uLeej = lib.userManager.registerUser("Leej")

let rating1 = lib.reviewManager.addReview(uJeel.uuid, book1.isbn, 1, "very good")
let rating2 = lib.reviewManager.addReview(uLeej.uuid, book1.isbn, 2, "very cool")

console.log(lib.reviewManager.findReview(book1.isbn, null, "cool"))