import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IVideo, PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
export default function Reviews() {
  const { props } =
    usePage<PageProps<{ id: string; reviews: any[]; video: IVideo }>>();
  const { id: videoId, reviews, video } = props;

  console.log(props);

  return (
    <AuthenticatedLayout>
      <div className="px-12 py-12 text-white">
        <h1>Reviews</h1>
        <p>Review for video with ID: {videoId}</p>

        <video width="320" height="240" controls>
          <source src={video.path} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="px-12 py-12 text-white">
        <h1>Reviews:</h1>
        <br />
        <ul>
          {reviews.length > 0
            ? reviews.map((review) => (
                <div
                  key={review.id}
                  className="mb-4 w-1/2 rounded-lg border border-white p-4"
                >
                  <p>Sensei: {review.reviewer.name}</p>
                  <p>{review.reviewer?.dojo?.name}</p>
                  <p>
                    <i>{review.status}</i>
                  </p>
                  {review.status !== 'pending' && (
                    <Link
                      href={route('student-reviews.show', {
                        video_id: videoId,
                        review_id: review.id,
                      })}
                    >
                      <button className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700">
                        See Review
                      </button>
                    </Link>
                  )}
                </div>
              ))
            : 'No reviews'}
        </ul>
      </div>
      <div className="px-12 py-12 text-white">
        <Link
          href={route('student-reviews.create', { id: videoId })}
          className="text-white"
        >
          <button className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">
            Create new review request
          </button>
        </Link>{' '}
      </div>
    </AuthenticatedLayout>
  );
}
