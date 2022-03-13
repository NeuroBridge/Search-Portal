import { Fragment } from 'react'
import { Router as ReachRouter } from '@reach/router'
import { Box, Container } from '@mui/material'
import { AboutView, NotFoundView, SearchView } from './views'
import { Link } from './components/link'
import { Drawer } from './components/drawer'

const Router = () => {
  return (
    <ReachRouter>
      <SearchView path="/" />
      <AboutView path="/about" />
      <NotFoundView default />
    </ReachRouter>
  )
}

export const App = () => {
  return (
    <Fragment>
      <header>
        <Container maxWidth="xl" sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '5rem',
          padding: '0 1rem',
        }}>
          <Box>
            <Link to="/" style={{
              fontVariant: 'small-caps',
              textDecoration: 'none',
              fontSize: '2rem',
            }}>
              NeuroBridge
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Link to="/">Search</Link>
            <Link to="/about">About</Link>
          </Box>
        </Container>
      </header>
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
