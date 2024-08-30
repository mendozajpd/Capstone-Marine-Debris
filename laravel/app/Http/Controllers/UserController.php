<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use App\Http\Controllers\Controller;


class UserController extends Controller
{

    public function index()
    {
        $users = User::all();
        return response()->json($users, 200);
    }

    public function informationIndex ()
    {
        $usersInformation = UserInformation::all();
        return response()->json($usersInformation, 200);
    }

    public function show($id)
    {
        $user = User::find($id); 
        if ($user) {
            return response()->json($user, 200);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function store(Request $request)
    {
        $user = new User();
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
    
        $user->save();
    
        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id); // Retrieve user by id
        if ($user) {
            $user->fill($request->all()); // Fill user model with request data
            $user->save(); // Save user to database

            return response()->json($user, 200);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function updateInformation(Request $request, $id)
    {
        $user = UserInformation::find($id);
        if ($user) {
            $user->fill($request->all()); 
            $user->save(); 

            return response()->json($user, 200);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function destroy($id)
    {
        $user = User::find($id); 
        if ($user) {
            $user->delete();
            return response()->json(['message' => 'User deleted'], 200);
        } else {
            return response()->json(['error' => 'User not found'], 404);
        }
    }
}
