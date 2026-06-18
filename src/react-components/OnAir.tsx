import React from 'react';
import ReactIcon from './ReactIcon';
import './OnAir.scss';

const OnAir = () => {
  return (
    <div className="on-air">
      <div className="stream-info">
        <div className="live-badges">
          <div className="badge live-info">
            <ReactIcon decorative id="record" width="16" height="16" /> <span>Now Live</span>
          </div>
          <div className="badge viewer-count">
            <ReactIcon decorative id="users" width="16" height="16" />
            <span>123</span>
          </div>
        </div>
        <div className="twitch-info">
          <div className="stream-titles">
            <h2>Lorem Ipsum</h2>
            <p>Playing <b>Dolor Sit Amet</b></p>
          </div>
          <div className="cta">
            <a href="#">
              <ReactIcon width='16' height='16' decorative id="twitch" />
              <span>Watch</span>
            </a>
          </div>
        </div>
      </div>
      <div className="filmstrip">
        <div className="item">
          <img src="https://placehold.co/640x360" />
          <div className="time">Now</div>
        </div> 
        <div className="item">
          <img src="https://placehold.co/640x360" />
          <div className="time">5 mins back</div>
        </div> 
        <div className="item">
          <img src="https://placehold.co/640x360" />
          <div className="time">10 mins back</div>
        </div> 
      </div>
    </div>
  )
}

export default OnAir