import React, { Fragment, useEffect, useState } from "react";
import { ImageGrid } from "../imageGrid";
import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
  fetch: fetch,
});

const NUM_TILES = 3;
const NUM_ROUNDS = 3;

// function hashImage(image, ref_point) {
//   str = image + ref_point.join()
//   return CryptoJS.SHA256(str).toString(CryptoJS.enc.base64)
// };

function Register() {
  const [category, setCategory] = useState();
  const [rawImages, setRawImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [imageNumber, setImageNumber] = useState(0);
  
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
        thumbnails.push(`${pic.urls.thumb}&crop=faces&fit=crop&h=250&w=250`);
      });

      setRawImages(fullImages);
      setThumbnails(thumbnails);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addImageAndTileSequence = (image, tileSequence) => {
    setSequences((prev) => [
      ...prev,
      {
        image,
        tileSequence: tileSequence,
      },
    ]);
    setImageNumber(prev => prev + 1);
    setCategory("");
    setRawImages([]);
    setThumbnails([]);
  };

  const register = async() => {

  }

  return (
    <Fragment>
      <div className="mx-auto my-2 font-light flex justify-center text-center">
        <form className="bg-white pt-6 w-2/3 flex justify-center">
          <div className="mb-4">
            <label className="text-gray-700 mb-2 text-lg" htmlFor="username">
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
            <label className="text-gray-700 mb-2 text-lg" htmlFor="category">
              Category for image
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="category"
              placeholder="Try 'cats'"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="mx-2 btn btn-sm btn-secondary py-2 px-4"
              type="button"
              onClick={() => getImages()}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      {imageNumber === NUM_ROUNDS ? (
        <div className="flex flex-col">
          <p className="mx-auto text-3xl my-2">Woo-hoo! You're almost there!</p>
          <button className="btn btn-sm btn-primary mx-auto">Confirm registration</button>
        </div>
      ) : (
        <ImageGrid
          imageURLs={rawImages}
          thumbnails={thumbnails}
          addImageAndTileSequence={addImageAndTileSequence}
          numRounds={NUM_ROUNDS}
          numTiles={NUM_TILES}
        />
      )}
    </Fragment>
  );
}

export default Register;
