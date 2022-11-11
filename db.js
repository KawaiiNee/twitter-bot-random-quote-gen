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

const TestSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 1,
  },

  loggedClient: {
    type: Object,
  },
});

const Auth = mongoose.model("Auth", AuthSchema);
const AuthToken = mongoose.model("Auth Token", AuthTokenSchema);
const Test = mongoose.model("test schema", TestSchema);

module.exports = {
  Auth,
  AuthToken,
  Test,
};
