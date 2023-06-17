const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion , ObjectId} = require('mongodb');

const cors = require('cors');
app.use(express.json());
app.use(cors())
require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World!')
})






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dtd3sv1.mongodb.net/?retryWrites=true&w=majority`;

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

    const toyCollection = client.db('Toy').collection('addedtoy');

    app.get('/addedtoy', async (req, res) => {
      const cursor = toyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.post('/addedtoy', async (req, res) => {
      const newtoy = req.body;
     
      const result = await toyCollection.insertOne(newtoy);
      res.send(result);
  })

  app.get('/addedtoy/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}
    const result = await toyCollection.findOne(query);
    res.send(result);
})

app.put('/addedtoy/:id', async(req, res) => {
  const id = req.params.id;
  const filter = {_id: new ObjectId(id)}
  const options = { upsert: true };
  const t = req.body;

  const coffee = {
      $set: {
          name: t.name, 
          quantity: t.quantity, 
          price: t.price, 
          rating : t.rating , 
          subCategory: t.subCategory, 
          description: t.description, 
          pictureUrl: t.pictureUrl
      }
  }

  const result = await toyCollection.updateOne(filter, coffee, options);
  res.send(result);
})

app.delete('/addedtoy/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) }
  const result = await toyCollection.deleteOne(query);
  res.send(result);
})
  
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})