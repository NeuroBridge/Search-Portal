import { render } from 'react-dom'
import { App } from './app'
import { LocationProvider } from '@reach/router'
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { DrawerProvider } from './components/drawer'
import './styles/index.scss'

const themeOptions = {
  palette: {
    type: 'light',
    primary: {
      main: '#373f51',
    },
    secondary: {
      main: '#00758d',
    },
    danger: '#966',
  },
  shape: {
    borderRadius: 0,
  },
  spacing: 8,
  typography: {
    htmlFontSize: 18,
    h1: {
      fontSize: '1.75rem',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 'normal',
    },
    h3: {
      fontSize: '1.4rem',
      fontWeight: 'normal',
    },
    h4: {
      fontWeight: 'normal',
      fontSize: '1.3rem',
    },
    h5: {
      fontSize: '1.2rem',
    },
    h6: {
      fontSize: '1.1rem',
    },
  },
}

const theme = createTheme(adaptV4Theme(themeOptions))

render(
  <LocationProvider>
    <DrawerProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </DrawerProvider>
  </LocationProvider>,
  document.getElementById('root')
)
