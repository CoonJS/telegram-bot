const token = require('../token')

module.exports = function(app, db, tmAPI) {
    const usersCollection = db.collection('users')

    app.post(`/${token}/`, (req, res) => {
        const message = req.body.message

        console.log(message, 'message')
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
            count: 0,
        }
        console.log(userObject, 'userObject')

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
