'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DateTimeForm, DateTimeContextType } from '../../schemas'

const DateTimeContext = createContext<DateTimeContextType | undefined>(undefined)

interface DateTimeProviderProps {
  children: ReactNode
  initialDate?: string
  initialTime?: string
}

export function DateTimeProvider({ 
  children, 
  initialDate = '', 
  initialTime = '' 
}: DateTimeProviderProps) {
  const [dateTime, setDateTimeState] = useState<DateTimeForm>({
    date: initialDate,
    time: initialTime
  })

  const setDateTime = (newDateTime: DateTimeForm) => {
    setDateTimeState(newDateTime)
  }

  const updateDate = (date: string) => {
    setDateTimeState((prev: DateTimeForm) => ({ ...prev, date }))
  }

  const updateTime = (time: string) => {
    setDateTimeState((prev: DateTimeForm) => ({ ...prev, time }))
  }

  const resetDateTime = () => {
    setDateTimeState({ date: '', time: '' })
  }

  const value: DateTimeContextType = {
    dateTime,
    setDateTime,
    updateDate,
    updateTime,
    resetDateTime
  }

  return (
    <DateTimeContext.Provider value={value}>
      {children}
    </DateTimeContext.Provider>
  )
}

export function useDateTime() {
  const context = useContext(DateTimeContext)
  if (context === undefined) {
    throw new Error('useDateTime must be used within a DateTimeProvider')
  }
  return context
}
