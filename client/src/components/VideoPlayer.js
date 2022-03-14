import React from 'react';

export default function VideoPlayer({ setOpen, open, data }) {
  const playVideo = () => {
    setOpen({ video: 'open', autoPlay: '&amp;autoplay=1' });
  };

  return (
    <div className={`box-video ${open.video}`} onClick={playVideo}>
      <div
        className="bg-video"
        style={{
          backgroundImage: `url(${data.banner})`,
        }}
      >
        <div className="bt-play"></div>
      </div>
      <div className="video-container">
        <iframe width="560" height="315" src={data.url} title={data.title} frameBorder="0" allowFullScreen></iframe>
      </div>
    </div>
  );
}
