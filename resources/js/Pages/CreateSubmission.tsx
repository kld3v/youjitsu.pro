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
  const [selectedDojoId, setSelectedDojoId] = useState('');
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [suggestedReviewers, setSuggestedReviewers] = useState<any[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedDojoId) {
      const reviewersArray = reviewers.filter(
        (reviewer) => reviewer?.dojo_id === selectedDojoId,
      );
      setSuggestedReviewers(reviewersArray);
    } else {
      setSuggestedReviewers([]);
    }
  }, [selectedDojoId]);

  const { post, errors, processing, recentlySuccessful } = useForm({
    dojo_id: selectedDojoId,
    reviewer_id: selectedReviewerId,
    notes,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!selectedDojoId || !selectedReviewerId) {
      alert('Please select a dojo and a reviewer');
      return;
    }

    // testing
    alert(
      'selectedDojoId: ' +
        selectedDojoId +
        ' selectedReviewerId: ' +
        selectedReviewerId +
        ' notes: ' +
        notes,
    );
    return;
    post(route('submission.store', { id: videoId }));
  };

  return (
    <AuthenticatedLayout>
      <div className="grid grid-cols-2 gap-6 space-y-4 px-12 py-12 text-white">
        <div className="w-full">
          <h1 className="text-xl">Submit Video For Review</h1>
          <p>Submit video for review with ID: {videoId}</p>
          <SelectDojo dojos={dojos} setSelectedDojo={setSelectedDojoId} />
          {selectedDojoId && <p>you have selected dojo id: {selectedDojoId}</p>}
          <SelectReviewer
            suggestedReviewers={suggestedReviewers}
            setSelectedReviewerId={setSelectedReviewerId}
          />
          {selectedReviewerId && (
            <p>you have selected reviewer id: {selectedReviewerId}</p>
          )}

          <div>
            <textarea
              className="mt-4 w-full rounded border border-gray-300 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Notes"
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div>
            <button
              onClick={submit}
              className="my-2 inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
            >
              Submit video for review
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
