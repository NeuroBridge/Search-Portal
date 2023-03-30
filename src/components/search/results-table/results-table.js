import { useMemo, useState } from 'react'
import { Card, Fade, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { columns } from './columns'
import { TableHeader } from './table-header'
import { useSearch } from '../context'
import { Link } from '../../link'
import { Error } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useTheme } from '@emotion/react'
import { SIDEBAR_CONFIG, StudySidebar } from './study-sidebar'

//

export const ResultsTable = () => {
  const theme = useTheme();
  const {
    results, lastRequestTime, totalResultCount, translatedTerms
  } = useSearch()

  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  const handleChangeTab = (event, newIndex) => {
    setCurrentTabIndex(newIndex)
  }

  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_CONFIG.initialWidth);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // tableData will be a memoized array consisting of just
  // the items from each interface in the results object.
  const currentTableData = useMemo(() => {
    if (!results || !Object.keys(results).length) {
      return []
    }
    const serviceId = Object.keys(results).sort()[currentTabIndex]
    return results[serviceId] || []
  }, [currentTabIndex, totalResultCount, lastRequestTime])

  const [pageSize, setPageSize] = useState(20)

  //

  const nqLink = `https://neuroquery.org/query?text=${ translatedTerms.join('+') }`;

  const handleRowClick = ({ row }) => {
    if(selectedRow && row.pmid === selectedRow.pmid) {
      setIsSidebarOpen((prev) => !prev);
    }
    else {
      setSelectedRow(row);
      setIsSidebarOpen(true);
    }
  };

  return (
    <Fade in={ totalResultCount > 0 }>
      <Card sx={{ height: '100%', display: 'flex' }}>

        <DataGrid
          sx={{
            '.MuiDataGrid-row': { cursor: 'pointer' },
            borderColor: 'background.paper',
          }}
          autoHeight
          rows={ currentTableData }
          columns={ columns }
          getRowId={ row => row.pmid }
          pageSize={ pageSize }
          onPageSizeChange={ newSize => setPageSize(newSize) }
          onRowClick={handleRowClick}
          rowsPerPageOptions={ [10, 20, 50] }
          components={{
            Toolbar: TableHeader,
          }}
          componentsProps={{
            toolbar: {
              currentTabIndex,
              handleChangeTab,
              detail: currentTabIndex === 1 && translatedTerms.length > 0
                ? (
                  nqLink.length - 8 > 4094 ?
                  <Box display='flex' gap='8px' alignItems='center' sx={{ color: theme.palette.error.main }}>
                    <Error />
                    <Typography variant='body2'>Too many terms selected to view on NeuroQuery.org</Typography>
                  </Box>
                  :
                  <Link
                    to={ nqLink }
                  >View selected terms at NeuroQuery.org</Link>
                ) : '',
            }
          }}
          disableSelectionOnClick
          checkboxSelection
        />

        {isSidebarOpen && selectedRow !== null && (
            <StudySidebar
              selectedRow={selectedRow}
              setSelectedRow={setSelectedRow}
              sidebarWidth={sidebarWidth}
              setSidebarWidth={setSidebarWidth}
            />
          )}
      </Card>
    </Fade>
  );
}
