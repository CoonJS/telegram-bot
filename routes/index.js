const path = require('path')

module.exports = function(app, tmApi) {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../client', 'index.html'))
    })

    app.get('/getMe/:token', (req, res) => {
        console.log(req.query, 'query')
        tmApi.getMe((tReq, tRes) => {
            res.setHeader('Access-Control-Allow-Origin', '*')
            res.status(200).json(tRes.body)
        })
    })
}
