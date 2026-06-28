import React from 'react';
import './ClipItem.scss';

interface ClipItemProps {
  thumbnailUrl?: string;
  clipTitle?: string;
  clipDate?: string;
  clipDuration?: string;
}

const ClipItem = ({ thumbnailUrl = 'https://placehold.co/640x360', clipTitle = 'Clip Title', clipDate = 'Jan 1', clipDuration = '13 min' } : ClipItemProps) => {
  return (
    <div className="clip-item">
      <div className="thumbnail">
        <img src={thumbnailUrl} alt="" />
      </div>
      <div className="info">
        <h4>{clipTitle}</h4>
        <span className="clip-date">{clipDate}</span>
      </div>
    </div>
  )
}

export default ClipItem