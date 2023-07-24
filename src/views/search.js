import { Box, Container, Stack } from '@mui/material'
import { PublicationTray, QueryBuilder, ResultsTable} from '../components/search'
import { SearchProvider } from '../components/search'
import { PublicationTrayProvider } from '../components/search/publication-tray/context'

export const SearchView = () => {
  return (
    <Container maxWidth="xl">
      <SearchProvider>
        <PublicationTrayProvider>
          <Stack direction='row' spacing={2}>
            <Stack spacing={2} flex={1} justifyContent='flex-start'>
              <Box flex={1}>
                <QueryBuilder />
              </Box>
              <Box flex={1}>
                <ResultsTable />
              </Box>
            </Stack>
            
            <PublicationTray />
          </Stack>
        </PublicationTrayProvider>
      </SearchProvider>
    </Container>
  )
}
