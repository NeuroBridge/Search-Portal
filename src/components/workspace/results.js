import { useMemo, useState } from 'react'
import { Box, Card } from '@mui/material'
import { useWorkspace } from './workspace'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

const columns = [
  { field: 'title', headerName: 'Title', flex: 2 },
  { field: 'pmid', headerName: 'PMID', },
  { field: 'url', headerName: 'URL', flex: 1 },
  // { field: 'snippet', headerName: 'Snippet' },
  { field: 'score', headerName: 'Score', },
  { field: 'source', headerName: 'Source' },
]

export const SearchResults = () => {
  const { results } = useWorkspace()
  const [pageSize, setPageSize] = useState(20)

  const tableData = useMemo(() => {
    return Object.keys(results).reduce((arr, interfaceId) => {
      const newResults = results[interfaceId].map(result => ({
        ...result,
        source: interfaceId,
      }))
      return [...arr, ...newResults]
    }, [])
  }, [results])

  if (!Object.keys(results).length) {
    return <div />
  }

  return (
    <Card>
      <DataGrid
        autoHeight
        rows={ tableData }
        columns={ columns }
        getRowId={ row => row.pmid }
        pageSize={ pageSize }
        onPageSizeChange={ newSize => setPageSize(newSize) }
        pagination
        rowsPerPageOptions={ [20, 50, 100] }
        components={{ Toolbar: () => <Box sx={{ p: 1 }}><GridToolbar /></Box> }}
      />
    </Card>
  )
}