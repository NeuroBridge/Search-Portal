import { Fragment, useCallback, useMemo, useState } from 'react'
import { useSearchContext } from '../components/search/context'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Grid, IconButton, Paper, Typography } from '@material-ui/core'
import { TermCard } from '../components/search/term-card'
import { TermDialog } from '../components/search/term-dialog'
import { BugReport as DebugIcon } from '@material-ui/icons';
import ReactJson from 'react-json-view'

const useStyles = makeStyles(theme => ({
  '@keyframes fadeIn': {
    from: { filter: 'opacity(0.0)' },
    to: { filter: 'opacity(1.0)' },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: theme.spacing(2),
    animation: '$fadeIn 250ms ease-out',
  },
  resultsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  debugIcon: {
    filter: `opacity(0.25)`,
  },
  active: {
    filter: `opacity(1.0)`,
  },
  debug: {
    animation: '$fadeIn 250ms ease-out',
    '& .react-json-view': {
      fontSize: '80%',
      borderRadius: theme.spacing(1) / 2,
      padding: theme.spacing(2),
    }
  },
}))

export const SearchView = () => {
  const classes = useStyles()
  const { busy, doSearch, terms, currentTerm, setCurrentTerm, previousTerm, nextTerm, searchedQuery } = useSearchContext()
  const dialogOpen = useMemo(() => !!currentTerm, [currentTerm])
  const [debugMode, setDebugMode] = useState(false)

  const handleClickTerm = index => event => {
    if (0 <= index && index < terms.length) {
      setCurrentTerm(terms[index])
    }
  }

  const handleToggleDebugMode = () => setDebugMode(!debugMode)

  const MemoizedResultsHeader = useCallback(() => {
    return (
      <Paper className={ classes.resultsHeader } elevation={ 0 }>
        <Typography>"{ searchedQuery }" returned { terms.length } results</Typography>
        <IconButton onClick={ handleToggleDebugMode } size="small">
          <DebugIcon
            fontSize="small"
            color="primary"
            className={ `${ classes.debugIcon } ${ debugMode ? classes.active : undefined }` }
          />
        </IconButton>
      </Paper>
    )
  }, [debugMode, searchedQuery, terms])

  return (
    <Fragment>
      { searchedQuery && <MemoizedResultsHeader /> }
      <br />
      {
        debugMode ? (
          <div className={ classes.debug }>
            <ReactJson src={ terms } theme="monokai" />
          </div>
        ) : (
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } className={ classes.grid }>
              {
                !!terms.length && terms.map((term, index) => <TermCard term={ term } key={ term.label } clickHandler={ handleClickTerm(index) } />)
              }
              <TermDialog open={ dialogOpen } term={ currentTerm } closeHandler={ handleClickTerm(null) } />
            </Grid>
          </Grid>
        )
      }
    </Fragment>
  )
}