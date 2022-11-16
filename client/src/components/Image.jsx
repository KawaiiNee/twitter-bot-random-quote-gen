import React, { useEffect, useCallback } from "react";
import { createApi } from "unsplash-js";

const Image = ({ image, setImage, doTweet }) => {
  const api = createApi({
    accessKey: import.meta.env.VITE_ACCESS_KEY,
  });

  const getImage = useCallback(async () => {
    try {
      const res = await api.photos.getRandom({
        orientation: "landscape",
        count: 1,
      });

      setImage(res);
    } catch (error) {
      console.error(error);
    }
    // FIXME: setting the api.photos as a dependency generate an infinite loop
  }, [setImage]);

  useEffect(() => {
    if (!doTweet) getImage();
  }, [getImage, doTweet]);

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
