<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Review;

class ReviewController extends Controller
{
    public function show($id)
    {
        $reviews = Review::with(['reviewer', 'video'])
            ->where('video_id', $id)
            ->get();
        return Inertia::render('Reviews', [
            'id' => $id,
            'reviews' => $reviews
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
        ]);
        $review->save();

        return redirect()->route('videos.index');

    }

}