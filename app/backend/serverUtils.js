import {pbkdf2Sync} from 'crypto'
import {ObjectId} from 'mongodb'

export function hash(password) {
    return pbkdf2Sync(password, 'afili8', 5, 64, 'sha512')
}

export function loginText(session) {
    return session.email ? 'Logout' : 'Login'
}

function getPipeline(type) {
    /**
     * Returns the MongoDB aggregate config for the specified type
     * @param type a string equal to either "commission" or "price"
     */

    let today = new Date(Date.now());
    let monthStart = new Date(today.getFullYear(), today.getMonth());

    let pipeline = [
      //restrict to this month only
      {
        $match: {
          date: { $gte: monthStart }
        }
      },
      //transform to day of month
      {
        $project: {
            date: { $dayOfMonth: {date: "$date"} }
        }
      }
    ];

    let commissionConfig = {
      // group and sum by day
        $group: {
            _id: "$date",
            commission: { $sum: "$commission" }
        }
    };

    let priceConfig = {
      // group and sum by day
        $group: {
            _id: "$date",
            price: { $sum: "$price" }
        }
    };

    pipeline.push(type === "commission" ? commissionConfig : priceConfig)
    pipeline.push({$sort: {date: 1}})
    return pipeline
}

export async function fetchDashboardData(client, dbName, token) {
    /**
     * @param client a MongoClient object
     * @param dbName a string containing the name of the db
     * @param token the secret token for the account
     * @returns array containing the referral link data, referral income by day data, and commissions paid by day data
     */
    const db = await getDB(client, dbName);

    //Get referrals links in descending order by number of uses
    let linksPromise = (async () => {
        try {
            let links = await db.collection("clients." + token).aggregate({ $sort: { numUses: -1 } });
            links = await links.toArray();
            return links;
        } catch (error) {console.log(error);}
    })();

    let transactions = db.collection("clients." + token + ".transactions");

    //Get data points of referral sales vs date
    let referralPromise = (async () => {
        try {
            let prices = await transactions.aggregate(getPipeline("price"));
            prices = await prices.toArray();
            return prices.map(doc => doc.price);
        } catch (error) {console.log(error);}
    })();

    //Get data points of commissions paid vs date
    let commissionPromise = 
    (async () => {
        try {
            let prices = await transactions.aggregate(getPipeline("commission"));
            prices = await prices.toArray();
            return prices.map(doc => doc.price);
        } catch (error) {console.log(error);}
    })();
    //Let them run concurrently
    return await Promise.all([linksPromise, referralPromise, commissionPromise]);
} 

export async function verifyToken(token, db) {
    /**
     * Queries database to check if a client with the specified token exists
     *  @param token the client API token to check
     * @param db the MongoDB database instance
     */
    
    let test = await db.collection('clients').find({_id: ObjectId(token)});
    return !!test;
}

export async function handleRequest(req, res, client, dbName, callback) {
    /**
     * Connects to MongoDB instance and verifies client token before passing args to a callback
     * @param req express request object
     * @param res express response object
     * @param callback callback function that takes the following paramaters
     * @param affiliateCode affiliate link passed in the HTTP request body
     * @param clientaffiliates reference to the collection
     */
    
    const clientToken = req.body.clientToken
    const affiliateCode = req.body.affiliateCode

    try {
        
        const db = await getDB(client, dbName)
        
        if(!(await verifyToken(clientToken, db))) {
            res.sendStatus(400)
            return
        }
        
        const clientaffiliates = db.collection('clients.' + clientToken)
        
        let result = await callback(affiliateCode, clientaffiliates)
        
        res.json(result)
    } catch (error) {
        console.log("An error occurred: ", error)
    }
        
}

let dbWrapper = {
    db: null
}

export async function getDB(client, dbName) {
    if (!dbWrapper.db) {
        await client.connect();
        dbWrapper.db = client.db(dbName);
    }
    return dbWrapper.db;
}