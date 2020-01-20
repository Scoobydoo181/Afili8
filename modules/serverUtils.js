export async function verifyToken(token, db) {
    /**
     * Queries database to check if a client with the specified token exists
     *  @param token the client API token to check
     * @param db the MongoDB database instance
     */
    
    let test = await db.listCollections({name: 'clients.' + token}, {nameOnly: true}).toArray();
    
    return !!test.length;
}

export async function handleRequest(req, res, next, client, dbName, callback) {
    /**
     * Connects to MongoDB instance and verifies client token before passing args to a callback
     * @param req express request object
     * @param res express response object
     * @param callback callback function that takes the following paramaters
     * @param afiliateCode afiliate link passed in the HTTP request body
     * @param clientAfiliates reference to the collection
     */
    const clientToken = req.body.clientToken
    const afiliateCode = req.body.afiliateCode

    try {
        
        const db = await getDB(client, dbName)
        
        if(!(await verifyToken(clientToken, db))) {
            res.sendStatus(400)
            return
        }
        
        const clientAfiliates = db.collection('clients.' + clientToken)
        
        let result = await callback(afiliateCode, clientAfiliates)
        
        res.json(result)
    } catch (error) {
        console.log("An error occurred: ", error)
        next(error)
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