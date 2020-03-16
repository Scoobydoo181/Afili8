import express from 'express'
import path from 'path'
import session from "express-session";

import apiRouter from './backend/apiRouter.js'
import frontendRouter from './backend/frontendRouter.js'

//Express config
const app = express()
app.set('view engine', 'vash')
app.use(express.json())
app.use(express.urlencoded())
app.use(session({secret: process.env.secret}))

//Webpage
app.use(frontendRouter)
app.use(express.static('public'))
app.use(express.static(path.join('node_modules', 'chart.js', 'dist')))

//API Endpoints
app.use(apiRouter)


//Start server
app.listen(process.env.port, () => {
    console.log(`Node server running on port ${process.env.port}`)
})