import VideoList from '@/Components/Videos/VideoList';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IVideo, PageProps } from '@/types';
import { Head } from '@inertiajs/react';

interface DashboardProps extends PageProps {
  videos: IVideo[];
}
export default function Dashboard({ videos }: DashboardProps) {
  console.log(videos);
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Dashboard
        </h2>
      }
    >
      <Head title="Home" />

      <div className="px-12 py-12">
        <VideoList videos={videos} />
      </div>
    </AuthenticatedLayout>
  );
}
