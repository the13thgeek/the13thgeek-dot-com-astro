import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import "swiper/css";
import "swiper/css/pagination";
import './NowPlaying.scss';

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
        <SwiperSlide>
          <div className="card-content">
            <img src="https://placehold.co/1280x720" alt="" className="bg" />
            <div className="data">
              <img src="https://placehold.co/200x75" alt="" className="gametitle" />
              <h3>Lorem Ipsum</h3>
              <span className="schedule">Streams Fridays @ 8pm EST</span>
              <p>Superheroes, supervillains, and super chaos! Watch as @the13thgeek assembles the ultimate team... or gets yeeted across the battlefield.</p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card-content">
            <img src="https://placehold.co/1280x720" alt="" className="bg" />
            <div className="data">
              <img src="https://placehold.co/200x75" alt="" className="gametitle" />
              <h3>Lorem Ipsum</h3>
              <span className="schedule">Streams Fridays @ 8pm EST</span>
              <p>Superheroes, supervillains, and super chaos! Watch as @the13thgeek assembles the ultimate team... or gets yeeted across the battlefield.</p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card-content">
            <img src="https://placehold.co/1280x720" alt="" className="bg" />
            <div className="data">
              <img src="https://placehold.co/200x75" alt="" className="gametitle" />
              <h3>Lorem Ipsum</h3>
              <span className="schedule">Streams Fridays @ 8pm EST</span>
              <p>Superheroes, supervillains, and super chaos! Watch as @the13thgeek assembles the ultimate team... or gets yeeted across the battlefield.</p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card-content">
            <img src="https://placehold.co/1280x720" alt="" className="bg" />
            <div className="data">
              <img src="https://placehold.co/200x75" alt="" className="gametitle" />
              <h3>Lorem Ipsum</h3>
              <span className="schedule">Streams Fridays @ 8pm EST</span>
              <p>Superheroes, supervillains, and super chaos! Watch as @the13thgeek assembles the ultimate team... or gets yeeted across the battlefield.</p>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="card-content">
            <img src="https://placehold.co/1280x720" alt="" className="bg" />
            <div className="data">
              <img src="https://placehold.co/200x75" alt="" className="gametitle" />
              <h3>Lorem Ipsum</h3>
              <span className="schedule">Streams Fridays @ 8pm EST</span>
              <p>Superheroes, supervillains, and super chaos! Watch as @the13thgeek assembles the ultimate team... or gets yeeted across the battlefield.</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="np-nav"></div>
    </div>
  )
}

export default NowPlaying