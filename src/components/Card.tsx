import React from 'react';

const Card = () => {

    const handleClick = () => {
        console.log('Button clicked');
    };

  return (
    <div>
        <p>Card</p>
        <button onClick={handleClick} className="test">Button</button>
    </div>
  )
}

export default Card