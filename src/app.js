import { useEffect } from 'react'
import { AppBar, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { Router } from '@reach/router'
import { Link } from '@reach/router'
import { makeStyles, useTheme } from '@mui/styles'
import { Menu, MobileMenu } from './components/menu'
import { useSearchContext } from './components/search'
import { Drawer, useDrawer } from './components/drawer'
import neuroBridgeBackground from './images/nbbg.jpeg'
import {
  ListView,
  NotFoundView,
  ResultsView,
  QueryBuilderView,
} from './views'
import { OntologyProvider } from './components/ontology'
import { SearchContextProvider } from './components/search'

const useStyles = makeStyles(theme => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    minHeight: '100vh',
    width: '100%',
  },
  toolbar: {
    padding: `0 0 0 ${ theme.spacing(2) }`,
    alignItems: 'stretch',
  },
  title: {
    width: '100%',
    fontVariant: 'small-caps',
    letterSpacing: '1px',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& a': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      filter: 'saturate(0.0) brightness(2)',
      transition: 'filter 250ms',
      '&:hover': {
        filter: 'saturate(1.0) brightness(1.0)',
      }
    },
  },
  watermark: {
    background: `linear-gradient(0deg, transparent 0, #fff 66%), url(${ neuroBridgeBackground })`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    filter: 'opacity(0.33) saturate(0.33)',
    position: 'fixed',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  main: {
    flex: 1,
    width: '100%',
    marginTop: '64px',
    position: 'relative',
    transition: 'padding-left 300ms cubic-bezier(0, 0, 0.2, 1) 100ms, filter 250ms',
  },
  
}))

export const App = () => {
  const classes = useStyles()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const compact = useMediaQuery('(max-width: 600px)')
  const { resetSearch, searchInputRef } = useSearchContext()
  const { drawerWidth, drawerOpen, toggleOpen } = useDrawer()

  useEffect(() => {
    // when the user toggle's the drawer open,
    // focus the search input
    if (drawerOpen && searchInputRef?.current) {
      searchInputRef.current.focus()
    }
    // this lets the user press backslash to open the drawer
    // todo: & focus search input
    const handleKeyPress = event => {
      if (event.ctrlKey && event.keyCode === 220) { // ctrl + backslash ("\") 
        toggleOpen()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [drawerOpen])

  return (
    <div className={ classes.app }>
      <AppBar position="fixed" sx={{ zIndex: '1300' }}>
        <Toolbar disableGutters className={ classes.toolbar }>
          <Typography variant="h6" align={ mobile ? 'center' : 'left' } className={ classes.title }>
            <Link to="/" onClick={ resetSearch }>NeuroBridge</Link>
          </Typography>
          { compact ? <MobileMenu /> : <Menu /> }
        </Toolbar>
      </AppBar>
      <div className={ classes.watermark } />
      <OntologyProvider>
        <SearchContextProvider>
          <main className={ classes.main } style={{ paddingLeft: drawerOpen ? `calc(${ drawerWidth }px + 4rem)` : '4rem' }}>
            <Router>
              <QueryBuilderView exact path="/" />
              <ResultsView exact path="/results" />
              <NotFoundView default />
            </Router>
          </main>
          <Drawer title="Search Drawer">
            <ListView />
          </Drawer>
        </SearchContextProvider>
      </OntologyProvider>
    </div>
  )
}
