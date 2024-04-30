const express = require("express");
const cors = require("cors");
require("dotenv").config();
const {
  MongoClient,
  ServerApiVersion,
  ClientSession,
  ObjectId,
} = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rsmyn0p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const spotsCollection = client
      .db("touristSpotsManagementDB")
      .collection("spots");

    app.post("/spots", async (req, res) => {
      const newSpots = req.body;
      const result = await spotsCollection.insertOne(newSpots);
      res.json(result);
    });
    app.get("/spots", async (req, res) => {
      const cursor = spotsCollection.find();
      const result = await cursor.toArray();
      res.json(result);
    });



    app.get("/mySpots/:whoAdded", async (req, res) => {
      const email = req.params.whoAdded;
      const result = await spotsCollection.find({ whoAdded: email }).toArray();
      res.json(result);
    });

    app.get("/singleSpot/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const result = await spotsCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    });

    app.get("/updateSpot/:id", async (req, res) => {
      const id = req.params.id;
      const result = await spotsCollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    })

    app.get("/spotsByCountry/:country", async (req, res) => {
      const country = req.params.country;
      const result = await spotsCollection.find({ selectedCountry: country }).toArray();
      res.json(result);
    })

    app.put("/updateSpot/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id)};
      const options = { upsert: true };
      const updatedSpot = req.body
      const updateDoc = {
        $set: {
          imageURL:updatedSpot.imageURL,
          touristsSpotName:updatedSpot.touristsSpotName,
          location:updatedSpot.location,
          shortDescription:updatedSpot.shortDescription,
          averageCost:updatedSpot.averageCost,
          seasonality:updatedSpot.seasonality,
          travelTime:updatedSpot.travelTime,
          totalVisitorsPerYear:updatedSpot.totalVisitorsPerYear,
        },
      };
      console.log(updateDoc);
      const result = await spotsCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });

    app.delete("/deleteSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await spotsCollection.deleteOne(query);
      res.json(result); 
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("tourism user management server is running");
});

app.listen(port, () => {
  console.log(`tourism user management server is running on port ${port}`);
});
