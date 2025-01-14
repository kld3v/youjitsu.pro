<?php

namespace App\Http\Controllers;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
        
        $videos = $user->videos->map(function ($video) {
            $video->url = Storage::url($video->path);
            Log::info($video);
            return $video;
        });
    
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

        $request->validate([
            'video' => 'required|mimes:mp4,mov,avi|max:102400'
        ]);

        $userId = Auth::id();

        try {
            // $path = $request->file('video')->store('jiujitsu-videos', 'public');
            $path = Storage::disk('s3')->put('videos', $request->file('video'));

            $video = new Video([
                'path' => $path,
                'title' => $request->input('title', 'Untitled Video'),
                'description' => $request->input('description', ''),
                'user_id' => $userId,
            ]);

            $video->save();

            $url = Storage::url($path);
            Log::info('Video URL: ' . $url);
            return response()->json(['message' => 'Video uploaded successfully', 'url' => $url]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to upload video', 'message' => $e->getMessage()], 500);
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
        Storage::disk('s3')->delete($video->path);
        $video->delete(); // This will perform a soft delete if the Video model uses the SoftDeletes trait

    return redirect()->route('videos.index');
    } catch (\Exception $e) {
        return response()->json(['error' => 'Failed to delete video', 'message' => $e->getMessage()], 500);
    }
    }
}