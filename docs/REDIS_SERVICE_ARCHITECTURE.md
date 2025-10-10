# Redis Service Architecture Documentation

## Overview

This document describes the Redis service architecture implemented for the CGVS application, featuring a clean adapter pattern that supports multiple Redis providers.

---

## 🏗️ Architecture

### Design Pattern: Adapter Pattern

```mermaid
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  (Rate Limiting, Caching, Session Management)               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ uses
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              IRedisService (Interface)                       │
│  Common contract for all Redis implementations              │
│  - get(), set(), incr(), del()                              │
│  - expire(), ttl(), pipeline()                              │
│  - ping(), disconnect()                                     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ implements
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
┌───────────────────────┐  ┌───────────────────────┐
│  LocalRedisAdapter    │  │  UpstashRedisAdapter  │
│  (ioredis)           │  │  (@upstash/redis)     │
│                       │  │                       │
│  - Persistent TCP     │  │  - REST API           │
│  - Low latency        │  │  - Serverless         │
│  - Self-hosted        │  │  - Fully managed      │
└───────┬───────────────┘  └────────┬──────────────┘
        │                           │
        ▼                           ▼
┌──────────────────┐       ┌──────────────────┐
│ Local Redis      │       │ Upstash Cloud    │
│ (Docker)         │       │ (https://)       │
│ localhost:6379   │       │ REST endpoint    │
└──────────────────┘       └──────────────────┘
```

### Key Components

#### 1. **IRedisService** (Interface)

- **Location**: `server/services/redis/IRedisService.ts`
- **Purpose**: Defines the contract that all Redis adapters must implement
- **Benefits**:
  - Type safety
  - Interchangeable implementations
  - Easy testing with mocks

#### 2. **LocalRedisAdapter**

- **Location**: `server/services/redis/LocalRedisAdapter.ts`
- **Technology**: ioredis (npm package)
- **Use Case**: Development and self-hosted production
- **Features**:
  - Persistent TCP connection
  - Full Redis command support
  - Connection retry logic
  - Event logging (connect, error, ready)

#### 3. **UpstashRedisAdapter**

- **Location**: `server/services/redis/UpstashRedisAdapter.ts`
- **Technology**: @upstash/redis (npm package)
- **Use Case**: Serverless production (Vercel, Netlify, etc.)
- **Features**:
  - REST-based (stateless)
  - No persistent connections
  - Auto-scaling
  - Fully managed

#### 4. **RedisServiceFactory**

- **Location**: `server/services/redis/RedisServiceFactory.ts`
- **Pattern**: Factory + Singleton
- **Purpose**: Creates and manages the appropriate Redis adapter
- **Selection Logic**:

  ```typescript
  REDIS_PROVIDER=local  → LocalRedisAdapter
  REDIS_PROVIDER=upstash → UpstashRedisAdapter
  ```

---

## 📦 Files Created

### Core Service Files

```list
server/services/redis/
├── IRedisService.ts           # Interface definition
├── LocalRedisAdapter.ts       # Local Redis (ioredis)
├── UpstashRedisAdapter.ts     # Upstash Redis (@upstash)
├── RedisServiceFactory.ts     # Factory + Singleton
├── index.ts                   # Public exports
└── README.md                  # Service documentation
```

### Updated Files

```list
server/lib/
├── ratelimit.ts              # Updated to use Redis service
├── env.ts                    # Added Redis provider validation
└── index.ts                  # Export env validation

containers/redis/
├── docker-compose.yml        # Redis container
├── redis.conf               # Redis configuration
└── README.md                # Redis setup guide

Root:
├── .env.example             # Environment template
└── middleware.ts            # Request logging
```

---

## 🔧 Environment Configuration

### Local Redis (Development)

```bash
# Provider selection
REDIS_PROVIDER=local

# Connection URL
REDIS_URL=redis://localhost:6379
```

**Setup:**

```bash
cd containers/redis
docker compose up -d
```

### Upstash Redis (Production)

