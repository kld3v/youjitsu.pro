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
   
    }