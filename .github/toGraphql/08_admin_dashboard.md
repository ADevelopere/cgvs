# Admin Dashboard Migration

## GraphQL Schema Changes

Create `graphql/types/Dashboard.graphql`:
```graphql
type DashboardStats {
  totalTemplates: Int!
  totalCertificates: Int!
  recentActivity: [Activity!]!
}

type Activity {
  id: ID!
  type: String!
  description: String!
  timestamp: DateTime!
}
```

Create `graphql/queries/dashboard.graphql`:
```graphql
extend type Query {
  adminDashboard: DashboardStats! 
    @guard 
    @can(ability: "admin")
    @field(resolver: "DashboardQuery@stats")
}
```

## Resolver Implementation

Create `app/GraphQL/Queries/DashboardQuery.php`:
```php
<?php

namespace App\GraphQL\Queries;

use App\Models\Template;
use App\Models\TemplateRecipient;

class DashboardQuery
{
    public function stats()
    {
        return [
            'totalTemplates' => Template::count(),
            'totalCertificates' => TemplateRecipient::count(),
            'recentActivity' => $this->getRecentActivity(),
        ];
    }

    private function getRecentActivity()
    {
        // Combine and sort recent activities from different sources
        $activities = collect();

        // Add template creation activities
        Template::latest()
            ->take(5)
            ->get()
            ->each(function ($template) use ($activities) {
                $activities->push([
                    'id' => 'template_' . $template->id,
                    'type' => 'TEMPLATE_CREATED',
                    'description' => "Template '{$template->name}' was created",
                    'timestamp' => $template->created_at,
                ]);
            });

        // Add certificate generation activities
        TemplateRecipient::latest()
            ->take(5)
            ->with('template')
            ->get()
            ->each(function ($recipient) use ($activities) {
                $activities->push([
                    'id' => 'recipient_' . $recipient->id,
                    'type' => 'CERTIFICATE_GENERATED',
                    'description' => "Certificate generated for {$recipient->template->name}",
                    'timestamp' => $recipient->created_at,
                ]);
            });

        return $activities
            ->sortByDesc('timestamp')
            ->take(10)
            ->values()
            ->all();
    }
}
```

## Authorization

No additional authorization needed as we're using the existing 'admin' gate:
```php
Gate::define('admin', function ($user) {
    return $user->isAdmin();
});
```

## Testing

Create feature tests in `tests/Feature/GraphQL/DashboardTest.php`.
