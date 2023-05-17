import PropTypes from 'prop-types'
import {
  Box, Divider, IconButton, Stack, Tab, Tabs, Tooltip,
} from '@mui/material'
import { PlaylistRemove } from '@mui/icons-material'
import { useSearch } from '../context'
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid'

export const TableHeader = ({ currentTabIndex, handleChangeTab, detail }) => {
  const { results, clearResults } = useSearch()

  return (
    <GridToolbarContainer sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      p: 0,
    }}>
      <Stack
        direction="row"
        divider={ <Divider orientation="vertical" flexItem /> }
        alignItems="stretch"
      >
        <Box sx={{
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>RESULTS</Box>

        <Tabs
          value={ currentTabIndex }
          onChange={ handleChangeTab }
          variant="scrollable"
          sx={{ flex: 1, height: '100%' }}
        >
          <Tooltip title="Sorted by number of matching concepts" placement="top">
            <Tab
              sx={{ textTransform: 'revert' }}
              label={ `PubMed Central (${ results.NeuroBridge.length })` }
              id={ `results-tab-NeuroBridge` }
              aria-controls="results-tabpanel-NeuroBridge"
            />
          </Tooltip>
          <Tooltip title="Sorted by relevance" placement="top">
            <Tab
              sx={{ textTransform: 'revert' }}
              label={ `NeuroQuery (${ results.NeuroQuery.length })` }
              id={ `results-tab-NeuroQuery` }
              aria-controls="results-tabpanel-NeuroQuery"
            />
          </Tooltip>
        </Tabs>

        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          className="results-action-buttons"
          sx={{ p: '0 1 0 0'}}
        >
          <Tooltip title="Clear all results" placement="left">
            <IconButton
              onClick={ clearResults }
              size="small"
              aria-label="Clear all results"
              sx={{ borderRadius: 0, height: '100%', p: 1 }}
            >
              <PlaylistRemove />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider />

      <Stack direction="row" gap={ 1 } sx={{ backgroundColor: '#0001', p: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          { detail }
        </Box>
      </Stack>
      <Divider />
    </GridToolbarContainer>
  )
}

TableHeader.propTypes = {
  currentTabIndex: PropTypes.number.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
  detail: PropTypes.node,
}
