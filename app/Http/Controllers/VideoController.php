<?php

namespace App\Http\Controllers;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use FFMpeg;
use FFMpeg\Format\Video\X264;


class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $user = Auth::user();
        
        $videos = $user->videos()->where('is_review', false)->get();
    
        return Inertia::render('Dashboard', [
            'videos' => $videos,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
    
        // Validate input
        $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi|max:15728640', // Max 150MB
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);
    
        try {
            Log::info('Starting video upload process...');
    
            $file = $request->file('video');
            if (!$file) {
                throw new \Exception('No video file found in the request.');
            }
    
            // Generate unique filenames
            $rawFilename = uniqid('raw_') . '.mp4';
            $compressedFilename = uniqid('compressed_') . '.mp4';
    
            // Save raw file locally to reduce Spaces traffic
            $rawPath = storage_path('app/temp/' . $rawFilename);
            $file->move(storage_path('app/temp/'), $rawFilename);
    
            Log::info("Raw video saved locally: {$rawPath}");
    
            // Initialize FFMpeg with correct binary paths
            $ffmpeg = FFMpeg\FFMpeg::create([
                'ffmpeg.binaries'  => storage_path('app/workspace/bin/ffmpeg'),  // Full path to ffmpeg binary
                'ffprobe.binaries' => storage_path('app/workspace/bin/ffprobe'), // Full path to ffprobe binary
                'timeout'          => 7200, // The timeout for the underlying process
                'ffmpeg.threads'   => 12,   // The number of threads that FFMpeg should use
            ]);
    
            // Open the video file for processing
            $video = $ffmpeg->open($rawPath);
    
            // Export the video in desired format
            $format = new X264('aac', 'libx264');  // Specify the video and audio codec
            $video->save($format, storage_path('app/temp/' . $compressedFilename));
    
            Log::info("Compression complete: {$compressedFilename}");
    
            // Upload compressed file to Spaces
            $compressedPath = storage_path('app/temp/' . $compressedFilename);
            Storage::disk('spaces')->put($compressedFilename, file_get_contents($compressedPath), 'public');
            $compressedUrl = Storage::disk('spaces')->url($compressedFilename);
    
            Log::info("Compressed video uploaded to Spaces: {$compressedUrl}");
    
            // Clean up local files
            unlink($rawPath);
            unlink($compressedPath);
            Log::info("Local temp files deleted.");
    
            // Save video record to DB
            $videoRecord = new Video([
                'path' => $compressedUrl,
                'title' => $request->input('title', 'Untitled Video'),
                'description' => $request->input('description', ''),
                'user_id' => Auth::id(),
            ]);
            $videoRecord->save();
    
            return response()->json([
                'message' => 'Video uploaded and compressed successfully',
                'url' => $compressedUrl,
            ], 201);
    
        } catch (\Exception $e) {
            Log::error('Error uploading video: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to upload video',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    
    

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    if (!Auth::check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }

    $user = Auth::user();
    $video = Video::find($id);

    if (!$video || $video->user_id !== $user->id) {
        return response()->json(['error' => 'Video not found or unauthorized'], 404);
    }

    try {
        Storage::disk('spaces')->delete($video->path);
        $video->delete(); // This will perform a soft delete if the Video model uses the SoftDeletes trait

    return redirect()->route('videos.index');
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete video', 'message' => $e->getMessage()], 500);
    }
    }
}