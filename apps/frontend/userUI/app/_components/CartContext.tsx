'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MenuItem } from '../../zod'

interface CartContextType {
  cartItems: Record<string, number>
  addToCart: (item: MenuItem) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  getItemCount: (itemId: string) => number
  getTotalItems: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<Record<string, number>>({})

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev }
      if (newItems[itemId] > 1) {
        newItems[itemId] -= 1
      } else {
        delete newItems[itemId]
      }
      return newItems
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev => ({
      ...prev,
      [itemId]: Math.max(0, quantity)
    }))
  }

  const getItemCount = (itemId: string) => {
    return cartItems[itemId] || 0
  }

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, count) => total + count, 0)
  }

  const clearCart = () => {
    setCartItems({})
  }

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getItemCount,
    getTotalItems,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
