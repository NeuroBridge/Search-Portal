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
}))

export const SearchView = () => {
  const classes = useStyles()
  const { terms, toggleRootTermSelection, searchedQuery } = useSearchContext()
  const [debugMode, setDebugMode] = useState(false)

  const handleToggleDebugMode = () => setDebugMode(!debugMode)
  const handleToggleTermSelection = term => () => toggleRootTermSelection(term)

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
    return <span />
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
                  toggleRootTermSelectionHandler={ handleToggleTermSelection(term) }
                />
              ))
            }
          </div>
        )
      }
    </div>
  )
}