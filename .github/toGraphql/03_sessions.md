# Session Management Migration

## GraphQL Schema Changes

Create `graphql/types/Session.graphql`:
```graphql
type Session {
  id: ID!
  userId: ID
  ipAddress: String
  userAgent: String
  lastActivity: DateTime!
}
```

Create `graphql/queries/session.graphql`:
```graphql
extend type Query {
  userSessions: [Session!]! @auth @can(ability: "viewSessions")
}
```

Create `graphql/mutations/session.graphql`:
```graphql
extend type Mutation {
  deleteSession(id: ID!): Boolean! 
    @auth 
    @can(ability: "deleteSession", find: "id")
    @field(resolver: "SessionMutator@delete")

  deleteAllSessions: Boolean! 
    @auth 
    @can(ability: "deleteAllSessions")
    @field(resolver: "SessionMutator@deleteAll")
}
```

## Resolver Implementation

Create `app/GraphQL/Mutations/SessionMutator.php`:
```php
<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\DB;

class SessionMutator
{
    public function delete($root, array $args, $context)
    {
        $user = $context->user();
        return DB::table('sessions')
            ->where('id', $args['id'])
            ->where('user_id', $user->id)
            ->delete() > 0;
    }

    public function deleteAll($root, array $args, $context)
    {
        $user = $context->user();
        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete() > 0;
    }
}
```

Create `app/GraphQL/Queries/SessionQuery.php`:
```php
<?php

namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\DB;

class SessionQuery
{
    public function userSessions($root, array $args, $context)
    {
        $user = $context->user();
        return DB::table('sessions')
            ->where('user_id', $user->id)
            ->get();
    }
}
```

## Authorization

Add to AuthServiceProvider:
```php
Gate::define('viewSessions', function ($user) {
    return true;
});

Gate::define('deleteSession', function ($user, $sessionId) {
    return DB::table('sessions')
        ->where('id', $sessionId)
        ->where('user_id', $user->id)
        ->exists();
});

Gate::define('deleteAllSessions', function ($user) {
    return true;
});
```

## Testing

Create feature tests in `tests/Feature/GraphQL/SessionTest.php`.
