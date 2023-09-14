import { CryptoProvider } from "./cryptoprovider.js";
import { IllegalArgumentException } from "./errors.js";
import { UniqueArray, nullIfEmpty } from "./helper.js";

/** @private */
class User {
  /** 
   * @param {?string} name
   * @param {string} uuid */
  constructor(uuid, name) {
    name = nullIfEmpty(name)
    if (name == null) {
      throw new IllegalArgumentException("Name")
    }

    /** @type {string} */
    this.name = name
    /** @type {string} */
    this.uuid = uuid
  }
}

/** @augments UniqueArray<User> */
export class UserManager extends UniqueArray {
  /** @param {CryptoProvider} cryptoObject  */
  constructor(cryptoObject) {
    super((user) => user.uuid)
    this._crypto = cryptoObject
  }

  /** @param {string} name */
  registerUser(name) {
    const user = new User(this._crypto.genUUID(), name)
    this.push(user)
    return user
  }

  /** @param {string} uuid */
  deleteUser(uuid) {
    this.findAndDelete(uuid)
  }
};

