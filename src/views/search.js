import { Box, Container, Paper, Stack } from '@mui/material'
import { QueryBuilder, ResultsTable} from '../components/search'
import { SearchProvider } from '../components/search'

export const SearchView = () => {
  return (
    <Container maxWidth="xl">
      <SearchProvider>
        <Stack direction='row' spacing={2}>
          <Stack spacing={2} flex={1}>
            <Box flex={1}>
              <QueryBuilder />
            </Box>
            <Box flex={1}>
              <ResultsTable />
            </Box>
          </Stack>

          <Paper sx={{ p: 2, flex: 1 }}>
            Publication Viewer
          </Paper>
        </Stack>
      </SearchProvider>
    </Container>
  )
}
