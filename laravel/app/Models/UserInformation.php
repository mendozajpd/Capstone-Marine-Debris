<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserInformation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'contact',
        'country',
        'province',
        'city',
        'birthdate',
    ];

    /**
     * Get the user that owns the user information.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}