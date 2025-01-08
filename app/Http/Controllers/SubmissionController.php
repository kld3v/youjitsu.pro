<?php

namespace App\Http\Controllers;

use App\Models\Dojo;
use App\Models\Review;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Video;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
    
    public function show($id)
    {
        $video = Video::find($id);
        $video->url = Storage::url($video->path);
        $dojos = Dojo::all();
        $reviewers = User::where('role', 'sensei')->get();
        if (!$video) {
            abort(404);
        }
        return Inertia::render('CreateSubmission', [
            'id' => $id,
            'video' => $video,
            'dojos' => $dojos,
            'reviewers' => $reviewers
        ]);
     
    }
   
    public function store(Request $request, $id)
    {
       // Validate incoming request data
        $validated = $request->validate([
            'dojo_id' => 'required|exists:dojos,id',
            'reviewer_id' => 'required|exists:users,id', // Assuming reviewers are users
            'notes' => 'required|string|max:1000',
        ]);
        
        // create new submission
        $submission = new Submission([
            'submitter_id' => Auth::user()->id,
            'dojo_id' => $validated['dojo_id'],
            'notes' => $validated['notes'],
        ]);

        // Save the submission
        $submission->save();

        // Create Review
        Review::create([
            'submission_id' => $submission->id,
            'reviewer_id' => $validated['reviewer_id'],
            'status' => 'pending',
            'feedback' => '',
            'video_id' => $id,
        ]);

        return redirect()->route('videos.index');

    }
}