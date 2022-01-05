import { createContext, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

const DrawerContext = createContext({})

export const useDrawer = () => useContext(DrawerContext)

export const DrawerProvider = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerLocked, setDrawerLocked] = useState(false)
  const [drawerMaxWidth, setDrawerMaxWidth] = useState(500)

  const toggleOpen = () => {
    if (drawerLocked) {
      return
    }
    setDrawerOpen(!drawerOpen)
  }

  const openDrawer = () => setDrawerOpen(true)

  const toggleLocked = () => setDrawerLocked(!drawerLocked)

  const drawerWidth = useMemo(() => drawerMaxWidth, [drawerMaxWidth])

  return (
    <DrawerContext.Provider value={{ drawerOpen, drawerLocked, toggleOpen, toggleLocked, openDrawer, drawerWidth, drawerMaxWidth, setDrawerMaxWidth }}>
      { children }
    </DrawerContext.Provider>
  )
}

DrawerProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
