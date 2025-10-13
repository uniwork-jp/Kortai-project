import { z } from 'zod';

// Item schema
export const ItemSchema = z.object({
  id: z.string(),
  ja_name: z.string(),
  thai_name: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
});

// Category schema
export const CategorySchema = z.object({
  id: z.string(),
  ja_name: z.string(),
  thai_name: z.string(),
  name: z.string(),
  items: z.array(ItemSchema),
});

// Menu schema
export const MenuSchema = z.object({
  menu: z.object({
    categories: z.array(CategorySchema),
  }),
});

// Type exports
export type Item = z.infer<typeof ItemSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Menu = z.infer<typeof MenuSchema>;

// Validation functions
export const validateItem = (data: unknown): Item => {
  return ItemSchema.parse(data);
};

export const validateCategory = (data: unknown): Category => {
  return CategorySchema.parse(data);
};

export const validateMenu = (data: unknown): Menu => {
  return MenuSchema.parse(data);
};

// Helper functions
export const findItemById = (menu: Menu, itemId: string): Item | undefined => {
  for (const category of menu.menu.categories) {
    const item = category.items.find(item => item.id === itemId);
    if (item) return item;
  }
  return undefined;
};

export const findCategoryById = (menu: Menu, categoryId: string): Category | undefined => {
  return menu.menu.categories.find(category => category.id === categoryId);
};

export const getAllItems = (menu: Menu): Item[] => {
  return menu.menu.categories.flatMap(category => category.items);
};

export const getItemsByCategory = (menu: Menu, categoryId: string): Item[] => {
  const category = findCategoryById(menu, categoryId);
  return category ? category.items : [];
};

export const searchItems = (menu: Menu, query: string): Item[] => {
  const lowerQuery = query.toLowerCase();
  return getAllItems(menu).filter(item => 
    item.ja_name.toLowerCase().includes(lowerQuery) ||
    item.thai_name.toLowerCase().includes(lowerQuery) ||
    item.name.toLowerCase().includes(lowerQuery) ||
    item.description.toLowerCase().includes(lowerQuery)
  );
};

export const getItemsByPriceRange = (menu: Menu, minPrice: number, maxPrice: number): Item[] => {
  return getAllItems(menu).filter(item => 
    item.price >= minPrice && item.price <= maxPrice
  );
};

// Additional utility functions
export const getCategories = (menu: Menu): Category[] => {
  return menu.menu.categories;
};

export const getItemCount = (menu: Menu): number => {
  return getAllItems(menu).length;
};

export const getCategoryCount = (menu: Menu): number => {
  return menu.menu.categories.length;
};

export const getPriceRange = (menu: Menu): { min: number; max: number } => {
  const prices = getAllItems(menu).map(item => item.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
};

export const groupItemsByPrice = (menu: Menu, priceRanges: { label: string; min: number; max: number }[]): Record<string, Item[]> => {
  const result: Record<string, Item[]> = {};
  
  priceRanges.forEach(range => {
    result[range.label] = getItemsByPriceRange(menu, range.min, range.max);
  });
  
  return result;
};
