# Demo Data Seeder

This directory contains scripts to populate the Ktor CGSV application with demo data for testing and development purposes.

## Overview

The demo data seeder creates:
- **1 Admin User**: admin@cgsv.com (password: password)
- **Template Categories**: 5 main categories with subcategories
- **Templates**: One template per main category with variables
- **Students**: 1,000 sample students with Arabic names
- **Template Variables**: Category-specific variables for each template

## Usage

### Method 1: Using Gradle Task (Recommended)

```bash
# Run the seeder
./gradlew seedDemoData

# Validate the data
./gradlew validateDemoData

# Or build and seed in one command
./gradlew build seedDemoData
```

### Method 2: Using PowerShell Script (Windows)

```powershell
# Navigate to project root
cd c:\Users\Admin\Projects\cgsv

# Run the PowerShell script
.\scripts\seed-demo-data.ps1
```

### Method 3: Using Bash Script (Linux/macOS)

```bash
# Navigate to project root
cd /path/to/cgsv

# Make script executable
chmod +x scripts/seed-demo-data.sh

# Run the script
./scripts/seed-demo-data.sh
```

### Method 4: Direct Kotlin Execution

```bash
# Compile and run the main class directly
./gradlew run --args="scripts.SeedDemoDataApp"
```

## Generated Data

### Admin User
- **Email**: admin@cgsv.com
- **Password**: password
- **Role**: Admin
- **Name**: مدير النظام

### Template Categories

1. **الشهادات الأكاديمية** (Academic Certificates)
   - شهادات البكالوريوس (Bachelor's Certificates)
   - شهادات الماجستير (Master's Certificates)

2. **الشهادات المهنية** (Professional Certificates)
   - شهادات التدريب التقني (Technical Training Certificates)
   - شهادات الإدارة (Management Certificates)

3. **شهادات الحضور** (Attendance Certificates)
   - شهادات المؤتمرات (Conference Certificates)
   - شهادات ورش العمل (Workshop Certificates)

4. **شهادات التقدير** (Appreciation Certificates)
   - شهادات التفوق (Excellence Certificates)
   - شهادات التميز (Distinguished Certificates)

5. **الشهادات التطوعية** (Volunteer Certificates)
   - شهادات العمل التطوعي (Volunteer Work Certificates)
   - شهادات خدمة المجتمع (Community Service Certificates)

### Templates

Each main category gets one template with category-specific variables:

#### Base Variables (All Templates)
- **اسم الطالب** (Student Name) - Text
- **تاريخ الإصدار** (Issue Date) - Date
- **الرقم المرجعي** (Reference Number) - Text with pattern

#### Category-Specific Variables

**Academic Certificates**:
- **التخصص** (Specialization) - Text
- **المعدل** (GPA) - Number (0-5 with 2 decimal places)

**Professional Certificates**:
- **المجال** (Field) - Select (IT, Business, HR, Digital Marketing, Project Management)
- **مدة التدريب** (Training Duration) - Number (1-1000 hours)

**Attendance Certificates**:
- **اسم الفعالية** (Event Name) - Text
- **مكان الانعقاد** (Event Location) - Text

**Appreciation Certificates**:
- **سبب التقدير** (Reason for Appreciation) - Text
- **المستوى** (Level) - Select (Excellent, Very Good, Good, Acceptable)

**Volunteer Certificates**:
- **نوع العمل التطوعي** (Type of Volunteer Work) - Text
- **عدد ساعات التطوع** (Volunteer Hours) - Number

### Students

1,000 students with:
- **Arabic Names**: Realistic first, middle, and last names
- **Email**: 70% probability of having email
- **Phone**: 60% probability of having phone number (Saudi format)
- **Date of Birth**: 80% probability, years 1980-2004
- **Gender**: 90% probability (male/female)
- **Nationality**: 75% probability (Saudi and other Arab nationalities)

## Database Requirements

Ensure your database configuration is properly set up in `application.yaml`:

```yaml
postgres:
  url: "jdbc:postgresql://localhost:5432/cgsv"
  user: "your_username"
  password: "your_password"
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your database is running
   - Verify connection settings in `application.conf`
   - Ensure the database exists

2. **Build Errors**
   - Run `./gradlew clean build` first
   - Check Java version compatibility (requires JVM 24)

3. **Table Creation Errors**
   - Ensure your database user has CREATE TABLE privileges
   - Check if tables already exist (seeder will skip existing data)

4. **Memory Issues**
   - Increase JVM heap size: `export GRADLE_OPTS="-Xmx2G"`

### Clean Database

To start fresh:

```sql
-- Connect to your database and run:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then run the seeder again.

## Development

### Customizing Data

To modify the generated data:

1. Edit `DemoDataSeeder.kt`
2. Modify the data arrays (names, categories, etc.)
3. Adjust probability percentages for optional fields
4. Change the number of students generated

### Adding New Categories

1. Update `templateCategoriesData` in `DemoDataSeeder.kt`
2. Add a new case in `createTemplateVariables()`
3. Create a new `create*Variables()` method

### Testing

Run the seeder against a test database first:

```bash
# Set test database in application.yaml
postgres:
  url: "jdbc:postgresql://localhost:5432/cgsv_test"
  user: "test_user"
  password: "test_password"

# Run seeder
./gradlew seedDemoData
```

## License

This demo data seeder is part of the CGSV project.
