import React, { Fragment, useEffect, useState } from "react";
import { ImageGrid } from "../imageGrid";
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
  fetch: fetch,
});

function Register() {
  const [category, setCategory] = useState();
  const [rawImages, setRawImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  const getImages = async () => {
    let fullImages = [];
    let thumbnails = [];

    try {
      const result = await unsplash.search.getPhotos({
        query: category,
        page: 1,
        perPage: 10,
        orientation: "squarish",
      });

      const pictures = result.response;
      pictures.results.forEach((pic) => {
        fullImages.push(`${pic.urls.full}&crop=faces&fit=crop&h=250&w=250}`);
        thumbnails.push(pic.urls.thumb);
      });

      setRawImages(fullImages);
      setThumbnails(thumbnails);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <div className="m-8 font-light flex justify-center text-center">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs">
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2 text-lg"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2 text-lg"
              htmlFor="category"
            >
              Category for password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              placeholder="Try 'Elon Musk'"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => getImages()}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <ImageGrid imageURLs={rawImages} thumbnails={thumbnails} />
    </Fragment>
  );
}

export default Register;
