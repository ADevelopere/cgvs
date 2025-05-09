<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ImageElement extends Model
{
    protected $primaryKey = 'element_id';
    public $incrementing = false;

    protected $fillable = [
        'image_url',
        'width',
        'height'
    ];

    protected $casts = [
        'width' => 'integer',
        'height' => 'integer'
    ];

    public function element(): BelongsTo
    {
        return $this->belongsTo(TemplateElement::class, 'element_id');
    }
}
