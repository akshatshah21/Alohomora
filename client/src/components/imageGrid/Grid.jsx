import React, { useState } from "react";
import { PixelSelect } from "../pixelSelect";

const Grid = (props) => {

  const submitSequence = (seq) => console.log(seq);

  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(false);
  return (
    <>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
        {props.images.map((img) => (
          <div key={img.id}>
            <img htmlFor="my-modal" className="modal-button" src={img.thumbnail} onClick={() => {
              setShowModal(true)
              setCurrentImage(img.src)
            }}/>
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
                  <PixelSelect imageURL={currentImage} dimension={250} selectionResolution={5} submitSequence={submitSequence} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Grid;