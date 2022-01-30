import { Fragment, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@mui/styles'
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material'
import {
  DataGrid, 
  GridFooterContainer,
  GridPagination,
} from '@mui/x-data-grid'
import { LoadingButton } from '@mui/lab'
import { TermCard } from '../components/search'
import {
  Clear as ClearIcon,
  Search as SearchIcon,
  Sync as SyncIcon,
} from '@mui/icons-material'
import { useOntology } from '../components/ontology'
import { useDrawer } from '../components/drawer'
import TimeAgo from 'timeago-react'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[200],
  },
  virtualScroller: {
    backgroundColor: '#fff',
    scrollbarWidth: 'thin', // firefox only
    scrollbarColor: `${ theme.palette.primary.dark } ${ theme.palette.grey[100] }`, // firefox only
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

//

const escapeRegExp = value => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

//

const QuickSearchToolbar = ({ value, onChange, clearSearch, count }) => {
  const theme = useTheme()
  const { drawerOpen } = useDrawer()
  const searchInputRef = useRef()

  useEffect(() => {
    if (drawerOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [drawerOpen])

  return (
    <Fragment>
      <TextField
        fullWidth
        variant="standard"
        inputRef={ searchInputRef }
        value={ value }
        onChange={ onChange }
        placeholder="Search…"
        InputProps={{
          style: { height: '80px', fontSize: '150%', },
          startAdornment: <SearchIcon fontSize="small" sx={{ margin: theme.spacing(1) }} />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: value ? 'visible' : 'hidden' }}
              onClick={ clearSearch }
              sx={{ margin: theme.spacing(1) }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
      />
      <Box sx={{
        backgroundColor: '#fff',
        padding: theme.spacing(1),
        textAlign: 'right',
        borderBottom: `1px solid ${ theme.palette.primary.main }`,
      }}>
        {
          value === ''
            ? `${ count } total terms`
            : `${ count } matches for "${ value }"`
        }
      </Box>
    </Fragment>
  )
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
}

//

const CustomFooter = () => {
  const theme = useTheme()
  const ontology = useOntology()

  const handleClickSync = () => {
    ontology.fetchAllTerms()
  }

  return (
    <GridFooterContainer>
      <Box sx={{
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <Box sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          gap: theme.spacing(1),
        }}>
          <Tooltip title="Sync NeuroBridge Ontology" placement="right">
            <span>
              <LoadingButton
                onClick={ handleClickSync }
                loading={ ontology.loading }
                sx={{ height: '100%' }}
              >
                <SyncIcon />
              </LoadingButton>
            </span>
          </Tooltip>
          <Box sx={{
            fontSize: '75%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}>
            Last sync:<br />
            <TimeAgo datetime={ ontology.lastSyncTime } />
          </Box>
        </Box>
        <GridPagination />
      </Box>
    </GridFooterContainer>
  )
}

//

const TermRow = ({ row }) => <TermCard term={ row } />

TermRow.propTypes = {
  row: PropTypes.object.isRequired,
}

//

export const TermsView = () => {
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
        rows={ !ontology.loading ? rows.map(term => ({ ...term, id: term.short_form })) : [] }
        columns={ columns }
        pageSize={ 25 }
        rowsPerPageOptions={ [25] }
        rowHeight={ 75 }
        headerHeight={ 0 }
        components={{
          Toolbar: QuickSearchToolbar,
          Row: TermRow,
          NoRowsOverlay: () => '',
          Footer: CustomFooter,
        }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: event => requestSearch(event.target.value),
            clearSearch: () => requestSearch(''),
            count: rows.length,
          },
        }}
      />
    </div>
    
  )
}
