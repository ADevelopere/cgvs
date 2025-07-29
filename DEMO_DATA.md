# Demo Data Population Guide

This project includes a comprehensive demo data seeder that populates your Ktor database with sample data for testing and development.

## Quick Start

### Windows (PowerShell)
```powershell
.\scripts\seed-demo-data.ps1
```

### Windows (Command Prompt)
```cmd
.\scripts\seed-demo-data.bat
```

### Linux/macOS
```bash
./scripts/seed-demo-data.sh
```

### Using Gradle Directly
```bash
# Seed demo data
./gradlew seedDemoData

# Validate demo data
./gradlew validateDemoData

# Seed and then run application
./gradlew runWithDemoData
```

## What Gets Created

- **1 Admin User**: admin@cgsv.com (password: password)
- **Template Categories**: 5 main categories with subcategories (Arabic names)
- **Templates**: One template per main category with variables
- **Students**: 1,000 sample students with Arabic names
- **Template Variables**: Category-specific variables for each template

## Requirements

- PostgreSQL database running
- Proper database configuration in `application.conf`
- Java 24 or compatible JVM

## Configuration

Make sure your `src/main/resources/application.yaml` has the correct database settings:

```yaml
postgres:
  url: "jdbc:postgresql://localhost:5432/cgsv"
  user: "your_username"
  password: "your_password"
```

## Categories Created

1. **الشهادات الأكاديمية** (Academic Certificates)
2. **الشهادات المهنية** (Professional Certificates)  
3. **شهادات الحضور** (Attendance Certificates)
4. **شهادات التقدير** (Appreciation Certificates)
5. **الشهادات التطوعية** (Volunteer Certificates)

Each category includes subcategories and custom template variables.

## Troubleshooting

- **Database Connection Issues**: Check your PostgreSQL service and connection settings
- **Build Errors**: Run `./gradlew clean build` first
- **Permission Issues**: Make sure scripts are executable (`chmod +x scripts/*.sh`)

For more details, see `scripts/README.md`.
