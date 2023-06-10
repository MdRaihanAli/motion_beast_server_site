const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const { ObjectId } = require('mongodb');

const port = process.env.PORT || 5000





const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MOTION_DB_USER_NAME}:${process.env.MOTION_DB_PASS}@cluster0.q8hlybw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const classes = client.db('motion_breast_DB').collection('classes')

        app.get('/', (req, res) => {
            res.send("Motion is runnig");
        })
//  oll class get
        app.get('/classes', async(req, res)=>{
            const result = await classes.find().sort({ enarolled: -1 }).collation({ locale: "en_US", numericOrdering: true }).toArray()
            res.send(result)
        })











        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port)