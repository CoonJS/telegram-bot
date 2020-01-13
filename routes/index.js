const path = require('path')

module.exports = function(app) {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('../client', 'index.html'))
    })

    app.get('/getMe', (req, res) => {
        // console.log('getMEEEEEE == = ==  == = = = = ==')
        // tmAPI.getMe((tReq, tRres) => {
        //     console.log(tReq, 'REQ=======')
        //     console.log(tRres, 'RES=======')
        // })
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.status(200).json({ a: 2 })
    })
}
