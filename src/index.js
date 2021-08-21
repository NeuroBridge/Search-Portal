import { render } from 'react-dom'
import { App } from './app'
import './styles/index.scss'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'
import { SearchContextProvider } from './context.js'

const theme = createTheme({
  palette: {
    primary: {
      main: '#373f51',
    },
    secondary: {
      main: '#378f91'
    },
  },
})

render(
  <SearchContextProvider>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </SearchContextProvider>,
  document.getElementById('root')
)
