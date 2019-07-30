const fs = require('fs')
const token = require('./token')
const express = require('express')
const Store = require('data-store')
const differenceBy = require('lodash/differenceBy')

const TelegramApiController = require('./controllers/TelegramAPI')
const store = new Store({ name: 'Updates', path: 'store.json' })
store.set('lastUpdates', [])

const tmAPI = new TelegramApiController(token)

const app = express()
const port = 80

tmAPI.getUpdates((err, res, body) => {
    const items = body.result.filter(item => item.message !== undefined)
    store.set('lastUpdates', items)
})

setInterval(() => {
    tmAPI.getUpdates((err, res, body) => {
        const items = body.result.filter(item => item.message !== undefined)

        const lastUpdates = store.get('lastUpdates', [])

        const preparedLastUpdates = lastUpdates.filter(
            item => item.message !== undefined
        )

        const diff = differenceBy(items, preparedLastUpdates, 'message.date')

        diff.forEach(item => {
            tmAPI.sendMessage({
                chatId: item.message.chat.id,
                text: item.message.text,
            })
        })

        store.set('lastUpdates', items)
    })
}, 1000)

app.get('/', (request, response) => {
    response.send('Telegram Bot')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
