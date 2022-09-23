import PropTypes from 'prop-types'
import {
  Divider, IconButton, Stack, Tab, Tabs, Tooltip, Typography,
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
import { interfaceDisplayNames } from '../interfaces'

export const TableHeader = ({ heading, currentTabIndex, handleChangeTab }) => {
  const { results, clearResults } = useWorkspace()
  
  return (
    <GridToolbarContainer sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      p: 0,
    }}>
      <Stack
        direction="row"
        gap={ 2 }
        divider={ <Divider orientation="vertical" flexItem /> }
        alignItems="center"
        sx={{ p: 1 }}
      >
        <Typography>{ heading }</Typography>

        <Tabs
          value={ currentTabIndex }
          onChange={ handleChangeTab }
          variant="scrollable"
          sx={{ flex: 1 }}
        >
          {
            Object.keys(results)
            .sort()
            .map(interfaceId => (
              <Tab
                key={ `results-tab-${ interfaceId }` }
                label={ `${ interfaceDisplayNames[interfaceId] } (${ results[interfaceId].length })` }
                id={ `results-tab-${ interfaceId }` }
                aria-controls={ `results-tabpanel-${ interfaceId }` }
              />
            ))
          }
        </Tabs>
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          className="results-action-buttons"
        >
          <Tooltip title="Clear all results" placement="top">
            <IconButton
              onClick={ clearResults }
              size="small"
              aria-label="Clear all results"
            >
              <ClearResultsIcon />
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
      </Stack>
      <Divider />
    </GridToolbarContainer>
  )
}

TableHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  currentTabIndex: PropTypes.number.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
}
