import { render } from 'react-dom'
import { App } from './app'
import { LocationProvider } from '@reach/router'
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { DialogProvider } from './components/dialog'
import { DrawerProvider } from './components/drawer'
import { SearchContextProvider } from './components/search/context.js'
import './styles/index.scss'

const theme = createTheme(adaptV4Theme({
  palette: {
    primary: {
      main: '#373f51',
    },
    secondary: {
      main: '#378f91'
    },
  },
  spacing: n => n * 8,
}))

render(
  <LocationProvider>
    <SearchContextProvider>
      <DrawerProvider>
        <DialogProvider>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </StyledEngineProvider>
        </DialogProvider>
      </DrawerProvider>
    </SearchContextProvider>
  </LocationProvider>,
  document.getElementById('root')
)
