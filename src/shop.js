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

  getTotal = () => {
    return Object.values(this.products).reduce(
      (total, product) =>
        total +
        (product.amount * product.price * (100 - this.salePercent)) / 100,
      0
    )
  }
  updateDOM = () => {
    const updates = [['.prod-total', this.total.toFixed(2)], []]

    updates.forEach(([selector, value]) => {
      const element = document.querySelector(selector)
      if (element) element.textContent = value
      if (!element) alert('element not found')
    })
  }

  submitCpay = () => {}
}
