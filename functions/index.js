const { onRequest, onCall } = require('firebase-functions/v2/https')

exports.helloWorld = onRequest((request, response) => {
  response.send({
    request: `this is what youve requested ${request.params[0]}`,
  })
})
