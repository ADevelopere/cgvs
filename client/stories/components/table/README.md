# Table Component Stories

This directory contains comprehensive Storybook stories for the Table component, showcasing all its features and capabilities.

## Files Structure

```
stories/components/table/
├── README.md                           # This documentation
├── tableDecorator.tsx                  # Decorator that wraps table with all necessary contexts
├── mockData.ts                         # Utilities for generating mock data
├── Table.stories.tsx                   # Main table component stories
├── ColumnVisibilityPanel.stories.tsx  # Column visibility management
├── Filtering.stories.tsx              # Table filtering features
├── Pagination.stories.tsx             # Pagination functionality
├── Sorting.stories.tsx                # Sorting capabilities
└── FullFeatures.stories.tsx           # All features combined
```

## Overview

The Table component is a complex, feature-rich data table that supports:

- ✅ **Data Display**: Multiple column types (text, number, date, boolean, select, country, phone, custom)
- ✅ **Pagination**: Server-side and client-side pagination with customizable page sizes
- ✅ **Sorting**: Single and multi-column sorting with various data types
- ✅ **Filtering**: Advanced filtering per column with different operations
- ✅ **Row Selection**: Single and multi-row selection with checkboxes
- ✅ **Column Management**: Show/hide columns, resize columns, pin columns
- ✅ **Row Resizing**: Adjustable row heights
- ✅ **Loading States**: Built-in loading indicators
- ✅ **Responsive Design**: Works across different screen sizes
- ✅ **Internationalization**: Multiple language support
- ✅ **Theming**: Light and dark theme support

## Key Components

### TableDecorator (`tableDecorator.tsx`)

A utility decorator that wraps table components with all necessary contexts:

- `TableLocaleProvider`: Provides internationalization
- `TableProvider`: Main table context with data, columns, and configuration
- `AppRouterCacheProvider`: Next.js app router compatibility

```tsx
interface TableDecoratorConfig {
  data: any[];
  columns: EditableColumn[];
  locale?: SupportedLocale;
  isLoading?: boolean;
  paginationInfo?: PaginationInfo | null;
  rowSelectionEnabled?: boolean;
  enableRowResizing?: boolean;
  onPageChange?: (newPage: number) => void;
  onRowsPerPageChange?: (newRowsPerPage: number) => void;
  onLoadMoreRows?: (params: LoadMoreParams) => Promise<void>;
  onFilterChange?: (filterClause: FilterClause | null, columnId: string) => void;
  onSort?: (orderByClause: { column: string; order: "ASC" | "DESC" }[]) => void;
  rowsPerPageOptions?: number[];
  initialPageSize?: number;
  containerHeight?: string;
  containerWidth?: string;
}
```

### Mock Data Utilities (`mockData.ts`)

Provides utilities for generating realistic test data:

#### Column Generators
- `createPersonColumns()`: Personal information columns
- `createProductColumns()`: Product catalog columns  
- `createOrderColumns()`: Order management columns
- `createMixedColumns()`: All column types for testing

#### Data Generators
- `generatePersonData(rowCount)`: People with names, emails, ages, etc.
- `generateProductData(rowCount)`: Products with categories, prices, stock
- `generateOrderData(rowCount)`: Orders with statuses, dates, totals
- `generateMixedData(rowCount)`: Mixed data types for testing
- `generateMockData(config)`: Generic data generator

#### Column Types Supported
- `text`: Names, descriptions, free text
- `number`: Ages, prices, quantities, IDs
- `date`: Birth dates, order dates, release dates
- `boolean`: Active status, availability flags
- `select`: Categories, statuses with predefined options
- `country`: Country names
- `phone`: Phone numbers
- `custom`: Custom formatted data

## Story Categories

### 1. Main Table Stories (`Table.stories.tsx`)

Comprehensive stories showing different data types and configurations:

- **Default**: Basic person data table
- **WithRowSelection**: Enables row selection checkboxes
- **WithPagination**: Product data with pagination
- **LoadingState**: Shows loading indicators
- **LargeDataset**: 500 rows with all features
- **ProductCatalog**: Product-focused example
- **OrderManagement**: Order-focused example
- **SmallDataset**: Minimal data for testing
- **AllColumnTypes**: Every column type demonstrated

### 2. Column Visibility (`ColumnVisibilityPanel.stories.tsx`)

Stories focused on column management:

- **Default**: Column visibility panel interface

### 3. Filtering (`Filtering.stories.tsx`)

Demonstrates table filtering capabilities:

- **WithFiltering**: Enabled column filters
- **WithoutFiltering**: Baseline without filters
- **SmallDatasetWithFiltering**: Testing with fewer rows

#### Filter Operations Supported

