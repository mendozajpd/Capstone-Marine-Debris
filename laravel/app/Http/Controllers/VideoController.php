<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VideoController extends Controller
{
    public function upload(Request $request)
    {
        // Validate the request
        $request->validate([
            'video' => 'required|mimes:mp4,avi,mkv|max:20000', // Adjust the validation rules as needed
        ]);

        // Handle the upload
        if ($request->hasFile('video')) {
            $file = $request->file('video');
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            // Store the file
            $path = $file->storeAs('videos', $fileName, 'public');

            // Return the path or any response you want
            return response()->json(['success' => true, 'file' => $fileName, 'path' => $path], 200);
        }

        return response()->json(['success' => false], 400);
    }
}
