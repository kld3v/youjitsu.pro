import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, StudentReview } from '@/types';
import { usePage } from '@inertiajs/react';
export default function Show() {
  const { props } =
    usePage<
      PageProps<{ id: string; review: StudentReview; student_video: any }>
    >();

  const { review, student_video } = props;
  console.log(props);

  return (
    <AuthenticatedLayout>
      <div className="px-12 py-12 text-white">
        <h1>Review from {review.reviewer.name} </h1>
        <video controls className="h-full w-1/2">
          <source src={review.review_video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p>{review.feedback}</p>
      </div>
    </AuthenticatedLayout>
  );
}
