import PropTypes from 'prop-types'
import { createContext, useContext, useState } from 'react'

const WorkspaceContext = createContext({})

export const WorkspaceProvider = ({ children }) => {
  const [contents, setContents] = useState([])

  const toggle = id => {
    let newContents = [...contents]
    const index = contents.indexOf(id)
    if (index > -1) {
      newContents = newContents.slice(0, index).concat(newContents.slice(index + 1))
    } else {
      newContents = [...contents, id]
    }
    setContents(newContents)
  }

  const log = () => {
    console.log(contents)
  }

  const contains = id => {
    const index = contents.indexOf(id)
    return index > -1
  }

  return (
    <WorkspaceContext.Provider value={{
      contains,
      contents,
      log,
      toggle,
    }}>
      { children }
    </WorkspaceContext.Provider>
  )
}

WorkspaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useWorkspace = () => useContext(WorkspaceContext)
