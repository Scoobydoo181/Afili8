import express from 'express'
import {MongoClient} from 'mongodb'

import {loginText, fetchDashboardData} from './serverUtils.js'

const url = process.env.mongoUrl;
const dbName = "afili8";
const client = new MongoClient(url, { useNewUrlParser: true });

const frontendRouter = express.Router()

frontendRouter.get("/", (req, res) => {
    res.render("home", {loginText: loginText(req.session)});
});

frontendRouter.get('/register', (req, res) => {
    res.render("register", { loginText: loginText(req.session) });
});

frontendRouter.get("/login", (req, res) => {
    if(req.session.email) {
        req.session.email = undefined;
        req.session.name = undefined;
        req.session.token = undefined;
        res.redirect("home");
    }
    let errorText = req.statusCode === 401 ? "Error! Failed to login in" : ""
    
    res.render("login", { loginText: loginText(req.session), errorText: errorText || "" });
});

frontendRouter.get("/documentation", (req, res) => {
    res.render("documentation", { loginText: loginText(req.session) });
});

frontendRouter.get("/dashboard", async (req, res) => {
    if(!req.session.name) {
        res.redirect("login");
        return
    }

    let [links, referralData, commissionData] = await fetchDashboardData(client, dbName, req.session.token)

    let today = new Date(Date.now())
    let model = {
        referralData: referralData, //array of referral income data
        commissionData: commissionData, //array of commissions paid data
        links: links,  //referral links pulled from DB
        daysInMonth: new Date(today.getFullYear(), today.getMonth(), 0).getDate(),
        name: req.session.name,       //account name
        loginText: loginText(req.session),    //conditionally render "Login" or "Logout" on navbar
        token: req.session.token,     //client secret token 
        url: "https://34.67.51.25:443/"     //current URL of server
    };
    res.render("dashboard", model);
});

export default frontendRouter