<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Video extends Model
{
    use SoftDeletes;
    protected $fillable = ['path', 'title', 'description', 'user_id', 'is_review'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function getUrlAttribute()
    {
        return $this->path? Storage::url($this->path) : null;
    }
}