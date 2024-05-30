import { preparePayment } from './firebase'

class Product {
  constructor(name, cyrName, price, amount = 0) {
    this.name = name
    this.cyrName = cyrName
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
        ({ name, cyrName, amount }) => `
        <div class="flex-column justify-between">
          <div class="flex-row justify-between">
              <p>${cyrName}</p>
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
  sessionStorageSet = () => {
    sessionStorage.setItem('cart', JSON.stringify(this.products))
  }
  sessionStorageGet = () => {
    return JSON.parse(sessionStorage.getItem('cart'))?.map(
      ({ name, cyrName, price, amount }) =>
        new Product(name, cyrName, price, amount) || null
    )
  }

  checkForm = (dataObj) => {
    const errorMessages = {
      full_name: 'Внесете име и презиме',
      Address: 'Внесете ја вашата адреса',
      Email: 'Внесете ја вашата е-мејл адреса',
      Phone: 'Внесете го вашиот телефонски број',
    }
    const form = document.querySelector(dataObj.target.selector)
    const formArr = Array.from(form.elements).map((input) => ({
      name: input.name,
      value: input.value.trim(),
      errorMsg: errorMessages[input.name] || null,
      target: document.querySelector(`label[for="${input.name}"]`),
    }))

    let hasError = false

    formArr.forEach((inputObj) => {
      if (inputObj.value === '' && inputObj.errorMsg) {
        inputObj.target.textContent = inputObj.errorMsg
        inputObj.target.classList.add('error-red')
        hasError = true
      }
    })

    return !hasError
  }
  mapForm = () => {
    return Array.from(document.querySelector('#deliveryInfo').elements).reduce(
      (acc, input) => {
        if (input.name) {
          acc[input.name] = input.value.trim()
        }
        return acc
      },
      {}
    )
  }

  proxyRequest = async (dataObj) => {
    // Checks
    // if (this.products.some((product) => !product.amount)) {
    //   console.log(product)
    //   document.querySelector('._global_error').textContent =
    //     'Немате продукти во кошничка'
    //   return false
    // }
    let formStatus = this.checkForm(dataObj)
    if (formStatus == false) {
      document.querySelector('._global_error').textContent =
        'Потребно е сите полиња да се пополнfети'
      return
    }

    // products
    let response = null
    // console.log(this.mapForm())
    // console.log(this.products)
    try {
      response = await preparePayment({
        products: this.products,
        form: this.mapForm(),
      })
      console.log(response)
    } catch (error) {
      console.log(error)
    }

    const orderedKeys = [
      'AmountToPay',
      'PayToMerchant',
      'MerchantName',
      'AmountCurrency',
      'Details1',
      'Details2',
      'PaymentFailURL',
      'PaymentOKURL',
      'CheckSumHeader',
      'CheckSum',
      'Address',
      'Telephone',
      'Email',
    ]

    let formHtml =
      '<form action="https://www.cpay.com.mk/client/Page/default.aspx?xml_id=/mk-MK/.loginToPay/.simple/" method="post" id="paymentForm">'
    orderedKeys.forEach((key) => {
      if (!response.format[key]) console.warn(`Form data doesnt contain ${key}`)
      formHtml += `<input type="hidden" name="${key}" value="${response.format[key]}" />`
    })

    formHtml += '<button type="submit">Pay</button></form>'
    document.body.insertAdjacentHTML('beforeend', formHtml)
    console.log(formHtml)
    document.getElementById('paymentForm').submit()
  }
}

export { Product, Cart }
