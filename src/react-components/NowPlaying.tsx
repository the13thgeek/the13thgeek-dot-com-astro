import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
import './NowPlaying.scss';
import NpData from '../data/nowplaying.json';

const NowPlaying = () => {
  return (
    <div className="nowplaying-carousel">
      <Swiper 
        modules={[Autoplay,Pagination]}
        centeredSlides={true}
        slidesPerView={'auto'}
        watchSlidesProgress
        spaceBetween={24}
        loop
        speed={500}
        pagination={{el: '.np-nav',clickable: true}}
        autoplay={{delay: 5000, disableOnInteraction: false}}
      >
        {NpData.filter(slide => slide.show_game).map((slide,idx) =>
          <SwiperSlide key={idx} className='slide-item'>
            <div className="card-content">
              <img src={`/assets/twitch/now-playing/slide-${slide.game_id}.jpg`} alt="" className="bg" />
              <div className="data">
                <img src={`/assets/twitch/now-playing/logo-${slide.game_id}.png`} alt={slide.game_title} className="gametitle" />
                <h3>{slide.game_title}</h3>
                <p>{slide.description}</p>
                <span className="schedule">{slide.schedule ? ('Streams ' + slide.schedule) : 'Streaming in Regular Rotation' }</span>
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>
        
      <div className="np-nav"></div>
    </div>
  )
}

export default NowPlaying