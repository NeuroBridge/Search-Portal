import { createContext, useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useOntology } from '../ontology'

const DrawerContext = createContext({})

export const DrawerProvider = ({ children }) => {
  const ontology = useOntology()
  const [isOpen, setIsOpen] = useState(false)
  const [currentTerm, setCurrentTerm] = useState()

  const setTermId = useCallback(id => {
    if (!id) {
      setCurrentTerm(null)
      return
    }
    const termToDetail = ontology.find(id)
    if (!termToDetail) {
      console.log(`Failed to locate term "${ id }"`)
      return
    }
    setCurrentTerm({
      ...ontology.find(id),
      children: ontology.childrenOf(id),
      descendants: ontology.descendantsOf(id),
    })
    setIsOpen(true)
  }, [])

  const toggle = () => setIsOpen(!isOpen)
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <DrawerContext.Provider value={{
      isOpen, close, open, toggle, currentTerm, setTermId,
    }}>
      { children }
    </DrawerContext.Provider>
  )
}

DrawerProvider.propTypes = {
  children: PropTypes.node,
}

export const useDrawer = () => useContext(DrawerContext)
