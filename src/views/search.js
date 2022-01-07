import { useCallback, useState } from 'react'
import { useSearchContext } from '../components/search/context'
import makeStyles from '@mui/styles/makeStyles';
import { IconButton, Paper, Tooltip, Typography } from '@mui/material'
import { TermCard } from '../components/search/term-card'
import {
  BugReport as DebugIcon,
} from '@mui/icons-material';
import ReactJson from 'react-json-view'

const useStyles = makeStyles(theme => ({
  '@keyframes fadeIn': {
    from: { filter: 'opacity(0.0)' },
    to: { filter: 'opacity(1.0)' },
  },
  wrapper: {
    padding: theme.spacing(4),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 7fr))',
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
      padding: theme.spacing(2),
    }
  },
  landing: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(4),
    padding: theme.spacing(4),
    backgroundColor: '#ccc',
  },
  frown: {
    flex: 1,
    fontSize: '600%',
    color: '#999',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  details: {
    flex: 2,
    textAlign: 'center',
    color: '#666',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
}))

const SearchLanding = () => {
  const classes = useStyles()

  return (
    <div className={ classes.landing }>
      <Typography className={ classes.frown }>:(</Typography>
      <div className={ classes.details }>
        <Typography paragraph>
          Search for terms in the NeuroBridge Ontology using
          the search bar at the top of the page.
        </Typography>
        <Typography paragraph>
          Matching results will appear here.
        </Typography>
      </div>
    </div>
  )
}

export const SearchView = () => {
  const classes = useStyles()
  const { terms, toggleRootSelection, searchedQuery } = useSearchContext()
  const [debugMode, setDebugMode] = useState(false)

  const handleToggleDebugMode = () => setDebugMode(!debugMode)
  const handleToggleTermSelection = term => () => toggleRootSelection(term)

  const MemoizedResultsHeader = useCallback(() => {
    return (
      <Paper className={ classes.resultsHeader } elevation={ 0 }>
        <Typography>{ terms.length } result{ terms.length !== 1 ? 's' : '' } for "{ searchedQuery }"</Typography>
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
    return <SearchLanding />
  }

  return (
    <div className={ classes.wrapper }>
      <MemoizedResultsHeader />
      <br />
      {
        debugMode ? (
          <div className={ classes.debug }>
            <ReactJson src={ terms } theme="monokai" enableClipboard={ false } />
          </div>
        ) : (
          <div className={ classes.grid }>
            {
              !!terms.length && terms.map(term => (
                <TermCard
                  key={ term.label }
                  term={ term }
                  toggleRootSelectionHandler={ handleToggleTermSelection(term) }
                />
              ))
            }
          </div>
        )
      }
    </div>
  )
}