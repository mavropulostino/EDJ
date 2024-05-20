// UTILS
function generateID() {
  return Math.random().toString(36).substring(2, 8)
}
function updateVal(context) {
  const updateMap = [
    ...context.cleanseRef.map(({ ID, days }) => [
      // add mappings here
      (`.${ID} .days`, days),
    ]),
  ]
  updateMap.forEach(([selector, value]) => {
    const element = document.querySelector(selector)
    if (element) element.textContent = value
    if (!element) console.warn(`${selector} not found`)
  })
}
function updateTemplate(selector, template) {}

function sessionSet(data) {
  sessionStorage.setItem('data', JSON.stringify(data)) || null
}
function sessionGet() {
  return JSON.parse(sessionStorage.getItem('data'))?.map(
    ({ name, price, amount }) => new Product(name, price, amount) || null
  )
}

class Cleanse {
  constructor(name, priceMap) {
    this.name = name
    this.days = 2
    this.priceMap = priceMap
    this._ID ||= generateID()
  }
  get ID() {
    return this._ID
  }
  get total() {
    return this.priceMap[this.days]
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
  productDaysIncrement = (dataObj) => {
    const cleanse = this.cleanseRef.find((cleanse) => cleanse.ID === dataObj.ID)
    cleanse.days = Math.min(++cleanse.days, 5)
    updateVal(this)
  }
  productDaysDecrement = (dataObj) => {
    const cleanse = this.cleanseRef.find((cleanse) => cleanse.ID === dataObj.ID)
    cleanse.days = Math.max(--cleanse.days, 2)
    updateVal(this)
  }
  productAdd = (dataObj) => {
    this.cleanses.push(
      this.cleanseRef.find((cleanse) => cleanse.ID === dataObj.target.ID)
      // update the ID of the cleanse
    )
    updateVal(this)
  }
  productRemove = (dataObj) => {
    this.cleanses = this.cleanses.filter(
      (cleanse) => cleanse.ID !== dataObj.target.ID
    )
    updateVal(this)
  }
  inputSubmit = (dataObj) => {}
  firestorePush = (dataObj) => {}
}

export { Cleanse, Cart }

// connect to UI
// manage complex elements / template
// cPay post
// submission refinement  
