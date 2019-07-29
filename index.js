const fs = require('fs')
const token = require('./token')
const express = require('express')
const TelegramApiController = require('./controllers/TelegramAPI')

const chatId = '347227894'
const text = 'HELLO WORLD'

const tmAPI = new TelegramApiController(token)

const app = express()
const port = 80

app.get('/', (request, response) => {
    tmAPI.sendMessage({ chatId, text }, (err, res, body) => {
        response.send(body)
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
