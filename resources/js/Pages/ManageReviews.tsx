import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, SenseiReview } from '@/types';
import { usePage } from '@inertiajs/react';
export default function ManageReviews() {
  const { props } =
    usePage<
      PageProps<{ id: string; reviews: SenseiReview[]; video: { url: string } }>
    >();

  const { reviews } = props;

  console.log(props);
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Manage Reviews
        </h2>
      }
    >
      <div className="px-12 py-12 text-white">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border-3 grid grid-cols-2 border border-solid p-4"
            >
              <div>
                <p>Review request for {review.video.user.name}</p>
                <p>
                  User notes:
                  {review.notes && review.notes.length > 50
                    ? review.notes.slice(50) + '...'
                    : review.notes}
                </p>
                <p>
                  Video Description:
                  {review.description && review.description}
                </p>
                <p>
                  Video Title:
                  {review.title && review.title}
                </p>
                <p className="font-bold">{review.status}</p>
              </div>
              <div className="grid justify-items-center">
                <video controls className="h-48 w-48">
                  <source src={review.video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          ))
        ) : (
          <div>No reviews</div>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
