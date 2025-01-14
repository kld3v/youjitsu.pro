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
  const handleMouseDown = (e: React.MouseEvent) => {
    // if the canvas is empty, return
    if (!canvasRef.current) return;

    // get the canvas context - this means we can draw on the canvas. more techincally, we can draw on the 2d plane of the canvas.
    const ctx = canvasRef.current.getContext('2d');

    // if the context is null, return. why woudl the context be null? if the canvas is not visible, or if the canvas is not supported by the browser.
    if (!ctx) return;

    // Set the drawing flag to true.
    setIsDrawing(true);

    // Store the starting position
    // offsetX and offsetY are the coordinates of the mouse pointer relative to the target element (canvas)
    // eg if the canvas is at 0,0 and the mouse is at 10,10, offsetX and offsetY will be 10,10
    // meaning the mouse is 10px away from the top and 10px away from the left of the canvas
    startX.current = e.nativeEvent.offsetX;
    startY.current = e.nativeEvent.offsetY;

    // Begin the drawing path (for freehand drawing)
    if (tool === 'pen') {
      // Begin the path
      ctx.beginPath();
      // Move the pen to the starting point
      ctx.moveTo(startX.current, startY.current);
    }

    if (tool === 'circle') {
      ctx.beginPath();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen') {
      // Freehand drawing
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
    } else if (tool === 'rectangle') {
      // Rectangle drawing
      const width = e.nativeEvent.offsetX - startX.current;
      const height = e.nativeEvent.offsetY - startY.current;

      // Clear the canvas overlay before drawing new shapes
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw the rectangle
      ctx.strokeRect(startX.current, startY.current, width, height);
    } else if (tool === 'circle') {
      // Clear the canvas before redrawing to avoid overlapping
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Calculate the radius based on the distance from start to current mouse position
      // bit of pythagoras theorem at work here
      const radius = Math.abs(e.nativeEvent.offsetY - startY.current);

      // Draw the circle
      ctx.beginPath();
      ctx.arc(startX.current, startY.current, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    setIsDrawing(false);

    // Finalize the path
    if (tool === 'pen') {
      ctx.closePath();
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
        canvas.style.cursor = 'pen';
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
        alert('Video uploaded successfully!');
        setTimeout(() => {
          window.location.href = route('manage-reviews.index');
        }, 3000);
      } else {
        console.error('Failed to upload video:', response);
        alert('Failed to upload video!');
      }
    } catch (error) {
      console.error('Error during video upload:', error);
      alert('An error occurred while uploading the video.');
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
          Manage Reviews
        </h2>
      }
    >
      <div className="px-12 py-12 text-white">
        <p>Manage review with id: {review.id}</p>
      </div>
      <div
        id="review-studio"
        className="relative grid h-full justify-items-center rounded-lg p-8"
      >
        {/* Video Player */}
        <div className="relative">
          <video ref={videoRef} controls className="relative z-[1]">
            <source src={review.video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Canvas Overlay */}
          <canvas
            id="annotation-canvas"
            ref={canvasRef}
            // add style

            style={tool !== null ? { zIndex: 2 } : { zIndex: 0 }}
            className="absolute border border-green-500"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
        </div>
        <div className="absolute right-10 top-0 bg-black bg-opacity-50 p-4 text-white">
          <p>
            Notes from {review.video.user.name}: <br /> {review?.notes}
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

        <div>
          <video
            className="mt-4 w-1/2 justify-center rounded-lg border border-gray-300"
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
