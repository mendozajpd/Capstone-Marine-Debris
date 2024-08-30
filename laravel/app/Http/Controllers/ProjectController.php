<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; 

class ProjectController extends Controller
{
    public function getAllProjects()
    {
        $projects = Project::all();
        return response()->json($projects, 200);
    }

    public function getProjectsByPortfolioId($portfolioId)
    {
        $projects = Project::where('portfolio_id', $portfolioId)->get();
        return response()->json($projects, 200);
    }

    public function getProjectByProjectId($projID)
    {
        $project = Project::where('id', $projID)->first();
        return response()->json($project, 200);
    }

    public function getProjectsForAuthenticatedUser()
    {
        $user = auth()->user()->load('portfolio');

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $projects = Project::where('portfolio_id', $user->portfolio->id)->get();
        return response()->json($projects, 200);
    }

    public function createProject(Request $request)
    {
        $project = new Project();
        $project->name = $request->name;
        $project->location = $request->location;
        $project->status = $request->status;
        if (!$request->portfolio_id) {
            if (!auth()->user()) {
                return response()->json(['error' => 'User not found'], 404);
            }
            $user = auth()->user()->load('portfolio');
            $project->portfolio_id = $user->portfolio->id;
        } else {
            $project->portfolio_id = $request->portfolio_id;
        }
        $project->save();
    
        return response()->json(['message' => 'Project created','projectID' => $project->id], 200);
    }
    
    public function updateProject(Request $request)
    {
        $project = Project::find($request->id);
        $project->name = $request->name;
        $project->location = $request->location;
        $project->status = $request->status;
        $project->save();
    
        return response()->json(['message' => 'Project updated'], 200);
    }

    public function deleteProject(Request $request)
    {
        $project = Project::find($request->id);
        $project->delete();

        return response()->json(['message' => 'Project deleted'], 200);
    }
}
