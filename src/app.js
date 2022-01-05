import { useEffect, useState } from 'react'
import { AppBar, Toolbar, useMediaQuery } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Brand } from './components/brand'
import { Menu, MobileMenu } from './components/menu'
import { SearchBar } from './components/search/search-bar'
import { useSearchContext } from './components/search'
import { Drawer, useDrawer } from './components/drawer'
import neuroBridgeBackground from './images/nbbg.jpeg'
import { ForestView, SearchView } from './views'

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
  watermark: {
    background: `linear-gradient(0deg, transparent 0, #fff 66%), url(${ neuroBridgeBackground })`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    filter: 'opacity(0.33) saturate(0.33)',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  main: {
    flex: 1,
    width: '100%',
    marginTop: '115px',
    position: 'relative',
    transition: 'padding-right 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, filter 250ms',
  },
  
}))

export const App = () => {
  const classes = useStyles()
  const compact = useMediaQuery('(max-width: 600px)')
  const { searchedQuery, selectedRootTermsCount, terms } = useSearchContext()
  const { drawerWidth, drawerOpen, locked, openDrawer } = useDrawer()
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (searchedQuery) {
      openDrawer()
    }
  }, [searchedQuery])

  /* temporary faking term send request */
  useEffect(() => {
    const resetSend = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(resetSend)
  }, [sent])
  
  /**
   *
   * show the drawer's contents whenever they change,
   * ...unless it's locked.
   *
   */
  useEffect(() => {
    if (drawerOpen || locked || selectedRootTermsCount === 0) {
      return
    }
    openDrawer()
  }, [selectedRootTermsCount])

  return (
    <div className={ classes.app }>
      <AppBar position="fixed" sx={{ zIndex: '1300' }}>
        <Toolbar disableGutters className={ classes.toolbar }>
          <Brand />
          { compact ? <MobileMenu /> : <Menu /> }
        </Toolbar>
        <SearchBar />
      </AppBar>
      <div className={ classes.watermark } />
      <main className={ classes.main } style={{ paddingRight: drawerOpen ? `calc(${ drawerWidth }px + 4rem)` : '4rem' }}>
        <ForestView />
      </main>
      <Drawer title={ `Search Drawer - ${ terms.length } results for "${ searchedQuery }"` }>
        <SearchView />
      </Drawer>
    </div>
  )
}
