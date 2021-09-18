import { useEffect, useRef } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { IconButton, LinearProgress, InputBase, useMediaQuery } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'
import { useSearchContext } from './context'

const useStyles = makeStyles(theme => ({
  form: {
    backgroundColor: '#fff',
    display: 'flex',
  },
  input: {
    backgroundColor: '#fff',
    padding: `0 ${ theme.spacing(3) }px`,
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
  const mobile = useMediaQuery(theme.breakpoints.down('xs'))
  const { busy, doSearch, terms, currentTerm, setCurrentTerm, previousTerm, nextTerm, searchedQuery } = useSearchContext()
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
          <InputBase className={ classes.input } id="query-field" label="Enter Query" type="search" variant="filled" inputRef={ inputRef } endAdornment={ !mobile && <small className={ classes.inputTip }>Press \ to focus</small> }/>
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </form>
        <LinearProgress variant={ busy ? 'indeterminate' : 'determinate' } value={ 100 } />
      </div>
  )
}