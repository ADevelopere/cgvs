<?php

namespace App\TemplateCategory;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\GraphQL\Contracts\LighthouseModel;

class TemplateCategory extends Model implements LighthouseModel
{
    use SoftDeletes, HasFactory;

    protected $fillable = [
        'name',
        'description',
        'parent_category_id',
        'order',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'special_type' => 'string',
    ];

    // Special category types
    public const SPECIAL_TYPE_DELETION = 'deletion';
    public const SPECIAL_TYPE_MAIN = 'main';

    public function isSpecial(): bool
    {
        return !is_null($this->special_type);
    }

    public function isDeletionCategory(): bool
    {
        return $this->special_type === self::SPECIAL_TYPE_DELETION;
    }

    public function isMainCategory(): bool
    {
        return $this->special_type === self::SPECIAL_TYPE_MAIN;
    }

    public function isImmutableCategory(): bool
    {
        // Only deleted category is completely immutable
        return $this->isDeletionCategory();
    }

    // Boot the model
    protected static function booted()
    {
        static::saving(function ($category) {
            if ($category->isImmutableCategory()) {
                // Prevent changing deleted category properties
                $original = $category->getOriginal();
                $category->name = $original['name'] ?? $category->name;
                $category->parent_category_id = null;
                $category->order = null;
            } else if ($category->isMainCategory()) {
                // For main category, only prevent having a parent
                $category->parent_category_id = null;
            }
        });
    }

    /**
     * Get the parent category if this is a subcategory
     */
    public function parentCategory(): BelongsTo
    {
        return $this->belongsTo(TemplateCategory::class, 'parent_category_id');
    }

    /**
     * Get the child categories of this category
     */
    public function childCategories(): HasMany
    {
        return $this->hasMany(TemplateCategory::class, 'parent_category_id')
            ->orderBy('order');
    }

    /**
     * Get all templates in this category
     */
    public function templates(): HasMany
    {
        return $this->hasMany(Template::class, 'category_id')
            ->orderBy('order');
    }

    /**
     * Get the deleted templates category
     */
    public static function getDeletedCategory()
    {
        return static::where('special_type', self::SPECIAL_TYPE_DELETION)->firstOrFail();
    }

    /**
     * Get the main templates category
     */
    public static function getMainCategory()
    {
        return static::where('special_type', self::SPECIAL_TYPE_MAIN)->firstOrFail();
    }
}
