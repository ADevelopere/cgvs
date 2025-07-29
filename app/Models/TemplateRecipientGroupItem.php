<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TemplateRecipientGroupItem extends Model
{
    protected $fillable = [
        'template_recipient_group_id',
        'student_id',
    ];

    /**
     * Get the recipient group that owns this item
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(TemplateRecipientGroup::class, 'template_recipient_group_id');
    }

    /**
     * Get the student associated with this item
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get all variable values for this item
     */
    public function variableValues(): HasMany
    {
        return $this->hasMany(RecipientGroupItemVariableValue::class);
    }
}
