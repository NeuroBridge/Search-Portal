import { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { IconButton, LinearProgress, InputBase, useMediaQuery } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useSearchContext } from './context'

const useStyles = makeStyles(theme => ({
  form: {
    backgroundColor: '#fff',
    display: 'flex',
  },
  input: {
    backgroundColor: '#fff',
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