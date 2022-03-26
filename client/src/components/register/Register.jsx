import React, { Fragment, useEffect, useState } from "react";
import { ImageGrid } from "../imageGrid";
import { createApi } from "unsplash-js";
import CryptoJS from "crypto-js";
import axios from "axios";
import { toast } from "react-toastify";
import { navigate } from "@reach/router";
import Canvas from "../canvas/Canvas";
import imageCaption from "./Story";

const unsplash = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY,
  fetch: fetch,
});

const NUM_TILES = Number(process.env.REACT_APP_NUM_TILES);
const NUM_ROUNDS = Number(process.env.REACT_APP_NUM_ROUNDS);

function hashImage(image, ref_point) {
  const str = image + ref_point.join();
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.base64);
}

function encryptImage(image, key) {
  return CryptoJS.AES.encrypt(image, key).toString();
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [rawImages, setRawImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [sequences, setSequences] = useState([]);
  const [roundNumber, setRoundNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isHuman, setIsHuman] = useState(false);

  const getImages = async () => {
    if (category.trim() === "") {
      toast.info("Please enter a category", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    setIsLoading(true);
    let fullImages = [];
    let thumbnails = [];

    try {
      const tempResult = await unsplash.search.getPhotos({
        query: category,
        page: 1,
        perPage: 1,
        orientation: "squarish",
      });

      const pic = tempResult.response;
      const totalImages = pic.total;
      const randomNumber = Math.floor(Math.random() * totalImages) + 1;
      const imagePage = Math.floor(randomNumber / 30) + 1;
      
      const result = await unsplash.search.getPhotos({
        query: category,
        page: imagePage,
        // perPage: Number(process.env.REACT_APP_PER_PAGE_IMAGE_LIMIT),
        perPage: 9,
        orientation: "squarish",
      });

      const pictures = result.response;
      pictures.results.forEach((pic) => {
        fullImages.push(`${pic.urls.full}&crop=faces&fit=crop&h=250&w=250`);
        thumbnails.push(`${pic.urls.thumb}&crop=faces&fit=crop&h=250&w=250`);
      });

      setIsLoading(false);
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
    setRoundNumber((prev) => prev + 1);
    setCategory("");
    setRawImages([]);
    setThumbnails([]);
  };

  const register = async () => {
    if (!name || !name.trim() || !email || !email.trim()) {
      toast.warning("Please enter your details", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    const hashes = [];
    let captions = [];
    sequences.map((imageSelection) => {
      captions.push(imageCaption(imageSelection.image));
      hashes.push(hashImage(imageSelection.image, imageSelection.tileSequence));
    });

    Promise.all(captions).then(async(values) => {
      console.log(values);
      let captionList = [];
      for(let i=0; i<values.length;i++){
        captionList.push(values[i].text);
      }

      const encryptedImages = [];

      for (let i = 1; i < NUM_ROUNDS; i++) {
        encryptedImages.push(encryptImage(sequences[i].image, hashes[i - 1]));
      }

      const passwordHash = CryptoJS.SHA256(hashes.join()).toString(
        CryptoJS.enc.base64
      );

      try {
        const res = await axios.post("/register", {
          name,
          email,
          passwordHash,
          images: [sequences[0].image, ...encryptedImages],
          captions : captionList,
        });

        if (res.status === 200) {
          console.log("Registration successful");
          toast.success("Registration successful!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          navigate("/login");
        }
      } catch (error) {
        if (error.reponse.status === 500) {
          toast.error("An error occured", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error("Invalid login", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          sequences.current = [];
          setRoundNumber(0);
        }
      }
    })

  };

  return (
    <Fragment>
      <Canvas
        modalIsOpen={showCaptcha}
        setIsOpen={setShowCaptcha}
        onResult={(captchaResult) => {
          if (captchaResult) {
            setIsHuman(true);
            getImages();
          } else {
            toast.warning("Are you human? Please try again", {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          setShowCaptcha(false);
        }}
      />
      <div className="mx-auto my-2 font-light flex justify-center text-center">
        <form className="bg-white pt-6 w-2/3 flex md:flex-row flex-col justify-center">
          <div className="mb-4 mr-2">
            <label className="text-gray-700 mb-2 text-lg" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              name="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4 mr-2">
            <label className="text-gray-700 mb-2 text-lg" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
          </div>

          <div className="mb-4 mr-2">
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
              onClick={() => {
                if (roundNumber === 0 && !isHuman) {
                  setShowCaptcha(true);
                } else {
                  getImages();
                }
              }}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      {roundNumber === NUM_ROUNDS ? (
        <div className="flex flex-col">
          <p className="mx-auto text-3xl my-2">Woo-hoo! You're almost there!</p>
          <button className="btn btn-sm btn-primary mx-auto" onClick={register}>
            Confirm registration
          </button>
        </div>
      ) : (
        <ImageGrid
          imageURLs={rawImages}
          thumbnails={thumbnails}
          addImageAndTileSequence={addImageAndTileSequence}
          numRounds={NUM_ROUNDS}
          numTiles={NUM_TILES}
          isLoading={isLoading}
        />
      )}
    </Fragment>
  );
}

export default Register;
