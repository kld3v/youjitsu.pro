import axios from 'axios';
import React, { useState } from 'react';

const VideoUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('video', file);
      try {
        console.log(formData);
        return;
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-lg bg-white p-4 shadow-md"
    >
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*"
          className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Upload Video
      </button>
    </form>
  );
};

export default VideoUploadForm;
