import React, { useState } from "react";

const Grid = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(false);
  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {props.images.map((img) => (
          <div key={img.id}>
            <img for="my-modal" class="modal-button" src={img.src} onClick={() => {
              setShowModal(true)
              setCurrentImage(img.src)
            }}/>
          </div>
        ))}
      </div>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto mx-auto max-w-3xl">
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
                  <img src={currentImage} />
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