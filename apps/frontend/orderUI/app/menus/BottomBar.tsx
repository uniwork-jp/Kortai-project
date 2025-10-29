'use client'

import { 
  Box,
  Typography,
  Button,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useOrder } from '../_components/OrderContext'

type BottomBarProps = {
  onSubmit?: () => void
}

export default function BottomBar({ onSubmit }: BottomBarProps) {
  const router = useRouter()
  const { total } = useOrder()

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit()
    } else {
      // Default behavior: navigate to confirm page
      router.push('/confirm')
    }
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        p: 2,
        backgroundColor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        display: 'flex',
        gap: '100px',
        justifyContent: 'flex-end',
        alignItems: 'center',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" fontWeight="bold" color="primary">
        合計 (รวม): ¥{total.price.toLocaleString()}
      </Typography>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={total.price === 0}
        sx={{
          minWidth: '120px',
          height: '40px',
        }}
      >
        Submit
      </Button>
    </Box>
  )
}

