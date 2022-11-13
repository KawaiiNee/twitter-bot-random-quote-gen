import React, { useEffect } from "react";

const Quote = ({ quote, setQuote }) => {
  const getQuote = async () => {
    try {
      const res = await fetch("http://localhost:3000/api");
      const fin = await res.json();
      setQuote(fin);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getQuote();
  }, []);

  if (Object.keys(quote).length === 0) {
    return <div className="quote">Loading...</div>;
  }

  return <h1 className="quote">{`"${quote.data[0].q}"`}</h1>;
};

export default Quote;
