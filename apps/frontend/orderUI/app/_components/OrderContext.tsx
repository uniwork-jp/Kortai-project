'use client'

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react'
import { CartMenu, OrderContextState } from '../../types'

interface OrderContextType {
  menus: CartMenu[]
  total: {
    price: number
  }
  addMenu: (menuId: string, price: number, quantity: number, japanese: string, thai_name: string) => void
  removeMenu: (menuId: string) => void
  updateMenuQuantity: (menuId: string, quantity: number) => void
  clearMenus: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

interface OrderProviderProps {
  children: ReactNode
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [menus, setMenus] = useState<CartMenu[]>([])

  // Calculate total price
  const total = useMemo(() => {
    const totalPrice = menus.reduce((sum, menu) => sum + (menu.price * menu.quantity), 0)
    return { price: totalPrice }
  }, [menus])

  const addMenu = (menuId: string, price: number, quantity: number, japanese: string, thai_name: string) => {
    setMenus(prev => {
      const existingIndex = prev.findIndex(m => m.menuId === menuId)
      if (existingIndex >= 0) {
        // Update existing menu quantity
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        }
        return updated
      } else {
        // Add new menu
        return [...prev, { menuId, price, quantity, japanese, thai_name }]
      }
    })
  }

  const removeMenu = (menuId: string) => {
    setMenus(prev => prev.filter(m => m.menuId !== menuId))
  }

  const updateMenuQuantity = (menuId: string, quantity: number) => {
    if (quantity <= 0) {
      removeMenu(menuId)
      return
    }
    setMenus(prev => 
      prev.map(m => 
        m.menuId === menuId ? { ...m, quantity } : m
      )
    )
  }

  const clearMenus = () => {
    setMenus([])
  }

  const value: OrderContextType = {
    menus,
    total,
    addMenu,
    removeMenu,
    updateMenuQuantity,
    clearMenus
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}

