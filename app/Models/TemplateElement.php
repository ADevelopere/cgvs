<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\GraphQL\Contracts\LighthouseModel;

class TemplateElement extends Model implements LighthouseModel
{
    use HasFactory;

    // Element types constants
    public const TYPE_TEXT = 'text';
    public const TYPE_DATE = 'date';
    public const TYPE_GENDER_TEXT = 'gender_text';
    public const TYPE_CONDITIONAL_TEXT = 'conditional_text';
    public const TYPE_IMAGE = 'image';
    public const TYPE_QR_CODE = 'qr_code';

    protected $fillable = [
        'template_id',
        'element_type',
        'x_coordinate',
        'y_coordinate',
        'properties',
        'font_size',
        'color',
        'alignment',
        'font_family',
        'language_constraint',
        'source_field',
    ];

    protected $casts = [
        'properties' => 'array',
        'x_coordinate' => 'float',
        'y_coordinate' => 'float',
        'font_size' => 'integer',
    ];

    /**
     * Get the template that owns this element
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Get the available element types
     */
    public static function getAvailableTypes(): array
    {
        return [
            self::TYPE_TEXT,
            self::TYPE_DATE,
            self::TYPE_GENDER_TEXT,
            self::TYPE_CONDITIONAL_TEXT,
            self::TYPE_IMAGE,
            self::TYPE_QR_CODE,
        ];
    }
}
