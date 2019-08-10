const _ = require('lodash')
const request = require('request')
const parseString = require('xml2js').parseString

const ChatMessage = require('../ChatMessage')

const COMMANDS = {
    START: '/start',
    HELP: '/help',
    SEND_ALL_ACTIVITY: '/allactivity',
    SEND_MY_ACTIVITY: '/myactivity',
}

const isCommandTriggered = (command, message) => {
    return message.text && message.text.indexOf(command) !== -1
}

module.exports = (app, db, token, tmAPI) => {
    const usersCollection = db.collection('users')

    app.post(`/${token}/`, async (req, res) => {
        const message = req.body.message

        console.log(req.body, 'req.body')

        const hasMessage = message !== undefined
        const hasLocation = hasMessage
            ? req.body.message.location !== undefined
            : false

        if (!hasMessage) {
            res.status(200).send({})
            return
        }

        if (hasLocation) {
            const { latitude, longitude } = req.body.message.location
            console.log(latitude, longitude, 'latitude, longitude')
            request(
                `http://api.worldweatheronline.com/premium/v1/weather.ashx?q=${latitude},${longitude}&key=5d5ddd730db04ec790e194934190508`,
                { json: true },
                (err, res) => {
                    parseString(res.body, (error, result) => {
                        const currentCondition =
                            result.data.current_condition[0]
                        const time = currentCondition.observation_time[0]
                        const temp = currentCondition.temp_C[0]
                        const windSpeed = currentCondition.windspeedKmph[0]

                        console.log(time, temp, 'time', 'temp')

                        tmAPI.sendMessage({
                            chat_id: message.chat.id,
                            text: `Time: ${time}\nTemperature: ${temp} ℃\nWind speed: ${windSpeed} kmph\n`,
                        })
                    })
                }
            )
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

        usersCollection.insertOne(userObject)

        if (
            isCommandTriggered(COMMANDS.START, message) ||
            isCommandTriggered(COMMANDS.HELP, message)
        ) {
            const { chat_id } = userObject

            tmAPI.sendMessage(
                {
                    chat_id,
                    text: ChatMessage.HELLO_MESSAGE,
                },
                () => {
                    tmAPI.sendMessage(
                        {
                            chat_id,
                            text: ChatMessage.FIRST_POSSIBILITY,
                        },
                        () => {
                            tmAPI.sendMessage(
                                {
                                    chat_id,
                                    text: ChatMessage.SECOND_POSSIBILITY,
                                },
                                () => {
                                    tmAPI.sendMessage(
                                        {
                                            chat_id,
                                            text: ChatMessage.THIRD_POSSIBILITY,
                                        },
                                        () => {
                                            tmAPI.sendMessage({
                                                chat_id,
                                                text:
                                                    ChatMessage.FOURTH_POSSIBILITY,
                                            })
                                        }
                                    )
                                }
                            )
                        }
                    )
                }
            )
        }

        if (isCommandTriggered(COMMANDS.SEND_MY_ACTIVITY, message)) {
            const { chat_id, user_id, first_name, last_name } = userObject
            usersCollection
                .find({ user_id, chat_id })
                .toArray((err, result) => {
                    tmAPI.sendMessage({
                        chat_id,
                        text: `Hi ${first_name} ${last_name} - you sent ${result.length} messages`,
                    })
                })
        }

        if (isCommandTriggered(COMMANDS.SEND_ALL_ACTIVITY, message)) {
            const { chat_id } = userObject
            usersCollection.find({ chat_id }).toArray((err, items) => {
                const usersGroupByUserId = _.groupBy(items, o => o.user_id)

                let messageResponse = 'Users Activity Statistics: \n\n'

                Object.keys(usersGroupByUserId).forEach(id => {
                    const percent =
                        (usersGroupByUserId[id].length / items.length) * 100
                    const userFullName =
                        usersGroupByUserId[id][0].first_name +
                        ' ' +
                        usersGroupByUserId[id][0].last_name
                    const activityPercent = percent.toFixed(2) + '%'

                    messageResponse +=
                        userFullName + ': ' + activityPercent + '\n'
                })

                tmAPI.sendMessage({ chat_id, text: messageResponse })
            })
        }

        res.status(200).send({})
    })

    app.get(`/${token}/`, (req, res) => {
        res.status(200).send({})
    })
}
