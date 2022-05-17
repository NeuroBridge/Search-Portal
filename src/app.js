import { Fragment } from 'react'
import { Router as ReachRouter } from '@reach/router'
import { Box } from '@mui/material'
import { AboutView, BrowseView, NotFoundView, SearchView } from './views'
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
