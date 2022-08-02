import { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Box } from '@mui/material'
import {
  AboutView, BrowseView, ContactView, NotFoundView, SearchView,
} from './views'
import { Drawer } from './components/drawer'
import { Header } from './components/layout'

const Router = () => {
  return (
    <Routes>
      <Route path="/"       element={ <SearchView /> } />
      <Route path="/browse" element={ <BrowseView /> } />
      <Route path="/contact" element={ <ContactView /> } />
      <Route path="/about"  element={ <AboutView /> } />
      <Route path="*"       element={ <NotFoundView /> } />
    </Routes>
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
