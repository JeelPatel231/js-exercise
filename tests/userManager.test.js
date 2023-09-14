// @ts-nocheck

import { WebCryptoProvider } from "../cryptoprovider.js"
import { UserManager } from "../user.js"

describe(`User Manager`, () => {
  const crypto = new WebCryptoProvider()
  let userManager = null

  beforeEach(() => {
    userManager = new UserManager(crypto)
  })

  it(`Uses user uuid as unique key`, () => {
    userManager.registerUser("jeel")
    userManager.registerUser("jeel")
    assert.equal(userManager.length, 2)
  })

})
