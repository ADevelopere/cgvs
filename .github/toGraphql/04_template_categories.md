# Template Categories Migration

## GraphQL Schema Changes

Create `graphql/types/TemplateCategory.graphql`:
```graphql
type TemplateCategory {
  id: ID!
  name: String! @rules(apply: ["min:3"])
  description: String
  parentCategory: TemplateCategory @belongsTo
  childCategories: [TemplateCategory!]! @hasMany
  templates: [Template!]! @hasMany
  order: Int!
  specialType: TemplateCategoryType
  createdAt: DateTime!
  updatedAt: DateTime!
  deletedAt: DateTime
}

enum TemplateCategoryType {
  DELETED
  MAIN
  NONE
}

input CreateTemplateCategoryInput {
  name: String! @rules(apply: ["required", "string", "min:3", "max:255"])
  description: String
  parentCategoryId: ID @rules(apply: ["exists:template_categories,id"])
  order: Int
}

input UpdateTemplateCategoryInput {
  name: String @rules(apply: ["string", "min:3", "max:255"])
  description: String
  parentCategoryId: ID @rules(apply: ["exists:template_categories,id"])
  order: Int
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
    public function rules(): array
    {
        return [
            'name' => ['required', 'min:3'],
            'special_type' => [
                'prohibited_if:parent_category_id,!null',
                Rule::unique('template_categories')->ignore($this->argument('id')),
            ],
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
