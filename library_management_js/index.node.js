import { LocalStorageMock } from "./storage.js";
import { Library } from "./library.js";
import { NodeCryptoProvider } from "./cryptoprovider.js";

const lib = new Library(new LocalStorageMock(), new NodeCryptoProvider())

const book1 = lib.bookManager.addBook("a", "c", "isbn1")
const book2 = lib.bookManager.addBook("b", "b", "isbn2")
const book3 = lib.bookManager.addBook("c", "a", "isbn3")

let uJeel = lib.userManager.registerUser("Jeel")
let uLeej = lib.userManager.registerUser("Leej")

