<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DataTextElement extends Model
{
    protected $primaryKey = 'element_id';
    public $incrementing = false;

    protected $fillable = [
        'source_type',
        'source_field'
    ];

    protected $casts = [
        'source_type' => 'string'
    ];

    public function element(): BelongsTo
    {
        return $this->belongsTo(TemplateElement::class, 'element_id');
    }
}
