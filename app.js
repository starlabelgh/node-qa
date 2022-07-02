const { urlencoded } = require("express")
const express = require("express")
const { listenerCount } = require("mongod")
const router = require("./router")
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)

module.exports = app;