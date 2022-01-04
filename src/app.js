import { useCallback, useEffect, useState } from 'react'
import { AppBar, Button, IconButton, Paper, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { DeleteSweep as ClearSelectionIcon } from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles';
import { Router } from './router'
import { Brand } from './components/brand'
import { Menu, MobileMenu } from './components/menu'
import { SearchBar } from './components/search/search-bar'
import { useSearchContext, SelectionForest } from './components/search'
import { Drawer, useDrawer } from './components/drawer'
import neuroBridgeBackground from './images/nbbg.jpeg'

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
    background: `linear-gradient(0deg, transparent 0, #fff 100%), url(${ neuroBridgeBackground })`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    filter: 'opacity(0.25) saturate(0.25)',  
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
  drawerHeading: {
    color: theme.palette.primary.dark,
    padding: theme.spacing(1),
    '& > *': {
      textAlign: 'center',
      padding: 0,
    },
  },
}))

export const App = () => {
  const classes = useStyles()
  const compact = useMediaQuery('(max-width: 600px)')
  const {
    clearRootTermSelection, selectedRootTermsCount,
    selectedTerms, clearTermSelection, selectedTermsCount,
  } = useSearchContext()
  const { drawerWidth, drawerOpen, locked, toggleOpen } = useDrawer()
  const [sent, setSent] = useState(false)

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
    toggleOpen(true)
  }, [selectedRootTermsCount])

  const DrawerHeading = useCallback(() => {
    return (
      <Paper className={ classes.drawerHeading }>
        <Typography variant="subtitle1">
          { selectedRootTermsCount } Root Term{ selectedRootTermsCount === 1 ? '' : 's' }
          <IconButton onClick={ clearRootTermSelection } disabled={ selectedRootTermsCount === 0 }>
            <ClearSelectionIcon />
          </IconButton>
        </Typography>
        <Typography variant="subtitle2">
          { selectedTermsCount } selected term{ selectedTermsCount === 1 ? '' : 's'}
          <IconButton onClick={ clearTermSelection } disabled={ selectedTermsCount === 0 }>
            <ClearSelectionIcon />
          </IconButton>
        </Typography>
      </Paper>
    )
  }, [selectedRootTermsCount, selectedTerms, selectedTermsCount])

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
        <Router />
      </main>
      <Drawer title="Term Selection">
        <DrawerHeading />
        <SelectionForest />
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem auto' }}>
          <Button variant="contained" color="secondary" disabled={ sent || !selectedTermsCount } onClick={ () => setSent(true) }>
            Send { selectedTermsCount ? selectedTermsCount : '' } term{ selectedTermsCount === 1 ? '' : 's' }
          </Button>
        </div>
        {
          sent && (
            <div style={{ padding: '3rem' }}>
              <Typography variant="subtitle2">Sending the following request payload</Typography>
              <pre style={{ backgroundColor: '#ddd', fontSize: '75%', padding: '1rem' }}>
                { JSON.stringify(selectedTerms, null, 2) }
              </pre>
            </div>
          )
        }
      </Drawer>
    </div>
  )
}
