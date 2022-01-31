if (process.env.NODE_ENV !== 'production')
    require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const route = require('./routes')
app.use(route)

module.exports = app