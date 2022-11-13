require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const cors = require("cors");
// enable CORS
app.use(cors());
const axios = require("axios");

const schedule = require("node-schedule");

const mongoose = require("mongoose");
const connectDB = (URI) => {
  return mongoose.connect(URI);
};

const { TwitterApi, EUploadMimeType } = require("twitter-api-v2");

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET_KEY,
});

// db models
const { Auth, AuthToken } = require("./db");

const callbackURL = "http://127.0.0.1:3000/callback";

app.get("/auth", async (req, res) => {
  try {
    const { url, oauth_token, oauth_token_secret } =
      await twitterClient.generateAuthLink(callbackURL, {
        linkMode: "authorize",
      });

    const update = {
      oauth_token: `${oauth_token ? oauth_token : null}`,
      oauth_token_secret: `${oauth_token_secret ? oauth_token_secret : null}`,
    };

    await Auth.findOneAndUpdate({ id: 1 }, update, {
      upsert: true,
    });

    res.redirect(url);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

app.get("/callback", async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;

    const { oauth_token_secret } = await Auth.findOne({ id: 1 });

    if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
      return res
        .status(400)
        .send("You denied the app or your session expired!");
    }

    // produces accessToken & Secret for accesss (to be use on tweeting)
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret,
    });

    const {
      client: loggedClient,
      accessToken,
      accessSecret,
    } = await client.login(oauth_verifier);

    // you can use the "loggedClient" here to tweet if you want

    const update = {
      accessToken,
      accessSecret,
      oauth_verifier,
    };

    await AuthToken.findOneAndUpdate({ id: 1 }, update, {
      upsert: true,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
});

// if you want to use api
app.get("/tweet", async (req, res) => {
  const { base64Img } = req.body;
  console.log(base64Img);

  try {
    const { accessToken, accessSecret } = await AuthToken.findOne({ id: 1 });

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken,
      accessSecret,
    });

    const mediaId = await client.v1.uploadMedia(base64Img);
    const newTweet = await client.v1.tweet("Hello!", { media_ids: mediaId });

    res.status(200).send(newTweet);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// schedule's tweet
schedule.scheduleJob("1 1 * * * *", async function () {
  try {
    // const {data} = req.body
    // const buffer = Buffer.from(data, "base64");
    const { accessToken, accessSecret } = await AuthToken.findOne({ id: 1 });

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken,
      accessSecret,
    });

    // const mediaId = await client.v1.uploadMedia(Buffer.from([...]), { mimeType: EUploadMimeType.Png });

    // const mediaId = await client.v1.uploadMedia("./Screenshot (277).png");
    // const newTweet = await client.v1.tweet("Hello!", { media_ids: mediaId });

    const d = new Date(Date.now()).toLocaleString();
    console.log(d);
    console.log("!!!!!!!!!! ** TWEET ** !!!!!!!!!!");
    // console.log(mediaId);
  } catch (error) {
    console.error(error);
  }
});

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

// TODO:
// rather import the schedule on the frontend, generate image, then finally call the api "/tweet", receiving the buffer we want to tweet
