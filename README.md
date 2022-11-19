<div align="center">
<h1>Twitter bot</h1>
<p>Automatically generate and tweet random quotes and a background image for you</p>
</div>

## Usage

Set up the environment variables required before spinning up the client and the server.

### Client

All variables on the client side must be prefixed with `VITE_`.

Keys must be obtain from the `unsplash` API for the image generation.

```jsx
VITE_ACCESS_KEY = youraccesskey;
VITE_SECRET_KEY = yoursecretkey;
```

### Server

For the server, you will need a [MongoDB](https://www.mongodb.com/) connection string (will served as your token storage).

[Twitter api keys and token](https://developer.twitter.com/en/) will be also required.

```jsx
TWITTER_API_KEY = your_twitter_api_key;
TWITTER_API_SECRET_KEY = your_twitter_secret_key;
TWITTER_BEARER_TOKEN = your_twitter_bearer_token;
TWITTER_CLIENT_ID = your_twitter_client_id;
TWITTER_CLIENT_SECRET = your_twitter_client_secret;
```
