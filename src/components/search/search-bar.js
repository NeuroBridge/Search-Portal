import { useEffect, useRef } from 'react'
import { IconButton, LinearProgress, InputBase, useAutocomplete, useMediaQuery } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles';
import { Search as SearchIcon } from '@mui/icons-material'
import { useSearchContext } from './context'
import { useLocalStorage } from '../../hooks'

const useStyles = makeStyles(theme => ({
  form: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
  },
  input: {
    backgroundColor: theme.palette.common.white,
    padding: `0 1rem`,
    flex: 1,
  },
  inputTip: {
    filter: 'opacity(0.33)',
    whiteSpace: 'nowrap',
    pointerEvents: 'none'
  },
}))

export const SearchBar = () => {
  const classes = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { busy, doSearch } = useSearchContext()
  const inputRef = useRef() // used for programatic focus of text input
  const { searchHistory } = useLocalStorage('searchHistory', '[]')
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: 'query-autocomplete',
    options: searchHistory,
    getOptionLabel: option => option.query,
  })

  useEffect(() => {
    // this lets the user press backslash to jump focus to the search box
    const handleKeyPress = event => {
      if (event.keyCode === 220) { // backslash ("\") key 
        if (inputRef.current) {
          event.preventDefault()
          inputRef.current.select()
        }
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleSubmit = event => {
    event.preventDefault()
    doSearch(inputRef.current.value)
  }
  
  return (
    <div>
      <form className={ classes.form } noValidate autoComplete="off" onSubmit={ handleSubmit }>
        <InputBase
          className={ classes.input }
          id="query-field"
          label="Enter Query"
          type="search"
          variant="filled"
          inputRef={ inputRef }
          endAdornment={ !mobile && <small className={ classes.inputTip }>Press \ to focus</small> }
          {...getInputProps()}
        />
        <IconButton
          type="submit"
          className={ classes.iconButton }
          aria-label="search"
          size="large">
          <SearchIcon />
        </IconButton>
      </form>
      <LinearProgress
        variant={ busy ? 'indeterminate' : 'determinate' }
        value={ 100 }
      />
    </div>
  );
}