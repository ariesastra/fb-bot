const routes = require('express').Router()

routes.get('/', (req, res, next) => {
    res.status(200).json({
        status: 'server running'
    })
})

module.exports = routes