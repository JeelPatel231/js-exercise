export class CryptoProvider {
  /** @returns {string} */
  genUUID() {
    throw new Error("Abstract class")
  }
}

export class WebCryptoProvider extends CryptoProvider {
  /** @returns {string} */
  genUUID() {
    return window.crypto.randomUUID()
  }
}
