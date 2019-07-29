const request = require('request')

class TelegramAPIController {
    constructor(TOKEN) {
        this.token = TOKEN
        this.rootURL = `http://api.telegram.org/bot${this.token}`
    }

    getMe(cb) {
        request(`${this.rootURL}/getMe`, { json: true }, cb)
    }

    sendMessage({ chatId, text }, cb) {
        request(
            `${this.rootURL}/sendMessage?chat_id=-${chatId}&text=${text}`,
            { json: true },
            cb
        )
    }
}

module.exports = TelegramAPIController
