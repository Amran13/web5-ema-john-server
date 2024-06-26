const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()

//middleware 
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0sxdnca.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const emaJohnCollection = client.db('emaJohnDB').collection('productsDB')
    const emaJohnCartCollection = client.db('emaJohnDB').collection('cartDB')

    app.get('/products', async(req, res) => {
        const cursor = emaJohnCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    //cart
    app.get('/cart', async(req, res) => {
        const cursor = emaJohnCartCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.post('/cart', async(req, res) => {
        const data = req.body;
        const result = await emaJohnCartCollection.insertOne(data)
        res.send(result)
    })

    app.delete('/cart/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : id}
        const result = await emaJohnCartCollection.deleteOne(query)
        res.send(result)
    })
    
    app.delete('/cart', async(req, res) => {
        const query = {}
        const result = await emaJohnCartCollection.deleteMany(query)
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('Ema john server is running')
})


app.listen(port, console.log(`Server is running`))