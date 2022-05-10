import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { createContext, useContext, useState } from 'react'

const BasketContext = createContext({})

export const BasketProvider = ({ children }) => {
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

  const ids = useMemo(() => {
    return Object.keys(contents)
  }, [contents])

  return (
    <BasketContext.Provider value={{
      contains,
      contents,
      log,
      toggle,
      ids,
    }}>
      { children }
    </BasketContext.Provider>
  )
}

BasketProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useBasket = () => useContext(BasketContext)
