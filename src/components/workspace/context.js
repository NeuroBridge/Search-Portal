import PropTypes from 'prop-types'
import { useBasket } from '../basket'

const WorkspaceContext = createContext({})

export const WorkspaceProvider = ({ children }) => {
  const { contents } = useBasket()
  
  return (
    <WorkspaceContext.Provider value={{ contents }}>
      { children }
    </WorkspaceContext.Provider>
  )
}

WorkspaceProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useWorkspace = () => useContext(WorkspaceContext)
