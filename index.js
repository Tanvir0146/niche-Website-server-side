const express  = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.elw8g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('travelAgency');
        const hotelsCollection = database.collection('hotels');
        const bookingCollection = database.collection('bookings');

        //Get Hotels
        app.get('/hotels', async(req,res)=>{
            const cursor = hotelsCollection.find({});
            const hotels = await cursor.toArray();
            res.send(hotels);
        })

        //Get Single Hotel
        app.get('/hotels/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const hotel = await hotelsCollection.findOne(query);
            res.json(hotel);
        })

        //Post Hotels
        app.post('/hotels', async(req,res)=>{
            const bookings = req.body;
            const result = await hotelsCollection.insertOne(bookings);
            // console.log(bookings);
            res.json(result);
        })

        //Get All Bookings
        app.get('/bookings', async(req,res)=>{
            const cursor = bookingCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //Post Bookings
        app.post('/bookings', async(req,res)=>{
            const bookings = req.body;
            const result = await bookingCollection.insertOne(bookings);
            // console.log(bookings);
            res.json(result);
        })

        //Get Single User Bookings
        app.get('/bookings/:email',async(req,res)=>{
            const email = req.params.email;
            const query = {email : email};
            const cursor = bookingCollection.find(query);
            const booking = await cursor.toArray()
            res.json(booking);
            // console.log(booking);

        })

        //Update Single Booking
        app.put('/bookings/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const updateDoc = {
                $set: {
                  status: "Approved"
                },
              };
              const result = await bookingCollection.updateOne(query,updateDoc);
            // console.log('updated',result);
            res.json(result);
        })

        //Delete Single User Bookings
        app.delete('/bookings/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await bookingCollection.deleteOne(query);
            // console.log('delete',result);
            res.json(result);
        })

    }finally{

    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('hello there!');
})

app.listen(port,()=>{
    console.log('listening from port ',port);
})