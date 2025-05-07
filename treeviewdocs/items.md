The items can be defined with the items prop, which expects an array of objects.

The items prop should keep the same reference between two renders except if you want to apply new items. Otherwise, the Tree View will re-generate its entire structure.
import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function BasicRichTreeView() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} />
    </Box>
  );
}
Item identifier

Each item must have a unique identifier.

This identifier is used internally to identify the item in the various models and to track the item across updates.

By default, the Rich Tree View component looks for a property named id in the data set to get that identifier:

const ITEMS = [{ id: 'tree-view-community' }];

<RichTreeView items={ITEMS} />;

Copy
If the item's identifier is not called id, then you need to use the getItemId prop to tell the Rich Tree View component where it is located.

The following demo shows how to use getItemId to grab the unique identifier from a property named internalId:

const ITEMS = [{ internalId: 'tree-view-community' }];

function getItemId(item) {
  return item.internalId;
}

<RichTreeView items={ITEMS} getItemId={getItemId} />;

import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  internalId: string;
  label: string;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
  {
    internalId: 'grid',
    label: 'Data Grid',
    children: [
      { internalId: 'grid-community', label: '@mui/x-data-grid' },
      { internalId: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { internalId: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    internalId: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { internalId: 'pickers-community', label: '@mui/x-date-pickers' },
      { internalId: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    internalId: 'charts',
    label: 'Charts',
    children: [{ internalId: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    internalId: 'tree-view',
    label: 'Tree View',
    children: [{ internalId: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

const getItemId = (item: MuiXProduct) => item.internalId;

export default function GetItemId() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemId={getItemId} />
    </Box>
  );
}
Just like the items prop, the getItemId function should keep the same JavaScript reference between two renders. Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the React.useCallback hook if the function reuses something from the component scope.


Item label

Each item must have a label which does not need to be unique.

By default, the Rich Tree View component looks for a property named label in the data set to get that label:

const ITEMS = [{ label: '@mui/x-tree-view' }];

<RichTreeView items={ITEMS} />;

Copy
If the item's label is not called label, then you need to use the getItemLabel prop to tell the Rich Tree View component where it's located:

The following demo shows how to use getItemLabel to grab the unique identifier from a property named name:

const ITEMS = [{ name: '@mui/x-tree-view' }];

function getItemLabel(item) {
  return item.name;
}

<RichTreeView items={ITEMS} getItemLabel={getItemLabel} />;
import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

type MuiXProduct = TreeViewBaseItem<{
  id: string;
  name: string;
}>;

const MUI_X_PRODUCTS: MuiXProduct[] = [
  {
    id: 'grid',
    name: 'Data Grid',
    children: [
      { id: 'grid-community', name: '@mui/x-data-grid' },
      { id: 'grid-pro', name: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', name: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    name: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', name: '@mui/x-date-pickers' },
      { id: 'pickers-pro', name: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    name: 'Charts',
    children: [{ id: 'charts-community', name: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    name: 'Tree View',
    children: [{ id: 'tree-view-community', name: '@mui/x-tree-view' }],
  },
];

const getItemLabel = (item: MuiXProduct) => item.name;

export default function GetItemLabel() {
  return (
    <Box sx={{ minHeight: 352, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} getItemLabel={getItemLabel} />
    </Box>
  );
}


Just like the items prop, the getItemLabel function should keep the same JavaScript reference between two renders. Otherwise, the Tree View will re-generate its entire structure.

It could be achieved by either defining the prop outside the component scope or by memoizing using the React.useCallback hook if the function reuses something from the component scope.

Unlike the Simple Tree View component, the Rich Tree View component only supports string labels, you cannot pass React nodes to it.

Disabled items

Use the isItemDisabled prop on the Rich Tree View to disable interaction and focus on a Tree Item:

function isItemDisabled(item) {
  return item.disabled ?? false;
}

<RichTreeView isItemDisabled={isItemDisabled} />;

Just like the items prop, the isItemDisabled function should keep the same JavaScript reference between two renders. Otherwise, the Tree View will re-generate its entire structure.

This can be achieved by either defining the prop outside the component scope or by memoizing using the React.useCallback hook if the function reuses something from the component scope.

Imperative API

To use the apiRef object, you need to initialize it using the useTreeViewApiRef hook as follows:

const apiRef = useTreeViewApiRef();

return <RichTreeView apiRef={apiRef} items={ITEMS}>;

Copy
When your component first renders, apiRef will be undefined. After this initial render, apiRef holds methods to interact imperatively with the Tree View.

Get an item by ID

Use the getItem API method to get an item by its ID.

const item = apiRef.current.getItem(
  // The id of the item to retrieve
  itemId,
);

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function ApiMethodGetItem() {
  const apiRef = useTreeViewApiRef();
  const [selectedItem, setSelectedItem] = React.useState<TreeViewBaseItem | null>(
    null,
  );

  const handleSelectedItemsChange = (
    event: React.SyntheticEvent | null,
    itemId: string | null,
  ) => {
    if (itemId == null) {
      setSelectedItem(null);
    } else {
      setSelectedItem(apiRef.current!.getItem(itemId));
    }
  };

  return (
    <Stack spacing={2}>
      <Typography sx={{ minWidth: 300 }}>
        Selected item: {selectedItem == null ? 'none' : selectedItem.label}
      </Typography>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          apiRef={apiRef}
          selectedItems={selectedItem?.id ?? null}
          onSelectedItemsChange={handleSelectedItemsChange}
        />
      </Box>
    </Stack>
  );
}


Get the current item tree

Use the getItemTree API method to get the current item tree.

const itemTree = apiRef.current.getItemTree();

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function ApiMethodGetItemTree() {
  const apiRef = useTreeViewApiRef();

  const [items, setItems] = React.useState(MUI_X_PRODUCTS);
  const [itemOnTop, setItemOnTop] = React.useState(items[0].label);

  const handleInvertItems = () => {
    setItems((prevItems) => [...prevItems].reverse());
  };

  const handleUpdateItemOnTop = () => {
    setItemOnTop(apiRef.current!.getItemTree()[0].label);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleInvertItems}>Invert first tree</Button>
        <Button onClick={handleUpdateItemOnTop}>Update item on top</Button>
      </Stack>
      <Typography>Item on top: {itemOnTop}</Typography>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeView apiRef={apiRef} items={items} />
      </Box>
    </Stack>
  );
}


This method is mostly useful when the Tree View has some internal updates on the items. For now, the only features causing updates on the items is the re-ordering.

