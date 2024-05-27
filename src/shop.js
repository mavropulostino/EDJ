import { preparePayment } from './firebase'

class Product {
  constructor(name, price, amount = 0) {
    this.name = name
    this.price = price
    this.amount = amount
  }
  get total() {
    return this.amount * this.price
  }
}

class Cart {
  constructor(...products) {
    this.products = this.sessionStorageGet() || products
    this.salePercent = 0
  }
  addAmount = (dataObj) => {
    const product = this.products.find((p) => p.name === dataObj.origin.name)
    if (product) product.amount = Math.min(6, ++product.amount)
    this.sessionStorageSet()
    this.updateDOM()
  }
  removeAmount = (dataObj) => {
    const product = this.products.find((p) => p.name === dataObj.origin.name)
    if (product) product.amount = Math.max(0, --product.amount)
    this.sessionStorageSet()
    this.updateDOM()
  }
  get total() {
    return this.products.reduce(
      (total, product) => total + product.total * (1 - this.salePercent / 100),
      0
    )
  }

  updateDOM = () => {
    const updates = [
      ...this.products.map(({ name, amount }) => [`.${name}_amount`, amount]),
      ['.cart-total', this.total],
      // Add more mappings here
    ]
    updates.forEach(([selector, value]) => {
      const element = document.querySelector(selector)
      if (element) element.textContent = value
      // if (!element) console.warn(`${selector} not found`)
    })

    const cont = document.querySelector('.product-cont')
    if (!cont) return console.warn(`${cont} not found`)

    cont.innerHTML = this.products
      .filter((product) => product.amount > 0)
      .map(
        ({ name, amount }) => `
        <div class="flex-column justify-between">
          <div class="flex-row justify-between">
              <p>${this.parseName(name)}</p>
            <div class="flex-row gap-05 align-center card">
            <span class="material-symbols-outlined icon-20 _add_amount"  data-name="${name}">add</span>
            <p>${amount}</p>
            <span class="material-symbols-outlined icon-20 _remove_amount"  data-name="${name}">remove</span>
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
  sessionStorageSet = () => {
    sessionStorage.setItem('cart', JSON.stringify(this.products))
  }
  sessionStorageGet = () => {
    return JSON.parse(sessionStorage.getItem('cart'))?.map(
      ({ name, price, amount }) => new Product(name, price, amount) || null
    )
  }
  proxyRequest = async () => {
    let mockProducts = [{ name: 'Product1', amount: 1 }]
    let response = null
    try {
      response = await preparePayment({ products: mockProducts })
    } catch (error) {
      console.log(error)
    }

    console.log(response)

    const formData = new FormData()
    Object.entries(response.format).forEach(([key, value]) => {
      formData.append(key, value)
    })

    // console.log(formData)
    // Array.from(formData).forEach(([key, value]) => {
    //   console.log(key, value)
    // })

    const form = document.createElement('form')
    form.method = 'post'
    form.action = 'https: //eclatdejus.com'
    // Use Object.entries to iterate over object properties
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = value
      form.appendChild(input)
    })

    document.body.appendChild(form)
    form.submit()
  }
}

export { Product, Cart }