```bash
# Provider selection
REDIS_PROVIDER=upstash

# Upstash credentials (from https://console.upstash.com/)
UPSTASH_REDIS_REST_URL=https://your-redis-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token-here
```

**No additional setup needed** - cloud-based service!

---

## 💡 Usage Examples

### 1. Basic Operations

```typescript
import { redisService } from '@/server/services/redis';

// Set with expiration
await redisService.set('session:123', 'user-data', { ex: 3600 });

// Get value
const data = await redisService.get('session:123');

// Increment counter
const views = await redisService.incr('page:views');

// Delete key
await redisService.del('session:123');
```

### 2. Rate Limiting (Current Implementation)

```typescript
// server/lib/ratelimit.ts
import { redisService } from '@/server/services/redis';

class RateLimiter {
    async limitSimple(identifier: string) {
        const key = `ratelimit:${identifier}`;
        const count = await redisService.get(key);
        
        if (!count) {
            await redisService.set(key, '1', { ex: 60 });
            return { success: true, remaining: 99 };
        }
        
        const current = parseInt(count, 10);
        if (current >= 100) {
            return { success: false, remaining: 0 };
        }
        
        await redisService.incr(key);
        return { success: true, remaining: 100 - current };
    }
}
```

### 3. Caching

```typescript
async function getTemplateWithCache(id: string) {
    const cacheKey = `cache:template:${id}`;
    
    // Try cache first
    const cached = await redisService.get(cacheKey);
    if (cached) {
        return JSON.parse(cached);
    }
    
    // Fetch from database
    const template = await db.query.templates.findFirst({
        where: eq(templates.id, id)
    });
    
    // Cache for 1 hour
    await redisService.set(
        cacheKey,
        JSON.stringify(template),
        { ex: 3600 }
    );
    
    return template;
}
```

---

## 🚀 Benefits

### 1. **Flexibility**

- Switch providers without code changes
- Environment-based configuration
- Easy to test with mocks

### 2. **Type Safety**

- Full TypeScript support
- Compile-time error checking
- IntelliSense support

### 3. **Maintainability**

- Clean separation of concerns
- Single Responsibility Principle
- Easy to extend with new providers

### 4. **Production Ready**

- Automatic provider selection
- Environment validation
- Graceful error handling
- Health checks built-in

### 5. **Developer Experience**

- Simple API
- Comprehensive documentation
- Docker setup for local development
- Clear error messages

---

## 🔄 Provider Comparison

| Aspect | Local Redis | Upstash Redis |
|--------|-------------|---------------|
| **Package** | ioredis | @upstash/redis |
| **Connection** | TCP (persistent) | REST (stateless) |
| **Setup** | Docker required | Cloud-based |
| **Cost** | Free (self-hosted) | Free tier + usage-based |
| **Latency** | ~1ms (local) | ~50-200ms (network) |
| **Scaling** | Manual | Automatic |
| **Maintenance** | Self-managed | Fully managed |
| **Best For** | Dev, self-hosted prod | Serverless deployments |
| **Deployment** | VPS, Docker, K8s | Vercel, Netlify, Lambda |

---

## 📊 Integration Points

### Current Integrations

1. **Rate Limiting** (`server/lib/ratelimit.ts`)
   - GraphQL API: 100 req/min
   - Auth endpoints: 10 req/15min
   - General API: 200 req/min

### Future Integrations

1. **Session Storage**
   - Replace database sessions with Redis
   - Faster session lookups
   - Auto-expiration

2. **Caching**
   - GraphQL query results
   - Database queries
   - Computed values

3. **Real-time Features**
   - Pub/Sub for notifications
   - Live updates
   - WebSocket state

4. **Queue Management**
   - Background jobs
   - Email queue
   - Report generation

---

## 🧪 Testing

### Mock Redis Service

```typescript
// In tests
jest.mock('@/server/services/redis', () => ({
    redisService: {
        get: jest.fn(),
        set: jest.fn(),
        incr: jest.fn(),
        del: jest.fn(),
    }
}));

// Test rate limiting
it('should limit requests', async () => {
    const { redisService } = require('@/server/services/redis');
    redisService.get.mockResolvedValue('100');
    
    const result = await checkRateLimit('user-ip');
    expect(result.success).toBe(false);
});
```

