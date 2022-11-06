import { Box, Container } from '@mui/material'
import { Workspace } from '../components/workspace'

//

export const SearchView = () => {

  return (
    <Container maxWidth="xl">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 6,
      }}>
        
        <Workspace />

      </Box>
    </Container>
  )
}
