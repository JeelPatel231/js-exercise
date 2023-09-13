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

export class NodeCryptoProvider extends CryptoProvider {
  /** @returns {string} */
  genUUID() {
    // not recommended but for dev purposes on node js
    // source : https://fjolt.com/article/javascript-uuid#option-4:-math.random()-(not-recommended)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

