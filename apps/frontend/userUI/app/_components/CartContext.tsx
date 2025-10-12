'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { MenuItem, CartItem } from '../../zod'

interface CartContextType {
  cartItems: Record<MenuItem['id'], CartItem>
  addToCart: (item: MenuItem) => void
  removeFromCart: (itemId: MenuItem['id']) => void
  increaseItem: (item: MenuItem) => void
  decreaseItem: (itemId: MenuItem['id']) => void
  updateQuantity: (itemId: MenuItem['id'], quantity: number) => void
  getItemCount: (itemId: MenuItem['id']) => number
  getTotalItems: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<Record<MenuItem['id'], CartItem>>({})

  const addToCart = (item: MenuItem) => {
    console.log('addToCart called on context:', { item })
    setCartItems(prev => {
      if (prev[item.id]) {
        return {
          ...prev,
          [item.id]: { ...prev[item.id] }
        }
      }
      return {
        ...prev,
        [item.id]: { menuItem: item, amount: 1 } as CartItem
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => {
      const newItems = { ...prev }
      delete newItems[itemId]
      return newItems
    })
  }

  const increaseItem = (item: MenuItem) => {
    setCartItems(prev => {
      if (prev[item.id]) {
        return {
          ...prev,
          [item.id]: { ...prev[item.id], amount: prev[item.id].amount + 1 }
        }
      }
      return {
        ...prev,
        [item.id]: { menuItem: item, amount: 1 } as CartItem
      }
    })
  }

  const decreaseItem = (itemId: string) => {
    setCartItems(prev => {
      if (prev[itemId]) {
        const newAmount = prev[itemId].amount - 1
        if (newAmount <= 0) {
          const newItems = { ...prev }
          delete newItems[itemId]
          return newItems
        }
        return {
          ...prev,
          [itemId]: { ...prev[itemId], amount: newAmount }
        }
      }
      return prev
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev => {
      if (quantity <= 0) {
        const newItems = { ...prev }
        delete newItems[itemId]
        return newItems
      }
      if (prev[itemId]) {
        return {
          ...prev,
          [itemId]: { ...prev[itemId], amount: quantity }
        }
      }
      return prev
    })
  }

  const getItemCount = (itemId: string) => {
    return cartItems[itemId]?.amount || 0
  }

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((total, item) => total + item.amount, 0)
  }

  const clearCart = () => {
    setCartItems({})
  }

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseItem,
    decreaseItem,
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
