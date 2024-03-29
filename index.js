
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ro8id.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('MONGODB CONNETED33')



async function run(){
    try{
      await client.connect();
      const productCollection = client.db('warehouse').collection('product');
      const itemCollection = client.db('Product').collection('items');
      app.get('/inventory', async(req,res) =>{
       const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
      });

      app.put('/items/:id' , async(req,res)=> {
          const id = req.params.id;
        const updatedQuantity = req.body.Quantity;
       
        const filter = {_id:ObjectId(id)};
        const options = {upsert:true};
        const updatedDoc = {
            $set:{
                Quantity:updatedQuantity
            }
        };
        const result = await itemCollection.updateOne(filter,updatedDoc , options);

       res.send(result);
      })

    //   items  api 
    app.get('/items/:id', async(req,res)=> {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const inventory = await itemCollection.findOne(query);
        res.send(inventory);
    })

      app.get('/items', async(req,res) =>{
        const query = {};
       const cursor = itemCollection.find(query);
       const items = await cursor.toArray();
       res.send(items);
       });
       app.post('/items' , async(req,res) =>{
           const newItem = req.body;
           const result = await itemCollection.insertOne(newItem);
           res.send(result);
       });
       app.delete('/items/:id' , async(req , res)=>{
           const id = req.params.id;
           const query ={_id:ObjectId(id)};
           const result = await itemCollection.deleteOne(query);
           res.send(result);
       });
       app.get('/myItems/:email', async (req,res) =>{

        const email = req.params.email;
        const query = {email:email};
        const result = await itemCollection.find(query).toArray();
        res.send(result);
       })
     
    }
    finally{

    }
}
run().catch(console.dir);
 



// 

app.get('/' , (req , res) => {
    res.send('hello iam sahed');
});

app.listen(port, () => {
    console.log('listening to port');
})