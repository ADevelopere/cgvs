<?php

namespace App\TemplateCategory;

use Illuminate\Support\Facades\Validator;

class TemplateCategoryValidator
{
    /**
     * Register all template category related validation rules
     */
    public static function register()
    {
        static::registerNotSpecialCategory();
        static::registerPreventSelfParent();
        static::registerPreventCircularReference();
    }

    /**
     * Check if category is not special
     */
    private static function notDeletionCategory($value, $fail)
    {
        if ($value) {
            $parent = TemplateCategory::find($value);
            if ($parent && $parent->isDeletionCategory()) {
                $fail("Deletion category can't: (updated, have parent, have child categories).");
            }
        }
    }

    /**
     * Prevent self-parent relationship
     */
    private static function preventSelfParent($value, $fail, $input)
    {
        if ($value && isset($input['id']) && $value == $input['id']) {
            $fail('A category cannot be its own parent.');
        }
    }

    /**
     * Prevent circular references in category hierarchy
     */
    private static function preventCircularReference($value, $fail, $input)
    {
        if ($value && isset($input['id'])) {
            $parent = TemplateCategory::find($value);
            while ($parent) {
                if ($parent->id === $input['id']) {
                    $fail('Cannot create circular reference in category hierarchy.');
                    break;
                }
                $parent = $parent->parentCategory;
            }
        }
    }

    /**
     * Register validation rule to check if category is not special
     */
    private static function registerNotSpecialCategory()
    {
        Validator::extend('not_deletion_category', function ($attribute, $value, $parameters, $validator) {
            $fail = function($message) use ($validator, $attribute) {
                $validator->errors()->add($attribute, $message);
                return false;
            };
            return static::notDeletionCategory($value, $fail) !== false;
        });
    }

    /**
     * Register validation rule to prevent self-parent relationship
     */
    private static function registerPreventSelfParent()
    {
        Validator::extend('prevent_self_parent', function ($attribute, $value, $parameters, $validator) {
            $fail = function($message) use ($validator, $attribute) {
                $validator->errors()->add($attribute, $message);
                return false;
            };
            return static::preventSelfParent($value, $fail, $validator->getData()) !== false;
        });
    }

    /**
     * Register validation rule to prevent circular references
     */
    private static function registerPreventCircularReference()
    {
        Validator::extend('prevent_circular_reference', function ($attribute, $value, $parameters, $validator) {
            $fail = function($message) use ($validator, $attribute) {
                $validator->errors()->add($attribute, $message);
                return false;
            };
            return static::preventCircularReference($value, $fail, $validator->getData()) !== false;
        });
    }
}
