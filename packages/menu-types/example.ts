import { validateMenu, findItemById, searchItems, getAllItems, getPriceRange } from './src/index';
import menuData from '../../apps/frontend/userUI/menu.json';

// Example usage of the menu-types package
export function exampleUsage() {
  console.log('🍜 Menu Types Package Example');
  console.log('============================');

  // Validate menu data
  const menu = validateMenu(menuData);
  console.log(`✅ Menu validated successfully`);
  console.log(`📊 Categories: ${menu.menu.categories.length}`);
  
  // Get all items
  const allItems = getAllItems(menu);
  console.log(`🍽️  Total items: ${allItems.length}`);
  
  // Find specific item
  const padThai = findItemById(menu, 'pad-thai');
  if (padThai) {
    console.log(`🍝 Found: ${padThai.name} (${padThai.ja_name}) - ${padThai.price}円`);
  }
  
  // Search items
  const noodleItems = searchItems(menu, 'noodle');
  console.log(`🍜 Noodle items found: ${noodleItems.length}`);
  
  // Get price range
  const priceRange = getPriceRange(menu);
  console.log(`💰 Price range: ${priceRange.min}円 - ${priceRange.max}円`);
  
  // Show categories
  console.log('\n📋 Categories:');
  menu.menu.categories.forEach(category => {
    console.log(`  • ${category.name} (${category.ja_name}) - ${category.items.length} items`);
  });
  
  return menu;
}

// Run example if this file is executed directly
if (require.main === module) {
  exampleUsage();
}
