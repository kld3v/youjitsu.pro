<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Review;

class ReviewController extends Controller
{
    public function show($id)
    {
        $reviews = Review::with(['submission', 'reviewer', 'video'])
            ->where('submission_id', $id)
            ->get();
        return Inertia::render('Reviews', [
            'id' => $id,
            'reviews' => $reviews
        ]);
    }

   
}