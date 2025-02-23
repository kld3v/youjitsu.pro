<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Review;
use Illuminate\Support\Facades\Storage;
use App\Models\Video;
use Illuminate\Support\Facades\Log;

class ManageReviewsController extends Controller
{
    public function index () {
        // Get all reviews for the current user where their user_id is the reviewer_id
        $reviews = Auth::user()->reviews;

        // Load the related models
        $reviews->load([
            'video',
            'video.user:id,name', // Load only 'id' and 'name' for the user
        ]);

        
        
        return Inertia::render('ManageReviews/Index', [
            'reviews' => $reviews,
        ]);
    }

    public function create ($reviewId) {
        $review = Review::find($reviewId);

        $review->load([
            'video',
            'video.user:id,name' // Load only 'id' and 'name' for the user
        ]);

        $review->video->url = Storage::url($review->video->path);

        return Inertia::render('ManageReviews/Create', [
            'review' => $review
        ]);
    }

    public function store (Request $request, $id) {
        // does this review id belong to the current user?
        $review = Review::where('id', $id)->where('reviewer_id', Auth::id())->first();
        if (!$review) {
            return redirect()->route('manage-reviews.index')->withErrors('You do not have permission to perform this action.');
        }

        // validate video from request (add webm to the list of allowed file types)
        $request->validate([
            'video' => 'required|file|mimes:mp4,mov,avi,webm|max:102400',
            'feedback'=> 'string|max:1024',
            
        ]);
        
        $file = $request->file('video');
        try {

            // Generate a unique filename to avoid overwrites
            $filename = uniqid('video_review_') . '.' . $file->getClientOriginalExtension();
                
            // Upload the file to DigitalOcean Spaces
            $success = Storage::disk('spaces')->put($filename, $file->get(), 'public');
            Log::info('File uploaded? ' . $success ? 'Yes' : 'No');

            // Generate a public URL for the uploaded video
            $url = Storage::disk('spaces')->url($filename);
            Log::info('Video URL: ' . $url);
            
            $video = Video::create([
                'path' => $url,
                'user_id' => Auth::id(),
                'is_review' => true
            ]);
            
            $review->update([
                'status' => 'reviewed',
                'review_video_id' => $video->id,
                'feedback' => $request->input('feedback', '')
            ]);

        } 
        catch (\Throwable $th) {
            Log::error($th);
            return response()->json(['error' => 'Failed to upload video', 'message' => $th->getMessage()], 500);
           
        }


        return response()->json(['message' => 'Video uploaded successfully', 201]);
    }
}