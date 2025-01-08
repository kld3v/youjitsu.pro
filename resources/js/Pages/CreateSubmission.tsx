import SelectDojo from '@/Components/Submission/SelectDojo';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function CreateSubmission() {
  const { props } =
    usePage<PageProps<{ id: string; video: any; dojos: any[] }>>();
  const { id: videoId, video, dojos } = props;

  const [selectedDojoId, setSelectedDojoId] = useState('');
  const [selectedReviewerId, setSelectedReviewerId] = useState('');

  console.log(props);

  return (
    <AuthenticatedLayout>
      <div className="grid grid-cols-2 gap-6 space-y-4 px-12 py-12 text-white">
        <div className="w-full">
          <h1 className="text-xl">Submit Video</h1>
          <p>Submit video for review with ID: {videoId}</p>
          <SelectDojo dojos={dojos} setSelectedDojo={setSelectedDojoId} />
          {selectedDojoId && <p>you have selected dojo id: {selectedDojoId}</p>}
          <input
            type="text"
            className="mt-4 w-full rounded border border-gray-300 bg-gray-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring"
            placeholder="Select Reviewer"
          />

          <div>
            <Link
              href={route('submission.store', { id: videoId })}
              className="inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
            >
              Submit video for review
            </Link>
          </div>
        </div>
        <div className="w-full">
          <video controls className="w-full rounded-lg" src={video.url}></video>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
