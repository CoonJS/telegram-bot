const request = require('request')
const parseString = require('xml2js').parseString

module.exports = function(app, db, token, tmAPI) {
    const usersCollection = db.collection('users')

    app.post(`/${token}/`, (req, res) => {
        const message = req.body.message

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
            count: 0,
        }

        usersCollection.findOne(
            { user_id: userObject.user_id },
            (err, user) => {
                if (err) {
                } else {
                    const hasItem = user !== null

                    if (!hasItem) {
                        usersCollection.insertOne(userObject)
                    }

                    if (hasItem) {
                        usersCollection.updateOne(
                            { user_id: user.user_id },
                            { $set: { count: user.count + 1 } }
                        )
                    }

                    if (message.text === '/myactivity@MyChatAnalyzerBot') {
                        const { chat_id } = userObject
                        tmAPI.sendMessage({
                            chat_id,
                            text: `Hi ${user.first_name} ${user.last_name} - you sent ${user.count} messages`,
                        })

                        return
                    }

                    if (message.text === '/allactivity@MyChatAnalyzerBot') {
                        const test = usersCollection.find()
                        console.log(test, 'test')
                    }

                    if (message.text === '/weather@MyChatAnalyzerBot') {
                        console.log(req.body, 'req.body')
                    }
                }
            }
        )

        res.status(200).send({})
    })

    app.get(`/${token}/`, (req, res) => {
        res.status(200).send({})
    })
}
