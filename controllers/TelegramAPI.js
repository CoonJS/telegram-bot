const request = require('request')
const queryString = require('query-string')

class TelegramAPIController {
    constructor(TOKEN) {
        this.token = TOKEN
        this.rootURL = `http://api.telegram.org/bot${this.token}`
    }

    getMe(cb) {
        request(`${this.rootURL}/getMe`, { json: true }, cb)
    }

    sendMessage({ chat_id, text, options }, cb) {
        const data = {
            chat_id,
            text,
        }

        const query = queryString.stringify(data)

        request(`${this.rootURL}/sendMessage?${query}`, { json: true }, cb)
    }

    getUpdates(cb) {
        request(`${this.rootURL}/getUpdates`, { json: true }, cb)
    }

    setWebHook(url, cb) {
        console.log(
            `${this.rootURL}/setWebhook?allowed_updates=message&url=${url}/${this.token}/`
        )
        request(
            `${this.rootURL}/setWebhook?url=${url}/${this.token}/`,
            {
                json: true,
            },
            cb
        )
    }

    getWebHookInfo(cb) {
        request(
            `${this.rootURL}/getWebhookInfo`,
            {
                json: true,
            },
            cb
        )
    }

    getLocationRequest({}, cb) {
        const query = queryString.stringify({
            parse_mode: 'Markdown',
            reply_markup: JSON.stringify({
                one_time_keyboard: true,
                keyboard: [
                    [
                        {
                            text: 'My phone number',
                            request_contact: true,
                        },
                    ],
                    ['Cancel'],
                ],
            }),
        })

        request(
            `${this.rootURL}/sendMessage?${query}`,
            {
                json: true,
            },
            cb
        )
    }
}

module.exports = TelegramAPIController
