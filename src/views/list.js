import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles'
import { Box, IconButton, TextField } from '@mui/material'
import { DataGrid, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbar } from '@mui/x-data-grid'
import { useSearchContext } from '../components/search'
import { Container } from '../components/container'
import { TermCard } from '../components/search'
import { Link } from '../components/link'
import {
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material'

const useStyles = makeStyles(theme => ({
}))

const columns = [
  { field: 'short_form',             headerName: 'short form',            width: 350,     editable: false,      type: 'string'   },
  { field: 'label',                  headerName: 'label',                 width: 100,     editable: false,      type: 'string'   },
  // { field: 'has_children',           headerName: 'children',              width: 100,     editable: false,      type: 'boolean'  },
  // { field: 'description',            headerName: 'description',           width: 100,     editable: false,      type: 'string'   },
  // { field: 'seeAlso',                headerName: 'see also',              width: 100,     editable: false,      type: 'string'   },
  { field: 'iri',                    headerName: 'iri',                   width: 300,     editable: false,      type: 'string'   },
]

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

function QuickSearchToolbar(props) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          '& .MuiSvgIcon-root': {
            mr: 0.5,
          },
          '& .MuiInput-underline:before': {
            borderBottom: 1,
            borderColor: 'divider',
          },
        }}
      />
    </Box>
  )
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

export const ListView = () => {
  const { ontology } = useSearchContext()
  const classes = useStyles()

  const [searchText, setSearchText] = useState('')
  const [rows, setRows] = useState(ontology)

  useEffect(() => setRows(ontology), [ontology])

  const requestSearch = searchValue => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    if (ontology.length === 0) {
      return
    }
    const filteredRows = ontology.filter(row => {
      // console.log('- - -')
      // console.table(row)
      return columns.map(col => col.field).some(field => {
        // console.log(field)
        // console.log(row[field])
        return searchRegex.test(row[field].toString())
      })
    })
    setRows(filteredRows)
  }

  return (
    <Container>
      <div style={{ width: '100%' }}>
        <DataGrid
          loading={ ontology.length === 0 }
          rows={ rows.map(term => ({ ...term, id: term.short_form })) }
          columns={ columns }
          pageSize={ 25 }
          autoHeight
          components={{
            Toolbar: QuickSearchToolbar,
          }}
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(''),
            },
          }}
        />
      </div>
      
    </Container>
  )
}
