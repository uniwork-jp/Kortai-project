'use client'

import React from 'react'
import { OrderProvider } from './OrderContext'

export default function ClientOrderProvider({ children }: { children: React.ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>
}

