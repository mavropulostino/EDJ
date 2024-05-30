const xss = require('xss')
const crypto = require('crypto')
const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { params } = require('firebase-functions')
const path = require('path')

function sanitize(value) {
  if (typeof value === 'string') return xss(value)
  if (typeof value === 'number') return Number(xss(value.toString()))
  if (Array.isArray(value)) return value.map((val) => sanitize(val))
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [sanitize(key), sanitize(val)])
    )
  }
  if (
    typeof value !== 'number' &&
    typeof value !== 'string' &&
    !Array.isArray(value) &&
    (typeof value !== 'object' || value === null)
  )
    throw new Error('Unsupported data type')

  return value
}

function getTotal(data, productMap) {
  const total = data.products.reduce(
    (total, { name, amount }) => total + amount * Math.abs(productMap[name]),
    0
  )
  return total
  // const ref = doc(firestore, 'metadata', 'events')
  // const docSnap = await getDoc(ref)

  // if (!docSnap.exists()) {
  //   return total
  // }

  // const { 'amount-left': amountLeft = 0, percent = 0 } = docSnap.data()
  // return amountLeft > 0 ? total + (total * percent) / 100 : total
}

function genDetails1(data) {
  return data.products
    .map((product) => {
      if (product.amount > 0) return `${product.cyrName} x${product.amount}`
    })
    .filter(Boolean) // removes undefined values
    .join(', ')
}

function genDetails2() {
  return Math.random().toString(36).substring(2, 14)
}

function formatMap(details1, details2, total, cleanData) {
  return {
    // AmountToPay: total * 100,
    AmountToPay: 1 * 100,
    AmountCurrency: 'MKD',
    Details1: details1,
    Details2: details2, // Unique payment reference
    PayToMerchant: 1000002294,
    MerchantName: 'DJUSIFAJ DOO',
    PaymentOKURL: 'https://paymentsuccess-lwuscei57q-uc.a.run.app',
    PaymentFailURL: 'https://paymentfail-lwuscei57q-uc.a.run.app',
    Address: cleanData.form.Address,
    Telephone: cleanData.form.Phone,
    Email: cleanData.form.Email,
  }
}

function nullCheck(format) {
  for (const [key, value] of Object.entries(format)) {
    if (!value) throw new Error(`Field '${key}' is null or 0.`)
  }
}

function generateChecksumData(formData, checksumKey) {
  const orderedParams = [
    { name: 'AmountToPay', value: formData.AmountToPay },
    { name: 'PayToMerchant', value: formData.PayToMerchant },
    { name: 'MerchantName', value: formData.MerchantName },
    { name: 'AmountCurrency', value: formData.AmountCurrency },
    { name: 'Details1', value: formData.Details1 },
    { name: 'Details2', value: formData.Details2 },
    { name: 'PaymentOKURL', value: formData.PaymentOKURL },
    { name: 'PaymentFailURL', value: formData.PaymentFailURL },
    { name: 'Address', value: formData.Address },
    { name: 'Telephone', value: formData.Telephone },
    { name: 'Email', value: formData.Email },
  ]

  const header = `${orderedParams.length
    .toString()
    .padStart(2, '0')}${orderedParams
    .map((param) => param.name)
    .join(',')},${orderedParams
    .map((param) =>
      param.value
        ? param.value.toString().length.toString().padStart(3, '0')
        : ''
    )
    .join('')}`
  const inputString = `${header}${orderedParams
    .map((param) => param.value || '')
    .join('')}${checksumKey}`
  const checksum = crypto.createHash('md5').update(inputString).digest('hex')

  return { CheckSumHeader: header, CheckSum: checksum }
}

exports.preparePayment = onCall(
  { cors: 'https://eclatdejus.com' },
  (request) => {
    const key = 'TEST_PASS'
    const productMap = {
      Two_Day_Signature: 2000,
      Three_Day_Signature: 2850,
      Four_Day_Signature: 3600,
      //
      Two_Day_Immuno: 1900,
      Three_Day_Immuno: 2700,
      Four_Day_Immuno: 3400,
    }

    let cleanData = sanitize(request.data)
    let total = getTotal(cleanData, productMap)
    let details1 = genDetails1(cleanData)
    let details2 = genDetails2(cleanData)
    let format = formatMap(details1, details2, total, cleanData)

    nullCheck(format)
    let checksumData = generateChecksumData(format, key)
    format = { ...format, ...checksumData }

    return {
      format: format,
    }
  }
)

exports.paymentSuccess = onRequest({ cors: true }, (req, res) => {
  // let reqOBJ = {
  //   headers: req.headers,
  //   query: req.query,
  //   params: req.params,
  //   path: req.path,
  //   body: req.body,
  // }
  if (req.headers.origin !== 'https://www.cpay.com.mk') res.status(403).send()
  res.status(200).redirect('https://eclatdejus.com/?success').send()
})
exports.paymentFail = onRequest({ cors: true }, (req, res) => {
  if (req.headers.origin !== 'https://www.cpay.com.mk') res.status(403).send()
  res.status(200).redirect('https://eclatdejus.com/?fail').send()
})
