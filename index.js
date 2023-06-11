const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const data = require('./data.json')
const cors = require('cors');
app.use(cors())
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/data', (req, res) => {
  res.send(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})