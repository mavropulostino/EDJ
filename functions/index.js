const { onRequest } = require('firebase-functions/v2/https')
const cors = require('cors')({ origin: 'http://localhost:5173' }) // Allow only this origin

exports.myFunction = onRequest((req, res) => {
  cors(req, res, () => {
    res.send('MJAU')
  })
})
