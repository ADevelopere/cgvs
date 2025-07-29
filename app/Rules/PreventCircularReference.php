<?php

namespace App\Rules;

use Closure;
use App\Models\TemplateCategory;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

class PreventCircularReference implements ValidationRule, DataAwareRule
{
    protected array $data = [];

    public function setData(array $data): static
    {
        $this->data = $data;
        return $this;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value && isset($this->data['id'])) {
            $parent = TemplateCategory::find($value);
            while ($parent) {
                if ($parent->id === $this->data['id']) {
                    $fail('Cannot create circular reference in category hierarchy.');
                    break;
                }
                $parent = $parent->parentCategory;
            }
        }
    }
}
