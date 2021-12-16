import { Fragment, useCallback, useMemo, useState } from 'react'
import { useSearchContext } from '../components/search/context'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, IconButton, Paper, Tooltip, Typography } from '@material-ui/core'
import { TermCard } from '../components/search/term-card'
import { TermBrowser } from '../components/search/term-browser'
import { BugReport as DebugIcon } from '@material-ui/icons';
import ReactJson from 'react-json-view'
import { SearchHistoryList } from '../components/search/history-list'

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

const SearchLanding = () => {
  return (
    <Grid container spacing={ 10 }>
      <Grid item xs={ 12 } md={ 8 }>
        <br />
        <Typography variant="h4" align="center">Search the NeuroBridge Ontology</Typography>
        <br />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
          consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Typography>

        <Typography paragraph>
          Duis aute irure dolor in reprehenderit in voluptate velit esse
          cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Typography>
      </Grid>
      <Grid item xs={ 12 } md={ 4 }>
        <SearchHistoryList />
      </Grid>
    </Grid>
  )
}

export const SearchView = () => {
  const classes = useStyles()
  const { terms, currentTerm, setCurrentTerm, searchedQuery } = useSearchContext()
  const dialogOpen = useMemo(() => !!currentTerm, [currentTerm])
  const [debugMode, setDebugMode] = useState(false)

  const handleClickTerm = index => () => {
    if (0 <= index && index < terms.length) {
      setCurrentTerm(terms[index])
    }
  }

  const handleToggleDebugMode = () => setDebugMode(!debugMode)

  const MemoizedResultsHeader = useCallback(() => {
    return (
      <Paper className={ classes.resultsHeader } elevation={ 0 }>
        <Typography>"{ searchedQuery }" returned { terms.length } results</Typography>
        <Tooltip title="Toggle debug mode" placement="left">
          <IconButton onClick={ handleToggleDebugMode } size="small">
            <DebugIcon
              fontSize="small"
              color="primary"
              className={ `${ classes.debugIcon } ${ debugMode ? classes.active : undefined }` }
            />
          </IconButton>
        </Tooltip>
      </Paper>
    )
  }, [debugMode, searchedQuery, terms])

  if (!searchedQuery) {
    return (
      <SearchLanding />
    )
  }

  return (
    <Fragment>
      <MemoizedResultsHeader />
      <br />
      {
        debugMode ? (
          <div className={ classes.debug }>
            <ReactJson src={ terms } theme="monokai" enableClipboard={ false } />
          </div>
        ) : (
          <Grid container spacing={ 3 }>
            <Grid item xs={ 12 } className={ classes.grid }>
              {
                !!terms.length && terms.map((term, index) => <TermCard term={ term } key={ term.label } clickHandler={ handleClickTerm(index) } />)
              }
              <TermBrowser open={ dialogOpen } term={ currentTerm } closeHandler={ handleClickTerm(null) } />
            </Grid>
          </Grid>
        )
      }
    </Fragment>
  )
}