import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Collapse, Divider, IconButton, InputLabel, FormControl, FormControlLabel, FormGroup,
  MenuItem, Popover, Select, Stack, Switch, Tooltip,
} from '@mui/material'
import {
  Close as CloseIcon,
  Settings as ConfigIcon,
} from '@mui/icons-material'
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

const InterfaceContext = createContext({})

const ConfigMenu = ({ children, sx }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const id = open ? 'config-menu' : undefined;

  return (
    <Box sx={ sx }>
      <Tooltip placement="left" title="Configuration Options">
        <IconButton
          aria-describedby={ id }
          variant="contained"
          onClick={ handleClick }
          size="small"
        ><ConfigIcon fontSize="small" /></IconButton>
      </Tooltip>
      <Popover
        id={ id }
        open={ open }
        anchorEl={ anchorEl }
        onClose={ handleClose }
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >{ children }</Popover>
    </Box>
  )
}

ConfigMenu.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
}

//

export const Form = () => {
  const { register } = useWorkspace()
  const ontology = useOntology()
  const basket = useBasket()
  const [values, setValues] = useState({ })
  const [outerOperator, setOuterOperator] = useState('AND')
  const [innerOperator, setInnerOperator] = useState('OR')
  const [showRawQuery, setShowRawQuery] = useState(false)

  // this is basically a copy of the ids of the basket contents,
  // with the non-checked (value = 0) ones filtered out.
  const roots = useMemo(() => {
    return [...basket.ids]
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

  const handleChangeOperator = whichOperator => {
    if (whichOperator === 'inner') {
      return event => setInnerOperator(event.target.value)
    }
    if (whichOperator === 'outer') {
      return event => setOuterOperator(event.target.value)
    }
  }
  
  // here, we construct the query.
  const query = useMemo(() => {
    // build an easy way to lookup descendants.
    // `groups` has shape { [termId]: [descendants], [termId]: [descendants], ... }
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
      if (groups[id].some(desc => values[desc] !== 0)) {
        _query[outerOperator].push({
          [innerOperator]: [
            ...groups[id]
              .filter(id => values[id] !== 0)
              .map(id => values[id] === 1 ? id : { not: [id] }),
          ]
        })
      }
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
  }, [roots, values, innerOperator, outerOperator])

  useLayoutEffect(() => {
    register('neurobridge', fetchResults)
  }, [fetchResults])

  const toggleShowRawQuery = () => {
    setShowRawQuery(!showRawQuery)
  }

  return (
    <InterfaceContext.Provider value={{ values, toggleTermSelection, query }}>

      <ConfigMenu sx={{ position: 'absolute', right: 5, top: 5, zIndex: 9 }}>
        <Stack direction="column" gap={ 2 } sx={{ minWidth: '200px', p: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="outer-operator-select-label">Between Concept Trees</InputLabel>
            <Select
              labelId="outer-operator-select-label"
              id="outer-operator-select"
              value={ outerOperator }
              label="Between Concept Trees"
              onChange={ handleChangeOperator('outer') }
            >
              <MenuItem value="AND">AND</MenuItem>
              <MenuItem value="OR">OR</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel id="inner-operator-select-label">Within Concept Trees</InputLabel>
            <Select
              labelId="inner-operator-select-label"
              id="inner-operator-select"
              value={ innerOperator }
              label="Within Concept Trees"
              onChange={ handleChangeOperator('inner') }
            >
              <MenuItem value="AND">AND</MenuItem>
              <MenuItem value="OR">OR</MenuItem>
            </Select>
          </FormControl>

          <FormGroup>
            <FormControlLabel
              label="Raw Query"
              control={
                <Switch checked={ showRawQuery } onChange={ toggleShowRawQuery } />
              }
            />
          </FormGroup>

        </Stack>
      </ConfigMenu>

      <Forest />

      <Divider />

      <Collapse
        in={ showRawQuery }
        sx={{
          position: 'relative',
          '.query': {
            m: 0, p: 1,
            backgroundColor: '#eee',
            color: '#556',
            fontSize: '85%',
          },
        }}>
          <IconButton
            onClick={ () => setShowRawQuery(false) }
            size="small"
            sx={{
              position: 'absolute',
              right: 5, top: 5,
              '&:hover': { '& svg': { filter: 'opacity(1.0)' } },
            }}
          ><CloseIcon fontSize="small" color="danger" sx={{ filter: 'opacity(0.33)' }} /></IconButton>
          <pre className="query">{ JSON.stringify(query, null, 2) }</pre>
      </Collapse>

   </InterfaceContext.Provider>
  )
} 

export const useInterfaceContext = () => useContext(InterfaceContext)
