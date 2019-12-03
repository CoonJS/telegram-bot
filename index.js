const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const token = require('./token')
const dbConfig = require('./db_config')

const app = express()
const env = app.get('env')
const PROD_MODE = env === 'production'
const DEV_MODE = env === 'development'

console.log(`APP RUNNING IN ${env.toUpperCase()} MODE`)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
    express.static(path.resolve(__dirname, './encrypt'), {
        dotfiles: 'allow',
    })
)

// const options = PROD_MODE
//     ? {
//           key: fs.readFileSync(
//               '/etc/letsencrypt/live/telegram-bot.oxem.ru/privkey.pem',
//               'utf8'
//           ),
//           cert: fs.readFileSync(
//               '/etc/letsencrypt/live/telegram-bot.oxem.ru/fullchain.pem',
//               'utf8'
//           ),
//       }
//     : {}

MongoClient.connect(dbConfig.FULL_CONFIG_URL, (err, client) => {
    if (err) return console.log(err)

    const db = client.db('chat')

    const TelegramApiController = require('./controllers/TelegramAPI')
    const tmAPI = new TelegramApiController(token)

    if (PROD_MODE) {
        console.log('SET PRODUCTION WEBHOOK')
        tmAPI.setWebHook('https://telegram-bot.oxem.ru:443', (req, res) => {
            console.log(res.body)
            console.log('\n')
        })
        tmAPI.getWebHookInfo((req, res) => {
            console.log(res.body)
            console.log('\n')
        })
    }

    if (DEV_MODE) {
        console.log('SET DEV WEBHOOK')
        tmAPI.setWebHook('https://dc2f0e39.ngrok.io:443', (req, res) => {
            console.log(res.body)
            console.log('\n')
        })
        tmAPI.getWebHookInfo((req, res) => {
            console.log(res.body)
            console.log('\n')
        })
    }

    const chatRouter = require('./routes/bot')(app, db, token, tmAPI)
    const indexRouter = require('./routes/index')(app, db, tmAPI)

    http.createServer(app).listen(80)

    https.createServer(options, app).listen(443)
})
