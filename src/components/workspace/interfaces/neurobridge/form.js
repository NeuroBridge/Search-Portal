import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import {
  Accordion, AccordionDetails, AccordionSummary, Divider,
  InputLabel, FormControl, MenuItem, Select, Stack,
} from '@mui/material'
import { ExpandMore as AccordionIcon } from '@mui/icons-material'
import axios from 'axios'
import { useBasket } from '../../../basket'
import { useOntology } from '../../../ontology'
import { Forest } from './selection-forest'
import { useWorkspace } from '../../workspace'

//

axios.defaults.timeout = 5000

//

const API_URL = `https://neurobridges-ml.renci.org/nb_translator`

//

const operators = ['AND', 'OR']

//

const InterfaceContext = createContext({})

export const Form = () => {
  const { register } = useWorkspace()
  const ontology = useOntology()
  const basket = useBasket()
  const [values, setValues] = useState({ })
  const [outerOperator, setOuterOperator] = useState(operators[1])
  const [innerOperator, setInnerOperator] = useState(operators[0])

  // this is basically a copy of the ids of the basket contents,
  // with the non-checked (value = 0) ones filtered out.
  const roots = useMemo(() => {
    return [...basket.ids.filter(id => basket.contents[id] === 1)]
  }, [basket.ids])

  // this effect gets triggered when the basket contents update.
  // it handles updating the values this component holds in its state by
  // first starting with a base selection of "0" for all basket terms and their
  // descendants, and then spreading in the existing state already in state.
  useEffect(() => {
    const previousValues = { ...values }
    let baseValues
    roots.forEach(id => {
      const descendants = [
        id,
        ...ontology.descendantsOf(id).map(term => term.id),
      ]
      baseValues = {
        ...baseValues,
        ...descendants
          .reduce((obj, id) => ({
            [id]: basket.ids.includes(id) ? 1 : 0,
            ...obj,
          }), {}),
      }
    })
    setValues({ ...baseValues, ...previousValues })
  }, [basket.ids])

  const toggleTermSelection = id => event => {
    const newValue = (values[id] + 1) % 3
    const newValues = { ...values, [id]: newValue }
    // if the CTRL key is held down, then also toggle all
    // descendants to have the same state as the clicked term.
    if (event.nativeEvent.ctrlKey) {
      ontology.descendantsOf(id).forEach(term => {
        newValues[term.id] = newValue
      })
    }
    setValues(newValues)
  }

  const handleChangeOperator = whichOperator => event => {
    if (whichOperator === 'inner') {
      return setInnerOperator(event.target.value)
    }
    if (whichOperator === 'outer') {
      return setOuterOperator(event.target.value)
    }
  }
  
  // here, we construct the query.
  const query = useMemo(() => {
    const groups = roots.reduce((obj, root) => {
      return {
        ...obj,
        [root]: [
          ...ontology
            .descendantsOf(root)
            .map(term => term.id)
        ]
      }
    }, {})
    let _query = { [outerOperator]: [] }
    roots.forEach(id => {
      _query[outerOperator].push({
        [innerOperator]: [
          ...groups[id]
            .filter(id => values[id] !== 0)
            .map(id => values[id] === 1 ? id : { not: [id] }),
        ]
      })
    })
    if (roots.length === 1) {
      _query = _query[outerOperator][0]
    }
    return _query
  }, [roots, values, innerOperator, outerOperator])

  const fetchResults = useCallback(() => {
    return axios.post(
      API_URL,
      JSON.stringify({ query: { expression: query }, max_res: 100 }),
      { headers: { 'Content-Type': 'text/html;charset=utf-8' } },
    ).then(response => {
      if (!response?.data?.docs) {
        throw new Error('An error occurred while fetching results.')
      }
      const results = response.data.docs
        .map(result => ({
          title: result.title,
          snippet: result.snippet,
          score: result.score,
          pmid: result.pmid,
          pubmed_url: result.pmc_link,
          pmcid: result.pmcid,
          pmc_url: result.pmc_link,
        }))
      return results
    }).catch(error => {
      console.error(error.message)
      return []
    })
  }, [values])

  useLayoutEffect(() => {
    register('neurobridge', fetchResults)
  }, [fetchResults])

  return (
    <InterfaceContext.Provider value={{ values, toggleTermSelection, query }}>
      <Stack direction="row" gap={ 2 } sx={{ p: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="outer-operator-select-label">Outer Operator</InputLabel>
          <Select
            labelId="outer-operator-select-label"
            id="outer-operator-select"
            value={ outerOperator }
            label="Outer Operator"
            onChange={ handleChangeOperator('outer') }
          >
            {
              operators.map(op => (
                <MenuItem key={ `outer-operator-option-${ op }` } value={ op }>{ op }</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="inner-operator-select-label">Inner Operator</InputLabel>
          <Select
            labelId="inner-operator-select-label"
            id="inner-operator-select"
            value={ innerOperator }
            label="Inner Operator"
            onChange={ handleChangeOperator('inner') }
          >
            {
              operators.map(op => (
                <MenuItem key={ `inner-operator-option-${ op }` } value={ op }>{ op }</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Stack>
      <Forest />
      <Divider />
      <Accordion
        square
        disableGutters
        elevation={ 0 }
        sx={{ '.MuiButtonBase-root': { minHeight: 0 } }}
      >
        <AccordionSummary expandIcon={ <AccordionIcon color="primary" /> }>
          Raw Query
        </AccordionSummary>
        <AccordionDetails sx={{
          p: 0,
          '.query': {
            m: 0, p: 1,
            backgroundColor: '#556',
            color: '#eee',
            fontSize: '85%',
          },
        }}>
          <pre className="query">{ JSON.stringify(query, null, 2) }</pre>
        </AccordionDetails>
      </Accordion>
   </InterfaceContext.Provider>
  )
} 

export const useInterfaceContext = () => useContext(InterfaceContext)
