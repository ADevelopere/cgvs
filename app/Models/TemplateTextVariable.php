<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateTextVariable extends TemplateVariable
{
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->type = 'text';
        });

        parent::booted();
    }

    public function scopeAllowedFields()
    {
        return [
            'min_length',
            'max_length',
            'pattern'
        ];
    }
}
