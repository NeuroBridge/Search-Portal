import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppBar, Toolbar, Typography, useMediaQuery } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import brainImage from './images/brain.png'
import { Router } from './router'
import { Brand } from './components/brand'
import { Menu } from './components/menu'
import { SearchBar } from './components/search/search-bar'

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
  },
  toolbar: {
    padding: `0 ${ theme.spacing(3) }px`,
    alignItems: 'stretch',
  },
}))

export const App = () => {
  const classes = useStyles()

  return (
    <div className={ classes.app }>
      <AppBar position="sticky">
        <Toolbar disableGutters className={ classes.toolbar }>
          <Brand />
          <Menu />
        </Toolbar>
        <SearchBar />
      </AppBar>
      <Router />
    </div>
  )
}
