import { Box, Container } from '@mui/material'
import { QueryBuilder, /*ResultsTable*/ } from '../components/search'
import { SearchProvider } from '../components/search'

//

export const SearchView = () => {
  
  return (
    <Container maxWidth="lg">
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        mb: 6,
      }}>      
        <SearchProvider>
          <QueryBuilder />
{/*          <ResultsTable />
*/}        </SearchProvider>
      </Box>
    </Container>
  )
}
