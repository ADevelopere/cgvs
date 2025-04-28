# Certificate Generation and Verification System (CGSV)

A Laravel-based system for generating and verifying certificates.

## Requirements

### PHP Extensions
- PHP >= 8.3
- PDO PHP Extension
- SQLite3 PHP Extension
- JSON PHP Extension
- Fileinfo PHP Extension
- OpenSSL PHP Extension
- PDO SQLite PHP Extension

To install required SQLite extensions:
```bash
# For Ubuntu/Debian
sudo apt-get install php8.3-sqlite3

# For other PHP versions, replace 8.3 with your PHP version
```

## Installation

1. Clone the repository
```bash
git clone [repository-url]
cd cgsv_php
```

2. Install PHP dependencies
```bash
composer install
```

3. Create environment file
```bash
cp .env.example .env
php artisan key:generate
```

4. Create SQLite database
```bash
touch database/database.sqlite
```

5. Run migrations
```bash
php artisan migrate
```

## Running Tests

The project uses PHPUnit for testing. To run tests:

```bash
# Run all tests
php artisan test

# Run specific test file
php artisan test tests/Feature/Models/TemplateTest.php

# Run tests with coverage report
php artisan test --coverage
```

### Database Testing
Tests use SQLite in-memory database. Make sure you have the SQLite PHP extension installed:
```bash
php -m | grep sqlite
```

Should show:
```
pdo_sqlite
sqlite3
```

If not found, install the SQLite extension as shown in the Requirements section.

## Development

1. Start development server
```bash
php artisan serve
```

2. Run tests during development
```bash
php artisan test --parallel
```


