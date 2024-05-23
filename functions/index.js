const { logger } = require('firebase-functions')
const { onRequest, onCall } = require('firebase-functions/v2/https')
// const xss = require('xss')

exports.helloWorld = onRequest((request, response) => {
  logger.log(request.body)
  // let data = request.body

  // const sanitizeObject = (data) => {
  //   if (Array.isArray(data)) {
  //     return data.map((item) => sanitizeObject(item))
  //   }
  //   if (data && typeof data === 'object') {
  //     const sanitizedData = {}
  //     Object.keys(data).forEach((key) => {
  //       sanitizedData[key] = sanitizeObject(data[key])
  //     })
  //     return sanitizedData
  //   }
  //   return typeof data === 'string' ? xss(data) : data
  // }

  // const sanitizedData = sanitizeObject(data)

  // response.send({ sanitized: sanitizedData })
  response.send({ data: request.body })
})
