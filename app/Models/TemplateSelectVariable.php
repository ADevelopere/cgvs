<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TemplateSelectVariable extends TemplateVariable
{
    protected static function booted()
    {
        static::creating(function ($model) {
            $model->type = 'select';
        });

        parent::booted();
    }

    public function scopeAllowedFields()
    {
        return [
            'options',
            'multiple'
        ];
    }
}
