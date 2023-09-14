import { NotImplementedError } from "./errors.js"

export class CryptoProvider {
  /** @returns {string} */
  genUUID() {
    throw new NotImplementedError()
  }
}

export class WebCryptoProvider extends CryptoProvider {
  /** @returns {string} */
  genUUID() {
    return window.crypto.randomUUID()
  }
}
