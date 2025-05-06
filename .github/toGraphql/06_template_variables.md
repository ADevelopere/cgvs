# Template Variables Migration

## GraphQL Schema Changes

Create `graphql/types/TemplateVariable.graphql`:
```graphql
enum VariableType {
  TEXT
  DATE
  NUMBER
  GENDER
}

type TemplateVariable {
  id: ID!
  name: String!
  type: VariableType!
  description: String
  previewValue: String
  template: Template! @belongsTo
  order: Int!
  created_at: DateTime!
  updated_at: DateTime!
}

input CreateTemplateVariableInput {
  templateId: ID!
  name: String! @rules(apply: ["required", "string", "max:255"])
  type: VariableType! @rules(apply: ["required"])
  description: String
  previewValue: String
  order: Int
}

input UpdateTemplateVariableInput {
  name: String @rules(apply: ["string", "max:255"])
  type: VariableType
  description: String
  previewValue: String
  order: Int
}

input ReorderVariablesInput {
  id: ID!
  order: Int!
}
```

Create `graphql/queries/template-variable.graphql`:
```graphql
extend type Query {
  templateVariables(templateId: ID! @eq): [TemplateVariable!]! 
    @paginate
    @guard
  
  templateVariable(id: ID! @eq): TemplateVariable! 
    @find
    @guard
}
```

Create `graphql/mutations/template-variable.graphql`:
```graphql
extend type Mutation {
  createTemplateVariable(input: CreateTemplateVariableInput! @spread): TemplateVariable!
    @guard
    @can(ability: "createVariable")
    @field(resolver: "TemplateVariableMutator@create")
  
  updateTemplateVariable(id: ID!, input: UpdateTemplateVariableInput! @spread): TemplateVariable!
    @guard
    @can(ability: "updateVariable", find: "id")
    @field(resolver: "TemplateVariableMutator@update")
  
  deleteTemplateVariable(id: ID!): TemplateVariable!
    @guard
    @can(ability: "deleteVariable", find: "id")
    @field(resolver: "TemplateVariableMutator@delete")
    
  reorderTemplateVariables(templateId: ID!, input: [ReorderVariablesInput!]!): [TemplateVariable!]!
    @guard
    @can(ability: "updateVariable")
    @field(resolver: "TemplateVariableMutator@reorder")
}
```

## Resolver Implementation

Create `app/GraphQL/Mutations/TemplateVariableMutator.php`:
```php
<?php

namespace App\GraphQL\Mutations;

use App\Models\TemplateVariable;

class TemplateVariableMutator
{
    public function create($root, array $args)
    {
        $data = $args['input'];
        
        if (!isset($data['order'])) {
            $data['order'] = TemplateVariable::where('template_id', $data['templateId'])
                ->max('order') + 1;
        }

        return TemplateVariable::create($data);
    }

    public function update($root, array $args)
    {
        $variable = TemplateVariable::findOrFail($args['id']);
        $variable->update($args['input']);
        return $variable;
    }

    public function delete($root, array $args)
    {
        $variable = TemplateVariable::findOrFail($args['id']);
        $variable->delete();
        return $variable;
    }

    public function reorder($root, array $args)
    {
        $updates = collect($args['input'])->mapWithKeys(function ($item) {
            return [$item['id'] => ['order' => $item['order']]];
        });

        TemplateVariable::query()
            ->where('template_id', $args['templateId'])
            ->whereIn('id', $updates->keys())
            ->each(function ($variable) use ($updates) {
                $variable->update($updates[$variable->id]);
            });

        return TemplateVariable::whereIn('id', $updates->keys())->get();
    }
}
```

## Authorization

Add to AuthServiceProvider:
```php
Gate::define('createVariable', function ($user) {
    return $user->isAdmin();
});

Gate::define('updateVariable', function ($user, TemplateVariable $variable) {
    return $user->isAdmin();
});

Gate::define('deleteVariable', function ($user, TemplateVariable $variable) {
    return $user->isAdmin();
});
```

## Testing

Create feature tests in `tests/Feature/GraphQL/TemplateVariableTest.php`.
