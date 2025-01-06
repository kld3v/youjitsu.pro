<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dojo extends Model
{
    protected $fillable = ['name'];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }
}