import React from 'react';
import Grid from './Grid';

function ImageGrid(props) {
  const images = []
  const thumbnailSide = 256; 
  console.log(props.thumbnails)

  for(let i=0; i< props.imageURLs.length; i++) {
    images.push({
      id: i+1,
      src: props.imageURLs[i],
      thumbnail: props.thumbnails[i],
      thumbnailHeight: thumbnailSide,
      thumbnailWidth: thumbnailSide
    })
  }

  return (
    <div className="mx-8">
      <Grid images={images}/>
    </div>
  )
}

export default ImageGrid