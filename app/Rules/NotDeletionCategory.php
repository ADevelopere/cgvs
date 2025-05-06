<?php

namespace App\Rules;

use Closure;
use App\Models\TemplateCategory;
use Illuminate\Contracts\Validation\ValidationRule;

class NotDeletionCategory implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value) {
            $parent = TemplateCategory::find($value);
            if ($parent && $parent->isDeletionCategory()) {
                $fail("Deletion category can't: (updated, have parent, have child categories).");
            }
        }
    }
}
