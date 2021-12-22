import { Fragment, useCallback, useEffect, useState } from 'react'
import { navigate } from '@reach/router'
import { useSearchContext } from '../components/search/context'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Grid, IconButton, Paper, Tooltip, Typography } from '@material-ui/core'
import { TermCard } from '../components/search/term-card'
import {
  BugReport as DebugIcon,
  KeyboardArrowUp as OpenDrawerIcon,
  KeyboardArrowDown as CloseDrawerIcon,
} from '@material-ui/icons';
import ReactJson from 'react-json-view'
import { SearchHistoryList } from '../components/search/history-list'
import { Drawer } from '../components/drawer'
import { SelectionList } from '../components/selection-list'
import {
  DeleteSweep as ClearSelectionIcon,
  Send as SendIcon,
} from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  '@keyframes fadeIn': {
    from: { filter: 'opacity(0.0)' },
    to: { filter: 'opacity(1.0)' },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
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
  drawerHeader: {
    position: 'fixed',
    bottom: '-1px',
    left: 0,
    right: 0,
    height: '3rem',
    backgroundColor: '#474f61',
    transition: 'transform 225ms, filter 250ms',
    display: 'flex',
    flexDirection: 'row',
    filter: 'brightness(1.0)',
    '&:hover': {
      filter: 'brightness(0.9)',
    },
    cursor: 'pointer',
  },
  drawerTitle: {
    color: '#eee',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerIconContainer: {
    width: theme.spacing(10),
    backgroundColor: '#81676f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      fill: '#eee',
    },
  },
}))

const LandingPageContent = () => {
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
  const { terms, selectedTerms, clearTermSelection, clickSelectedTerm, deselectTerm, toggleTermSelection, searchedQuery } = useSearchContext()
  const [debugMode, setDebugMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(true)

  const handleToggleDebugMode = () => setDebugMode(!debugMode)
  const handleClickTerm = term => () => toggleTermSelection(term)
  const sendSelection = () => navigate('/select')

  useEffect(() => {
    if (Object.keys(selectedTerms).length > 0) {
      setDrawerOpen(true)
    }
  }, [selectedTerms])

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
      <LandingPageContent />
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
                !!terms.length && terms.map(term => (
                  <TermCard
                    key={ term.label }
                    term={ term }
                    selected={ term.short_form in selectedTerms }
                    clickHandler={ handleClickTerm(term) }
                  />
                ))
              }
            </Grid>
          </Grid>
        )
      }
      <Drawer
        open={ drawerOpen }
        actions={[
          { ariaLabel: 'Clear selection', icon: <ClearSelectionIcon style={{ fill: 'var(--color-unc-davie-green)' }} />, onClick: clearTermSelection, disabled: !Object.keys(selectedTerms).length },
          { ariaLabel: 'Send', icon: <SendIcon color="secondary" />, onClick: sendSelection, disabled: !Object.keys(selectedTerms).length },
        ]}
      >
        <SelectionList
          items={ Object.keys(selectedTerms).map(key => selectedTerms[key]) }
          onDeleteSelection={ clearTermSelection }
          onItemDelete={ term => deselectTerm(term) }
          onItemClick={ clickSelectedTerm }
        />
      </Drawer>
      <div
        className={ classes.drawerHeader }
        role="button"
        aria-label={ `${ open ? 'Close' : 'Open' } drawer` }
        onClick={ () => setDrawerOpen(!drawerOpen) }
        style={{ transform: `translateY(${ drawerOpen ? '-200px' : 0 })` }}
      >
        <div className={ classes.drawerTitle }>Term Selection</div>
        <div className={ `${ classes.drawerIconContainer }` }>{ drawerOpen ? <CloseDrawerIcon /> : <OpenDrawerIcon /> }</div>
      </div>
    </Fragment>
  )
}