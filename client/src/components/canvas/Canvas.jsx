import React, { useEffect, useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import Modal from 'react-modal';
import { createWorker } from "tesseract.js"
import { Buffer } from 'buffer';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
function Canvas({ modalIsOpen, setIsOpen, onResult  }) {
  // const [modalIsOpen, setIsOpen] = React.useState(isOpen);
  const canvasRef = useRef(null);
  const rand = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  const handleSubmit = async () => {
    /* const uri = refDraw[0].current.toDataURL();
    console.log(uri); */
    const data = canvasRef.current.canvasContainer.children[1].toDataURL();
    let imageBuffer = Buffer.from(data.slice(22), "base64");
    const worker = await createWorker({});
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789',
    });
    const { data: { text } } = await worker.recognize(imageBuffer);
    await worker.terminate();
    console.log("text",text)
    console.log("rand",rand)
    if(rand==text){
      console.log("Success");
      onResult(true);
    }
    else{
      console.log("failure")
      onResult(false);
    }

    closeModal()
  };
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >

        <div className="overflow-auto mx-auto" >
          <div className="flex">
            <p className="mx-auto font-bold">please draw : {rand}</p>
          </div>
          <CanvasDraw ref={canvasRef} hideGrid={true} className="mx-auto" />
          <div className="flex">
            <a onClick={() => handleSubmit()} className="btn ml-auto mt-4">Submit</a>
          </div>

        </div>
      </Modal>
    </>
  );
}

export default Canvas;