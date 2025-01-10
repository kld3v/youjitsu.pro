import SelectDojo from '@/Components/Submission/SelectDojo';
import SelectReviewer from '@/Components/Submission/SelectReviewer';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Dojo, PageProps } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

export default function CreateSubmission() {
  const { props } =
    usePage<
      PageProps<{ id: string; video: any; dojos: Dojo[]; reviewers: any[] }>
    >();
  const { id: videoId, video, dojos, reviewers } = props;
  const [suggestedReviewers, setSuggestedReviewers] = useState<any[]>([]);

  const { data, post, errors, processing, setData, reset } = useForm({
    dojo_id: '',
    reviewer_id: '',
    notes: '',
  });

  const { dojo_id, reviewer_id } = data;

  useEffect(() => {
    if (dojo_id) {
      const reviewersArray = reviewers.filter(
        (reviewer) => reviewer?.dojo_id === dojo_id,
      );
      setSuggestedReviewers(reviewersArray);
    } else {
      setSuggestedReviewers([]);
    }
  }, [dojo_id]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!dojo_id || !reviewer_id) {
      alert('Please select a dojo and a reviewer');
      return;
    }
    setData('dojo_id', dojo_id);
    setData('reviewer_id', reviewer_id);
    post(route('reviews.store', { id: videoId }), {
      onSuccess: () => {
        reset();
        setData('dojo_id', '');
        setData('reviewer_id', '');
        alert('Submission created successfully');
      },
      onError: (err) => {
        console.log(err);
        alert('Submission failed');
      },
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="grid grid-cols-2 gap-6 space-y-4 px-12 py-12 text-white">
        <div className="w-full">
          <h1 className="text-xl">Submit Video For Review</h1>
          <p>Submit video for review with ID: {videoId}</p>
          <SelectDojo dojos={dojos} setData={setData} />
          {dojo_id && <p>you have selected dojo id: {dojo_id}</p>}
          <SelectReviewer
            suggestedReviewers={suggestedReviewers}
            setData={setData}
          />
          {reviewer_id && <p>you have selected reviewer id: {reviewer_id}</p>}

          <div>
            <textarea
              className="mt-4 w-full rounded border border-gray-300 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Notes"
              onChange={(e) => setData('notes', e.target.value)}
            ></textarea>
          </div>

          <div>
            <button
              onClick={submit}
              disabled={processing}
              className="my-2 inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
            >
              {processing ? 'Submitting...' : 'Submit video for review'}
            </button>
          </div>
        </div>
        <div className="w-full">
          <video controls className="w-full rounded-lg" src={video.url}></video>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
