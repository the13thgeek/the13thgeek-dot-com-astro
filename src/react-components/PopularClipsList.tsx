import React from 'react';
import './PopularLipsList.scss';
import ClipItem from './ClipItem';

const PopularClipsList = () => {
  return (
    <div className='clips-list'>
      <ClipItem />
      <ClipItem />
      <ClipItem />
    </div>
  )
}

export default PopularClipsList