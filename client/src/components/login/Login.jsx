import React, { useState } from "react";
import axios from 'axios';
import { ImageGrid } from "../imageGrid";
import CryptoJS from "crypto-js";

const NUM_TILES = 1;
const NUM_ROUNDS = 2;

function hashImage(image, ref_point) {
  const str = image + ref_point.join()
  return CryptoJS.SHA256(str).toString(CryptoJS.enc.base64)
};

function encryptImage(image, key) {
  return CryptoJS.AES.encrypt(image, key).toString();
};

function Login() {
  const [email, setEmail] = useState()
  const [roundNumber, setRoundNumber] = useState(0)
  const [images, setImages] = useState([])
  const [sequences, setSequences] = useState([])

  const handleSubmit = async () => {
    console.log(roundNumber);
    // fetching first round images
    if(roundNumber === 0) {
      console.log("round 0, no img tile");
      try {
        const res = await axios.post('http://localhost:4000/api/login', {
          email: email,
          iterationNum: roundNumber,
          passwordHash: '',
          key: ''
        }, { 'Content-Type': 'application/json' })
  
        if(res.status === 200) {
          setImages(res.data.images)
        }
      } catch(err) {
        console.error(err)
      }
    } 

    // middle rounds
    else if(roundNumber < NUM_ROUNDS) {
      console.log("int rounds");
      try {
        console.log(sequences);
        const currentSequence = sequences[sequences.length-1]
        const res = await axios.post('http://localhost:4000/api/login', {
          email: email,
          iterationNum: roundNumber,
          passwordHash: '',
          key: hashImage(currentSequence.image, currentSequence.tileSequence)
        }, { 'Content-Type': 'application/json' })
  
        if(res.status === 200) {
          setImages(res.data.images)
        }
      } catch(err) {
        console.error(err)
      }
    }

    // last round
    else {
      console.log("last r");
      const hashes = [];
      sequences.map(imageSelection =>{
        hashes.push(hashImage(imageSelection.image, imageSelection.tileSequence));
      });

      const encryptedImages = [];
      for(let i=1; i<NUM_ROUNDS; i++) {
        encryptedImages.push(encryptImage(sequences[i].image, hashes[i-1]));
      }
      const passwordHash = CryptoJS.SHA256(hashes.join()).toString(CryptoJS.enc.base64);

      const currentSequence = sequences[sequences.length-1]
      try {
        const res = await axios.post('http://localhost:4000/api/login', {
          email: email,
          iterationNum: roundNumber,
          passwordHash: passwordHash,
          key: hashImage(currentSequence.image, currentSequence.tileSequence)
        }, { 'Content-Type': 'application/json' })

        if(res.status === 200) {
          console.log("success!!")
        }
      } catch(err) {
        console.error(err)
      }
    }
    
    setRoundNumber(prev => prev + 1);
  }

  const addImageAndTileSequence = (image, tileSequence) => {
    console.log("handle tile");
    setSequences((prev) => [
      ...prev,
      {
        image,
        tileSequence: tileSequence,
      },
    ]);
    setImages([]);
    handleSubmit();
  };
  
  return <div>
    <div className="m-8 font-light flex justify-center text-center">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs">
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2 text-lg"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-light py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => handleSubmit()}
            >
              {roundNumber < NUM_ROUNDS ? 'Next' : 'Login'}
            </button>
          </div>
        </form>
      </div>
      <ImageGrid 
        imageURLs={images} 
        thumbnails={images} 
        addImageAndTileSequence={addImageAndTileSequence}
        numRounds={NUM_ROUNDS}
        numTiles={NUM_TILES}
      />
  </div>;
}

export default Login;
