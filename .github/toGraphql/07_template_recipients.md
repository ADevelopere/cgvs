# Template Recipients Migration

## GraphQL Schema Changes

Create `graphql/types/TemplateRecipient.graphql`:
```graphql
scalar JSON

type TemplateRecipient {
  id: ID!
  templateId: ID!
  template: Template! @belongsTo
  isValid: Boolean!
  validationErrors: [String!]
  data: JSON!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type ValidationResult {
  isValid: Boolean!
  errors: [String!]
  preview: [JSON!]
}

type ImportResult {
  success: Boolean!
  importedCount: Int!
  errors: [String!]
}

input UpdateRecipientInput {
  data: JSON! @rules(apply: ["required"])
}
```

Create `graphql/queries/template-recipient.graphql`:
```graphql
extend type Query {
  templateRecipients(templateId: ID! @eq): [TemplateRecipient!]! 
    @paginate
    @guard
    @can(ability: "viewRecipients")

  templateRecipientTemplate(templateId: ID!): String! 
    @guard
    @can(ability: "downloadRecipientTemplate")
    @field(resolver: "TemplateRecipientQuery@downloadTemplate")
}
```

Create `graphql/mutations/template-recipient.graphql`:
```graphql
extend type Mutation {
  validateRecipients(templateId: ID!, file: Upload!): ValidationResult!
    @guard
    @can(ability: "manageRecipients")
    @field(resolver: "TemplateRecipientMutator@validate")
  
  importRecipients(templateId: ID!, file: Upload!): ImportResult!
    @guard
    @can(ability: "manageRecipients")
    @field(resolver: "TemplateRecipientMutator@import")
  
  updateRecipient(id: ID!, input: UpdateRecipientInput! @spread): TemplateRecipient!
    @guard
    @can(ability: "updateRecipient", find: "id")
    @field(resolver: "TemplateRecipientMutator@update")
    
  deleteRecipient(id: ID!): TemplateRecipient!
    @guard
    @can(ability: "deleteRecipient", find: "id")
    @field(resolver: "TemplateRecipientMutator@delete")
}
```

## Resolver Implementation

Create `app/GraphQL/Mutations/TemplateRecipientMutator.php`:
```php
<?php

namespace App\GraphQL\Mutations;

use App\Models\Template;
use App\Models\TemplateRecipient;
use PhpOffice\PhpSpreadsheet\IOFactory;

class TemplateRecipientMutator
{
    public function validate($root, array $args)
    {
        $template = Template::findOrFail($args['templateId']);
        $file = $args['file'];
        
        $spreadsheet = IOFactory::load($file->path());
        $worksheet = $spreadsheet->getActiveSheet();
        $data = $worksheet->toArray();
        
        // Validate headers and data format
        $headers = array_shift($data);
        $requiredColumns = $template->variables()->pluck('name')->toArray();
        
        $errors = [];
        $preview = [];
        
        if (count(array_intersect($headers, $requiredColumns)) !== count($requiredColumns)) {
            $errors[] = 'Missing required columns';
        }
        
        foreach ($data as $row) {
            $rowData = array_combine($headers, $row);
            $preview[] = $rowData;
        }
        
        return [
            'isValid' => empty($errors),
            'errors' => $errors,
            'preview' => $preview,
        ];
    }

    public function import($root, array $args)
    {
        $template = Template::findOrFail($args['templateId']);
        $file = $args['file'];
        
        $spreadsheet = IOFactory::load($file->path());
        $worksheet = $spreadsheet->getActiveSheet();
        $data = $worksheet->toArray();
        
        $headers = array_shift($data);
        $errors = [];
        $importedCount = 0;
        
        foreach ($data as $row) {
            $rowData = array_combine($headers, $row);
            try {
                TemplateRecipient::create([
                    'template_id' => $template->id,
                    'data' => $rowData,
                    'is_valid' => true,
                ]);
                $importedCount++;
            } catch (\Exception $e) {
                $errors[] = "Error importing row: " . json_encode($rowData);
            }
        }
        
        return [
            'success' => $importedCount > 0,
            'importedCount' => $importedCount,
            'errors' => $errors,
        ];
    }

    public function update($root, array $args)
    {
        $recipient = TemplateRecipient::findOrFail($args['id']);
        $recipient->update($args['input']);
        return $recipient;
    }

    public function delete($root, array $args)
    {
        $recipient = TemplateRecipient::findOrFail($args['id']);
        $recipient->delete();
        return $recipient;
    }
}
```

Create `app/GraphQL/Queries/TemplateRecipientQuery.php`:
```php
<?php

namespace App\GraphQL\Queries;

use App\Models\Template;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class TemplateRecipientQuery
{
    public function downloadTemplate($root, array $args)
    {
        $template = Template::findOrFail($args['templateId']);
        $variables = $template->variables()->orderBy('order')->pluck('name');
        
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        
        // Add headers
        foreach ($variables as $index => $variable) {
            $sheet->setCellValueByColumnAndRow($index + 1, 1, $variable);
        }
        
        $writer = new Xlsx($spreadsheet);
        $path = storage_path('app/temp/template_' . $template->id . '.xlsx');
        $writer->save($path);
        
        // Return URL that can be used to download the file
        return url('storage/temp/template_' . $template->id . '.xlsx');
    }
}
```

## Authorization

Add to AuthServiceProvider:
```php
Gate::define('viewRecipients', function ($user) {
    return $user->isAdmin();
});

Gate::define('manageRecipients', function ($user) {
    return $user->isAdmin();
});

Gate::define('updateRecipient', function ($user, TemplateRecipient $recipient) {
    return $user->isAdmin();
});

Gate::define('deleteRecipient', function ($user, TemplateRecipient $recipient) {
    return $user->isAdmin();
});

Gate::define('downloadRecipientTemplate', function ($user) {
    return $user->isAdmin();
});
```

## Testing

Create feature tests in `tests/Feature/GraphQL/TemplateRecipientTest.php`.
