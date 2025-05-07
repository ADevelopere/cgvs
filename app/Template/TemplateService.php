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
     * Create a new template.
     *
     * @param CreateTemplateInput $input
     * @return Template
     * @throws ValidationException|TemplateStorageException
     */
    public static function createTemplate(CreateTemplateInput $input): ?Template
    {
        $config = TemplateConfig::fromConfig();

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
        $config = TemplateConfig::fromConfig();

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
     * @param ReorderTemplateInput[] $inputs Array of reorder inputs
     * @return Template[] Array of reordered templates
     * @throws ValidationException
     */
    public static function reorderTemplates(array $inputs): array
    {
        Log::info('Template reorder request:', [
            'input' => $inputs
        ]);

        $templateIds = array_map(fn($input) => $input->id, $inputs);
        $templates = Template::whereIn('id', $templateIds)->get();
        
        if (count($templates) !== count($inputs)) {
            throw ValidationException::withMessages([
                'templates' => ['One or more templates do not exist.']
            ]);
        }

        foreach ($inputs as $input) {
            $template = $templates->firstWhere('id', $input->id);
            $template->order = $input->order;
            $template->save();
        }

        Log::info('Templates reordered successfully');
        
        return $templates->map(function ($template) {
            if ($template->background_url) {
                $template->background_url = Storage::url($template->background_url);
            }
            return $template;
        })->all();
    }

    /**
     * Move template to deleted category.
     *
     * @param Template $template
     * @return Template
     */
    public static function moveToDeletionCategory(Template $template): Template
    {
        Log::info('Attempting move template to deletion category', [
            'template_id' => $template->id,
            'template_name' => $template->name,
            'current_category' => $template->category_id,
            'trashed_at' => now()
        ]);

        $template->moveToDeletionCategory();

        Log::info('Template soft moved to deletion categort successfully', [
            'template_id' => $template->id,
            'template_name' => $template->name,
            'trashed_at' => $template->trashed_at
        ]);

        if ($template->background_url) {
            $template->background_url = Storage::url($template->background_url);
        }

        return $template;
    }

    /**
     * Move template back to: pre deletion category || main category.
     *
     * @param Template $template
     * @return Template
     */
    public static function restoreTemplate(Template $template): Template
    {
        Log::info('Attempting to restore template', [
            'template_id' => $template->id,
            'template_name' => $template->name,
            'current_trashed_at' => $template->trashed_at
        ]);

        $template->restoreFromDeletionCategory();

        Log::info('Template restored successfully', [
            'template_id' => $template->id,
            'template_name' => $template->name,
            'trashed_at' => $template->trashed_at // Will be null after restore
        ]);

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
