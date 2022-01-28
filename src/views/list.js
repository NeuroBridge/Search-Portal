import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@mui/styles'
import { IconButton, TextField } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { TermCard } from '../components/search'
import {
  Clear as ClearIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useOntology } from '../components/ontology'
import { useDrawer } from '../components/drawer'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[200],
  },
  virtualScroller: {
    backgroundColor: '#fff',
  },
  footerContainer: {
    borderTop: `2px solid ${ theme.palette.primary.main }`,
  },
}))

const columns = [
  { field: 'short_form',             headerName: 'short form',            width: 350,     editable: false,      type: 'string',    hide: true },
  { field: 'label',                  headerName: 'label',                 width: null,     editable: false,      type: 'string',    hide: false },
  // { field: 'has_children',           headerName: 'children',              width: 100,     editable: false,      type: 'boolean',  hide: true },
  // { field: 'description',            headerName: 'description',           width: 100,     editable: false,      type: 'string',   hide: true },
  // { field: 'seeAlso',                headerName: 'see also',              width: 100,     editable: false,      type: 'string',   hide: true },
  { field: 'iri',                    headerName: 'iri',                   width: 300,     editable: false,      type: 'string',    hide: true },
]

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const QuickSearchToolbar = ({ value, onChange, clearSearch }) => {
  const theme = useTheme()
  const { drawerOpen } = useDrawer()
  const searchInputRef = useRef()

  useEffect(() => {
    if (drawerOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [drawerOpen])

  return (
    <TextField
      sx={{ borderBottom: `2px solid ${ theme.palette.primary.main }` }}
      fullWidth
      inputRef={ searchInputRef }
      value={ value }
      onChange={ onChange }
      placeholder="Search…"
      InputProps={{
        startAdornment: <SearchIcon fontSize="small" />,
        endAdornment: (
          <IconButton
            title="Clear"
            aria-label="Clear"
            size="small"
            style={{ visibility: value ? 'visible' : 'hidden' }}
            onClick={ clearSearch }
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        ),
      }}
    />
  )
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
}

const TermRow = ({ row }) => <TermCard term={ row } />

TermRow.propTypes = {
  row: PropTypes.object.isRequired,
}

export const ListView = () => {
  const ontology = useOntology()
  const dataGridClasses = useStyles()

  const [searchText, setSearchText] = useState('')
  const [rows, setRows] = useState(ontology.terms)

  useEffect(() => setRows(ontology.terms), [ontology.terms])

  const requestSearch = searchValue => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    if (ontology.terms.length === 0) {
      return
    }
    const filteredRows = ontology.terms.filter(row => {
      return columns.map(col => col.field).some(field => {
        return searchRegex.test(row[field].toString())
      })
    })
    setRows(filteredRows)
  }

  return (
    <div style={{ height: 'calc(100% - 65px)', }}>
      <DataGrid
        loading={ ontology.loading }
        classes={ dataGridClasses }
        rows={ rows.map(term => ({ ...term, id: term.short_form })) }
        columns={ columns }
        pageSize={ 20 }
        rowsPerPageOptions={ [20] }
        rowHeight={ 90 }
        headerHeight={ 0 }
        components={{
          Toolbar: QuickSearchToolbar,
          Row: TermRow,
          NoRowsOverlay: () => '',
        }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: event => requestSearch(event.target.value),
            clearSearch: () => requestSearch(''),
          },
        }}
      />
    </div>
    
  )
}
