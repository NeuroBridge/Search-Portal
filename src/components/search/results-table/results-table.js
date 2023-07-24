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
import { usePublicationTray } from '../publication-tray/context'

//

export const ResultsTable = () => {
  const theme = useTheme();
  const {
    results, lastRequestTime, totalResultCount, translatedTerms
  } = useSearch();

  const {
    studyTabs,
    activeTab,
    handleRowClick,
    handleRowDoubleClick,
  } = usePublicationTray();

  const [currentTabIndex, setCurrentTabIndex] = useState(0)

  const handleChangeTab = (_, newIndex) => {
    setCurrentTabIndex(newIndex)
  }
  
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

  

  return (
    <Fade in={ totalResultCount > 0 }>
      <Card sx={{ height: '100%', display: 'flex' }}>

        <DataGrid
          sx={{
            '.MuiDataGrid-row': { cursor: 'pointer' },
            borderColor: 'background.paper',

            '& .row-opened-in-tab': {
              backgroundColor: 'openRowBackground',
            },
            '& .active-tab': {
              fontWeight: 'bold',
            },
            '& .unpinned-tab': {
              fontStyle: 'italic',
            }
          }}
          autoHeight
          rows={ currentTableData }
          columns={ columns }
          getRowId={ row => row.pmid }
          pageSize={ pageSize }
          onPageSizeChange={ newSize => setPageSize(newSize) }
          onRowClick={handleRowClick}
          onRowDoubleClick={handleRowDoubleClick}
          getRowClassName={({ row }) => {
            if(studyTabs.length === 0) return '';
            let classes = [];
            if (row.pmid === activeTab)
              classes.push('active-tab');
            const studyListTabItem = studyTabs.find(tab => tab.study.pmid === row.pmid);
            if (studyListTabItem !== undefined) {
              classes.push('row-opened-in-tab');
              if (studyListTabItem?.pinned === false) 
                classes.push('unpinned-tab');
            }
            return classes.join(' ');
          }}
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
      </Card>
    </Fade>
  );
}
