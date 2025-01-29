import axios from 'axios';
import React, { useState } from 'react';

const VideoUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('description', description);
      setLoading(true);
      setMessage('');
      try {
        const response = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        setMessage('Upload successful!');
        // Reset the form
        setFile(null);
        setTitle('');
        setDescription('');
      } catch (error) {
        setMessage('Error uploading file.');
        console.error('Error uploading file:', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 5000);
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
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter video title"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="video/*"
          className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
        />
      </div>
      <div className="mb-4">
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Enter video description"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload Video'}
      </button>
      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )}
    </form>
  );
};

export default VideoUploadForm;
