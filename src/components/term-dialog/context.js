import { createContext, useContext, useState } from 'react'

const DialogContext = createContext({})

export const useDialogContext = () => useContext(DialogContext)

export const DialogContextProvider = ({ children }) => {
  const [selectedNodes, setSelectedNodes] = useState([])
  const [helpVisbility, setHelpVisibility] = useState(false)

  const toggleNodeSelection = id => {
    const newSelection = new Set(selectedNodes)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedNodes(Array.from(newSelection))
  }

  return (
    <DialogContext.Provider value={{ selectedNodes, setSelectedNodes, toggleNodeSelection, helpVisbility, setHelpVisibility }}>
      { children }
    </DialogContext.Provider>
  )
}

