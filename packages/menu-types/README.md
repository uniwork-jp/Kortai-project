# @kortai/menu-types

Zod schemas and TypeScript types for menu data validation and manipulation.

## Installation

```bash
pnpm add @kortai/menu-types
```

## Usage

### Basic Validation

```typescript
import { validateMenu, Menu, Item, Category } from '@kortai/menu-types';
import menuData from './menu.json';

// Validate menu data
const menu: Menu = validateMenu(menuData);

// Access categories and items
const categories = menu.menu.categories;
const firstCategory = categories[0];
const items = firstCategory.items;
```

### Helper Functions

```typescript
import { 
  findItemById, 
  findCategoryById, 
  getAllItems, 
  searchItems,
  getItemsByPriceRange 
} from '@kortai/menu-types';

// Find specific items
const padThai = findItemById(menu, 'pad-thai');
const noodleCategory = findCategoryById(menu, 'noodles');

// Get all items
const allItems = getAllItems(menu);

// Search items
const curryItems = searchItems(menu, 'curry');

// Filter by price
const affordableItems = getItemsByPriceRange(menu, 0, 500);
```

### Schema Validation

```typescript
import { ItemSchema, CategorySchema, MenuSchema } from '@kortai/menu-types';

// Validate individual components
const item = ItemSchema.parse(itemData);
const category = CategorySchema.parse(categoryData);
const menu = MenuSchema.parse(menuData);
```

## API Reference

### Types

- `Item`: Individual menu item
- `Category`: Menu category containing items
- `Menu`: Complete menu structure

### Schemas

- `ItemSchema`: Zod schema for items
- `CategorySchema`: Zod schema for categories
- `MenuSchema`: Zod schema for complete menu

### Functions

- `validateItem(data)`: Validate item data
- `validateCategory(data)`: Validate category data
- `validateMenu(data)`: Validate menu data
- `findItemById(menu, id)`: Find item by ID
- `findCategoryById(menu, id)`: Find category by ID
- `getAllItems(menu)`: Get all items from menu
- `getItemsByCategory(menu, categoryId)`: Get items by category
- `searchItems(menu, query)`: Search items by text
- `getItemsByPriceRange(menu, min, max)`: Filter items by price range
- `getCategories(menu)`: Get all categories
- `getItemCount(menu)`: Get total item count
- `getCategoryCount(menu)`: Get total category count
- `getPriceRange(menu)`: Get min/max prices
- `groupItemsByPrice(menu, ranges)`: Group items by price ranges

## Development

```bash
# Build
pnpm build

# Watch mode
pnpm dev

# Clean
pnpm clean
```
