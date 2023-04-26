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
import { PublicationTray } from '../publication-tray'
import { DraggableTray, TRAY_CONFIG } from '../publication-tray/draggable-tray'

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

  const [sideTrayWidth, setSideTrayWidth] = useState(TRAY_CONFIG.initialWidth);
  const [studyTabs, setStudyTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState(new Set());
  
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
    setIsSidebarOpen(true);

    if(!studyTabs.find(tab => tab.study.pmid === row.pmid)) {
      setStudyTabs(prev => [...prev, { study: row }]);
    }

    setActiveTab(row.pmid);
  };

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
          }}
          autoHeight
          rows={ currentTableData }
          columns={ columns }
          getRowId={ row => row.pmid }
          pageSize={ pageSize }
          onPageSizeChange={ newSize => setPageSize(newSize) }
          onRowClick={handleRowClick}
          getRowClassName={({ row }) => {
            if (row.pmid === activeTab && studyTabs.length !== 0) return 'active-tab row-opened-in-tab'
            return studyTabs.find(tab => tab.study.pmid === row.pmid) ?  'row-opened-in-tab' : ''
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

        {isSidebarOpen && activeTab !== null && studyTabs.length > 0 && (
            <DraggableTray width={sideTrayWidth} setWidth={setSideTrayWidth}>
              <PublicationTray
                selectedRow={activeTab}
                setIsSidebarOpen={setIsSidebarOpen}
                studyTabs={studyTabs}
                setStudyTabs={setStudyTabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                expandedAccordions={expandedAccordions}
                setExpandedAccordions={setExpandedAccordions}
              />
            </DraggableTray>
          )}
      </Card>
    </Fade>
  );
}
