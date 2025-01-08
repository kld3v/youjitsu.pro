<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Video;
use Illuminate\Support\Facades\Storage;
class SubmissionController extends Controller
{
    
       public function show($id)
    {
        $video = Video::find($id);
        $video->url = Storage::url($video->path);

        if (!$video) {
            abort(404);
        }
        return Inertia::render('CreateSubmission', [
            'id' => $id,
            'video' => $video
        ]);
     
    }
}