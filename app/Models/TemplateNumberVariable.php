<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateNumberVariable extends TemplateVariable
{
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->type = 'number';
        });

        parent::booted();
    }

    public function scopeAllowedFields()
    {
        return [
            'min_value',
            'max_value',
            'decimal_places'
        ];
    }

    public function getTypeAttribute(): string
    {
        return 'number';
    }
}
