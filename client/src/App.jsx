import React, { useState } from "react";
import axios from "axios";
import schedule from "node-schedule";
import domtoimage from "dom-to-image";

import "./index.css";
// components
import Quote from "./components/Quote";
import Image from "./components/Image";

const rule = new schedule.RecurrenceRule();
rule.minute = [0, new schedule.Range(0, 60, 20)];

function App() {
  const [quote, setQuote] = useState({});
  const [image, setImage] = useState("");
  const [doTweet, setDoTweet] = useState(false);
  const quoteRef = React.useRef(null);

  const postTweet = React.useCallback(async () => {
    const node = quoteRef.current;
    const dataUrl = await domtoimage.toJpeg(node);

    await axios.post("http://localhost:3000/tweet", {
      dataUrl,
    });

    setDoTweet(false);
  }, [quoteRef]);

  React.useEffect(() => {
    if (doTweet) {
      postTweet();
    }
  }, [postTweet, doTweet]);

  schedule.scheduleJob(rule, async () => {
    setDoTweet(true);
  });

  return (
    <div className="quote-container" id={"quote-container"} ref={quoteRef}>
      <Image image={image} setImage={setImage} doTweet={doTweet} />
      <Quote quote={quote} setQuote={setQuote} doTweet={doTweet} />
    </div>
  );
}

export default App;
