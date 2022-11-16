import { useMemo, useState } from 'react'
import { Card, Fade } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { columns } from './columns'
import { TableHeader } from './table-header'
import { useSearch } from '../context'

//

export const ResultsTable = () => {
  const { results } = useSearch()

  const [currentTabIndex, setCurrentTabIndex] = useState(0)

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
        />
      </Card>
    </Fade>
  )
}
