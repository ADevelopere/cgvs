<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Template;
use App\Exceptions\TemplateStorageException;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Http\Middleware\TemplateTabPermissionMiddleware;

class TemplateController extends Controller
{
    public function __construct()
    {
        $this->middleware(TemplateTabPermissionMiddleware::class)->only(['show']);
    }

    /**
     * Display a listing of the templates.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $templates = Template::all();

        // Add background_url to each template
        $templates->transform(function ($template) {
            if ($template->background_path) {
                $template->background_url = Storage::url($template->background_path);
            }
            return $template;
        });

        return response()->json($templates);
    }

    /**
     * Get template configuration including max file size
     *
     * @return JsonResponse
     */
    public function config(): JsonResponse
    {
        $maxSize = config('filesystems.upload_limits.template_background', 2048);
        Log::debug('Template max file size config:', [
            'maxSize' => $maxSize,
            'env_value' => env('MAX_TEMPLATE_BACKGROUND_SIZE'),
            'full_config' => config('filesystems.upload_limits')
        ]);
        return response()->json([
            'maxFileSize' => $maxSize
        ]);
    }

    /**
     * Store a newly created template in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $maxSize = config('filesystems.upload_limits.template_background', 5120);

        // Log the incoming request data
        Log::info('Template creation request:', [
            'files' => $request->allFiles(),
            'input' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'background' => [
                'nullable',
                'file',
                'mimes:jpeg,png,jpg,gif',
                'max:'.$maxSize,
                function (string $_, $value, $fail) {
                    if ($value && !$value->isValid()) {
                        $fail('The background file is invalid or corrupted.');
                    }
                },
            ],
        ], [
            'background.max' => 'The background image must not be larger than ' . number_format($maxSize / 1024, 1) . ' MB.',
            'background.mimes' => 'The background image must be a file of type: jpeg, png, jpg, gif.',
        ]);

        if ($validator->fails()) {
            Log::info('Template validation failed', [
                'errors' => $validator->errors()->toArray(),
                'input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $template = new Template();
            $template->name = $request->name;
            $template->description = $request->description;

            if ($request->hasFile('background') && $request->file('background')->isValid()) {
                $path = $request->file('background')->store('template_backgrounds', 'public');
                if (!$path) {
                    throw new TemplateStorageException('Failed to store the background image.');
                }
                $template->background_path = $path;
            }

            $template->save();

            if ($template->background_path) {
                $template->background_url = Storage::url($template->background_path);
            }

            return response()->json($template, 201);
        } catch (Exception $e) {
            Log::error('Failed to create template', [
                'error' => $e->getMessage(),
                'input' => $request->all()
            ]);

            return response()->json([
                'message' => 'Failed to create template',
                'error_details' => $e->getMessage(),
                'errors' => ['general' => ['An error occurred while creating the template. Please try again.']]
            ], 422);
        }
    }

    /**
     * Display the specified template.
     *
     * @param Template $template
     * @return JsonResponse
     */
    public function show(Template $template): JsonResponse
    {
        // Add background_url if the template has a background
        if ($template->background_path) {
            $template->background_url = Storage::url($template->background_path);
        }

        return response()->json($template);
    }
}
