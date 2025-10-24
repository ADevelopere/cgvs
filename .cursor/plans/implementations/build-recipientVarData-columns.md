# buildDataColumns Implementation

```typescript
export const buildDataColumns = (
  variables: Graphql.TemplateVariable[],
  strings: RecipientVariableDataTranslation,
  onUpdateCell: (rowId: number, columnId: string, value: unknown) => Promise<void>
): AnyColumn<RecipientWithVariableValues>[] => {
  
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});

  const columns: AnyColumn<RecipientWithVariableValues>[] = [
    {
      id: "studentName",
      type: "viewonly",
      resizable: true,
      initialWidth: 200,
      widthStorageKey: "recipient_variable_data_student_name_column_width",
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer
          label={strings.studentName}
          onSort={() => { /* sort handler */ }}
          onFilter={(e) => {
            setFilterAnchor(e.currentTarget);
            setActiveFilterColumn(column.id);
          }}
          isFiltered={!!filterValues[column.id]}
          filterPopoverRenderer={() => (
            <TextFilterPopover
              anchorEl={filterAnchor}
              open={activeFilterColumn === column.id}
              onClose={() => setActiveFilterColumn(null)}
              value={filterValues[column.id]}
              onChange={(value) => setFilterValues({ ...filterValues, [column.id]: value })}
            />
          )}
        />
      ),
      viewRenderer: ({ row }) => (
        <TextViewRenderer value={row.studentName} />
      ),
    },
    // ... variable columns
  ];
  
  // For each variable, create column with appropriate renderers
  sortedVariables.forEach(variable => {
    columns.push({
      id: `var_${variable.id}`,
      type: "editable",
      resizable: true,
      headerRenderer: ({ column }) => (
        <BaseHeaderRenderer label={variable.name || `Variable ${variable.id}`} />
      ),
      viewRenderer: ({ row }) => {
        const value = row.variableValues?.[variable.id];
        switch(variable.type) {
          case "TEXT": return <TemplateTextViewRenderer value={value} config={variable} />;
          case "NUMBER": return <TemplateNumberViewRenderer value={value} config={variable} />;
          // ...
        }
      },
      editRenderer: ({ row, onSave, onCancel }) => {
        const value = row.variableValues?.[variable.id];
        switch(variable.type) {
          case "TEXT": return <TemplateTextEditRenderer value={value} onSave={onSave} onCancel={onCancel} config={variable} />;
          // ...
        }
      },
      onUpdate: (rowId, value) => onUpdateCell(rowId, `var_${variable.id}`, value),
    });
  });
  
  return columns;
};
```
