import PropTypes from 'prop-types'
import {
  Box, Divider, IconButton, Stack, Tab, Tabs, Tooltip, Typography,
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

console.log(interfaceDisplayNames)

export const TableHeader = ({ heading, currentTabIndex, handleChangeTab }) => {
  const { results, clearResults } = useWorkspace()
  
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

        <Tabs
          value={ currentTabIndex }
          onChange={ handleChangeTab }
          variant="scrollable"
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
  currentTabIndex: PropTypes.number.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
}
