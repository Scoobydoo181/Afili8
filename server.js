import express from 'express'
import path from 'path'

const app = express()
app.set('view engine', 'vash')

//Dashboard site
app.use(express.static('public'))
app.use(express.static('node_modules/chart.js/dist'))

app.get('/', (req, res) => {
    const data = {message: 'Test Test Test'}
    res.render('home', data)
})

app.get('/sign-up', (req, res) => {
    
})

app.get('/sign-in', (req, res) => {
    
})

app.get('/dashboard', (req, res) => {
    const data = {data: [65, 21, 38, 75, 42, 51]}
    res.render('dashboard', data)
})

//API Endpoints
app.post("/api/create", (req, res) => {
    //Create new afilliate link
    const data = {text: req.body.message}
    console.log(data)
});

app.post("/api/confirm", (req, res) => {
    //Used after successful payment to attribute a sale to an affiliate

});

app.get("/api/redirect", (req, res) => {
    //Used by affiliate link itself to  redirect to the company page with data identifying which link was used

});

app.listen(3000, () => {
    console.log("Node server is running on port 3000")
})