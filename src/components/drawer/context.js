import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const DrawerContext = createContext({})

export const useDrawer = () => useContext(DrawerContext)

export const DrawerProvider = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerLocked, setDrawerLocked] = useState(false)

  const toggleOpen = () => {
    if (drawerLocked) {
      return
    }
    setDrawerOpen(!drawerOpen)
  }
  const toggleLocked = () => setDrawerLocked(!drawerLocked)

  return (
    <DrawerContext.Provider value={{ drawerOpen, drawerLocked, toggleOpen, toggleLocked }}>
      { children }
    </DrawerContext.Provider>
  )
}

DrawerProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
