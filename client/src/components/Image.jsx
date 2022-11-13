import React, { useEffect } from "react";
import domtoimage from "dom-to-image";
import { createApi } from "unsplash-js";

const Image = ({ image, setImage }) => {
  const handleClick = () => {
    const node = document.getElementById("quote-container");

    domtoimage.toJpeg(node).then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "random-quote.jpeg";
      link.href = dataUrl;
      // link.click();
    });
  };

  const api = createApi({
    accessKey: import.meta.env.VITE_ACCESS_KEY,
  });

  const getImage = async () => {
    const res = await api.photos.getRandom({
      orientation: "landscape",
      count: 1,
    });

    setImage(res);
  };

  useEffect(() => {
    getImage();
  }, []);

  if (!image) {
    return <div>Loading...</div>;
  } else if (image.errors) {
    return (
      <div>
        <div>{image.errors[0]}</div>
        <div>PS: Make sure to set your access token!</div>
      </div>
    );
  }
  return (
    <img
      src={image.response[0].urls.regular}
      className="image"
      alt={image.response[0].description}
    />
  );
};

export default Image;
