<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Review;
use Illuminate\Support\Facades\Storage;

class ManageReviewsController extends Controller
{
    public function index () {
        // get all reviews for the current user where their user id is the reviewer_id
        $reviews = Auth::user()->reviews;

        $reviews->load([
            'video',
            'video.user:id,name' // Load only 'id' and 'name' for the user
        ]);
        
        $reviews->map(function ($review){
           $review->video->url = Storage::url($review->video->path);
           return $review; 
        });

        return Inertia::render('ManageReviews', [
            'reviews' => $reviews
        ]);
    }
}