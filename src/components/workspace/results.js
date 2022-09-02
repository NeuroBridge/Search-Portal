import { Box } from '@mui/material'
import { useWorkspace } from './workspace'

export const SearchResults = () => {
  const { results } = useWorkspace()

  return (
    <Box>
      <Box>Results!</Box>
      <Box component="pre" sx={{ backgroundColor: '#0002', p: 2, fontSize: '80%' }}>
        { JSON.stringify(results, null, 2) }
      </Box>
    </Box>
  )
}