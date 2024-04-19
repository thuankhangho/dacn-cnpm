<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('test', function ($user, $id) {
    return true;
});
Broadcast::channel('qb.{id}.question', function ($user, $id) {
    return $user->isAbleTo('question-read',$id);
});
Broadcast::channel('qb.{id}.general', function ($user, $id) {
    return true;
});
