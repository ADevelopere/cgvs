<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // TODO: Replace with actual data when models are created
        return response()->json([
            'stats' => [
                'totalTemplates' => 0,
                'totalCertificates' => 0,
            ],
            'recentActivity' => [],
        ]);
    }
}
