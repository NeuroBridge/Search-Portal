import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const DrawerContext = createContext({})

export const useDrawer = () => useContext(DrawerContext)

export const DrawerProvider = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [drawerLocked, setDrawerLocked] = useState(false)
  const [drawerMaxWidth, setDrawerMaxWidth] = useState(500)

  useEffect(() => {
    // this lets the user press backslash to open the drawer
    // todo: & focus search input
    const handleKeyPress = event => {
      if (event.keyCode === 220) { // backslash ("\") key 
        openDrawer()
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const toggleOpen = () => {
    if (drawerLocked) {
      return
    }
    setDrawerOpen(!drawerOpen)
  }

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  const toggleLocked = () => setDrawerLocked(!drawerLocked)

  const drawerWidth = useMemo(() => drawerMaxWidth, [drawerMaxWidth])

  return (
    <DrawerContext.Provider value={{
      drawerOpen, drawerLocked, toggleOpen, toggleLocked, openDrawer, closeDrawer, drawerWidth, drawerMaxWidth, setDrawerMaxWidth,
    }}>
      { children }
    </DrawerContext.Provider>
  )
}

DrawerProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
