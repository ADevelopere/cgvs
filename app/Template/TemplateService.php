<?php

namespace App\Template;

use App\Models\Template;
use App\Models\TemplateCategory;
use App\Exceptions\TemplateStorageException;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;
use App\TemplateCategory\TemplateCategoryValidator;

class TemplateService
{
    /**
     * Get all templates with their background URLs.
     *
     * @return Collection
     */
    public function getAllTemplates(): Collection
    {
        $templates = Template::all();
        return $templates->transform(function ($template) {
            if ($template->background_url) {
                $template->background_url = Storage::url($template->background_url);
            }
            return $template;
        });
    }

    /**
     * Get template configuration.
     *
     * @return array
     */
    public function getConfig(): array
    {
        $maxSize = config('filesystems.upload_limits.template_background', 2048);
        Log::debug('Template max file size config:', [
            'maxSize' => $maxSize,
            'env_value' => env('MAX_TEMPLATE_BACKGROUND_SIZE'),
            'full_config' => config('filesystems.upload_limits')
        ]);
        return ['maxFileSize' => $maxSize];
    }

    /**
     * Create a new template.
     *
     * @param CreateTemplateInput $input
     * @return Template
     * @throws ValidationException|TemplateStorageException
     */
    public static function createTemplate(CreateTemplateInput $input): ?Template
    {
        $maxSize = config('filesystems.upload_limits.template_background', 5120);

        Log::info('Template creation request:', [
            'input' => [
                'name' => $input->name,
                'description' => $input->description,
                'categoryId' => $input->categoryId,
                'order' => $input->order,
                'backgroundImage' => $input->backgroundImage ? $input->backgroundImage->getClientOriginalName() : null
            ]
        ]);

        // Validate name
        if (!$input->name || strlen($input->name) < 3 || strlen($input->name) > 255) {
            throw ValidationException::withMessages([
                'name' => ['The template name must be between 3 and 255 characters.']
            ]);
        }

        // Validate category exists and is not special
        if (!$input->categoryId || !($category = TemplateCategory::find($input->categoryId))) {
            throw ValidationException::withMessages([
                'category_id' => ['The selected category does not exist.']
            ]);
        }

        // Validate not deletion category
        [$valid, $message] = TemplateCategoryValidator::validateNotDeletionCategory($input->categoryId);
        if (!$valid) {
            throw ValidationException::withMessages([
                'category_id' => [$message]
            ]);
        }

        // Validate order if provided
        if ($input->order !== null && $input->order < 0) {
            throw ValidationException::withMessages([
                'order' => ['The order must be at least 0.']
            ]);
        }

        try {
            $template = new Template();
            $template->name = $input->name;
            $template->description = $input->description;
            $template->category_id = $input->categoryId;

            $template->order = Template::where('category_id', $input->categoryId)->max('order') + 1;

            if ($input->backgroundImage && $input->backgroundImage->isValid()) {
                Log::info('Processing background file for template');
                $path = $input->backgroundImage->store('template_backgrounds', 'public');
                if (!$path) {
                    throw new TemplateStorageException('Failed to store the background image.');
                }
                $template->background_url = $path;
            }

            Log::info('Saving template', [
                'template_data' => $template->toArray()
            ]);

            $template->save();

            Log::info('Template saved successfully', [
                'template_id' => $template->id
            ]);

            if ($template->background_url) {
                $template->background_url = Storage::url($template->background_url);
            }

            return $template;
        } catch (Exception $e) {
            Log::error('Failed to create template', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Update an existing template.
     *
     * @param Template $template
     * @param UpdateTemplateInput $input
     * @return Template
     * @throws ValidationException|TemplateStorageException
     */
    public static function updateTemplate(Template $template, UpdateTemplateInput $input): ?Template
    {
        $maxSize = config('filesystems.upload_limits.template_background', 5120);

        // Validate name if provided
        if ($input->name !== null) {
            if (strlen($input->name) < 3 || strlen($input->name) > 255) {
                throw ValidationException::withMessages([
                    'name' => ['The template name must be between 3 and 255 characters.']
                ]);
            }
        }

        // Validate category if changing it
        if ($input->categoryId !== null && $input->categoryId !== $template->category_id) {
            if (!($category = TemplateCategory::find($input->categoryId))) {
                throw ValidationException::withMessages([
                    'category_id' => ['The selected category does not exist.']
                ]);
            }

            // Validate not deletion category
            [$valid, $message] = TemplateCategoryValidator::validateNotDeletionCategory($input->categoryId);
            if (!$valid) {
                throw ValidationException::withMessages([
                    'category_id' => [$message]
                ]);
            }
        }

        // Validate order if provided
        if ($input->order !== null && $input->order < 0) {
            throw ValidationException::withMessages([
                'order' => ['The order must be at least 0.']
            ]);
        }

        try {
            if ($input->name !== null) {
                $template->name = $input->name;
            }
            if ($input->description !== null) {
                $template->description = $input->description;
            }

            if ($input->categoryId !== null && $input->categoryId !== $template->category_id) {
                $newCategory = TemplateCategory::findOrFail($input->categoryId);

                if (!$newCategory->isSpecial()) {
                    $template->category_id = $input->categoryId;
                    if ($input->order === null) {
                        $template->order = Template::where('category_id', $input->categoryId)
                            ->max('order') + 1;
                    }
                }
            }

            if ($input->order !== null) {
                $currentCategory = TemplateCategory::findOrFail($template->category_id);
                if (!$currentCategory->isSpecial()) {
                    $template->order = $input->order;
                }
            }

            if ($input->backgroundImage && $input->backgroundImage->isValid()) {
                if ($template->background_url) {
                    Storage::disk('public')->delete($template->background_url);
                }

                $path = $input->backgroundImage->store('template_backgrounds', 'public');
                if (!$path) {
                    throw new TemplateStorageException('Failed to store the background image.');
                }
                $template->background_url = $path;
            }

            $template->save();

            if ($template->background_url) {
                $template->background_url = Storage::url($template->background_url);
            }

            return $template;
        } catch (Exception $e) {
            Log::error('Failed to update template', [
                'error' => $e->getMessage(),
                'template_id' => $template->id
            ]);
            throw $e;
        }
    }

    /**
     * Get a template by ID with background URL.
     *
     * @param Template $template
     * @return Template
     */
    public function getTemplate(Template $template): Template
    {
        if ($template->background_url) {
            $template->background_url = Storage::url($template->background_url);
        }
        return $template;
    }

    /**
     * Reorder templates within a category.
     *
     * @param Request $request
     * @throws ValidationException
     */
    public function reorderTemplates(Request $request): void
    {
        Log::info('Template reorder request:', [
            'input' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'templates' => 'required|array',
            'templates.*.id' => 'required|exists:templates,id',
            'templates.*.order' => 'required|integer|min:0',
            'category_id' => 'required|exists:template_categories,id'
        ]);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        foreach ($request->templates as $templateData) {
            Template::where('id', $templateData['id'])
                ->where('category_id', $request->category_id)
                ->update(['order' => $templateData['order']]);
        }

        Log::info('Templates reordered successfully');
    }

    /**
     * Move template to deleted category.
     *
     * @param Template $template
     * @return Template
     */
    public static function moveToDeletedCategory(Template $template): Template
    {
        Log::info('Attempting to soft delete template', [
            'template_id' => $template->id,
            'template_name' => $template->name,
            'current_category' => $template->category_id
        ]);

        $template->moveToDeletedCategory();

        Log::info('Template soft deleted successfully', [
            'template_id' => $template->id,
            'template_name' => $template->name
        ]);

        if ($template->background_url) {
            $template->background_url = Storage::url($template->background_url);
        }

        return $template;
    }

    /**
     * Move template back to main category.
     *
     * @param Template $template
     * @return Template
     */
    public static function restoreTemplate(Template $template): Template
    {
        $template->moveToMainCategory();

        if ($template->background_url) {
            $template->background_url = Storage::url($template->background_url);
        }

        return $template;
    }

    /**
     * Permanently delete a template and its associated files.
     *
     * @param Template $template
     * @return Template
     * @throws TemplateStorageException
     */
    public static function deleteTemplate(Template $template): Template
    {
        Log::info('Attempting to permanently delete template', [
            'template_id' => $template->id,
            'template_name' => $template->name,
            'background_url' => $template->background_url
        ]);

        try {
            // Delete background file if it exists
            if ($template->background_url) {
                Storage::disk('public')->delete($template->background_url);
            }

            // Store template data for return
            $deletedTemplate = clone $template;

            // Delete the template
            $template->delete();

            Log::info('Template permanently deleted successfully', [
                'template_id' => $template->id,
                'template_name' => $template->name
            ]);

            if ($deletedTemplate->background_url) {
                $deletedTemplate->background_url = Storage::url($deletedTemplate->background_url);
            }

            return $deletedTemplate;
        } catch (Exception $e) {
            Log::error('Failed to delete template', [
                'error' => $e->getMessage(),
                'template_id' => $template->id
            ]);
            throw new TemplateStorageException('Failed to delete template: ' . $e->getMessage());
        }
    }
}
