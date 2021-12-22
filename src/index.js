import { render } from 'react-dom'
import { App } from './app'
import './styles/index.scss'
import { LocationProvider } from '@reach/router'
import { createTheme, ThemeProvider, StyledEngineProvider, adaptV4Theme } from '@mui/material/styles';
import { SearchContextProvider } from './components/search/context.js'

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
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </SearchContextProvider>
  </LocationProvider>,
  document.getElementById('root')
)
