import { CryptoProvider } from "../cryptoprovider.js";
import crypto from "crypto"

export class NodeCryptoProvider extends CryptoProvider {
  /** @returns {string} */
  genUUID() {
    return crypto.randomUUID()
  }
}

