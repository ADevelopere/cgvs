<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateDateVariable extends TemplateVariable
{
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->type = 'date';
        });

        parent::booted();
    }

    public function scopeAllowedFields()
    {
        return [
            'min_date',
            'max_date',
            'format'
        ];
    }
}
