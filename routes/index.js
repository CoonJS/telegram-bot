module.exports = function(app, db) {
    app.get('/', (req, res) => {
        res.status(200).send({})
    })
}
