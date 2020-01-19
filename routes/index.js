const path = require('path')

module.exports = function(app, tmApi) {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../client', 'index.html'))
    })

    app.get('/getMe', (req, res) => {
        tmApi.getMe({ token: req.query.token }, (tReq, tRes) => {
            const hasResponse = tRes !== undefined
            const tmResponse = hasResponse ? tRes.body : { ok: false }
            const success = tmResponse.ok === true

            if (hasResponse && !success && tmResponse.error_code === 404) {
                res.status(401).json({
                    message: 'Bot not found',
                    error: 401,
                    success: false,
                })
                return
            }

            if (hasResponse && success) {
                res.status(200).json(tRes.body)
                return
            }

            res.status(403).json({
                message: 'Connection problem',
                error: 403,
                success: false,
            })
        })
    })

    app.get('/getUserProfilePhoto', (req, res) => {
        const { token, user_id } = req.query
        tmApi.getUserProfilePhoto({ token, user_id }, (tReq, tRes) => {
            const hasResponse = tRes !== undefined
            if (hasResponse) {
                const data =
                    'data:' +
                    tRes.headers['content-type'] +
                    ';base64,' +
                    new Buffer.from(tRes.body).toString('base64')

                res.status(200).json({ file: data })
                return
            }

            res.status(403).json({
                message: 'Connection problem',
                error: 403,
                success: false,
            })
        })
    })

    app.get('/getBotInfo', (req, res) => {
        const { token, user_id } = req.query
        tmApi.getChat({ token, user_id }, (tReq, tRes) => {
            const hasResponse = tRes !== undefined
            if (hasResponse) {
                res.status(200).json(tRes.body)
                return
            }

            res.status(403).json({
                message: 'Connection problem',
                error: 403,
                success: false,
            })
        })
    })
}
