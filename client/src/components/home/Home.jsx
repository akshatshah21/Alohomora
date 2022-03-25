import React from "react";
import { PixelSelect } from "../pixelSelect";
import { Canvas } from "../canvas"

const DIMENSION = 500;
const SELECTION_RESOLUTION = 5;  // 1 * 1
// const IMAGE = `https://random.imagecdn.app/${DIMENSION}/${DIMENSION}`;
const IMAGE = `https://picsum.photos/${DIMENSION}`;


function Home() {
  return (
      <Canvas />
  );
}

export default Home;
