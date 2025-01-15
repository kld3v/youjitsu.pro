<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    protected $fillable = [
        'submitter_id',
        'dojo_id',
        'video_url',
        'notes',
    ];

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitter_id');
    }

    public function dojo()
    {
        return $this->belongsTo(Dojo::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

}