import { useMemo, useState } from 'react'
import { Card, Fade, IconButton, List, ListItem, Stack, Tooltip, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { columns } from './columns'
import { TableHeader } from './table-header'
import { useSearch } from '../context'
import { Link } from '../../link'
import { Clear, Error } from '@mui/icons-material'
import { Box } from '@mui/system'
import { useTheme } from '@emotion/react'

import studyConcepts from '../../../data/study-concepts.json'

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

  const [selectedRow, setSelectedRow] = useState(null);
  
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
    if(selectedRow && row.pmcid === selectedRow.pmcid) {
      setSelectedRow(null);
    }
    else {
      setSelectedRow(row);
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

        {selectedRow !== null &&
          selectedRow.pmcid.toLowerCase() in studyConcepts && (
            <Box
              sx={{
                borderLeft: "3px solid",
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'stretch',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    fontSize: `0.875rem`,
                    lineHeight: '1.43',
                    borderRight: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {selectedRow.pmcid}
                </Box>
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  className="results-action-buttons"
                  sx={{ p: '0 1 0 0', borderLeft: '1px solid', borderColor: 'divider' }}
                >
                  <Tooltip title="Close study concepts view" placement="left">
                    <IconButton
                      onClick={ () => setSelectedRow(null) }
                      size="small"
                      aria-label="Clear all results"
                      sx={{ borderRadius: 0, height: '100%', p: 1 }}
                    >
                      <Clear />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
              <List>
                {studyConcepts[selectedRow.pmcid.toLowerCase()].map(
                  (concept, index) => (
                    <ListItem key={index}>{concept}</ListItem>
                  )
                )}
              </List>
            </Box>
          )}
      </Card>
    </Fade>
  )
}
