import { useEffect, useMemo } from 'react'
import { AppBar, Toolbar, useMediaQuery } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import { DeleteSweep as ClearSelectionIcon } from '@mui/icons-material';
import brainImage from './images/brain.png'
import { Router } from './router'
import { Brand } from './components/brand'
import { Menu, MobileMenu } from './components/menu'
import { SearchBar } from './components/search/search-bar'
import { useSearchContext } from './components/search/context'
import { Drawer, useDrawer } from './components/drawer'
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
    padding: `0 0 0 ${ theme.spacing(2) }`,
    alignItems: 'stretch',
  },
  main: {
    padding: theme.spacing(4),
    width: '100%',
    maxWidth: '1600px',
    margin: '0 auto 250px auto',
    position: 'relative',
  },
}))

export const App = () => {
  const classes = useStyles()
  const compact = useMediaQuery('(max-width: 600px)')
  const { selectedTerms, clearTermSelection, clickSelectedTerm, deselectTerm } = useSearchContext()
  const { drawerOpen, locked, toggleOpen } = useDrawer()
  
  /**
   *
   * memoized array of drawer actions.
   *
   */
  const drawerActions = useMemo(() => [{
    ariaLabel: 'Clear selection',
    icon: <ClearSelectionIcon style={{ fill: '#f99' }} />,
    onClick: clearTermSelection,
    disabled: !Object.keys(selectedTerms).length,
  }], [selectedTerms])

  /**
   *
   * memoized string for the drawer title
   *
   */
  const drawerTitle = useMemo(() => `Term Selection ${
    Object.keys(selectedTerms).length > 0
      ? ` — ${ Object.keys(selectedTerms).length } term${ Object.keys(selectedTerms).length !== 1 ? 's' : '' }`
      : ''
  }`, [selectedTerms])

  /**
   *
   * show the drawer's contents whenever they change,
   * ...unless it's locked.
   *
   */
  useEffect(() => {
    if (drawerOpen || locked) {
      return
    }
    toggleOpen(true)
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
      <Drawer title={ drawerTitle } actions={ drawerActions }>
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
