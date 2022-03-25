import React, { useEffect, useRef, useState } from "react";

function PixelSelect({
  imageURL,
  dimension,
  selectionResolution,
  submitSequence,
  numTiles,
  closeModal,
}) {
  const selectedTiles = useRef([]);

  const handleTileClick = (e) => {
    const selectedTile = document.getElementById(e.target.id);
    const selectedTileId = e.target.id;
    if (
      selectedTiles.current.includes(selectedTileId) ||
      selectedTiles.current.length >= numTiles
    ) {
      // selectedTile.classList.remove("border-2")
      // selectedTile.classList.remove("border-red-500");
      // selectedTiles.current = selectedTiles.current.filter(id => id !== selectedTileId);

      // Don't allow deselect, it messes up the sequence
      return;
    } else {
      selectedTile.classList.add("border-2");
      selectedTile.classList.add("border-red-500");
      selectedTiles.current.push(selectedTileId);
    }
  };

  useEffect(() => {
    let image = new Image(dimension, dimension);
    image.src = imageURL;
    image.crossOrigin = "anonymous";

    const gridContainer = document.querySelector("#selection-grid");

    let tileDimension = dimension / selectionResolution;
    image.addEventListener("load", () => {
      for (let row = 0, y = 0; y < dimension; y += tileDimension, row++) {
        for (let col = 0, x = 0; x < dimension; x += tileDimension, col++) {
          const canvas = document.createElement("canvas");
          canvas.width = tileDimension;
          canvas.height = tileDimension;
          canvas.id = `${row}_${col}`;
          canvas.addEventListener("click", handleTileClick);
          const ctx = canvas.getContext("2d");

          ctx.drawImage(image, x, y, 100, 100, 0, 0, 100, 100);
          console.log(row, col);
          gridContainer.appendChild(canvas);
        }
      }
    });
  }, [imageURL, dimension, selectionResolution]);

  return (
    <div className="mx-auto flex flex-col">
      <span>
        Select a sequence of tiles. If you don't want this image or if you want
        to change your sequence, click the cross icon above.
      </span>
      <div
        id="selection-grid"
        className="grid grid-cols-5 gap-x-0 gap-y-2 w-96 mx-auto"
      ></div>

      <button
        className={`btn w-1/4 my-4 mx-auto ${
          selectedTiles.length === numTiles ? "disabled" : ""
        }`}
        onClick={() => {
          submitSequence(imageURL, selectedTiles.current);
          closeModal();
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default PixelSelect;
