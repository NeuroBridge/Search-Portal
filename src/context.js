import { createContext, useCallback, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { lightTheme, darkTheme } from './styles/theme'
import { useLocalStorage } from './hooks'
import k8sValues from '../kubernetes/values.yaml'

const version = k8sValues?.image?.tag || 'unknown version'

const AppContext = createContext({})

const MODES = {
  light: 'light',
  dark: 'dark',
}

export const AppContextProvider = ({ children }) => {
  const [colorMode, setColorMode] = useLocalStorage('colorMode', MODES.light)

  const theme = useMemo(() => createTheme({
    ...(colorMode === MODES.light ? lightTheme : darkTheme),
  }), [colorMode])

  const toggleColorMode = useCallback(() => {
    if (colorMode === MODES.light) {
      setColorMode(MODES.dark)
      return
    }
    setColorMode(MODES.light)
  }, [colorMode])

  const notify = (message, type = 'default') => {
    toast(message, { type })
  }

  return (
    <AppContext.Provider value={{
      notify,
      version,
      settings: {
        color: {
          modes: MODES,
          mode: colorMode,
          toggleMode: toggleColorMode,
        },
      },
    }}>
      <ThemeProvider theme={ theme }>
        { children }
      </ThemeProvider>
    </AppContext.Provider>
  )
}

AppContextProvider.propTypes = {
  children: PropTypes.node,
}

export const useAppContext = () => useContext(AppContext)
