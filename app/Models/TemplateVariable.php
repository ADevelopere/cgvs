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
        'is_key',
        'order',
    ];

    protected $casts = [
        'validation_rules' => 'array',
        'is_key' => 'boolean',
        'order' => 'integer',
    ];

    protected static function booted()
    {
        static::deleting(function ($variable) {
            if ($variable->is_key) {
                throw new \Exception('Cannot delete key variable');
            }
        });
    }

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

    public static function getNextOrder(int $templateId): int
    {
        $maxOrder = static::where('template_id', $templateId)->max('order') ?? 0;
        return $maxOrder + 1;
    }
}
