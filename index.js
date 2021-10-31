
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const app = express()

const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 7000;


app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5hhs7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const run = async () => {
    try {
        await client.connect();
        const database = client.db("worldTour");
        const touristCollection = database.collection("tourist");
        const userCollection = database.collection("user");
        console.log('connected')


        app.get('/card', async (req, res) => {
            const cursor = touristCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/card', async (req, res) => {
            const newEvent = req.body
            const result = await touristCollection.insertOne(newEvent)
            res.json(result)
        })

        app.post('/users', async (req, res) => {
            const newEvent = req.body
            const result = await userCollection.insertOne(newEvent)
            res.json(result)
        })

        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id
            const cursor = { _id: ObjectId(id) }
            const result = await userCollection.deleteOne(cursor)
            res.json(result)
        })

    }
    finally {

    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('This is home')
})

app.listen(port, () => {
    console.log('port in running on', port)
})
