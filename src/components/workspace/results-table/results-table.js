import { useEffect, useMemo, useState } from 'react'
import {
  Card, Dialog, Divider, DialogContent, DialogTitle,
  Fade, Stack, Typography,
} from '@mui/material'
import { useWorkspace } from '../workspace'
import {
  DataGrid,
} from '@mui/x-data-grid'
import { Link } from '../../link'
import { columns } from './columns'
import { TableHeader } from './table-header'
import nihLogoIcon from '../../../images/pubmed-icon.png'

//

const NihLogo  = () => <img src={ nihLogoIcon } height="12" />

//

export const SearchResultsTable = () => {
  const { results } = useWorkspace()
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const [activeRow, setActiveRow] = useState()
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleChangeTab = (event, newIndex) => {
    setCurrentTabIndex(newIndex)
  }
  
  // tableData will be a memoized array consisting of just
  // the items from each interface in the results object.
  const tableData = useMemo(() => {
    if (!Object.keys(results).length) {
      return []
    }
    const interfaceId = Object.keys(results).sort()[currentTabIndex]
    return results[interfaceId]
  }, [currentTabIndex, results])

  const [pageSize, setPageSize] = useState(20)

  const handleRowClick = params => {
    setActiveRow(params.row)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    const unmountDelay = setTimeout(() => setActiveRow(null), 250)
    return () => clearTimeout(unmountDelay)
  }

  useEffect(() => {
    if (activeRow) {
      setDialogOpen(true)
    }
  }, [activeRow])

  //

  return (
    <Fade in={ !!Object.keys(results).length }>
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
          rowsPerPageOptions={ [10, 20, 50] }
          components={{
            Toolbar: TableHeader,
          }}
          componentsProps={{
            toolbar: { currentTabIndex, handleChangeTab }
          }}
          disableSelectionOnClick
          checkboxSelection
          onRowClick={ handleRowClick }
        />
        {
          activeRow && (
            <Dialog onClose={ handleCloseDialog } open={ dialogOpen }>
              <DialogTitle>{ activeRow.title }</DialogTitle>
              <Divider />
              <Stack
                direction="row"
                divider={ <Divider orientation="vertical" flexItem /> }
                sx={{ px: 3 }}
              >
                <Stack direction="row" alignItems="center" gap={ 1 } sx={{ p: 1 }}>
                  <NihLogo />
                  <Typography>Abstract: { activeRow.pmid && (
                    <Link to={ activeRow.pubmed_url }>
                      { activeRow.pmid }
                    </Link>) }
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={ 1 } sx={{ p: 1 }}>
                  <NihLogo />
                  <Typography>Full text: { activeRow.pmcid && (
                    <Link to={ activeRow.pmc_url }>
                      { activeRow.pmcid }
                    </Link>) }
                  </Typography>
                </Stack>
              </Stack>
              <Divider />
              <DialogContent>
                <Typography paragraph>
                  <strong>Snippet:</strong> <em>{ activeRow.snippet }</em>
                </Typography>
              </DialogContent>
            </Dialog>
          )
        }
      </Card>
    </Fade>
  )
}