import { Route, Routes } from 'react-router-dom'
import { Paper, useTheme } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import {
  AboutView,
  DocumentationView,
  FeedbackView,
  NotFoundView,
  SearchView,
} from './views'
import { Drawer } from './components/drawer'
import { Header } from './components/layout'

const Router = () => {
  return (
    <Routes>
      <Route path="/"               element={ <SearchView /> } />
      <Route path="/about"          element={ <AboutView /> } />
      <Route path="/documentation"  element={ <DocumentationView /> } />
      <Route path="/feedback"       element={ <FeedbackView /> } />
      <Route path="*"               element={ <NotFoundView /> } />
    </Routes>
  )
}

export const App = () => {
  const theme = useTheme()
  
  return (
    <Paper
      className="app-container"
      sx={{
        // app-wide background color
        backgroundColor: theme.palette.background.default,
        // app-wide link color
        'a': { color: theme.palette.primary.main },
        // add some space between content bottom and footer top
        '& > main': { mb: theme.spacing(4) },
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
        theme={ theme.palette.mode }
      />
    </Paper>
  )
}
