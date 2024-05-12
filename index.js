const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crkhnnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const foodCollection = client.db("foodDB").collection("foodCollection");
    // get all food Item
    app.get("/foodItem", async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // get single good item
    app.get("/foodItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    // get specific user food item
    app.get("/foodItem", async (req, res) => {
      console.log(req.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      } else if (req.query?.name) {
        query = { name: req.query.name };
      }
      const result = await foodCollection.find(query).toArray();
      res.send(result);
    });

    // update food

    app.get("/foodItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    app.post("/foodItem", async (req, res) => {
      const foodItem = req.body;
      console.log(foodItem);
      const result = await foodCollection.insertOne(foodItem);
      res.send(result);
    });
    // Update a status
    app.patch("/foodItem/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedFoodStatus = req.body;
      const updateFood = {
        $set: {
          additionalNotes: updatedFoodStatus.additionalNotes,
          Status: updatedFoodStatus.theStatus,
        },
      };
      const result = await foodCollection.updateOne(
        filter,
        updateFood,
        options
      );
      res.send(result);
    });

    // Food updated
    app.put("/foodItem/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateAFood = req.body;
      const food = {
        $set: {
          foodName: updateAFood.foodName,
          foodImage: updateAFood.foodImage,
          foodQuantity: updateAFood.foodQuantity,
          pickupLocation: updateAFood.pickupLocation,
          additionalNotes: updateAFood.additionalNotes,
          expireDate: updateAFood.expireDate,
          Status: updateAFood.Status,
        },
      };
      const result = await foodCollection.updateOne(filter, food, options);
      res.send(result);
    });

    // delete a food item
    app.delete("/foodItem/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("food donation server is running");
});

app.listen(port, () => {
  console.log(`food donation server is running on port ${port}`);
});
