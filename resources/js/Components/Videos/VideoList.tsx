import { IVideo } from '@/types';
import { Link, useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';

interface VideoListProps {
  videos: IVideo[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
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
        <div key={video.id} className="video-item mb-4 flex text-white">
          <div className="video-thumbnail mr-4 rounded border border-white">
            <video controls className="h-32 w-48">
              <source src={video.path} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="video-details flex-1">
            <h3 className="text-lg font-bold">{video.title}</h3>
            <p className="mb-2">
              {video.description ? 'Description:' : ''} {video.description}
            </p>
            <Link href={route('student-reviews.index', { id: video.id })}>
              Reviews
            </Link>
            <form onSubmit={deleteVideo} data-video-id={video.id}>
              <button type="submit" className="text-red-500">
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
