const fs = require('fs')
const path = require('path')
const http = require('http')
const https = require('https')
const express = require('express')
const bodyParser = require('body-parser')

const token = require('./token')

const app = express()

const env = app.get('env')
const PROD_MODE = env === 'production'
const DEV_MODE = env === 'development'

console.log(`APP RUNNING IN ${env.toUpperCase()} MODE`)

app.use(express.static('client'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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

const TelegramApiController = require('./controllers/TelegramAPI')
const tmAPI = new TelegramApiController(token, app)

// if (PROD_MODE) {
//     console.log('SET PRODUCTION WEBHOOK')
//     tmAPI.setWebHook('https://telegram-bot.oxem.ru:443', (req, res) => {
//         console.log(res.body)
//         console.log('\n')
//     })
//     tmAPI.getWebHookInfo((req, res) => {
//         console.log(res.body)
//         console.log('\n')
//     })
// }
//
// if (DEV_MODE) {
//     console.log('SET DEV WEBHOOK')
//     tmAPI.setWebHook('https://568b2ca7.ngrok.io:443', (req, res) => {
//         console.log(res.body)
//         console.log('\n')
//     })
//     tmAPI.getWebHookInfo((req, res) => {
//         console.log(res.body)
//         console.log('\n')
//     })
// }

const httpServer = http.createServer(app).listen(80)

const httpsServer = https.createServer(options, app).listen(443)

const ioServer = require('socket.io')

const io = new ioServer()

io.attach(httpServer)
io.attach(httpsServer)

io.on('connection', socket => {
    console.log('a user connected')
    socket.on('disconnect', function() {
        console.log('user disconnected')
    })

    socket.on('test', function(msg) {
        console.log('message: ' + msg.a)
    })
})

require('./routes/bot')(app, token, tmAPI, io)
require('./routes/index')(app, tmAPI)
