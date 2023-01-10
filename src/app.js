import { Route, Routes } from 'react-router-dom'
import { Paper, useTheme } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import {
  AboutView, ContactView, NotFoundView, SearchView
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
  const theme = useTheme()

  return (
    <Paper
      className="app-container"
      sx={{
        backgroundColor: theme.palette.background.default,
        'a': { color: theme.palette.primary.main },
        // modify toast default styling to add space between the notification's icon and message
        '.Toastify__toast-body': { gap: '1rem' },
      }}
    >
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
      <ToastContainer
        position="bottom-left"
        autoClose={ 5000 }
        newestOnTop={ false }
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Paper>
  )
}
