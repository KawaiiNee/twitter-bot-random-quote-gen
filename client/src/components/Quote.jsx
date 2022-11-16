import React, { useEffect, useCallback } from "react";
import axios from "axios";

const Quote = ({ quote, setQuote, doTweet }) => {
  const getQuote = useCallback(async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api");
      setQuote(data);
    } catch (error) {
      console.error(error);
    }
  }, [setQuote]);

  useEffect(() => {
    if (!doTweet) {
      getQuote();
    }
  }, [getQuote, doTweet]);

  if (Object.keys(quote).length === 0) {
    return <div className="quote">Loading...</div>;
  }

  return <h1 className="quote">{`"${quote.data[0].q}"`}</h1>;
};

export default Quote;
