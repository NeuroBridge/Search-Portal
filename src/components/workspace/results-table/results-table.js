import { useMemo, useState } from 'react'
import {
  Box, Card, Divider, Fade, IconButton, Stack, Tooltip, Typography,
} from '@mui/material'
import {
  Clear as ClearResultsIcon,
} from '@mui/icons-material'
import { useWorkspace } from '../workspace'
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid'
import { columns } from './columns'

//

export const SearchResultsTable = () => {
  const { results, clearResults, interfaceDisplayNames } = useWorkspace()
  
  // tableData will be a memoized array consisting of just
  // the items from each interface in the results object.
  const tableData = useMemo(() => {
    if (!Object.keys(results).length) {
      return []
    }
    return Object.keys(results).reduce((arr, interfaceId) => {
      const newResults = results[interfaceId].map(result => ({
        ...result,
        source: interfaceId,
      }))
      return [...arr, ...newResults]
    }, [])
  }, [results])

  const [pageSize, setPageSize] = useState(20)

  const rowsCount = useMemo(() => {
    if (!Object.keys(results).length) {
      return 0
    }
    return tableData.length
  }, [results])

  const handleRowClick = params => {
    console.log(params)
  }

  //

  if (!Object.keys(results).length) {
    return <div />
  }

  const TableToolbar = () => (
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
          <Typography>{ rowsCount } Total results</Typography>
          <Typography
            sx={{ fontStyle: 'italic', filter: 'opacity(0.66)', fontSize: '95%' }}
          >
            {
              Object.keys(results)
                .sort()
                .map(interfaceId => `${ interfaceDisplayNames[interfaceId] } (${ results[interfaceId].length })`)
                .join(', ')
            }
          </Typography>
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

  return (
    <Fade in={ !!tableData.length }>
      <Card>
        <DataGrid
          sx={{
            '.MuiDataGrid-row': { cursor: 'pointer' },
          }}
          autoHeight
          rows={ tableData }
          columns={ columns }
          getRowId={ row => row.pmid }
          pageSize={ pageSize }
          onPageSizeChange={ newSize => setPageSize(newSize) }
          pagination
          rowsPerPageOptions={ [20, 50, 100] }
          components={{
            Toolbar: TableToolbar,
          }}
          onRowClick={ handleRowClick }
        />
      </Card>
    </Fade>
  )
}