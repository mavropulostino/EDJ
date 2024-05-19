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

    const cont = document.querySelector('.product-cont')
    if (!cont) return console.warn(`${cont} not found`)

    cont.innerHTML = this.products
      .filter((product) => product.amount > 0)
      .map(
        ({ name, amount, total }) => `
        <div class="flex-column justify-between">
          <div class="flex-row justify-between">
            <div class="flex-row gap-05">
              <p>${amount}</p>
              <p>${this.parseName(name)}</p>
            </div>
            <div class="flex-row gap-05">
            <span class="material-symbols-outlined icon-20 _cart_origin_add"  data-name="${name}">add</span>
            <span class="material-symbols-outlined icon-20 _cart_origin_remove"  data-name="${name}">remove</span>
              <p>${total}</p>
            </div>
          </div>
        </div>
      `
      )
      .join('')
  }
  parseName = (name) => {
    return name.replace(/_/g, ' ')
  }

  submitCpay = () => {}
}

export { Product, Cart }

// cleanse element in dom (cart)
