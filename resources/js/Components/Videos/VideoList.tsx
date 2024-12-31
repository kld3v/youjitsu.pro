import { useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

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

const VideoList: React.FC<VideoListProps> = ({
  videos,
}: {
  videos: Video[];
}) => {
  const { delete: destroy } = useForm();

  const deleteVideo: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const videoId = (e.target as HTMLFormElement).dataset.videoId;

    destroy(route('videos.destroy', { id: videoId }), {
      preserveScroll: true,
    });
  };

  return (
    <div className="video-list">
      {videos.map((video) => (
        <div key={video.id} className="video-item">
          <h3>{video.title}</h3>
          <video controls>
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <form onSubmit={deleteVideo} data-video-id={video.id}>
            <button type="submit">Delete</button>
          </form>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
