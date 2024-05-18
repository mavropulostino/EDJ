// define parent which contains reactive pattern and DOM manip methods
// product and cart extend from parent
// product contains productAmount and productTotal
// cart contains cartAmount and cartTotal + cPayPost
// optimize by making universal amount and total methods on parent

class Product {
  constructor(name, price) {
    this.name = name
    this.price = price
    this.amount = 0
  }
}
class Cart {
  constructor(...products) {
    this.products = products
    this.salePercent = 0
    this.total = this.getTotal()
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
  getTotal = () =>
    this.products.reduce(
      (total, { amount, price }) =>
        total + amount * price * (1 - this.salePercent / 100),
      0
    )
  // .toFixed(2)

  updateDOM = () => {
    const updates = [
      ['.prod-total', this.total],
      ['.prod-amount', this.amount],
    ]

    updates.forEach(([selector, value]) => {
      const element = document.querySelector(selector)
      if (element) element.textContent = value
      if (!element) alert(`${selector} not found`)
    })
  }

  submitCpay = () => {}
}
