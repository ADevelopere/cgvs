<?php

namespace App\GraphQL\Interfaces;

use App\Models\TemplateVariable;
use App\Exceptions\UnknownTemplateVariableTypeException;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ResolveInfo;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class TemplateVariableResolver
{
    /**
     * Decide which GraphQL type a resolved value has.
     *
     * @param  mixed  $value
     * @return string
     */
    public static function resolveType($value): string
    {
        return match($value->type) {
            'text' => 'TemplateTextVariable',
            'number' => 'TemplateNumberVariable',
            'date' => 'TemplateDateVariable',
            'select' => 'TemplateSelectVariable',
            default => throw new UnknownTemplateVariableTypeException($value->type)
        };
    }
}
