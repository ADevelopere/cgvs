<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\GraphQL\Contracts\LighthouseModel;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TemplateVariable extends Model implements LighthouseModel
{
    protected $fillable = [
        'template_id',
        'name',
        'type',
        'description',
        'preview_value',
        'required',
        'order'
    ];

    protected $casts = [
        'required' => 'boolean',
        'order' => 'integer'
    ];

    protected static function booted()
    {
        static::deleting(function ($variable) {
            if ($variable->is_key) {
                throw new \Exception('Cannot delete key variable');
            }
        });
    }

    /**
     * Get the template that owns this variable
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    /**
     * Get all values for this variable across all recipient group items
     */
    public function values(): HasMany
    {
        return $this->hasMany(RecipientGroupItemVariableValue::class);
    }

    public function validatePreviewValue(): bool
    {
        $rules = $this->validation_rules ?? [];

        // Basic type validation
        switch ($this->type) {
            case 'text':
                return is_string($this->preview_value);
            case 'date':
                return strtotime($this->preview_value) !== false;
            case 'number':
                return is_numeric($this->preview_value);
            case 'gender':
                return in_array($this->preview_value, ['male', 'female']);
            default:
                return true;
        }
    }

    public static function getNextOrder(int $templateId): int
    {
        $maxOrder = static::where('template_id', $templateId)->max('order') ?? 0;
        return $maxOrder + 1;
    }

    public function textVariable(): HasOne
    {
        return $this->hasOne(TemplateTextVariable::class, 'variable_id');
    }

    public function numberVariable(): HasOne
    {
        return $this->hasOne(TemplateNumberVariable::class, 'variable_id');
    }

    public function dateVariable(): HasOne
    {
        return $this->hasOne(TemplateDateVariable::class, 'variable_id');
    }

    public function selectVariable(): HasOne
    {
        return $this->hasOne(TemplateSelectVariable::class, 'variable_id');
    }
}
