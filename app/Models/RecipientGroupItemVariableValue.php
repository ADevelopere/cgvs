<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecipientGroupItemVariableValue extends Model
{
    protected $fillable = [
        'template_recipient_group_item_id',
        'template_variable_id',
        'value',
        'value_indexed',
    ];

    /**
     * Get the recipient group item that owns this value
     */
    public function groupItem(): BelongsTo
    {
        return $this->belongsTo(TemplateRecipientGroupItem::class, 'template_recipient_group_item_id');
    }

    /**
     * Get the template variable associated with this value
     */
    public function variable(): BelongsTo
    {
        return $this->belongsTo(TemplateVariable::class, 'template_variable_id');
    }
}
