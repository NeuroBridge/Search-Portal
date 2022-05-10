import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { createContext, useContext, useState } from 'react'

const BasketContext = createContext({})

export const BasketProvider = ({ children }) => {
  const [contents, setContents] = useState({})

  const toggle = id => {
    const newContents = { ...contents }
    if (id in contents) {
      newContents[id] = (newContents[id] + 1) % 2
    } else {
      newContents[id] = 1
    }
    setContents(newContents)
  }

  const remove = id => {
    const newContents = { ...contents }
    delete newContents[id]
    setContents(newContents)
  }

  const ids = useMemo(() => Object.keys(contents), [contents])

  const contains = id => id in contents

  return (
    <BasketContext.Provider value={{
      contains,
      contents,
      ids,
      toggle,
      remove,
    }}>
      { children }
    </BasketContext.Provider>
  )
}

BasketProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useBasket = () => useContext(BasketContext)
