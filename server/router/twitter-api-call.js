const express = require("express");
const router = express.Router();
// db models
const { Auth, AuthToken } = require("../db");
// twitter-api
const { TwitterApi, EUploadMimeType } = require("twitter-api-v2");
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET_KEY,
});

const callbackURL = "http://127.0.0.1:3000/callback";

router.get("/auth", async (req, res) => {
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

router.get("/callback", async (req, res) => {
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
router.post("/tweet", async (req, res) => {
  let { dataUrl } = req.body;

  try {
    const { accessToken, accessSecret } = await AuthToken.findOne({ id: 1 });

    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET_KEY,
      accessToken,
      accessSecret,
    });

    dataUrl = dataUrl.replace(/^data:image\/[a-z]+;base64,/, "");
    const buffer = Buffer.from(dataUrl, "base64");

    const mediaId = await client.v1.uploadMedia(Buffer.from(buffer), {
      mimeType: EUploadMimeType.Jpeg,
    });

    const newTweet = await client.v1.tweet("testing api", {
      media_ids: mediaId,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    // console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
