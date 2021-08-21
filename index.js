const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const pass = "photography1234";

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload());

const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b4cay.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookingsCollection = client.db("photographyService").collection("bookings");
  const packageCollection = client.db("photographyService").collection("package");
  
  app.post('/addBookings', (req, res) => {
      const booking = req.body;
      console.log(booking)
      bookingsCollection.insertOne(booking)
      .then(result => {
          res.send(result.acknowledge = true)
      })
  })

  app.get('/bookings', (req, res) => {
      bookingsCollection.find({email: req.query.email})
      .toArray((err, documents) => {
          res.send(documents)
      })
  })

  app.post('/addPackage ', (req, res) => {
    const file = req.files.file;
    const package = req.body.package;
    const price = req.body.price;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    packageCollection.insertOne({ package, price, image })
        .then(result => {
            console.log(result)
            res.send(result.insertedCount > 0);
        })
})

});






app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

app.listen(process.env.PORT || port);