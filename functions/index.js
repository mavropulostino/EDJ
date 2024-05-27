const { logger } = require('firebase-functions')
const xss = require('xss')
const crypto = require('crypto')
const { onCall } = require('firebase-functions/v2/https')

function sanitize(value) {
  if (typeof value === 'string') return xss(value)
  if (typeof value === 'number') return Number(xss(value.toString()))
  if (Array.isArray(value)) return value.map((val) => sanitize(val))
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, sanitize(val)])
    )
  }
  return value
}

function getTotal(data, productMap) {
  return data.products.reduce((total, product) => {
    const price = productMap[product.name]
    const totalPrice = product.amount * price
    return total + totalPrice
  }, 0)
}

function genDetails1(data) {
  return data.products
    .map((product) => {
      return `${product.name} ${product.amount}`
    })
    .join(', ')
}

function genDetails2(data) {
  return '1234567889'
}

function formatMap(details1, details2, total) {
  return {
    // AmountToPay: total * 100,
    AmountToPay: 10 * 100,
    AmountCurrency: 'MKD',
    Details1: details1,
    Details2: details2, // Unique payment reference
    PayToMerchant: 1000002294,
    MerchantName: 'DJUSIFAJ DOO',
    PaymentOKURL: 'http://merchantOKurl.com',
    PaymentFailURL: 'http://merchantFailurl.com',
  }
}

function nullCheck(format) {
  for (const [key, value] of Object.entries(format)) {
    if (value === null || value === 0)
      logger.log(`Field '${key}' is null or 0.`)
  }
}

function generateHeader(format) {
  const headerCount = format.length.toString().padStart(2, '0')
  const paramNames = format.map((param) => param.name).join(',')
  const lengthFields = format
    .map((param) =>
      param.value !== null && param.value !== 0
        ? param.value.toString().length.toString().padStart(3, '0')
        : ''
    )
    .join('')

  return `${headerCount}${paramNames},${lengthFields}`
}

function generateInputString(format, key) {
  const params = [
    { name: 'AmountToPay', value: format.AmountToPay },
    { name: 'AmountCurrency', value: format.AmountCurrency },
    { name: 'Details1', value: format.Details1 },
    { name: 'Details2', value: format.Details2 },
    { name: 'PayToMerchant', value: format.PayToMerchant },
    { name: 'MerchantName', value: format.MerchantName },
  ]

  const header = generateHeader(params)
  const values = params
    .map((param) =>
      param.value !== null && param.value !== 0 ? `${param.value}` : ''
    )
    .join('')

  return `${header}${values}${key}`
}

function generateChecksum(inputString, key) {
  const inputWithKey = inputString + key
  const md5Hash = crypto.createHash('md5').update(inputWithKey).digest('hex')
  return md5Hash
}

exports.preparePayment = onCall(
  { cors: 'https://eclatdejus.com/' },
  (request) => {
    const key = 'TEST_PASS'
    const productMap = {
      Product2: 20,
      Product1: 10,
    }

    let cleanData = sanitize(request.data)
    let total = getTotal(cleanData, productMap)
    let details1 = genDetails1(cleanData)
    let details2 = genDetails2(cleanData)
    let format = formatMap(details1, details2, total)

    nullCheck(format)
    let inputString = generateInputString(format, key)
    let header = generateInputString(format)
    let checkSum = generateChecksum(inputString, key)
    return {
      format: format,
      header: header,
      inputString: inputString,
      checkSum: checkSum,
    }
  }
)