**Text Filters:**
- Contains, Not Contains
- Equals, Not Equals  
- Starts With, Ends With
- Is Empty, Is Not Empty

**Number Filters:**
- Equals, Not Equals
- Greater Than, Greater Than or Equal
- Less Than, Less Than or Equal
- Is Null, Is Not Null

**Date Filters:**
- Between, Is, Is Not
- Is After, Is Before
- Is On or After, Is On or Before
- Is Empty, Is Not Empty

### 4. Pagination (`Pagination.stories.tsx`)

Shows pagination in different scenarios:

- **WithPagination**: Standard pagination (500 rows, 25 per page)
- **LargePagination**: Large dataset (1000 rows, 50 per page)
- **SmallPageSize**: Small pages (200 rows, 10 per page)
- **WithoutPagination**: All data shown at once

### 5. Sorting (`Sorting.stories.tsx`)

Demonstrates sorting functionality:

- **WithSorting**: Single column sorting
- **MultiColumnSorting**: Multiple column sorting
- **WithoutSorting**: No sorting capability
- **LargeDatasetSorting**: Sorting with large datasets

### 6. Full Features (`FullFeatures.stories.tsx`)

Complete integration stories with all features:

- **AllFeatures**: Everything enabled (pagination, sorting, filtering, selection)
- **BasicFeatures**: Common feature combination
- **MinimalTable**: Bare minimum functionality
- **LoadingWithFeatures**: All features with loading state

## Usage Examples

### Basic Table Setup

```tsx
import { withTableContexts } from "./tableDecorator";
import { generatePersonData, createPersonColumns } from "./mockData";

const data = generatePersonData(100);
const columns = createPersonColumns();

const tableConfig = {
  data,
  columns,
  rowSelectionEnabled: true,
  containerHeight: "600px",
};

const TableWithContexts = withTableContexts(tableConfig);
return TableWithContexts(() => <Table />, {});
```

### With Pagination

```tsx
const tableConfig = {
  data: paginatedData,
  columns,
  paginationInfo: {
    currentPage: 1,
    perPage: 25,
    total: 500,
    lastPage: 20,
    hasMorePages: true,
    count: 25,
    firstItem: 1,
    lastItem: 25,
  },
  onPageChange: (page) => console.log("Page changed:", page),
  onRowsPerPageChange: (size) => console.log("Page size changed:", size),
};
```

### With Filtering and Sorting

```tsx
const tableConfig = {
  data: processedData,
  columns: columns.map(col => ({ ...col, sortable: true, filterable: true })),
  onSort: (orderBy) => console.log("Sort changed:", orderBy),
  onFilterChange: (filter, columnId) => console.log("Filter changed:", filter, columnId),
};
```

## Customization

### Adding New Column Types

1. Update the `ColumnTypes` union in `@/types/table.type.ts`
2. Add the generator logic in `generateValueForColumn()` in `mockData.ts`
3. Create test columns in your column generator functions

### Custom Data Scenarios

Create your own data generator functions:

```tsx
export const generateCustomData = (rowCount: number) => {
  return Array.from({ length: rowCount }, (_, i) => ({
    id: i + 1,
    customField: `Custom ${i}`,
    // ... your custom fields
  }));
};
```

### Localization

The table supports multiple locales through `TableLocaleProvider`. The decorator accepts a `locale` parameter:

```tsx
const tableConfig = {
  // ... other config
  locale: "ar", // or "en"
};
```

## Testing Features

Each story includes interactive controls in Storybook:

- **Theme**: Switch between light and dark themes
- **Language**: Toggle between supported languages  
- **Data Count**: Adjust number of rows
- **Feature Toggles**: Enable/disable specific functionality
- **Loading States**: Test loading indicators
- **Pagination Settings**: Adjust page sizes and options

## Performance Considerations

- **Large Datasets**: The table uses virtualization for large datasets
- **Filtering**: Client-side filtering is demonstrated but server-side is recommended for large data
- **Sorting**: Multi-column sorting can be performance-intensive with large datasets
- **Memory**: Mock data generators use faker with seeded values for consistency

## Integration with Real Data

To integrate with real data:

1. Replace mock data generators with your API calls
2. Implement server-side pagination, filtering, and sorting
3. Handle loading states appropriately
4. Add error handling for failed requests
5. Implement optimistic updates for editable cells

## Browser Support

The table component works in all modern browsers with the following features:

- CSS Grid and Flexbox support
- Modern JavaScript (ES2018+)
- ResizeObserver API (for column resizing)
- Intersection Observer API (for virtual scrolling)

## Accessibility

The table includes accessibility features:

- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Focus management
- High contrast support

---

*Generated stories provide a comprehensive testing environment for the Table component, covering all major use cases and feature combinations.*