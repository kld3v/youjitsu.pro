import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
export default function Reviews() {
  const { props } =
    usePage<
      PageProps<{ id: string; reviews: any[]; video: { url: string } }>
    >();
  const { id: videoId, reviews, video } = props;

  console.log(props);

  return (
    <AuthenticatedLayout>
      <div className="px-12 py-12 text-white">
        <h1>Reviews</h1>
        <p>Review for video with ID: {videoId}</p>

        <video width="320" height="240" controls>
          <source src={video.url} type="video/mp4" />
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
                  <p>{review.status}</p>
                </div>
              ))
            : 'No reviews'}
        </ul>
      </div>
      <div className="px-12 py-12 text-white">
        <Link
          href={route('submission.create', { id: videoId })}
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
