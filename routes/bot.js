const ChatMessage = require('../ChatMessage')
const emojiMap = require('../emojiMap')
const COMMANDS = {
    START: '/start',
    HELP: '/help',
    SEND_STICKER: '/sendsticker',
}

const isCommandTriggered = (command, message) => {
    return message.text && message.text.indexOf(command) !== -1
}

module.exports = (app, token, tmAPI) => {
    app.post(`/${token}/`, async (req, res) => {
        const message = req.body.message

        console.log(req.body, 'req.body')

        const hasMessage = message !== undefined

        if (!hasMessage) {
            res.status(200).send({})
            return
        }

        const userObject = {
            user_id: message.from.id,
            chat_id: message.chat.id,
            is_bot: message.from.is_bot,
            first_name: message.from.first_name,
            last_name: message.from.last_name,
            username: message.from.username,
            date: message.date,
        }

        if (
            isCommandTriggered(COMMANDS.START, message) ||
            isCommandTriggered(COMMANDS.HELP, message)
        ) {
            const { chat_id } = userObject

            tmAPI.sendMessage({
                chat_id,
                text: ChatMessage.HELLO_MESSAGE,
            })
        }

        if (isCommandTriggered(COMMANDS.SEND_STICKER, message)) {
            const { chat_id } = userObject

            tmAPI.sendAudio({
                chat_id,
                audio: 'http://www.largesound.com/ashborytour/sound/brobob.mp3',
            })
        }

        if (message.text.trim() !== '') {
            const { chat_id } = userObject

            const soundData = emojiMap[message.text]

            if (soundData) {
                tmAPI.sendAudio({
                    chat_id,
                    audio: soundData.sound,
                    title: message.text,
                })
            }
        }

        res.status(200).send({})
    })

    app.get(`/${token}/`, (req, res) => {
        res.status(200).send({})
    })
}
