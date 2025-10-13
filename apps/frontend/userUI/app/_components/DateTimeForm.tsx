import React, { useState } from 'react'
import { 
  Box, 
  TextField, 
  Typography,
  Paper,
  InputAdornment
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { dateTimeFormSchema, DateTimeForm } from '../../schemas'
import { useDateTime } from './DateTimeContext'

interface DateFormProps {
  onDateTimeChange?: (dateTime: DateTimeForm) => void
}

export default function DateForm({ onDateTimeChange }: DateFormProps) {
  const { dateTime, updateDate, updateTime } = useDateTime()
  const [errors, setErrors] = useState<Partial<DateTimeForm>>({})

  const handleDateChange = (newDate: string) => {
    updateDate(newDate)
    const formData = { date: newDate, time: dateTime.time }
    validateAndNotify(formData)
  }

  const handleTimeChange = (newTime: string) => {
    updateTime(newTime)
    const formData = { date: dateTime.date, time: newTime }
    validateAndNotify(formData)
  }

  const validateAndNotify = (formData: DateTimeForm) => {
    try {
      dateTimeFormSchema.parse(formData)
      setErrors({})
      onDateTimeChange?.(formData)
    } catch (error: any) {
      const fieldErrors: Partial<DateTimeForm> = {}
      error.errors?.forEach((err: any) => {
        fieldErrors[err.path[0] as keyof DateTimeForm] = err.message
      })
      setErrors(fieldErrors)
    }
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          日時を選択
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Date Picker */}
          <TextField
            label="日付"
            type="date"
            value={dateTime.date}
            onChange={(e) => handleDateChange(e.target.value)}
            error={!!errors.date}
            helperText={errors.date}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ 
              width: '100%',
              '& .MuiInputBase-input': {
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }
            }}
          />

          {/* Time Picker */}
          <TextField
            label="時間"
            type="time"
            value={dateTime.time}
            onChange={(e) => handleTimeChange(e.target.value)}
            error={!!errors.time}
            helperText={errors.time}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccessTimeIcon />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ 
              width: '100%',
              '& .MuiInputBase-input': {
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }
            }}
          />
        </Box>
      </Paper>
  )
}
