import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Router as ReachRouter } from '@reach/router'
import { AppBar, Toolbar, Box, Container, useScrollTrigger, Slide, Typography } from '@mui/material'
import { AboutView, BrowseView, NotFoundView, SearchView } from './views'
import { Link } from './components/link'
import { Drawer } from './components/drawer'
import { Header } from './components/layout'

const Router = () => {
  return (
    <ReachRouter>
      <SearchView path="/" />
      <BrowseView path="/browse" />
      <AboutView path="/about" />
      <NotFoundView default />
    </ReachRouter>
  )
}

export const App = () => {
  return (
    <Fragment>
      <Header />

      <main>
        <Router />
      </main>
      
      <footer>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '5rem',
        }}>
          &copy; { new Date().getFullYear() }
        </Box>
      </footer>
      <Drawer />
    </Fragment>
  )
}
