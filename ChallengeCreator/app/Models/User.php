<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laratrust\Traits\HasRolesAndPermissions;
use Laratrust\Contracts\LaratrustUser;

class User extends Authenticatable implements LaratrustUser
{
    use HasApiTokens, HasFactory, Filterable, Notifiable, HasRolesAndPermissions;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function questionbanks() {
        return $this->belongsToMany(
            QuestionBank::class, 'role_user', 'team_id', 'user_id'
        );
    }

    // public function roles() {
    //     return $this->belongsToMany(
    //         Role::class, 'role_user'
    //     );
    // }
}
