import express from "express";
import { MongoClient } from "mongodb";
import axios from 'axios'

import {handleRequest, getDB, hash} from "./serverUtils.js";

//MongoDB config
const url = process.env.mongoUrl;
const dbName = "afili8";
const client = new MongoClient(url, {useUnifiedTopology:true});

const apiRouter = express.Router()

apiRouter.post('/api/login', async (req, res) => {
    try {
        const db = await getDB(client, dbName)

        let data = req.body;
        data.password = hash(data.password).toString();
        let account = await db.collection('clients').findOne(data)

        req.session.email = account.email
        req.session.name = account.firstName
        req.session.token = account._id.toString()
    } catch (error) {
        console.log("An error occurred at login",error)
    }
    res.redirect('/dashboard')
})

apiRouter.post('/api/register', async (req, res) => {
    try {
        const db = await getDB(client, dbName)

        let data = req.body
        data.password = hash(data.password).toString()

        db.collection('clients').insertOne(data)

    } catch (error) {
        console.log("An error occurred at register",error)
    }
    res.redirect('/dashboard')
})

apiRouter.post("/api/create", (req, res) => {
  /*Create new affilliate link*/
    handleRequest(req, res, client, dbName, async (affiliateCode, clientAffiliates) => {
        await clientAffiliates.insertOne({affiliateCode: affiliateCode, numberUses: 0});
        return 200;
    });
});

apiRouter.post("/api/delete", (req, res) => {
  /*Delete affilliate link*/
    handleRequest(req, res, client, dbName, async (affiliateCode, clientAffiliates) => {
        await clientAffiliates.deleteOne({ affiliateCode: affiliateCode });
        return 200;
    });
});

apiRouter.post("/api/verify", (req, res) => {
    /*Used by client to check if the link used matches an existing link*/
    handleRequest(req, res, client, dbName, async (affiliateCode, clientAffiliates) => {
        const query = await clientAffiliates.findOne({ affiliateCode: affiliateCode });
        return !!query;
    });
});

apiRouter.post("/api/increment", async (req, res) => {
  /*Used after successful payment to attribute a sale to an affiliate*/
    handleRequest(req, res, client, dbName, async (affiliateCode, clientAffiliates) => {
        const oldUses = (await clientAffiliates.findOne({ affiliateCode: affiliateCode })).numberUses;
        await clientAffiliates.updateOne({ affiliateCode: affiliateCode },{ $set: { numberUses: oldUses + 1 } });
        clientAffiliates
        return 200;
    });

    try {
        const db = await getDB(client, dbName)

        let record = {
            date: new Date(Date.now()),
            affiliateCode: req.body.affiliateCode,
            price: req.body.price, 
            commission: req.body.comission
        }

        await db.collection('clients.' + req.body.clientToken + ".transactions").insertOne(record)

    } catch (error) {
        console.log("An error occurred at increment", error)
    }
    res.sendStatus(200)
});


export default apiRouter