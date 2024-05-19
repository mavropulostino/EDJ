// UTILS
function generateID() {
  return Math.random().toString(36).substring(2, 8)
}
function updateVal(selector, value) {
  document
    .querySelectorAll(selector)
    .forEach((element) => (element.textContent = value))
}
function updateTemplate(selector, template) {}

function sessionSet(data) {
  sessionStorage.setItem('data', JSON.stringify(data))
}
function sessionGet() {
  return JSON.parse(sessionStorage.getItem('cart'))?.map(
    ({ name, price, amount }) => new Product(name, price, amount) || null
  )
}

class Cleanse {
  constructor(name, priceMap) {
    this.name = name
    this.days = 2
    this.priceMap = priceMap
    this._ID = generateID()
  }
  get ID() {
    return this._ID
  }
  get total() {
    return this.priceMap[this.days]
  }
  daysIncrement = () => {
    this.days = Math.min(this.days++, 5)
    updateVal('cleanse-days', this.days)
    sessionSet(this)
  }
  daysDecrement = () => {
    this.days = Math.max(this.days--, 2)
    updateVal('cleanse-days', this.days)
    sessionSet(this)
  }
}

class Cart {
  constructor(...cleanseObj) {
    this.cleanseRef = cleanseObj
    this.cleanses = sessionGet() || []
    this.salePercent = 15
  }
  get total() {
    return (
      this.cleanses.reduce((sum, cleanse) => sum + cleanse.total, 0) *
      (1 - this.salePercent / 100)
    )
  }
  productAdd = (dataObj) => {
    this.cleanses.push(
      this.cleanseRef.find((cleanse) => cleanse.ID === dataObj.target.ID)
    )
  }
  productRemove = (dataObj) => {
    this.cleanses = this.cleanses.filter(
      (cleanse) => cleanse.ID !== dataObj.target.ID
    )
  }
  inputSubmit = (dataObj) => {}
  firestorePush = (dataObj) => {}
}

export { Cleanse, Cart }

// connect to UI
// manage complex elements / template
// cPay post
// submission refinement
// firestore
