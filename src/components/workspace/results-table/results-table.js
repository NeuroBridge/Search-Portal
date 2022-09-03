import { useMemo, useState } from 'react'
import { Card, Fade } from '@mui/material'
import { useWorkspace } from '../workspace'
import {
  DataGrid,
} from '@mui/x-data-grid'
import { columns } from './columns'
import { TableHeader } from './table-header'

//

export const SearchResultsTable = () => {
  const { results, interfaceDisplayNames } = useWorkspace()
  
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
          rowsPerPageOptions={ [20, 50, 100] }
          components={{
            Toolbar: TableHeader,
          }}
          componentsProps={{
            toolbar: {
              heading: `${ rowsCount } total results`,
              subheading: Object.keys(results)
                .sort()
                .map(interfaceId => `${ interfaceDisplayNames[interfaceId] } (${ results[interfaceId].length })`)
                .join(', ')
            },
          }}
          onRowClick={ handleRowClick }
        />
      </Card>
    </Fade>
  )
}