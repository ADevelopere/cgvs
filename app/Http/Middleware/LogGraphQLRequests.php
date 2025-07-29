<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogGraphQLRequests
{
    public function handle(Request $request, Closure $next)
    {
        // Log the incoming request
        Log::info('GraphQL Request:', [
            'query' => $request->input('query'),
            'variables' => $request->input('variables'),
            'operationName' => $request->input('operationName'),
        ]);

        $response = $next($request);

        // Log the response
        Log::info('GraphQL Response:', [
            'status' => $response->status(),
            'content' => json_decode($response->getContent(), true)
        ]);

        return $response;
    }
}
