const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')

const token = require('./token')
const TelegramApiController = require('./controllers/TelegramAPI')

const tmAPI = new TelegramApiController(token)

const app = express()

const env = app.get('env')
const PROD_MODE = env === 'production'
const DEV_MODE = env === 'development'

console.log(env, 'NODE_ENV')

if (DEV_MODE) {
    tmAPI.setWebHook('https://ca3dc1ab.ngrok.io:443')
    tmAPI.getWebHookInfo((req, res) => {
        console.log(res.body)
    })
}

if (PROD_MODE) {
    tmAPI.setWebHook('http://telegram-bot.oxem.ru:443')
    tmAPI.getWebHookInfo((req, res) => {
        console.log(res.body)
    })
}

app.use(bodyParser.json())

app.use(
    express.static(path.resolve(__dirname, './encrypt'), {
        dotfiles: 'allow',
    })
)

app.post(`/${token}/`, (req, res) => {
    const chat_id = req.body.message.chat.id
    const text = req.body.message.text
    tmAPI.sendMessage({ chat_id, text })

    res.status(200).send({})
})

app.get(`/${token}/`, (req, res) => {
    console.log(req.body.message, 'get')

    res.status(200).send({})
})

app.get('/', (req, res) => {
    res.status(200).send({})
})

const options = PROD_MODE
    ? {
          key: fs.readFileSync(
              '/etc/letsencrypt/live/telegram-bot.oxem.ru/privkey.pem',
              'utf8'
          ),
          cert: fs.readFileSync(
              '/etc/letsencrypt/live/telegram-bot.oxem.ru/fullchain.pem',
              'utf8'
          ),
      }
    : {}

http.createServer(app).listen(80)

https.createServer(options, app).listen(443)
