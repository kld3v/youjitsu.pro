<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Video;
use Illuminate\Support\Facades\Storage;
use App\Models\Dojo;
use App\Models\User;

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