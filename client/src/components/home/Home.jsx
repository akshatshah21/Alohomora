import React from "react";
import { PixelSelect } from "../pixelSelect";

const DIMENSION = 500;
const SELECTION_RESOLUTION = 5;  // 1 * 1
// const IMAGE = `https://random.imagecdn.app/${DIMENSION}/${DIMENSION}`;
const IMAGE = `https://picsum.photos/${DIMENSION}`;


function Home() {
  return (
      <PixelSelect imageURL={IMAGE} dimension={DIMENSION} selectionResolution={SELECTION_RESOLUTION} />
  );
}

export default Home;
