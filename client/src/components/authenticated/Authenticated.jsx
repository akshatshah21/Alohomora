import React from 'react';
import Confetti from 'react-confetti';

function Authenticated() {
  return (
    <div className="">
      <h1 className="text-3xl text-center my-4">You're in</h1>
      <Confetti />
    </div>
  )
}

export default Authenticated