import { useEffect, useState } from 'react'
import { AppBar, Toolbar, useMediaQuery } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import {
  DeleteSweep as ClearSelectionIcon,
  KeyboardArrowDown as CloseDrawerIcon,
  KeyboardArrowUp as OpenDrawerIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { navigate } from '@reach/router'
import brainImage from './images/brain.png'
import { Router } from './router'
import { Brand } from './components/brand'
import { Menu, MobileMenu } from './components/menu'
import { SearchBar } from './components/search/search-bar'
import { Drawer } from './components/drawer'
import { useSearchContext } from './components/search/context'
import { SelectionList } from './components/selection-list'

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
    overflowX: 'hidden',
  },
  toolbar: {
    padding: `0 0 0 1rem`,
    alignItems: 'stretch',
  },
  main: {
    padding: '2rem',
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto',
    position: 'relative',
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
    width: '5rem',
    backgroundColor: '#81676f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      fill: '#eee',
    },
  },
}))

export const App = () => {
  const classes = useStyles()
  const compact = useMediaQuery('(max-width: 600px)')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { selectedTerms, clearTermSelection, clickSelectedTerm, deselectTerm } = useSearchContext()
  
  const sendSelection = () => navigate('/select')

  useEffect(() => {
    if (Object.keys(selectedTerms).length > 0) {
      setDrawerOpen(true)
    }
  }, [selectedTerms])

  return (
    <div className={ classes.app }>
      <AppBar position="sticky">
        <Toolbar disableGutters className={ classes.toolbar }>
          <Brand />
          { compact ? <MobileMenu /> : <Menu /> }
        </Toolbar>
        <SearchBar />
      </AppBar>
      <main className={ classes.main }>
        <Router />
      </main>
      <div
        className={ classes.drawerHeader }
        role="button"
        aria-label={ `${ open ? 'Close' : 'Open' } drawer` }
        onClick={ () => setDrawerOpen(!drawerOpen) }
        style={{ transform: `translateY(${ drawerOpen ? '-200px' : 0 })` }}
      >
        <div className={ classes.drawerTitle }>
          Term Selection
          { Object.keys(selectedTerms).length > 0 &&
            ` — ${ Object.keys(selectedTerms).length } term${ Object.keys(selectedTerms).length !== 1 ? 's' : '' } selected` }
        </div>
        <div className={ `${ classes.drawerIconContainer }` }>{ drawerOpen ? <CloseDrawerIcon /> : <OpenDrawerIcon /> }</div>
      </div>
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
    </div>
  )
}
