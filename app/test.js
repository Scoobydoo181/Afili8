const axios = require('axios')
const MongoClient = require('mongodb').MongoClient

const port = 3001

const url = "mongodb://localhost:27017";
const dbName = "afili8";
const client = MongoClient(url)

let db

beforeAll(async () => {
    await client.connect();
    db = client.db(dbName);
})

test("Home route", async () => {
    let res = await axios.get("http://localhost:" + port + "/")   
    expect(res.status).toBe(200);
});

test("Login route", async () => {
    let res = await axios.get("http://localhost:" + port + "/login")
    expect(res.status).toBe(200);
});

test("Dashboard route", async () => {
    let res = await axios.get("http://localhost:" + port + "/dashboard");
    expect(res.status).toBe(200);
});

test("Create link", async () => {
    try {
        await axios.post("http://localhost:" + port + "/api/delete", {clientToken: 'TEST', affiliateCode: 'abc'})
        
        await axios.post("http://localhost:" + port + "/api/create", {clientToken: 'TEST', affiliateCode: 'abc'})
    
        let result = await db.collection('clients.TEST').findOne({affiliateCode: 'abc'})    
        
        expect(result).toEqual(expect.objectContaining({affiliateCode: 'abc'}))
    } catch (error) {
        console.log("Error in Create link: ", error);
        throw error
    }
});

test("Delete link", async () => {
    try {
        await axios.post("http://localhost:" + port + "/api/create", {clientToken: 'TEST', affiliateCode: 'abc'})
        
        await axios.post("http://localhost:" + port + "/api/delete", {clientToken: 'TEST', affiliateCode: 'abc'})
    
        let result = await db.collection('clients.TEST').findOne({affiliateCode: 'abc'})    
        expect(result).toEqual(null)
    } catch (error) {
        console.log("Error in Delete link: ", error);
        throw error
    }
});

test("Verify link", async () => {
    let res = await axios.post("http://localhost:" + port + "/api/verify", {clientToken: 'TEST', affiliateCode: 'abc'})
    expect(res.data).toBe(true);
});

test("Increment link", async () => {
    try {
        //await db.collection("clients.TEST").insertOne({ affiliateCode: "abc", numberUses: 0 });
    
        let result1 = await db.collection('clients.TEST').findOne({affiliateCode: 'abc'})
        result1 = result1.numberUses
        
        await axios.post("http://localhost:" + port + "/api/increment", {clientToken: 'TEST', affiliateCode:'abc'});
    
        let result2 = await db.collection('clients.TEST').findOne({affiliateCode: 'abc'})
        result2 = result2.numberUses
        expect(result2).toBe(result1 + 1)
    } catch (error) {
        console.log("Error in Increment link: ", error);
        throw error
    }
});

test("Add new client", async () => {
    try {
        const token = 'A5Y7G8M23S5UA92L3C8SXZ'
        const name = 'John Smith'
    
        await client.connect();
        const db = client.db(dbName);
    
        await axios.post('http://localhost:' + port + '/api/new-client', {APIToken: token, clientName: name})
    
        let result = await db.collection('clients.' + token).findOne({clientName: name})
    
        expect(result).toEqual(expect.objectContaining({clientName: name}))
    } catch (error) {
        console.log("Error in Add new client: ", error);
        throw error
    }
});

test("Test mongodb", async () => {
    try {
        await db.collection('apiTest').insertOne({value1: true, value2: 'test test test'})
    
        let result = await db.collection('apiTest').findOne({value1: true})
    
        expect(result).toEqual(expect.objectContaining({ value1: true, value2: "test test test"}));
    } catch (error) {
        console.log("Error in Test mongodb: ", error);
        throw error
    }
});