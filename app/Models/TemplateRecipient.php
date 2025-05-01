<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateRecipient extends Model
{
    protected $fillable = [
        'template_id',
        'data',
        'is_valid',
        'validation_errors',
    ];

    protected $casts = [
        'data' => 'array',
        'is_valid' => 'boolean',
        'validation_errors' => 'array',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }
}
