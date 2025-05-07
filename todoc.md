Nested List Display:
Use a tree-like structure to display categories and their subcategories.
Leverage Material-UI's TreeView or a custom expandable list.
Expand/Collapse Behavior:
Add an expand/collapse button (e.g., a chevron icon) to toggle visibility of subcategories.
Indentation:
Indent subcategories visually to indicate hierarchy.
Tree-Like Structure:
Use a tree view or nested list to visually represent parent and child categories.
Each parent category should have an expand/collapse button to toggle the visibility of its subcategories.
Indentation:
Indent subcategories to visually indicate their hierarchy.
Add Subcategory Button:
Add an "Add Subcategory" button for each category to allow users to create subcategories directly under a parent.

export type TemplateCategory = {
  ....
  childCategories: Array<TemplateCategory>;
  parentCategory?: Maybe<TemplateCategory>;
....
};