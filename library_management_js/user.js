import { CryptoProvider } from "./cryptoprovider.js";
import { UniqueArray } from "./helper.js";

/** @private */
class User {
  /** 
   * @param {string} name
   * @param {string} uuid */
  constructor(uuid, name) {

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

  /**
   * @param {string} uuid 
   */
  checkValid(uuid){
    if (!this.find(x => x.uuid === uuid)){
      throw new Error("UUID of given User invalid")
    }
  }

  /** @param {string} name */
  registerUser(name) {
    const user = new User(this._crypto.genUUID(), name)
    this.push(user)
    return user
  }

  /** @param {string} uuid */
  deleteUser(uuid) {
    throw new Error("UNIMPLEMENTED")
  }
};

