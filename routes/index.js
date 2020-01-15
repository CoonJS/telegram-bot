const path = require('path')

module.exports = function(app, tmApi) {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../client', 'index.html'))
    })

    app.get('/getMe', (req, res) => {
        tmApi.getMe({ token: req.query.token }, (tReq, tRes) => {
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

    app.get('/getUserProfilePhoto', (req, res) => {
        const { token, user_id } = req.query
        tmApi.getUserProfilePhoto({ token, user_id }, (tReq, tRes) => {
            const hasResponse = tRes !== undefined
            if (hasResponse) {
                console.log(tRes.body)
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
