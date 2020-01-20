import express from 'express'
import path from 'path'

import apiRouter from './modules/apiRouter'
import frontendRouter from './modules/frontendRouter'

//Express config
const app = express()
app.set('view engine', 'vash')
app.use(express.json())
app.use(express.urlencoded())

//Dashboard site
app.use(frontendRouter)

app.use(express.static('public'))
app.use(express.static(path.join('node_modules', 'chart.js', 'dist')))

//API Endpoints
app.use(apiRouter)

//Start server
const port = 3001
app.listen(port, () => {
    console.log(`Node server running on port ${port}`)
})