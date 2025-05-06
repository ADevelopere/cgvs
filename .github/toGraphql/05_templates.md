# Templates Migration

## GraphQL Schema Changes

Create `graphql/types/Template.graphql`:
```graphql
scalar Upload

type Template {
  id: ID!
  name: String!
  description: String
  backgroundUrl: String
  category: TemplateCategory! @belongsTo
  elements: [TemplateElement!]! @hasMany
  variables: [TemplateVariable!]! @hasMany
  recipients: [TemplateRecipient!]! @hasMany
  createdAt: DateTime!
  updatedAt: DateTime!
}

type TemplateConfig {
  maxBackgroundSize: Int!
  allowedFileTypes: [String!]!
}

input CreateTemplateInput {
  name: String! @rules(apply: ["required", "string", "max:255"])
  description: String
  categoryId: ID! @rules(apply: ["required", "exists:template_categories,id"])
  background: Upload
}

input UpdateTemplateInput {
  name: String @rules(apply: ["string", "max:255"])
  description: String
  categoryId: ID @rules(apply: ["exists:template_categories,id"])
  background: Upload
}
```

Create `graphql/queries/template.graphql`:
```graphql
extend type Query {
  templates: [Template!]! 
    @paginate 
    @guard 
    @can(ability: "viewTemplates")

  template(id: ID! @eq): Template! 
    @find 
    @guard 
    @can(ability: "viewTemplate", find: "id")

  templateConfig: TemplateConfig! @guard
}
```

Create `graphql/mutations/template.graphql`:
```graphql
extend type Mutation {
  createTemplate(input: CreateTemplateInput! @spread): Template! 
    @guard 
    @can(ability: "createTemplate")
    @field(resolver: "TemplateMutator@create")
  
  updateTemplate(id: ID!, input: UpdateTemplateInput! @spread): Template! 
    @guard 
    @can(ability: "updateTemplate", find: "id")
    @field(resolver: "TemplateMutator@update")
  
  deleteTemplate(id: ID!): Template! 
    @guard 
    @can(ability: "deleteTemplate", find: "id")
    @field(resolver: "TemplateMutator@delete")
}
```

## File Upload Handling

Install file upload package:
```bash
composer require mll-lab/laravel-graphql-upload
```

## Resolver Implementation

Create `app/GraphQL/Mutations/TemplateMutator.php`:
```php
<?php

namespace App\GraphQL\Mutations;

use App\Models\Template;
use Illuminate\Support\Facades\Storage;

class TemplateMutator
{
    public function create($root, array $args)
    {
        $data = $args['input'];
        
        if (isset($data['background'])) {
            $path = $data['background']->store('backgrounds', 'public');
            $data['backgroundUrl'] = Storage::url($path);
        }

        return Template::create($data);
    }

    public function update($root, array $args)
    {
        $template = Template::findOrFail($args['id']);
        $data = $args['input'];

        if (isset($data['background'])) {
            // Delete old background
            if ($template->backgroundUrl) {
                Storage::delete(str_replace('/storage/', '/public/', $template->backgroundUrl));
            }

            $path = $data['background']->store('backgrounds', 'public');
            $data['backgroundUrl'] = Storage::url($path);
        }

        $template->update($data);
        return $template;
    }

    public function delete($root, array $args)
    {
        $template = Template::findOrFail($args['id']);
        
        if ($template->backgroundUrl) {
            Storage::delete(str_replace('/storage/', '/public/', $template->backgroundUrl));
        }
        
        $template->delete();
        return $template;
    }
}
```

Create `app/GraphQL/Queries/TemplateQuery.php`:
```php
<?php

namespace App\GraphQL\Queries;

class TemplateQuery
{
    public function templateConfig()
    {
        return [
            'maxBackgroundSize' => config('templates.max_background_size', 5 * 1024 * 1024), // 5MB
            'allowedFileTypes' => ['image/jpeg', 'image/png', 'image/gif'],
        ];
    }
}
```

## Authorization

Add to AuthServiceProvider:
```php
Gate::define('viewTemplates', function ($user) {
    return true;
});

Gate::define('viewTemplate', function ($user, Template $template) {
    return true;
});

Gate::define('createTemplate', function ($user) {
    return $user->isAdmin();
});

Gate::define('updateTemplate', function ($user, Template $template) {
    return $user->isAdmin();
});

Gate::define('deleteTemplate', function ($user, Template $template) {
    return $user->isAdmin();
});
```

## Testing

Create feature tests in `tests/Feature/GraphQL/TemplateTest.php`.
