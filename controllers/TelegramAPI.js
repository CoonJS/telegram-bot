const request = require('request')
const queryString = require('query-string')

class TelegramAPIController {
    constructor(TOKEN) {
        this.token = TOKEN
        this.tmApiURL = 'http://api.telegram.org/bot'
        this.rootURL = `${this.tmApiURL}${this.token}`
    }

    getMe({ token }, cb) {
        request(`${this.tmApiURL}${token}/getMe`, { json: true }, cb)
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
                        console.log(
                            `https://api.telegram.org/file/bot${token}/${fRes.body.result.file_path}`,
                            'FILE'
                        )

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

    setWebHook(url, cb) {
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
