const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const Store = require('data-store')
const bodyParser = require('body-parser')
const differenceBy = require('lodash/differenceBy')

const token = require('./token')
const TelegramApiController = require('./controllers/TelegramAPI')

const store = new Store({ name: 'Updates', path: 'store.json' })
store.set('lastUpdates', [])

const tmAPI = new TelegramApiController(token)

const app = express()

app.use(bodyParser.json({ type: 'application/*+json' }))
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))
app.use(bodyParser.text({ type: 'text/html' }))

app.use(
    express.static(path.resolve(__dirname, './encrypt'), {
        dotfiles: 'allow',
    })
)

app.get('/', (req, res) => {
    res.writeHead(200)
    console.log(req.body)
    console.log('\n')
    res.end('hello world')
})

const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'domain.key'), 'utf8'),
    cert: fs.readFileSync(path.resolve(__dirname, 'domain.crt'), 'utf8'),
}

http.createServer(app).listen(80)

https.createServer(options, app).listen(443)
