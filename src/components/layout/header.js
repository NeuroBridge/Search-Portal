import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Toolbar, Box, Container, useScrollTrigger, Slide, useTheme } from '@mui/material'
import { Link } from '../link'

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
  alignItems: 'stretch',
  height: '100%',
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

export const Header = () => {
  const theme = useTheme()

  return (
    <Fragment>
      <HideOnScroll>
        <AppBar elevation={ 1 } sx={{
          backgroundColor: theme.palette.background.paper,
        }}>
          <Toolbar>
            <Container maxWidth="xl" sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '5rem',
              padding: '0 1rem',
            }}>
              <Box>
                <Link to="/" style={ brandStyle }>
                  NeuroBridge
                </Link>
              </Box>
              <Box sx={ navStyle }>
                <Link to="/">Search</Link>
                <Link to="/browse">Browse</Link>
                <Link to="/about">About</Link>
              </Box>
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
    </Fragment>
  )
}