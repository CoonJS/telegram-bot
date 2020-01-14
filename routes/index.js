const path = require('path')

module.exports = function(app, tmApi) {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../client', 'index.html'))
    })

    app.get('/getMe', (req, res) => {
        tmApi.getMe({ token: req.query.token }, (tReq, tRes) => {
            console.log(tReq, 'tReq')
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(200).json(tRes.body)
        })
    })
}
