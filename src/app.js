import { Route, Routes } from 'react-router-dom'
import { Paper } from '@mui/material'
import {
  AboutView, ContactView, NotFoundView, SearchView,
} from './views'
import { Drawer } from './components/drawer'
import { Header } from './components/layout'

const Router = () => {
  return (
    <Routes>
      <Route path="/"       element={ <SearchView /> } />
      <Route path="/contact" element={ <ContactView /> } />
      <Route path="/about"  element={ <AboutView /> } />
      <Route path="*"       element={ <NotFoundView /> } />
    </Routes>
  )
}

export const App = () => {
  return (
    <Paper className="app-container">
      <Header />

      <main>
        <Router />
      </main>
      
      <Paper
        component="footer"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '5rem',
        }}
      >&copy; { new Date().getFullYear() }</Paper>

      <Drawer />
    </Paper>
  )
}
