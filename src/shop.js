class Cleanse {
  constructor(cart) {
    this.name = 'Unnamed Cleanse'
    this.products = []
    this.ID = Math.random().toString(36).substring(2, 8)
    cart.addToAll(this)
  }

  addProduct = (dataObj) => {
    const pName = dataObj.origin.name
    const pPrice = dataObj.origin.price
    const pMatch = this.products.find((product) => product.name === pName)

    pMatch !== undefined
      ? pMatch.amount++
      : this.products.push({ name: pName, price: pPrice, amount: 1 })

    return this
  }

  removeProduct = (dataObj) => {
    const pName = dataObj.origin.name
    const pMatch = this.products.find((product) => product.name === pName)
    if (pMatch && pMatch.amount > 0) pMatch.amount--
    if (pMatch.amount === 0)
      this.products = this.products.filter((product) => product.name !== pName)
    this.updateDOM(dataObj)
    return this
  }

  updateName = (dataObj) => {
    const text = document.querySelector(dataObj.target.selector).textContent
    const isValid = /^[\w\s]+$/.test(text)
    isValid
      ? (this.name = text)
      : alert(
          'Cleanse name only accepts letters, numbers, and spaces, excluding characters used in XSS attacks.'
        )
  }

  getTotal = () => {
    return this.products.reduce((total, product) => total + product.price, 0)
  }
}

export { Cleanse }

class Cart {
  constructor() {
    this.cleansesAll = []
    this.cleansesCart = []
    this.deliveryInfo = {}
  }
  addToAll = (cleanse) => {
    this.cleansesAll.push(cleanse)
  }

  addToCart = (dataObj) => {
    this.cleansesCart.push(
      this.cleansesAll.find((cleanse) => cleanse.ID === dataObj.origin.id)
    )
    // refactor id based
  }

  removeFromCart = (dataObj) => {
    this.cleansesCart = this.cleansesCart.filter(
      (cleanse) => cleanse.ID !== dataObj.target.id
    )
  }

  getDeliveryInfo = (dataObj) => {}

  processCart = () => {
    console.log(this.cleansesAll)
    console.log(this.cleansesCart)
    console.log(this.deliveryInfo)
  }
}

export { Cart }
