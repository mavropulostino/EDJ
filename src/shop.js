class Product {
  constructor(name, price) {
    this.name = name
    this.price = price
    this.amount = 0
  }
  get total() {
    return this.amount * this.price
  }
}

class Cart {
  constructor(...products) {
    this.products = products
    this.salePercent = 0
  }
  addAmount = (dataObj) => {
    const product = this.products.find((p) => p.name === dataObj.origin.name)
    if (product) product.amount++
    this.updateDOM()
  }
  removeAmount = (dataObj) => {
    const product = this.products.find((p) => p.name === dataObj.origin.name)
    if (product) product.amount = Math.max(0, --product.amount)
    this.updateDOM()
  }
  get total() {
    return this.products.reduce(
      (total, product) => total + product.total * (1 - this.salePercent / 100),
      0
    )
    // .toFixed(2) // Ensure total is fixed to 2 decimal places
  }

  updateDOM = () => {
    const updates = [
      ...this.products.map(({ name, amount }) => [`.${name}-amount`, amount]),
      ['.cart-total', this.total],
      // Add more mappings here
    ]
    updates.forEach(([selector, value]) => {
      const element = document.querySelector(selector)
      if (element) element.textContent = value
      if (!element) console.warn(`${selector} not found`)
    })
  }

  submitCpay = () => {}
}

export { Product, Cart }

// Preorder bonus
// outline gmaps
// cleanse element in dom (cart)
