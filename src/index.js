import { render } from 'react-dom'
import { App } from './components/app'
import './styles/index.scss'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import { orange } from '@material-ui/core/colors'

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
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('root')
)
