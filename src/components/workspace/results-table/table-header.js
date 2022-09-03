import PropTypes from 'prop-types'
import {
  Box, Divider, IconButton, Stack, Tooltip, Typography,
} from '@mui/material'
import {
  Clear as ClearResultsIcon,
} from '@mui/icons-material'
import { useWorkspace } from '../workspace'
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid'

export const TableHeader = ({ heading, subheading }) => {
  const { clearResults } = useWorkspace()
  
  return (
    <GridToolbarContainer sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      p: 0,
    }}>
      <Box sx={{
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Stack
          direction="row"
          gap={ 2 }
          divider={ <Divider orientation="vertical" flexItem /> }
          alignItems="center"
        >
          <Typography>{ heading }</Typography>
          <Typography
            sx={{ fontStyle: 'italic', filter: 'opacity(0.66)', fontSize: '95%' }}
          >{ subheading }</Typography>
        </Stack>
        <Tooltip title="Clear all results" placement="left">
          <IconButton onClick={ clearResults }>
            <ClearResultsIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      <Stack direction="row" gap={ 1 } sx={{ backgroundColor: '#0001', p: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </Stack>
      <Divider />
    </GridToolbarContainer>
  )
}

TableHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string.isRequired,
}
