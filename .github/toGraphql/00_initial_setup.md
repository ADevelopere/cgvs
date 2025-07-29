# Initial Setup

## Required Steps

1. Install Lighthouse package:
```bash
composer require nuwave/lighthouse
```

2. Publish the configuration:
```bash
php artisan vendor:publish --tag=lighthouse-config
```

3. Create initial schema file:
```bash
php artisan lighthouse:ide-helper
```

## Schema Structure

Create the following directories:
1. `graphql/schema.graphql` - Main schema file
2. `graphql/types/*.graphql` - Type definitions
3. `graphql/queries/*.graphql` - Query definitions
4. `graphql/mutations/*.graphql` - Mutation definitions

## Configuration

1. Configure Lighthouse in `config/lighthouse.php`:
```php
return [
    'route' => [
        'prefix' => 'graphql',
        'middleware' => ['api'],
    ],
    'guards' => [
        'api' => 'sanctum',
    ],
    'schema' => [
        'register' => base_path('graphql/schema.graphql'),
    ],
    'debug' => env('LIGHTHOUSE_DEBUG', env('APP_DEBUG', false)),
];
```

2. Set up error handlers:
```php
'error_handlers' => [
    \App\GraphQL\Errors\AuthenticationErrorHandler::class,
],
```
