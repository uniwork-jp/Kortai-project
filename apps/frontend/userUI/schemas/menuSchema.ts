import * as z from 'zod'

// Raw JSON structure schemas
export const rawMenuItemSchema = z.object({
  id: z.string(),
  ja_name: z.string(),
  thai_name: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number()
})

export const rawMenuCategorySchema = z.object({
  id: z.string(),
  ja_name: z.string(),
  thai_name: z.string(),
  name: z.string(),
  items: z.array(rawMenuItemSchema)
})

export const rawMenuSchema = z.object({
  menu: z.object({
    categories: z.array(rawMenuCategorySchema)
  })
})

// Transformed schemas for components
export const menuItemSchema = rawMenuItemSchema.extend({
  category: z.string(),
  isAvailable: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
})

export const categorySchema = z.object({
  id: z.string(),
  title: z.string(),
  imageUrl: z.string(),
  price: z.number(),
  name: z.string(),
  thai_name: z.string(),
  ja_name: z.string()
})

export const menuSchema = z.object({
  categories: z.array(categorySchema),
  menuItems: z.record(z.string(), z.array(menuItemSchema))
})

// Cart item schema
export const cartItemSchema = z.object({
  menuItem: menuItemSchema,
  amount: z.number()
})

// Partial schemas for flexible validation
export const partialMenuItemSchema = menuItemSchema.partial()
export const partialCategorySchema = categorySchema.partial()
export const partialMenuSchema = menuSchema.partial()

// Types
export type RawMenuItem = z.infer<typeof rawMenuItemSchema>
export type RawMenuCategory = z.infer<typeof rawMenuCategorySchema>
export type RawMenu = z.infer<typeof rawMenuSchema>
export type MenuItem = z.infer<typeof menuItemSchema>
export type CartItem = z.infer<typeof cartItemSchema>
export type Category = z.infer<typeof categorySchema>
export type Menu = z.infer<typeof menuSchema>
export type PartialMenuItem = z.infer<typeof partialMenuItemSchema>
export type PartialCategory = z.infer<typeof partialCategorySchema>
export type PartialMenu = z.infer<typeof partialMenuSchema>
