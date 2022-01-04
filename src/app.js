import { useEffect } from 'react'
import { AppBar, Button, Toolbar, useMediaQuery } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import brainImage from './images/brain.png'
import { Router } from './router'
import { Brand } from './components/brand'
import { Menu, MobileMenu } from './components/menu'
import { SearchBar } from './components/search/search-bar'
import { useSearchContext, SelectionForest } from './components/search'
import { Drawer, useDrawer } from './components/drawer'

const useStyles = makeStyles(theme => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    minHeight: '100vh',
    backgroundImage: `url(${ brainImage })`,
    backgroundPosition: 'center 100%',
    backgroundSize: '800px',
    backgroundRepeat: 'no-repeat',
    width: '100%',
  },
  toolbar: {
    padding: `0 0 0 ${ theme.spacing(2) }`,
    alignItems: 'stretch',
  },
  main: {
    flex: 1,
    padding: theme.spacing(4),
    width: '100%',
    marginTop: '115px',
    position: 'relative',
    transition: 'padding-right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, filter 250ms',
  },
  drawerTitle: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: `0 ${ theme.spacing(3) }`,
  },
}))

export const App = () => {
  const classes = useStyles()
  const compact = useMediaQuery('(max-width: 600px)')
  const { selectedRootTerms, selectedTerms } = useSearchContext()
  const { DRAWER_WIDTH, drawerOpen, locked, toggleOpen } = useDrawer()
  
  /**
   *
   * show the drawer's contents whenever they change,
   * ...unless it's locked.
   *
   */
  useEffect(() => {
    if (drawerOpen || locked || Object.keys(selectedRootTerms).length === 0) {
      return
    }
    toggleOpen(true)
  }, [selectedRootTerms])

  return (
    <div className={ classes.app }>
      <AppBar position="fixed" sx={{ zIndex: '1300' }}>
        <Toolbar disableGutters className={ classes.toolbar }>
          <Brand />
          { compact ? <MobileMenu /> : <Menu /> }
        </Toolbar>
        <SearchBar />
      </AppBar>
      <main className={ classes.main } style={{ paddingRight: drawerOpen ? `calc(${ DRAWER_WIDTH } + 6rem)` : '6rem' }}>
        <Router />
      </main>
      <Drawer title="Term Selection">
        <SelectionForest />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
          <Button variant="contained" color="secondary" disabled={ !selectedTerms.length }>
            Send { selectedTerms.length ? selectedTerms.length : '' } term{ selectedTerms.length === 1 ? '' : 's' }
          </Button>
        </div>
      </Drawer>
    </div>
  )
}
