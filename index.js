const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const dbConfig = require('./db_config')
const MongoClient = require('mongodb').MongoClient

const app = express()
const env = app.get('env')
const PROD_MODE = env === 'production'
const DEV_MODE = env === 'development'

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
    express.static(path.resolve(__dirname, './encrypt'), {
        dotfiles: 'allow',
    })
)

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

MongoClient.connect(dbConfig.FULL_CONFIG_URL, (err, client) => {
    if (err) return console.log(err)

    console.log(`APP RUNNING IN ${env.toUpperCase()} MODE`)

    const token = require('./token')
    const TelegramApiController = require('./controllers/TelegramAPI')
    const tmAPI = new TelegramApiController(token)

    if (DEV_MODE) {
        tmAPI.setWebHook('https://f3356fd7.ngrok.io:443')
        tmAPI.getWebHookInfo((req, res) => {
            console.log(res.body)
            console.log('\n')
        })
    }

    if (PROD_MODE) {
        tmAPI.setWebHook('https://telegram-bot.oxem.ru:443')
        tmAPI.getWebHookInfo((req, res) => {
            console.log(res.body)
            console.log('\n')
        })
    }

    const db = client.db('chat')
    const chatRouter = require('./routes/bot')(app, db, tmAPI)
    const indexRouter = require('./routes/index')(app, db, tmAPI)

    http.createServer(app).listen(80)

    https.createServer(options, app).listen(443)
})
