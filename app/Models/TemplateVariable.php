<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TemplateVariable extends Model
{
    protected $fillable = [
        'template_id',
        'name',
        'type',
        'description',
        'validation_rules',
        'preview_value',
    ];

    protected $casts = [
        'validation_rules' => 'array',
    ];

    public function template()
    {
        return $this->belongsTo(Template::class);
    }

    public function validatePreviewValue(): bool
    {
        $rules = $this->validation_rules ?? [];

        // Basic type validation
        switch ($this->type) {
            case 'text':
                return is_string($this->preview_value);
            case 'date':
                return strtotime($this->preview_value) !== false;
            case 'number':
                return is_numeric($this->preview_value);
            case 'gender':
                return in_array($this->preview_value, ['male', 'female']);
            default:
                return true;
        }
    }
}
