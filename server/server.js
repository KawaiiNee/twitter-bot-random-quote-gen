require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

const cors = require("cors");
// enable CORS
app.use(cors());
const axios = require("axios");

const mongoose = require("mongoose");
const connectDB = (URI) => {
  return mongoose.connect(URI);
};

const twitterRouter = require("./router/twitter-api-call");
app.use("/", twitterRouter);

const QUOTE_API = "https://zenquotes.io/api/random";

app.get("/api", async (req, res) => {
  const { data } = await axios.get(QUOTE_API);
  res.json({ data });
});

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Connecting to port: ${PORT}...`));
  } catch (error) {
    console.error(error);
  }
}

start();

