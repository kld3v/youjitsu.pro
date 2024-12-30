<?php

namespace App\Http\Controllers;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $request->validate([
            'video' => 'required|mimes:mp4,mov,avi|max:102400'
        ]);

        if (!Auth::check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $userId = Auth::id();

        try {
            $path = $request->file('video')->store('jiujitsu-videos', 'public');

            $video = new Video([
                'path' => $path,
                'title' => $request->input('title', 'Untitled Video'),
                'user_id' => $userId,
                // Other metadata like description, etc.
            ]);

            $video->save();

            $url = Storage::url($path);
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
    }
}