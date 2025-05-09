<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrCodeElement extends Model
{
    protected $primaryKey = 'element_id';
    public $incrementing = false;

    protected $fillable = [
        'size'
    ];

    protected $casts = [
        'size' => 'integer'
    ];

    public function element(): BelongsTo
    {
        return $this->belongsTo(TemplateElement::class, 'element_id');
    }
}
