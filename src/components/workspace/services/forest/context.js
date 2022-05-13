import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { createContext, useContext } from 'react'
import { useBasket } from '../../../basket'
import { useOntology } from '../../../ontology'

const ForestContext = createContext({})

export const ForestProvider = ({ children }) => {
  const ontology = useOntology()
  const basket = useBasket()
  const [values, setValues] = useState({})

  // this effect gets triggered when the basket contents update.
  // it handles updating the values this component holds in its state by
  // first starting with a base selection of "0" for all basket terms and their
  // descendants, and then spreading in the existing state already in state.
  useEffect(() => {
    const previousValues = { ...values }
    let baseValues
    basket.ids
      .forEach(id => {
        const descendants = [
          id,
          ...ontology.descendantsOf(id).map(term => term.id),
        ]
        baseValues = {
          ...baseValues,
          ...descendants
            .reduce((obj, id) => ({ [id]: 0, ...obj }), {}),
        }
      })
      setValues({ ...baseValues, ...previousValues })
  }, [basket.ids])

  const toggleTermSelection = id => event => {
    const newValue = (values[id] + 1) % 3
    const newValues = { ...values, [id]: newValue }
    // if the CTRL key is held down, then toggle all descendants
    // to have the same state as the clicked term.
    if (event.nativeEvent.ctrlKey) {
      ontology.descendantsOf(id).forEach(term => {
        newValues[term.id] = newValue
      })
    }
    setValues(newValues)
  }

  return (
    <ForestContext.Provider value={{ values, toggleTermSelection }}>
      { children }
    </ForestContext.Provider>
  )
} 

ForestProvider.propTypes = {
  children: PropTypes.node,
}

export const useForest = () => useContext(ForestContext)
