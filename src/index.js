import { render } from 'react-dom'
import { App } from './app'
import { LocationProvider } from '@reach/router'
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { DrawerProvider } from './components/drawer'
import { SearchContextProvider } from './components/search/context.js'
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
  },
  shape: {
    borderRadius: 0,
  },
  spacing: 8,
}

const theme = createTheme(adaptV4Theme(themeOptions))

render(
  <LocationProvider>
    <SearchContextProvider>
      <DrawerProvider>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </StyledEngineProvider>
      </DrawerProvider>
    </SearchContextProvider>
  </LocationProvider>,
  document.getElementById('root')
)
