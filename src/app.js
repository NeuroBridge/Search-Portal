import { useCallback, useEffect, useState } from 'react'
import { AppBar, Button, IconButton, Paper, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { DeleteSweep as ClearSelectionIcon } from '@mui/icons-material'
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
  const { DRAWER_WIDTH, drawerOpen, locked, toggleOpen } = useDrawer()
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
      <main className={ classes.main } style={{ paddingRight: drawerOpen ? `calc(${ DRAWER_WIDTH } + 6rem)` : '6rem' }}>
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
