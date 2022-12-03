import { Fragment } from 'react'
import PropTypes from 'prop-types'
import {
  AppBar, Box, Container, IconButton, Slide,
  Toolbar, Tooltip, useScrollTrigger, useTheme,
} from '@mui/material'
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material'
import { Link } from '../link'
import { useMatch, useResolvedPath } from 'react-router-dom'
import { useDrawer } from '../drawer'
import { OpenInBrowser as DrawerIcon } from '@mui/icons-material'
import { useAppContext } from '../../context'

const HideOnScroll = ({ children }) => {
  const trigger = useScrollTrigger()

  return (
    <Slide appear={ false } direction="down" in={ !trigger }>
      { children }
    </Slide>
  )
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
}

//

const navStyle = {
  display: 'flex',
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'stretch',
  height: '100%',
  mr: 2,
  '& a': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.5rem',
    textDecoration: 'none',
    borderBottom: '3px solid transparent',
    transition: 'border-color 250ms, background-color 250ms',
    '&:hover': {
      borderBottom: '3px solid #ccc',
      backgroundColor: '#eaebec',
    },
    '&[aria-current="page"]': {
      borderBottom: '3px solid #1976d2',
    }
  }
}

const brandStyle = {
  fontVariant: 'small-caps',
  textDecoration: 'none',
  fontSize: '2rem',
}

//

const NavLink = ({ to, children }) => {
  const resolved = useResolvedPath(to)
  const match = useMatch({ path: resolved.pathname, end: true })

  return (
    <Link to={ to } aria-current={ match ? 'page' : undefined }>{ children }</Link>
  )
}

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

//

export const Header = () => {
  const { settings } = useAppContext()
  const theme = useTheme()
  const drawer = useDrawer()

  return (
    <Fragment>
      <HideOnScroll>
        <AppBar elevation={ 1 } sx={{
          backgroundColor: theme.palette.background.paper,
          backdropFilter: 'blur(5px)',
        }}>
          <Toolbar>
            <Container maxWidth="xl" sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '5rem',
              padding: '0 1rem',
            }}>
              <Link to="/" style={ brandStyle }>
                NeuroBridge
              </Link>
              <Box sx={ navStyle }>
                <NavLink to="/">Search</NavLink>
                <NavLink to="/about">About</NavLink>
                <NavLink to="/contact">Contact</NavLink>
              </Box>
              <Tooltip title="Toggle Color Mode" placement="bottom">
                <IconButton onClick={ settings.color.toggleMode }>
                  {
                    settings.color.mode === settings.color.modes.light
                      ? <LightModeIcon />
                      : <DarkModeIcon />
                  }
                </IconButton>
              </Tooltip>
              <Tooltip title="Open Ontology Browser" placement="bottom">
                <IconButton onClick={ () => drawer.open() }><DrawerIcon sx={{ transform: 'rotate(90deg)' }} /></IconButton>
              </Tooltip>
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </Fragment>
  )
}