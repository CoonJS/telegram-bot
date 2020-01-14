const request = require('request')
const queryString = require('query-string')

class TelegramAPIController {
    constructor(TOKEN) {
        this.token = TOKEN
        this.tmApiURL = 'http://api.telegram.org/bot'
        this.rootURL = `${this.tmApiURL}${this.token}`
    }

    getMe({ token }, cb) {
        console.log(
            `${this.tmApiURL}/${token}/getMe`,
            '`${this.tmApiURL}/${token}/getMe`'
        )
        request(`${this.tmApiURL}/${token}/getMe`, { json: true }, cb)
    }

    sendMessage({ chat_id, text }, cb) {
        const data = {
            chat_id,
            text,
        }

        const query = queryString.stringify(data)

        request(`${this.rootURL}/sendMessage?${query}`, { json: true }, cb)
    }

    sendAudio({ chat_id, audio, title = '' }, cb) {
        const data = {
            chat_id,
            audio,
            title,
        }
        const query = queryString.stringify(data)

        request(`${this.rootURL}/sendAudio?${query}`, { json: true }, cb)
    }

    sendHTMLMessage({ chat_id, text }, cb) {
        const data = {
            chat_id,
            text,
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: 'Кнопка 1', callback_data: '1' }],
                    [{ text: 'Кнопка 2', callback_data: 'data 2' }],
                    [{ text: 'Кнопка 3', callback_data: 'text 3' }],
                ],
            }),
        }

        const query = queryString.stringify(data)

        this.sendChatAction({ chat_id }, () => {
            setTimeout(() => {
                request(
                    `${this.rootURL}/sendMessage?${query}`,
                    { json: true },
                    cb
                )
            }, 1500)
        })
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

    sendChatAction({ chat_id, action = 'typing' }, cb) {
        request(
            `${this.rootURL}/sendChatAction?chat_id=${chat_id}&action=${action}`,
            {
                json: true,
            },
            cb
        )
    }
}

module.exports = TelegramAPIController
