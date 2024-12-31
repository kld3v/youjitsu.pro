import React from 'react';

export interface Video {
  id: number;
  title: string;
  path: string;
  description?: string;
  url: string;
}

interface VideoListProps {
  videos: Video[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <div key={video.id} className="video-item">
          <h3>{video.title}</h3>
          <video controls src={video.url} className="video-player" />
        </div>
      ))}
    </div>
  );
};

export default VideoList;
