// @ts-nocheck

import { NotFoundError } from "../errors.js"
import { UniqueArray } from "../helper.js"

describe("Unique Array", () => {
  let uniqueArray = null

  // const addBook1 = (library) => library.books.addBook("title1", "author1", "isbn1")
  // const addBook2 = (library) => library.books.addBook("title2", "author2", "isbn2")

  beforeEach(() => {
    uniqueArray = new UniqueArray((x) => x.a)
  })

  it(`Items are pushed as expected`, () => {
    uniqueArray.push({ a: "hello" });
    uniqueArray.push({ a: "world" });
    assert.equal(uniqueArray.length, 2)
  })

  it(`Items are Unique`, () => {
    uniqueArray.push({ a: "world" });

    assert.throws(() => {
      uniqueArray.push({ a: "world" });
    }, "Item Already Exists in Array")

    assert.equal(uniqueArray.length, 1)
  })

  it(`Deletes item by its unique property`, () => {
    uniqueArray.push({ a: "hello" });
    uniqueArray.push({ a: "world" });
    assert.throws(() => {
      uniqueArray.findAndDelete({ b: "hello" })
    }, NotFoundError)
    assert.equal(uniqueArray.length, 2)
  })

  it(`Find by Unique Property`, () => {
    uniqueArray.push({ a: "hello" });
    uniqueArray.push({ a: "world" });
    assert.deepEqual(
      uniqueArray.findByUniqueProp("hello"),
      { a: "hello" }
    )
  })

})
