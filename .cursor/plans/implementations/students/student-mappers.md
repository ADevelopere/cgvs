# Student Mappers Implementation

**File:** `client/views/student/student-mappers.ts`

**Status:** ✅ No changes needed - Already compatible with new architecture

This file contains data mapping utilities for transforming student data between different formats.

## Current Implementation

```typescript
import {
  PartialStudentUpdateInput,
  Student,
} from "@/client/graphql/generated/gql/graphql";

/**
 * Maps a student to update input
 */
export const mapStudentToPartialUpdateInput = (
  student: Student
): PartialStudentUpdateInput => {
  return {
    id: student.id,
    name: student.name,
    gender: student.gender,
    nationality: student.nationality,
    dateOfBirth: student.dateOfBirth,
    email: student.email,
    phoneNumber: student.phoneNumber,
  };
};
```

## Usage in New Architecture

### In Operations Layer

```typescript
const handleBulkUpdate = async (students: Student[]) => {
  const updatePromises = students.map(student => {
    const input = mapStudentToPartialUpdateInput(student);
    return partialUpdateStudent({ input });
  });

  await Promise.all(updatePromises);
};
```

### In Form Components

```typescript
const prepareUpdatePayload = (student: Student) => {
  const input = mapStudentToPartialUpdateInput(student);
  // Apply additional modifications if needed
  input.email = input.email?.toLowerCase();
  return input;
};
```

## Mapper Functions

### mapStudentToPartialUpdateInput

**Purpose:** Converts a complete `Student` object to a `PartialStudentUpdateInput` for GraphQL mutations.

**Input:**

```typescript
const student: Student = {
  id: 123,
  name: "John Doe",
  email: "john@example.com",
  dateOfBirth: "1990-01-15",
  gender: "MALE",
  nationality: "US",
  phoneNumber: "+966501234567",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-02T00:00:00Z",
};
```

**Output:**

```typescript
const input: PartialStudentUpdateInput = {
  id: 123,
  name: "John Doe",
  email: "john@example.com",
  dateOfBirth: "1990-01-15",
  gender: "MALE",
  nationality: "US",
  phoneNumber: "+966501234567",
  // Note: createdAt and updatedAt are excluded (not in PartialStudentUpdateInput)
};
```

## Integration with New Architecture

These mappers work seamlessly with the new renderer-based architecture:

### In Cell Update Handlers

```typescript
const handleUpdateCell = useCallback(
  async (rowId: number, columnId: string, value: unknown) => {
    // Get the current student data
    const student = students.find(s => s.id === rowId);
    if (!student) return;

    // Map to update input
    const input = mapStudentToPartialUpdateInput(student);

    // Update the specific field
    input[columnId] = value;

    // Send update
    await partialUpdateStudent({ input });
  },
  [students, partialUpdateStudent]
);
```

### In Bulk Operations

```typescript
const handleBulkDelete = async (selectedIds: number[]) => {
  const selectedStudents = students.filter(s => selectedIds.includes(s.id));

  const updates = selectedStudents.map(student => {
    const input = mapStudentToPartialUpdateInput(student);
    input.isDeleted = true; // Example soft delete
    return partialUpdateStudent({ input });
  });

  await Promise.all(updates);
};
```

## Additional Mappers (Can Be Added)

### mapStudentToCreateInput

```typescript
export const mapStudentToCreateInput = (
  student: Partial<Student>
): StudentCreateInput => {
  return {
    name: student.name || "",
    email: student.email,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    nationality: student.nationality,
    phoneNumber: student.phoneNumber,
  };
};
```

### mapStudentToFormData

```typescript
export const mapStudentToFormData = (student: Student) => {
  return {
    personalInfo: {
      name: student.name,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
    },
    contactInfo: {
      email: student.email,
      phoneNumber: student.phoneNumber,
    },
    address: {
      nationality: student.nationality,
    },
  };
};
```

### mapFormDataToStudent

```typescript
export const mapFormDataToStudent = (
  formData: FormData,
  existingStudent?: Student
): PartialStudentUpdateInput => {
  return {
    id: existingStudent?.id,
    name: formData.personalInfo.name,
    dateOfBirth: formData.personalInfo.dateOfBirth,
    gender: formData.personalInfo.gender,
    email: formData.contactInfo.email,
    phoneNumber: formData.contactInfo.phoneNumber,
    nationality: formData.address.nationality,
  };
};
```

## Type Safety

All mappers are fully type-safe:

```typescript
// TypeScript ensures all required fields are present
const input: PartialStudentUpdateInput =
  mapStudentToPartialUpdateInput(student);

// Compiler error if trying to add invalid fields
input.invalidField = "value"; // ❌ TypeScript error
```

## Why No Changes Are Needed

1. **Data Layer Only**: Mappers work with data types, not UI components
2. **Type Safe**: Use GraphQL generated types
3. **Reusable**: Can be used anywhere in the application
4. **Framework Agnostic**: Don't depend on React or table library
5. **Simple**: Pure functions with no side effects

## Testing

No changes to mapper tests are required. Example tests:

```typescript
describe("mapStudentToPartialUpdateInput", () => {
  it("should map all editable fields", () => {
    const student: Student = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      dateOfBirth: "1990-01-15",
      gender: "MALE",
      nationality: "US",
      phoneNumber: "+966501234567",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    };

    const input = mapStudentToPartialUpdateInput(student);

    expect(input).toEqual({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      dateOfBirth: "1990-01-15",
      gender: "MALE",
      nationality: "US",
      phoneNumber: "+966501234567",
    });

    // Ensure read-only fields are excluded
    expect(input).not.toHaveProperty("createdAt");
    expect(input).not.toHaveProperty("updatedAt");
  });
});
```

## Best Practices

1. **Keep Mappers Pure**: No side effects or mutations
2. **Type Everything**: Use generated GraphQL types
3. **Document Transformations**: Add comments for complex mappings
4. **Test Edge Cases**: Handle null/undefined values properly
5. **Reuse**: Create mappers for common transformations

## Summary

**Action Required:** ✅ None - This file is already compatible

The mapper functions are pure, type-safe utilities that work perfectly with the new renderer-based architecture. They provide clean data transformations without depending on UI components or table structure.
