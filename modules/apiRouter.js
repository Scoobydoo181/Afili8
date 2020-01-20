import express from "express";
import { MongoClient } from "mongodb";

import {handleRequest} from "./serverUtils";

//MongoDB config
const url = "mongodb://localhost:27017";
const dbName = "afili8";
const client = new MongoClient(url, {useUnifiedTopology:true});

const apiRouter = express.Router()

apiRouter.post("/api/new-client", async (req, res, next) => {
    /*Create new client token*/
    try {
        await client.connect();
        const db = client.db(dbName);
        
        await db.collection("clients." + req.body.APIToken).insertOne({ clientName: req.body.clientName });
        
    } catch (error) {
        console.log("An error occurred at new-client", error);
        next(error)
    }

    res.sendStatus(200);
});

apiRouter.post("/api/create", (req, res, next) => {
  /*Create new afilliate link*/
    handleRequest(req, res, next, client, dbName, async (afiliateCode, clientAfiliates) => {
        await clientAfiliates.insertOne({affiliateCode: afiliateCode, numberUses: 0});
        return 200;
    });
});

apiRouter.post("/api/delete", (req, res, next) => {
  /*Delete afilliate link*/
    handleRequest(req, res, next, client, dbName, async (afiliateCode, clientAfiliates) => {
        await clientAfiliates.deleteOne({ affiliateCode: afiliateCode });
        return 200;
    });
});

apiRouter.post("/api/increment", (req, res, next) => {
  /*Used after successful payment to attribute a sale to an affiliate*/
    handleRequest(req, res, next, client, dbName, async (afiliateCode, clientAfiliates) => {
        const oldUses = (await clientAfiliates.findOne({ afiliateCode: afiliateCode })).numberUses;
        await clientAfiliates.updateOne({ afiliateCode: afiliateCode },{ $set: { numberUses: oldUses + 1 } });
        return 200;
    });
});

apiRouter.post("/api/verify", (req, res, next) => {
    /*Used by client to check if the link used matches an existing link*/
    handleRequest(req, res, next, client, dbName, async (afiliateCode, clientAfiliates) => {
        const query = await clientAfiliates.findOne({ afiliateCode: afiliateCode });
        return !!query;
    });
});

export default apiRouter