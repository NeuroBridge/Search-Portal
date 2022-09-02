import { useMemo } from 'react'
import { Box } from '@mui/material'
import { useWorkspace } from './workspace'
import { DataGrid } from '@mui/x-data-grid'

const columns = [
  { field: 'title', headerName: 'Title', flex: 2 },
  { field: 'pmid', headerName: 'PMID', },
  { field: 'url', headerName: 'URL', flex: 1 },
  { field: 'snippet', headerName: 'Snippet' },
  { field: 'score', headerName: 'Score', },
  { field: 'source', headerName: 'Source' },
]

export const SearchResults = () => {
  const { results } = useWorkspace()

  const tableData = useMemo(() => {
    return Object.keys(results).reduce((arr, interfaceId) => {
      const newResults = results[interfaceId].map(result => ({
        ...result,
        source: interfaceId,
      }))
      return [...arr, ...newResults]
    }, [])
  }, [results])

  console.log(tableData)

  if (!Object.keys(results).length) {
    return <div />
  }

  return (
    <Box sx={{ height: '1200px' }}>
      <DataGrid
        rows={ tableData }
        columns={ columns }
        getRowId={ row => row.pmid }
      />
    </Box>
  )
}