const path = require('path')

module.exports = function(app, tmApi) {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../client', 'index.html'))
    })

    app.get('/getMe', (req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*')

        tmApi.getMe({ token: req.query.token }, (tReq, tRes) => {
            const hasResponse = tRes !== undefined
            if (hasResponse) {
                res.status(200).json(tRes.body)
            }

            res.status(403).json({
                title: 'Access denied',
                error: 403,
                success: false,
            })
        })
    })
}
