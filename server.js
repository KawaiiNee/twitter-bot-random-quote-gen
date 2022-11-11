require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const schedule = require("node-schedule");

const mongoose = require("mongoose");
const connectDB = (URI) => {
  return mongoose.connect(URI);
};

const { TwitterApi } = require("twitter-api-v2");

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET_KEY,
});

// DB SCHEMA
const { Auth, AuthToken } = require("./db");

const callbackURL = "http://127.0.0.1:3000/callback";

app.get("/", async (req, res) => {
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
    console.log(error);
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

    const update = {
      accessToken,
      accessSecret,
      oauth_verifier,
    };

    await AuthToken.findOneAndUpdate({ id: 1 }, update, {
      upsert: true,
    });

    // return res.status(200).json({ success: true });
    return res.redirect("/tweet");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.get("/tweet", async (req, res) => {
  try {
    const { accessToken, accessSecret } = await AuthToken.findOne({ id: 1 });

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken,
      accessSecret,
    });

    // const mediaId = await client.v1.uploadMedia(Buffer.from([...]), { mimeType: EUploadMimeType.Png });

    const mediaId = await client.v1.uploadMedia("./Screenshot (277).png");
    const newTweet = await client.v1.tweet("Hello!", { media_ids: mediaId });

    res.status(200).send(newTweet);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

schedule.scheduleJob("1 * * * * *", async function () {
  try {
    const { accessToken, accessSecret } = await AuthToken.findOne({ id: 1 });

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken,
      accessSecret,
    });

    // const mediaId = await client.v1.uploadMedia(Buffer.from([...]), { mimeType: EUploadMimeType.Png });

    const mediaId = await client.v1.uploadMedia("./Screenshot (277).png");
    const newTweet = await client.v1.tweet("Hello!", { media_ids: mediaId });

    const d = new Date(Date.now()).toLocaleString();
    console.log(d);
    console.log("!!!!!!!!!! ** TWEET ** !!!!!!!!!!");
    console.log(newTweet.source);
  } catch (error) {
    console.error(error);
  }
});

async function start() {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Connecting to port: ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
}

start();
