import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, SenseiReview } from '@/types';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function CreateSenseiReview() {
  const { props } = usePage<PageProps<{ id: string; review: SenseiReview }>>();
  const { review } = props;
  console.log(props);

  // References for video, recording, and controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [submissionSuccessful, setSubmissionSuccessful] = useState(false); // Track submission state
  const [hasFinishedRecording, setHasFinishedRecording] = useState(false);
  /**
   * Start Recording
   */
  const startRecording = async () => {
    if (!videoRef.current) return;

    // Capture video stream
    const videoStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    console.log('Captured video stream:', videoStream);

    // Capture audio stream
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    console.log('Captured audio stream:', audioStream);

    // Combine streams (video + audio)
    const combinedStream = new MediaStream([
      ...videoStream.getTracks(),
      ...audioStream.getTracks(),
    ]);

    console.log('Video Tracks:', videoStream.getTracks());
    console.log('Audio Tracks:', audioStream.getTracks());
    console.log('Combined Stream Tracks:', combinedStream.getTracks());

    // Initialize MediaRecorder
    const recorder = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm',
    });

    // Handle data availability
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
        console.log('Chunks collected in ref:', recordedChunksRef.current);
      }
    };

    // Handle recording stop
    recorder.onstop = () => {
      console.log('Recording stopped:', recordedChunksRef.current);

      // Create a Blob from the ref chunks
      const blob = new Blob(recordedChunksRef.current, {
        type: recorder.mimeType,
      });
      console.log('Final Blob:', blob);

      if (previewRef.current) {
        previewRef.current.src = URL.createObjectURL(blob);
        previewRef.current.hidden = false;
      }
    };

    // Start recording
    recorder.start();
    setMediaRecorder(recorder);
  };

  /**
   * Pause/Resume Recording
   */
  const togglePause = () => {
    if (mediaRecorder) {
      if (mediaRecorder.state === 'recording') {
        mediaRecorder.pause();
      } else if (mediaRecorder.state === 'paused') {
        mediaRecorder.resume();
      }
    }
  };

  /**
   * Stop Recording
   */
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setMediaRecorder(null);
      setHasFinishedRecording(true);
    }
  };

  useEffect(() => {
    console.log('Current recordedChunks:', recordedChunks);
  }, [recordedChunks]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'rectangle' | 'circle' | null>(null);
  // To store the starting point of the shape
  const startX = useRef(0);
  const startY = useRef(0);

  const getAdjustedCoordinates = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width; // Scale factor for X
    const scaleY = canvasRef.current.height / rect.height; // Scale factor for Y

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getAdjustedCoordinates(e);
    startX.current = x;
    startY.current = y;

    if (tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    if (tool === 'circle') {
      ctx.beginPath();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const { x, y } = getAdjustedCoordinates(e);

    if (tool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'rectangle') {
      const width = x - startX.current;
      const height = y - startY.current;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.strokeRect(startX.current, startY.current, width, height);
    } else if (tool === 'circle') {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      const radius = Math.sqrt(
        (x - startX.current) ** 2 + (y - startY.current) ** 2,
      );
      ctx.beginPath();
      ctx.arc(startX.current, startY.current, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);

    if (tool === 'pen' && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.closePath();
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  useEffect(() => {
    const syncCanvasToVideo = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Set canvas dimensions to match video dimensions
        // sets the pixel dimensions of the canvas from the video dimensions
        // Internal vs. Display: The internal dimensions (canvas.height) are crucial for drawing operations, ensuring your graphics are drawn with the correct resolution. The display dimensions (canvas.style.height) are necessary for layout purposes, ensuring the canvas fits nicely within your page's design without overlapping other elements.
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight - 40;

        // Align canvas position and size with the video
        const rect = video.getBoundingClientRect();
        console.log(rect);
        canvas.style.left = `0px`;
        canvas.style.top = `0px`;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height - 40}px`;
        canvas.style.cursor = 'crosshair';
      }
    };

    // Add an event listener for when the video metadata is loaded
    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', syncCanvasToVideo);
    }

    // Cleanup listener on component unmount
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener(
          'loadedmetadata',
          syncCanvasToVideo,
        );
      }
    };
  }, [videoRef, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (tool) {
      if (canvas) {
        canvas.style.zIndex = '2';
      }
    } else {
      if (canvas) {
        canvas.style.zIndex = '0';
      }
    }
  }, [tool]);

  const canvasClass = (toolType: string) =>
    `border px-4 py-2 ${tool === toolType ? 'bg-gray-200' : ''} hover:border-green-200`;

  const submitReview = async () => {
    if (!previewRef.current?.src) {
      alert('No video to submit!');
      return;
    }

    // Convert the video source to a Blob
    const blob = await fetch(previewRef.current.src).then((res) => res.blob());

    const formData = new FormData();
    formData.append('video', blob, 'review.webm');

    try {
      const response = await axios.post(
        `/manage-reviews/${review.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        console.log('Video uploaded successfully:', response.data);
        setSubmissionSuccessful(true);
      } else {
        console.error('Failed to upload video:', response);
        alert('Failed to upload video!');
      }
    } catch (error) {
      console.error('Error during video upload:', error);
      alert('An error occurred while uploading the video.');
    }
  };

  if (submissionSuccessful) {
    return (
      <AuthenticatedLayout>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
          <h1 className="text-2xl font-bold text-green-600">
            Video Submitted Successfully!
          </h1>
          <p className="mt-2 text-gray-700">Your review has been submitted.</p>
          <button
            className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            onClick={() =>
              (window.location.href = route('manage-reviews.index'))
            } // Navigate to the dashboard
          >
            Back to Dashboard
          </button>
        </div>
      </AuthenticatedLayout>
    );
  }
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Creating review for {review.video?.user.name}
        </h2>
      }
    >
      <div
        id="review-studio"
        className="flex flex-col items-center justify-center p-8"
      >
        {/* Video Player */}
        <div className="relative max-w-5xl">
          <video ref={videoRef} controls className="relative z-[1]">
            <source src={review.video?.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Canvas Overlay */}
          <canvas
            ref={canvasRef}
            style={tool !== null ? { zIndex: 2 } : { zIndex: 0 }}
            className="absolute border border-green-500"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </div>
        <div className="right-10 top-0 bg-black bg-opacity-50 p-4 text-white">
          <p>
            Notes from {review.video?.user.name}: <br /> {review?.notes}
          </p>
        </div>

        {/* Toolbar */}
        <div id="controls" className="mt-4 flex space-x-4">
          <button
            className={canvasClass('pen')}
            onClick={() => {
              tool === 'pen' ? setTool(null) : setTool('pen');
            }}
          >
            Pen
          </button>
          <button
            className={canvasClass('rectangle')}
            onClick={() => {
              tool === 'rectangle' ? setTool(null) : setTool('rectangle');
            }}
          >
            Rectangle
          </button>
          <button
            className={canvasClass('circle')}
            onClick={() => {
              tool === 'circle' ? setTool(null) : setTool('circle');
            }}
          >
            Circle
          </button>
          <button
            className="border px-4 py-2 hover:border-red-200"
            onClick={clearCanvas}
          >
            Clear Annotations
          </button>
        </div>

        {/* Controls */}
        <div id="controls" className="mt-4">
          <button
            className="mr-2 border px-4 py-2"
            onClick={startRecording}
            disabled={!!mediaRecorder}
          >
            Start Recording
          </button>
          <button
            className="mr-2 border px-4 py-2"
            onClick={togglePause}
            disabled={!mediaRecorder}
          >
            Pause/Resume
          </button>
          <button
            className="border px-4 py-2"
            onClick={stopRecording}
            disabled={!mediaRecorder}
          >
            Stop Recording
          </button>
        </div>

        {/* Recording Preview */}

        <div className="max-w-5xl" hidden={!hasFinishedRecording}>
          <h1 className="text-xl text-white">Preview your review</h1>
          <video
            className="mt-4 rounded-lg border border-gray-300"
            ref={previewRef}
            id="recording-preview"
            controls
            hidden
          ></video>

          <div className="mt-4">
            <button
              onClick={submitReview}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
