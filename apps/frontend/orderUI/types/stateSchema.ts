import * as z from 'zod'

// Menu Item schema
export const menuItemSchema = z.object({
  id: z.string(),
  ja_name: z.string(),
  thai_name: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number().min(0),
  category: z.object({
    id: z.string(),
    ja_name: z.string(),
    thai_name: z.string(),
    name: z.string(),
  }).optional(),
})

export type MenuItem = z.infer<typeof menuItemSchema>

// Cart Menu Item schema (simplified for context)
export const cartMenuSchema = z.object({
  menuId: z.string(),
  price: z.number().min(0),
  quantity: z.number().min(1),
  japanese: z.string(),
  thai_name: z.string(),
})

export type CartMenu = z.infer<typeof cartMenuSchema>

// Order Context State schema
export const orderContextStateSchema = z.object({
  menus: z.array(cartMenuSchema).default([]),
  total: z.object({
    price: z.number().min(0).default(0),
  }).default({ price: 0 }),
})

export type OrderContextState = z.infer<typeof orderContextStateSchema>

