<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Portfolio;
use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{

    protected function createPortfolio($user)
    {
        $portfolio = new Portfolio();
        $portfolio->user_id = $user->id;
        $portfolio->save();
    }

    public function register(Request $request)
    {
        $user = $this->registerUser($request);
    
        if ($user) {
            $request->request->add(['user_id' => $user->id]);
            $userInfoResponse = $this->registerUserInformation($request);

            $this->createPortfolio($user);
    
            return $userInfoResponse;
        }
    
        return response()->json(['message' => 'User registration failed'], 400);
    }

    public function registerUser(Request $request)
    {
        $user = new User();
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
    
        $user->save();
    
        return $user;
    }

    public function registerUserInformation(Request $request)
    {
        $userInfo = new UserInformation();
        $userInfo->name = $request->name;
        $userInfo->contact = $request->contact;
        $userInfo->country = $request->country;
        $userInfo->province = $request->province;
        $userInfo->city = $request->city;
        $userInfo->user_id = $request->user_id; 
        $userInfo->birthdate = $request->birthdate;
    
        $userInfo->save();
    
        return response()->json(['message' => 'User information registered successfully'], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if ($token = $this->guard()->attempt($credentials)) {
            return $this->respondWithToken($token);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    /**
     * Get the authenticated User
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json($this->guard()->user());
    }

    /**
     * Log the user out (Invalidate the token)
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        $this->guard()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken($this->guard()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $this->guard()->factory()->getTTL() * 60
        ]);
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    public function guard()
    {
        return Auth::guard();
    }
}
