const request = require('request')
const queryString = require('query-string')

const reply_markup = {
    resize_keyboard: true,
    one_time_keyboard: true,
    keyboard: [['yes'], ['no']],
}

class TelegramAPIController {
    constructor(TOKEN) {
        this.token = TOKEN
        this.rootURL = `http://api.telegram.org/bot${this.token}`
    }

    getMe(cb) {
        request(`${this.rootURL}/getMe`, { json: true }, cb)
    }

    sendMessage({ chatId, text, options }, cb) {
        const data = {
            chatId,
            text: encodeURI(text),
            reply_markup,
        }

        const query = queryString.stringify(data)

        request(`${this.rootURL}/sendMessage?${query}`, { json: true }, cb)
    }

    getUpdates(cb) {
        request(`${this.rootURL}/getUpdates`, { json: true }, cb)
    }

    setWebHook(url) {
        request(`${this.rootURL}/setWebhook`, { json: true }, cb)
    }
}

module.exports = TelegramAPIController
