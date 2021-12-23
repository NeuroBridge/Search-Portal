import { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const DrawerContext = createContext({})

export const useDrawer = () => useContext(DrawerContext)

export const DrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [locked, setLocked] = useState(false)

  const toggleOpen = () => {
    if (locked) {
      return
    }
    setOpen(!open)
  }
  const toggleLocked = () => setLocked(!locked)

  return (
    <DrawerContext.Provider value={{ open, locked, toggleOpen, toggleLocked }}>
      { children }
    </DrawerContext.Provider>
  )
}

DrawerProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
