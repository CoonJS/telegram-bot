const request = require('request')
const queryString = require('query-string')

class TelegramAPIController {
    constructor(TOKEN, app) {
        this.token = TOKEN
        this.tmApiURL = 'http://api.telegram.org/bot'
        this.rootURL = `${this.tmApiURL}${this.token}`

        const env = app.get('env')
        this.PROD_MODE = env === 'production'
        this.DEV_MODE = env === 'development'
    }

    getMe({ token }, cb) {
        request(`${this.tmApiURL}${token}/getMe`, { json: true }, cb)
    }

    getChat({ token, user_id }, cb) {
        const data = {
            chat_id: '-1001035909203',
        }

        const query = queryString.stringify(data)
        request(
            `${this.tmApiURL}${token}/getChatMembersCount?${query}`,
            { json: true },
            cb
        )
    }

    getUserProfilePhoto({ token, user_id, limit = 1, offset = 0 }, cb) {
        const data = {
            user_id,
            limit,
            offset,
        }

        const query = queryString.stringify(data)
        request(
            `${this.tmApiURL}${token}/getUserProfilePhotos?${query}`,
            { json: true },
            (tReq, tRes) => {
                const data = tRes.body
                const hasResponse = data !== undefined
                if (hasResponse) {
                    const { file_id } = data.result.photos[0][0]
                    this.getFileByFileId({ token, file_id }, (fReq, fRes) => {
                        request(
                            `https://api.telegram.org/file/bot${token}/${fRes.body.result.file_path}`,
                            { encoding: null },
                            cb
                        )
                    })
                }
            }
        )
    }

    getFileByFileId({ token, file_id }, cb) {
        const data = {
            file_id,
        }

        const query = queryString.stringify(data)
        request(`${this.tmApiURL}${token}/getFile?${query}`, { json: true }, cb)
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

    setWebHook({ token }, cb) {
        const url = this.DEV_MODE
            ? 'https://568b2ca7.ngrok.io:443'
            : 'https://telegram-bot.oxem.ru/'
        request(
            `${this.tmApiURL}${token}/setWebhook?url=${url}/${this.token}/`,
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
