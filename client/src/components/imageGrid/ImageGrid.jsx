import React from 'react';
import Grid from './Grid';

const thumbnailSide = 256;

const imageURLs = [
  'https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg',
  'https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg',
  'https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg'
]

const images = []

for(let i=0; i< imageURLs.length; i++) {
  images.push({
    id: i+1,
    src: imageURLs[i],
    thumbnailHeight: thumbnailSide,
    thumbnailWidth: thumbnailSide
  })
}

function ImageGrid() {
  return (
    <div className="mx-8">
      <Grid images={images}/>
    </div>
  )
}

export default ImageGrid