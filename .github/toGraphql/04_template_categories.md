# Template Categories Migration

## GraphQL Schema Changes

Create `graphql/types/TemplateCategory.graphql`:
```graphql
type TemplateCategory {
  id: ID!
  name: String! @rules(apply: ["required", "string", "min:3", "max:255"])
  description: String
  parentCategory: TemplateCategory @belongsTo
  childCategories: [TemplateCategory!]! @hasMany @orderBy(column: "order")
  templates: [Template!]! @hasMany @orderBy(column: "order")
  order: Int!
  specialType: TemplateCategoryType
  created_at: DateTime!
  updated_at: DateTime!
  deleted_at: DateTime
}

enum TemplateCategoryType {
  DELETED
  MAIN
  NONE
}

input CreateTemplateCategoryInput {
  name: String! @rules(apply: ["required", "string", "min:3", "max:255"])
  description: String
  parentCategoryId: ID @rules(apply: [
    "exists:template_categories,id",
    "not_special_category",
    "prevent_self_parent",
    "prevent_circular_reference"
  ])
  order: Int @rules(apply: ["integer", "min:0"])
}

input UpdateTemplateCategoryInput {
  name: String @rules(apply: ["string", "min:3", "max:255"])
  description: String
  parentCategoryId: ID @rules(apply: [
    "exists:template_categories,id",
    "not_special_category",
    "prevent_self_parent",
    "prevent_circular_reference"
  ])
  order: Int @rules(apply: ["integer", "min:0"])
}

input ReorderCategoriesInput {
  id: ID!
  order: Int!
}
```

Create `graphql/queries/template-category.graphql`:
```graphql
extend type Query {
  templateCategories: [TemplateCategory!]! @paginate @guard
  templateCategory(id: ID! @eq): TemplateCategory! @find @guard
  mainCategory: TemplateCategory! @field(resolver: "TemplateCategoryQuery@mainCategory")
  deletedCategory: TemplateCategory! @field(resolver: "TemplateCategoryQuery@deletedCategory")
}
```

Create `graphql/mutations/template-category.graphql`:
```graphql
extend type Mutation {
  createTemplateCategory(input: CreateTemplateCategoryInput! @spread): TemplateCategory! 
    @guard 
    @can(ability: "admin")
    @field(resolver: "TemplateCategoryMutator@create")
  
  updateTemplateCategory(id: ID!, input: UpdateTemplateCategoryInput! @spread): TemplateCategory! 
    @guard 
    @can(ability: "admin")
    @field(resolver: "TemplateCategoryMutator@update")
  
  deleteTemplateCategory(id: ID!): TemplateCategory! 
    @guard 
    @can(ability: "admin")
    @field(resolver: "TemplateCategoryMutator@delete")
  
  reorderTemplateCategories(input: [ReorderCategoriesInput!]!): [TemplateCategory!]! 
    @guard 
    @can(ability: "admin")
    @field(resolver: "TemplateCategoryMutator@reorder")
}
```

## Custom Validation

Create `app/GraphQL/Directives/ValidateTemplateCategoryNameDirective.php`:
```php
<?php

namespace App\GraphQL\Directives;

use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Illuminate\Validation\Rule;

class ValidateTemplateCategoryNameDirective extends BaseDirective
{
    public static function definition(): array
    {
        return [
            'not_special_category' => function($value, $fail) {
                if ($value) {
                    $parent = TemplateCategory::find($value);
                    if ($parent && $parent->isSpecial()) {
                        $fail('Cannot create or move categories under special categories.');
                    }
                }
            },
            'prevent_self_parent' => function($value, $fail, $input) {
                if ($value && isset($input['id']) && $value == $input['id']) {
                    $fail('A category cannot be its own parent.');
                }
            },
            'prevent_circular_reference' => function($value, $fail, $input) {
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
        ];
    }
}
```

## Resolver Implementation

Create `app/GraphQL/Mutations/TemplateCategoryMutator.php`:
```php
<?php

namespace App\GraphQL\Mutations;

use App\Models\TemplateCategory;

class TemplateCategoryMutator
{
    public function create($root, array $args)
    {
        return TemplateCategory::create($args['input']);
    }

    public function update($root, array $args)
    {
        $category = TemplateCategory::findOrFail($args['id']);
        $category->update($args['input']);
        return $category;
    }

    public function delete($root, array $args)
    {
        $category = TemplateCategory::findOrFail($args['id']);
        if ($category->specialType) {
            throw new \Exception('Cannot delete special categories');
        }
        $category->delete();
        return $category;
    }

    public function reorder($root, array $args)
    {
        $updates = collect($args['input'])->mapWithKeys(function ($item) {
            return [$item['id'] => ['order' => $item['order']]];
        });
        
        TemplateCategory::query()->whereIn('id', $updates->keys())
            ->each(function ($category) use ($updates) {
                $category->update($updates[$category->id]);
            });

        return TemplateCategory::whereIn('id', $updates->keys())->get();
    }
}
```

Create `app/GraphQL/Queries/TemplateCategoryQuery.php`:
```php
<?php

namespace App\GraphQL\Queries;

use App\Models\TemplateCategory;

class TemplateCategoryQuery
{
    public function mainCategory()
    {
        return TemplateCategory::where('special_type', 'MAIN')->firstOrFail();
    }

    public function deletedCategory()
    {
        return TemplateCategory::where('special_type', 'DELETED')->firstOrFail();
    }
}
```

## Testing

Create feature tests in `tests/Feature/GraphQL/TemplateCategoryTest.php`.
