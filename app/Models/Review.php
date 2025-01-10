<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $table = 'reviews';

    protected $fillable = [
        'reviewer_id',
        'feedback',
        'status',
        'video_id',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function video()
    {
        return $this->belongsTo(Video::class);
    }
}