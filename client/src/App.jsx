import React, { useState } from "react";
import "./index.css";
// components
import Quote from "./components/Quote";
import Image from "./components/Image";

function App() {
  const [quote, setQuote] = useState({});
  const [image, setImage] = useState("");

  if (Object.keys(quote).length !== 0) {
    // console.log("tite");
  } else {
    // console.log("loading");
  }

  return (
    <div className="quote-container" id={"quote-container"}>
      <Image image={image} setImage={setImage} />
      <Quote quote={quote} setQuote={setQuote} />
    </div>
  );
}

// TODO: fonts dont apply
// https://www.youtube.com/watch?v=20kCzEEqrNA

export default App;
