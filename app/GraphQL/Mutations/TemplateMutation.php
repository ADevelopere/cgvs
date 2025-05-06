<?php

namespace App\GraphQL\Mutations;

use App\Models\Template;
use App\Models\TemplateCategory;
use Illuminate\Support\Facades\Storage;

class TemplateMutation
{
    public function create($root, array $args)
    {
        $data = $args['input'];
        
        if (isset($data['background'])) {
            $path = $data['background']->store('backgrounds', 'public');
            $data['background_url'] = Storage::url($path);
        }

        return Template::create($data);
    }

    public function update($root, array $args)
    {
        $template = Template::findOrFail($args['id']);
        $data = $args['input'];

        if (isset($data['background'])) {
            // Delete old background
            if ($template->background_url) {
                Storage::delete(str_replace('/storage/', '/public/', $template->background_url));
            }

            $path = $data['background']->store('backgrounds', 'public');
            $data['background_url'] = Storage::url($path);
        }

        $template->update($data);
        return $template;
    }

    public function delete($root, array $args)
    {
        $template = Template::findOrFail($args['id']);
        
        if ($template->background_url) {
            Storage::delete(str_replace('/storage/', '/public/', $template->background_url));
        }
        
        $template->delete();
        return $template;
    }

    public function moveToDeleted($root, array $args)
    {
        $template = Template::findOrFail($args['templateId']);
        $deletedCategory = TemplateCategory::where('special_type', 'DELETED')->firstOrFail();
        $template->category()->associate($deletedCategory);
        $template->save();
        return $template;
    }
}
