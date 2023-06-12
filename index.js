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
        const userCollections = client.db('motion_breast_DB').collection('users')
        const selectedClasses = client.db('motion_breast_DB').collection('selectedClasses')

        app.get('/', (req, res) => {
            res.send("Motion is runnig");
        })
        //  all class get

        app.get('/classes', async (req, res) => {
            const result = await classes.find().sort({ enarolled: -1 }).collation({ locale: "en_US", numericOrdering: true }).toArray()
            res.send(result)
        })

        app.get('/myClass', async (req, res) => {
            const email = req.query.email
            const filter = { email: email }
            const result = await classes.find(filter).toArray()
            res.send(result)
            // console.log(query);
        })
        //  All users Get
        app.get('/users', async (req, res) => {
            const result = await userCollections.find().toArray()
            res.send(result)
        })

        //  get select class 

        app.get('/selectedClass', async (req, res) => {
            const result = await selectedClasses.find().toArray()
            res.send(result)
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            const email = user.email
            const query = { email: email }
            const exjestUser = await userCollections.findOne(query)
            if (exjestUser) {
                return
            }
            const result = await userCollections.insertOne(user)
            res.send(result)

        })


        app.post('/addClass', async (req, res) => {
            const newclass = req.body;
            const result = await classes.insertOne(newclass)
            res.send(result)
        })
        //  select class

        app.post('/selectClass', async (req, res) => {
            const select = req.body;


            const result = await selectedClasses.insertOne(select)
            res.send(result)
        })

        // class stutus update
        app.put('/class/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const newupdate = req.body
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    role: newupdate.role,
                    // feedback: newupdate.feedback
                },
            };
            const result = await classes.updateOne(filter, updateDoc, options)
            res.send(result)
        })
        app.put('/classfeedback/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const newupdate = req.body
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    feedback: newupdate.feedback
                },
            };
            const result = await classes.updateOne(filter, updateDoc, options)
            res.send(result)
        })


        // user status update 
        app.patch('/user/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const newupdate = req.body

            const updateDoc = {
                $set: {
                    role: newupdate.role,

                },
            };
            const result = await userCollections.updateOne(filter, updateDoc)
            res.send(result)
        })

        // name and price updater

        app.patch('/updateClass/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const newupdate = req.body

            const updateDoc = {
                $set: {
                    price: newupdate.price,
                    title: newupdate.title
                },
            };
            const result = await classes.updateOne(filter, updateDoc)
            res.send(result)
        })


        //  book to enrolled class

        app.patch('/enrolledClass/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const newupdate = req.body

            const updateDoc = {
                $set: {
                    select: newupdate.select,
                },
            };
            const result = await classes.updateOne(filter, updateDoc)
            res.send(result)
        })

        // selected item delete

        app.delete('/selectedItemDelete/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: id }

            const result = await selectedClasses.deleteOne(query)
            res.send(result)
            // console.log(result);
        })











        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port)