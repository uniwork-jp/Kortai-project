import { Box, BoxProps } from '@mui/material'

interface BackgroundContainerProps extends BoxProps {
  children: React.ReactNode
  centered?: boolean
}

export default function BackgroundContainer({ 
  children, 
  centered = true,
  ...props 
}: BackgroundContainerProps) {
  return (
    <Box 
      sx={{ 
        height: '100dvh', 
        maxHeight: '100vh',
        width: '100vw',
        bgcolor: 'lightgray', 
        position: 'relative', 
        overflow: 'hidden',
        display: centered ? 'flex' : 'block',
        justifyContent: centered ? 'center' : 'flex-start',
        alignItems: centered ? 'center' : 'flex-start',
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
