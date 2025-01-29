import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IVideo, PageProps, StudentReview } from '@/types';
import { usePage } from '@inertiajs/react';
export default function Show() {
  const { props } =
    usePage<
      PageProps<{ id: string; review: StudentReview; student_video: IVideo }>
    >();

  const { review, student_video } = props;
  console.log(props, "show a student's review");

  return (
    <AuthenticatedLayout>
      <div className="px-12 py-12 text-white">
        <h1>Review from {review.reviewer.name} </h1>
        <video controls className="h-full w-1/2">
          <source src={review.review_video.path} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p>{review.feedback}</p>
      </div>
    </AuthenticatedLayout>
  );
}
