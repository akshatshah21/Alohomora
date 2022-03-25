import React, { useState } from "react";
import { PixelSelect } from "../pixelSelect";
import { ArrowRight, XCircle } from "react-feather";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Grid = (props) => {
  const Box1 = ({ children }) => (
    <a
      style={{
        //border: "1px solid #ccc",
        display: "block",
        fontSize: 12,
        padding: 40,
      }}
    >
      {children}
    </a>
  );

  const Box2 = ({ children }) => (
    <a
      style={{
        border: "1px solid #ccc",
        display: "block",
        fontSize: 16,
        lineHeight: 2,
        padding: 20,
        marginBottom: 10,
        width: 100,
      }}
    >
      {children}
    </a>
  );

  const submitSequence = (seq) => console.log(seq);

  const [showModal, setShowModal] = useState(true);
  const [currentImage, setCurrentImage] = useState(false);

  return (
    <>
      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
          {props.images.map((img) => (
            <div key={img.id} className="">
              {props.isLoading ? (
                <SkeletonTheme
                  baseColor="#5294e0"
                  highlightColor="#a1cdff"
                  borderRadius="0.25rem"
                  duration={1}
                >
                  <Skeleton count={5} wrapper={Box1} />
                </SkeletonTheme>
              ) : (
                <img
                  htmlFor="my-modal"
                  className="modal-button"
                  src={img.thumbnail}
                  onClick={() => {
                    setShowModal(true);
                    setCurrentImage(img.src);
                  }}
                />
              )}
            </div>
          ))}
        </div>
        {showModal ? (
          <>
            <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto mx-auto">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-2 rounded-t ">
                    <button
                      className="bg-transparent border-0 text-black float-right"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="h-6 w-6 text-3xl block text-red-700">
                        x
                      </span>
                    </button>
                  </div>
                  <div className="relative p-2 flex-auto">
                    <PixelSelect
                      imageURL={currentImage}
                      dimension={250}
                      selectionResolution={5}
                      submitSequence={props.addImageAndTileSequence}
                      numTiles={props.numTiles}
                      closeModal={() => setShowModal(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Grid;
