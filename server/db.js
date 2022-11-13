const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 1,
  },

  oauth_token: {
    type: String,
    default: null,
  },
  oauth_token_secret: {
    type: String,
    default: null,
  },
});

const AuthTokenSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 1,
  },

  accessToken: {
    type: String,
  },
  accessSecret: {
    type: String,
  },
});

const Auth = mongoose.model("Auth", AuthSchema);
const AuthToken = mongoose.model("Auth Token", AuthTokenSchema);

module.exports = {
  Auth,
  AuthToken,
};
