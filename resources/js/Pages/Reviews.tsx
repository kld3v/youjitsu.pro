import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
export default function Reviews() {
  const { props } = usePage<PageProps<{ id: string; reviews: any[] }>>();
  const { id: videoId, reviews } = props;

  console.log(props);

  return (
    <AuthenticatedLayout>
      <div className="px-12 py-12 text-white">
        <h1>Review</h1>
        <p>Review for video with ID: {videoId}</p>
      </div>
      <div className="px-12 py-12 text-white">
        <h1>Reviews:</h1>
        <br />
        <ul>
          {reviews.length > 0
            ? reviews.map((review) => <div key={review.id}>Review </div>)
            : 'No reviews'}
        </ul>
      </div>
      <div className="px-12 py-12 text-white">
        <Link
          href={route('submission.show', { id: videoId })}
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
