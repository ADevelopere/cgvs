<?php

namespace App\Template;

use App\GraphQL\Contracts\LighthouseMutation;
use App\Models\Template;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class TemplateMutator implements LighthouseMutation
{
    /**
     * @throws ValidationException
     */
    public function create($root, array $args) : ?Template
    {
        Log::info('TemplateMutator: Creating template', $args);
        $input = new CreateTemplateInput(
            name: $args['name'],
            description: $args['description'] ?? null,
            categoryId: $args['categoryId'] ?? null,
            order: $args['order'] ?? null,
            image: $args['image'] ?? null
        );

        return TemplateService::createTemplate($input);
    }

    /**
     * @throws ValidationException
     */
    public function update($root, array $args): ?Template
    {
        $template = Template::query()->findOrFail($args['id']);
        $input = new UpdateTemplateInput(
            name: $args['name'],
            description: $args['description'] ?? null,
            categoryId: $args['categoryId'] ?? null,
            order: $args['order'] ?? null,
        );

        Log::info('TemplateMutator: Updating template', [
            'templateId' => $args['id'],
            'input' => $input
        ]);

        return TemplateService::updateTemplate($template, $input);
    }

    // updateWithImage
    /**
     * @throws ValidationException
     */
    public function updateWithImage($root, array $args): ?Template
    {
        $template = Template::query()->findOrFail($args['id']);
        $input = new UpdateTemplateWithImageInput(
            name: $args['name'],
            description: $args['description'] ?? null,
            categoryId: $args['categoryId'] ?? null,
            order: $args['order'] ?? null,
            image: $args['image'] ?? null
        );

        Log::info('TemplateMutator: Updating template with image', [
            'templateId' => $args['id'],
            'input' => $input
        ]);

        return TemplateService::updateTemplateWithImage($template, $input);
    }

    /**
     * @throws ValidationException
     */
    public function delete($root, array $args): Template
    {
        $template = Template::query()->findOrFail($args['id']);
        return TemplateService::deleteTemplate($template);
    }

    /**
     * Move a template to the deletion category
     * @throws ValidationException
     */
    public function moveToDeletion($root, array $args): Template
    {
        $template = Template::query()->findOrFail($args['templateId']);
        return TemplateService::moveToDeletionCategory($template);
    }

    /**
     * Restore a template from the deletion category
     * @throws ValidationException
     */
    public function restore($root, array $args): Template
    {
        $template = Template::query()->findOrFail($args['templateId']);
        return TemplateService::restoreTemplate($template);
    }

    /**
     * Reorder templates
     * @throws ValidationException
     */
    public function reorder($root, array $args): array
    {
        $inputs = array_map(
            fn($item) => new ReorderTemplateInput(
                id: $item['id'],
                order: $item['order']
            ),
            $args['input']
        );

        return TemplateService::reorderTemplates($inputs);
    }
}
