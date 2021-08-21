import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
  AppBar, Button, Card, CardContent, IconButton, Grid, LinearProgress, Paper, InputBase, Toolbar, Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import {
  ArrowForwardIos as ViewTermIcon,
  Search as SearchIcon,
} from '@material-ui/icons'
import { useSearchContext } from './context'
import { TermCard } from './components/term-card'
import { TermDialog } from './components/term-dialog'

const useStyles = makeStyles(theme => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    minHeight: '100vh',
  },
  toolbar: {
    padding: `0 ${ theme.spacing(3) }px`,
  },
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
  },
  main: {
    margin: theme.spacing(4),
  },
  terms: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
}))

export const App = () => {
  const classes = useStyles()
  const { busy, doSearch, terms, currentTerm, setCurrentTerm, previousTerm, nextTerm } = useSearchContext()
  const [query, setQuery] = useState('')
  const dialogOpen = useMemo(() => !!currentTerm, [currentTerm])
  const inputRef = useRef() // used for programatic focus of text input

  useEffect(() => {
    // this lets the user press backslash to jump focus to the search box
    const handleKeyPress = event => {
      if (event.keyCode === 220) { // backslash ("\") key 
        if (inputRef.current) {
          event.preventDefault()
          inputRef.current.select()
          window.scroll({
            top: 0,
            behavior: 'smooth',
          })
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
  
  const handleClickTerm = index => event => {
    if (0 <= index && index < terms.length) {
      setCurrentTerm(terms[index])
    }
  }

  return (
    <div className={ classes.app }>
      <AppBar position="static">
        <Toolbar disableGutters className={ classes.toolbar }>
          <Typography variant="h6">NeuroBridge</Typography>
        </Toolbar>
        <form className={ classes.form } noValidate autoComplete="off" onSubmit={ handleSubmit }>
          <InputBase className={ classes.input } id="query-field" label="Enter Query" type="search" variant="filled" inputRef={ inputRef } endAdornment={ <small className={ classes.inputTip }>Press \ to focus</small> }/>
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <SearchIcon />
          </IconButton>
        </form>
        <LinearProgress variant={ busy ? 'indeterminate' : 'determinate' } value={ 100 } />
      </AppBar>
      <main className={ classes.main }>
        <Grid container spacing={ 3 }>
          <Grid item xs={ 12 } className={ classes.terms }>
            {
              terms.length
                ? terms.map((term, index) => <TermCard term={ term } key={ term.label } clickHandler={ handleClickTerm(index) }/>)
                : `no terms returned from searching "${ inputRef.current.value }"`
            }
            <TermDialog open={ dialogOpen } term={ currentTerm } closeHandler={ handleClickTerm(null) } />
          </Grid>
        </Grid>
      </main>
    </div>
  )
}
