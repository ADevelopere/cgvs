<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\GraphQL\Contracts\LighthouseModel;

class TemplateElement extends Model implements LighthouseModel
{
    use HasFactory;

    // Element types constants
    public const TYPE_STATIC_TEXT = 'static_text';
    public const TYPE_DATA_TEXT = 'data_text';
    public const TYPE_DATA_DATE = 'data_date';
    public const TYPE_IMAGE = 'image';
    public const TYPE_QR_CODE = 'qr_code';

    protected $fillable = [
        'template_id',
        'type',
        'x_coordinate',
        'y_coordinate',
        'font_size',
        'color',
        'alignment',
        'font_family',
        'language_constraint'
    ];

    protected $casts = [
        'x_coordinate' => 'float',
        'y_coordinate' => 'float',
        'font_size' => 'integer'
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
            self::TYPE_STATIC_TEXT,
            self::TYPE_DATA_TEXT,
            self::TYPE_DATA_DATE,
            self::TYPE_IMAGE,
            self::TYPE_QR_CODE,
        ];
    }
}
