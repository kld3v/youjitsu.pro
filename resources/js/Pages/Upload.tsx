import VideoUploadForm from '@/Components/Upload/VideoUploadForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Upload Video
        </h2>
      }
    >
      <Head title="Home" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
            <VideoUploadForm />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
