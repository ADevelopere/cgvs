# Storage Components Stories

This directory contains comprehensive Storybook stories for all storage components in the `nextjs/views/storage/components` folder. The stories are built following the working example pattern from `ConnectivityStatus.stories.tsx`.

## 📁 Structure

```
stories/storage/
├── MockStorageProvider.tsx          # Mock context provider and data generators
└── components/
    ├── index.ts                     # Documentation
    ├── BulkActionsBar.stories.tsx   # Floating bulk actions bar
    ├── EmptyState.stories.tsx       # Empty folder/location states
    ├── ErrorBanner.stories.tsx      # Error display with retry
    ├── FileItem.stories.tsx         # File/folder list items
    ├── LoadingSkeletons.stories.tsx # Loading placeholders
    ├── SearchBar.stories.tsx        # Debounced search input
    ├── StorageBreadcrumbs.stories.tsx # Navigation breadcrumbs
    └── StorageStatsBar.stories.tsx  # Storage statistics display
```

## 🏗️ Mock Infrastructure

### MockStorageProvider
- Provides controllable mock storage context for stories
- Includes default mock functions to prevent errors
- Uses `useMemo` for performance optimization
- Supports partial context overrides for specific scenarios

### Mock Data Generators
- `createMockFileItem()` - Generates realistic file items
- `createMockFolderItem()` - Generates folder items with counts
- `createMockStorageStats()` - Creates storage statistics
- `createMockUploadBatch()` - Mock upload state for progress tracking

### Pre-defined Data Sets
- `MOCK_DATA_SETS.empty` - Empty storage state
- `MOCK_DATA_SETS.loading` - Loading state
- `MOCK_DATA_SETS.error` - Error state
- `MOCK_DATA_SETS.withFiles` - Populated with various file types
- `MOCK_DATA_SETS.withSelection` - Items with selections
- `MOCK_DATA_SETS.uploading` - Active upload scenario

## 🎨 Story Patterns

All stories follow consistent patterns:

### 1. Component Wrapping
```tsx
const MockComponentWrapper: React.FC<Props> = (props) => {
  const mockContextValue = {
    // ... mock storage context data based on props
  };

  return (
    <MockStorageProvider mockValue={mockContextValue}>
      <YourComponent {...componentProps} />
    </MockStorageProvider>
  );
};
```

### 2. Story Configuration
```tsx
export default {
  title: "Storage/Components/ComponentName",
  component: MockComponentWrapper,
  decorators: [withGlobalStyles],
  argTypes: {
    ...commonStoryArgTypes, // Theme and language controls
    // ... component-specific controls
  },
} as Meta;
```

### 3. Multiple Scenarios
Each component includes stories for:
- Default/typical usage
- Empty states
- Loading states
- Error states
- Edge cases (very long names, many items, etc.)
- Different configurations

## 📋 Components Covered

### ✅ Completed Stories

1. **FileItem** - Individual file/folder display
   - Different file types (image, document, video, audio, archive)
   - Selected/unselected states
   - Folders vs files
   - Various file sizes and names

2. **SearchBar** - Debounced search input
   - Different debounce timings
   - Custom placeholders
   - Initial values
   - Keyboard interaction demos

3. **EmptyState** - Empty folder display
   - Root vs folder contexts
   - Upload permissions
   - Error states
   - Different help text scenarios

4. **StorageBreadcrumbs** - Navigation breadcrumbs
   - Root level
   - Single level
   - Deep paths
   - Custom location labels
   - Up button variations

5. **LoadingSkeletons** - Loading placeholders
   - List skeleton
   - Grid skeleton
   - Toolbar skeleton
   - Stats skeleton
   - Different counts

6. **StorageStatsBar** - Statistics display
   - Various file type distributions
   - Different storage sizes
   - Empty vs populated states
   - Large storage scenarios

7. **BulkActionsBar** - Bulk operations bar
   - Different selection counts
   - Appears/disappears based on selection
   - Action demonstrations
   - Dialog interactions

8. **ErrorBanner** - Error messaging
   - Different error types (network, auth, 404, etc.)
   - Context vs prop-driven errors
   - Retry functionality
   - User-friendly error mapping

### 🔄 Remaining Components to Story

The following components from `views/storage/components` still need stories:
- `DeleteConfirmDialog.tsx`
- `FileList.tsx`
- `LocationGrid.tsx`
- `PaginationControls.tsx`
- `RenameDialog.tsx`
- `SelectHeader.tsx`
- `StorageToolbar.tsx`

## 🚀 Running the Stories

```bash
# Start Storybook (from nextjs directory)
npm run storybook

# Navigate to:
# Storage > Components > [ComponentName]
```

## 🎯 Key Features

- **Realistic Mock Data**: All stories use properly typed mock data that matches the actual GraphQL types
- **Interactive Controls**: Storybook controls allow real-time manipulation of component props
- **Multiple Scenarios**: Each component has stories covering various use cases and edge cases
- **Proper TypeScript**: Full type safety with proper GraphQL type integration
- **Translation Ready**: Uses actual translation hooks for realistic text display
- **Context Mocking**: Proper storage context mocking without breaking component dependencies
- **Visual Consistency**: All stories follow the same layout and theming patterns

## 💡 Usage Tips

1. **For Development**: Use stories to develop and test components in isolation
2. **For Testing**: Stories serve as visual regression test baselines
3. **For Documentation**: Stories document component behavior and usage patterns
4. **For Collaboration**: Designers and developers can review component states together

## 🔧 Technical Notes

- All GraphQL types are properly imported and used
- Mock context uses `useMemo` for performance
- Console statements are properly handled with eslint directives
- Stories include proper descriptions and documentation
- Args are categorized and ordered for better UX