### Health Check Endpoint

```typescript
// Add to API routes
export async function GET() {
    const redisHealth = await RedisServiceFactory.healthCheck();
    
    return Response.json({
        status: redisHealth ? 'healthy' : 'unhealthy',
        services: {
            redis: redisHealth
        }
    });
}
```

---

## 🔐 Security Considerations

### Local Redis

```bash
# Production: Enable authentication in redis.conf
requirepass your-strong-password

# Update connection URL
REDIS_URL=redis://:your-strong-password@localhost:6379
```

### Upstash Redis

- REST tokens are automatically secure
- HTTPS by default
- No need for additional authentication

---

## 📈 Performance Optimization

### Connection Pooling (Local)

```typescript
// LocalRedisAdapter already includes:
- maxRetriesPerRequest: 3
- Automatic reconnection
- Retry strategy with exponential backoff
```

### Pipeline Operations

```typescript
// Batch multiple operations
await redisService.pipeline([
    { command: 'set', args: ['key1', 'val1'] },
    { command: 'set', args: ['key2', 'val2'] },
    { command: 'incr', args: ['counter'] },
]);
```

---

## 🛠️ Troubleshooting

### Problem: Local Redis not connecting

**Solution:**

```bash
# Check if Redis is running
docker compose ps

# Restart Redis
docker compose restart redis

# View logs
docker compose logs -f redis
```

### Problem: Upstash connection errors

**Solution:**

1. Verify URL starts with `https://`
2. Check token is correct (copy from Upstash console)
3. Ensure `REDIS_PROVIDER=upstash` is set

### Problem: Rate limiting not working

**Solution:**

```bash
# Test Redis connection
docker exec -it cgvs_redis redis-cli ping
# Should return: PONG

# Check keys
docker exec -it cgvs_redis redis-cli keys 'ratelimit:*'
```

---

## 🎯 Migration Path

### Phase 1: ✅ Current (Complete)

- [x] Redis service interface
- [x] Local Redis adapter
- [x] Upstash Redis adapter
- [x] Factory pattern
- [x] Rate limiting integration
- [x] Environment validation

### Phase 2: 🔄 Next Steps

- [ ] Session storage migration
- [ ] GraphQL query caching
- [ ] Template caching
- [ ] Real-time pub/sub

### Phase 3: 🚀 Advanced

- [ ] Distributed locking
- [ ] Queue management
- [ ] Analytics tracking
- [ ] Performance monitoring

---

## 📝 Comparison with Previous Implementation

### Before (Upstash Direct)

```typescript
// ❌ Tightly coupled to Upstash
import { Redis } from '@upstash/redis';
const redis = new Redis({ url: '...', token: '...' });

// ❌ Doesn't work with local Redis
// ❌ Hard to test
// ❌ No flexibility
```

### After (Service Architecture)

```typescript
// ✅ Works with any provider
import { redisService } from '@/server/services/redis';

// ✅ Environment-based provider selection
// ✅ Easy to test with mocks
// ✅ Type-safe interface
// ✅ Graceful error handling
```

---

## 🎓 Learning Resources

- [ioredis Documentation](https://github.com/redis/ioredis)
- [Upstash Documentation](https://docs.upstash.com/redis)
- [Redis Commands](https://redis.io/commands)
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)

---

## ✅ Summary

The Redis service architecture provides:

1. **Flexibility**: Switch between local and cloud Redis without code changes
2. **Type Safety**: Full TypeScript support with interfaces
3. **Maintainability**: Clean adapter pattern, easy to extend
4. **Production Ready**: Environment validation, health checks, error handling
5. **Developer Friendly**: Docker setup, comprehensive docs, simple API

**Current Status**: ✅ Fully implemented and ready for use!

**Provider**: Local Redis (Docker) for development
**Future**: Can switch to Upstash for serverless production with zero code changes
