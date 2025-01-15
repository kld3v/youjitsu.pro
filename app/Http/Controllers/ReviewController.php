<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Review;
use App\Models\Video;
use Illuminate\Support\Facades\Storage;
class ReviewController extends Controller
{
    public function index($id)
    {
        $reviews = Review::with([
            'reviewer' => function ($query) {
                $query->select('id', 'name', 'dojo_id'); // Only get the id and name for the reviewer
            },
            'reviewer.dojo' => function ($query) {
                $query->select('id', 'name'); // Only get the id and name for the dojo
            }
        ])->where('video_id', $id)->get();
        
        $video = Video::find($id);
        $video->url = Storage::url($video->path);
        return Inertia::render('StudentReviews/Index', [
            'id' => $id,
            'reviews' => $reviews,
            'video' => $video
        ]);
    }
    
    public function show($video_id, $review_id)
    {
        $student_video = Video::find($video_id);
        $student_video->url = $student_video->url;
        

        $review = Review::with([
            'reviewer' => function ($query) {
                $query->select('id', 'name', 'dojo_id'); // Only get the id and name for the reviewer
            },
            'reviewer.dojo' => function ($query) {
                $query->select('id', 'name'); // Only get the id and name for the dojo
            }, 
            'reviewVideo'
           
        ])->find($review_id);
        $review->reviewVideo->url = $review->reviewVideo->url;
        
        return Inertia::render('StudentReviews/Show', [
            'review' => $review, 
            'student_video' => $student_video
        ]);
    }

   public function store(Request $request, $id)
    {
       // Validate incoming request data
        $validated = $request->validate([
            'dojo_id' => 'required|exists:dojos,id',
            'reviewer_id' => 'required', // Assuming reviewers are users
            'notes' => 'required|string|max:1000',
        ]);
        
        // Create Review
        $review = new Review([
            'reviewer_id' => $validated['reviewer_id'],
            'feedback' => '',
            'status' => 'pending',
            'video_id' => $id,
            'notes' => $validated['notes'],
        ]);
        $review->save();

        return redirect()->route('videos.index');

    }

}