import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  Box, Button, Card, CardContent, CardHeader, Collapse, Divider, IconButton,
  FormControl, FormLabel, LinearProgress,
  Stack, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import {
  Close as CloseIcon,
  DataObject as RawQueryIcon,
  Send as SearchIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material'
import { useBasket } from '../../basket'
import { useOntology } from '../../ontology'
import { useSearch } from '../context'
import { SelectionForest } from './selection-forest'
import { AddTermForm } from './add-term-form'
import { ConfigMenu } from './config-menu'

//

export const QueryBuilderContext = createContext({})
export const useQueryBuilder = () => useContext(QueryBuilderContext)

export const QueryBuilder = () => {
  const ontology = useOntology()
  const basket = useBasket()
  const [values, setValues] = useState({ })
  const [outerOperator, setOuterOperator] = useState('AND')
  const [innerOperator, setInnerOperator] = useState('OR')
  const [showRawQuery, setShowRawQuery] = useState(false)
  const { fetchResults, loading } = useSearch()

  // this is just a copy of the ids of the basket contents
  const roots = useMemo(() => [...basket.ids], [basket.ids])

  // this effect gets triggered when the basket contents update.
  // it handles updating the values this component holds in its state by
  // first starting with a base selection of "0" for all basket terms and their
  // descendants, and then spreading in the existing values already in state.
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

  // this gets triggered when the user removes te term from the query builder.
  // pass in a term id, it and all its denscendants get removed.
  const removeTerm = idToRemove => {
    // first, remove root from basket
    basket.remove(idToRemove)
    // now, we'll ensure that term and all its descdants are removed
    // from this component's `values`, too.
    const descendants = [
      idToRemove,
      ...ontology.descendantsOf(idToRemove).map(term => term.id)
    ]
    const newValues = Object.keys(values)
      .reduce((obj, termId) => {
        return descendants.includes(termId)
          ? { ... obj }
          : { ...obj, [termId]: values[termId] }
      }, {})
    setValues({ ...newValues })
  }

  const toggleTermSelection = id => event => {
    const newValue = (values[id] + 1) % 3
    const newValues = { ...values, [id]: newValue }
    // if the CTRL/CMD key is held down, then also toggle all
    // descendants to have the same state as the clicked term.
    if (event.nativeEvent.ctrlKey) {
      ontology.descendantsOf(id).forEach(term => {
        newValues[term.id] = newValue
      })
    }
    setValues(newValues)
  }

  const handleChangeOperator = useCallback(operator => {
    if (operator === 'inner') {
      return event => setInnerOperator(event.target.value)
    }
    if (operator === 'outer') {
      return event => setOuterOperator(event.target.value)
    }
  }, [])
  
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
              .map(id => values[id] === 1 ? id : { NOT: [id] }),
          ]
        })
      }
    })
    if (roots.length === 1) {
      _query = _query[outerOperator][0]
    }
    return _query
  }, [roots, values, innerOperator, outerOperator])

  const toggleShowRawQuery = () => {
    setShowRawQuery(!showRawQuery)
  }

  const handleClickStartOver = () => {
    basket.empty()
    setValues({ })
  }

  return (
    <Card sx={{ position: 'relative' }}>
      <QueryBuilderContext.Provider value={{ query, removeTerm, toggleTermSelection, values }}>
        <CardHeader
          title="Query Builder"
          subheader="Query terms are part of the NeuroBridge ontology which will be available on BioPortal soon."
        />

        <Divider />

        <SelectionForest roots={ basket.ids } />

        <Divider />

        <Collapse
          in={ showRawQuery }
          sx={{
            position: 'relative',
            '.query': {
              m: 0, p: 1, pl: 3,
              backgroundColor: '#345',
              color: '#eef',
              fontSize: '90%',
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
            ><CloseIcon fontSize="small" sx={{ color: '#fff', filter: 'opacity(0.75)' }} /></IconButton>
            <pre className="query">{ JSON.stringify(query, null, 2) }</pre>
        </Collapse>

        <LinearProgress variant={ loading ? 'indeterminate' : 'determinate' } value={ 0 } />

        <CardContent sx={{
          padding: '0 !important',
          '.MuiButton-root': {
            p: 4,
            boxShadow: 'none',
          },
        }}>
          <Stack
            direction="row"
            divider={ <Divider orientation="vertical" flexItem /> }
            justifyContent="stretch"
            sx={{
              'div.MuiBox-root': { flex: 1, backgroundColor: '#f3f6f9' },
              '.MuiButton-root': {
                borderRadius: 0,
              }
            }}
          >
            {/* add term button renders here */}
            <AddTermForm />

            {/* raw query button */}
            <Button
              onClick={ toggleShowRawQuery }
              startIcon={ <RawQueryIcon /> }
              sx={{ backgroundColor: showRawQuery ? '#f6fafd' : '#fff' }}
            >raw query</Button>

            {/* options button renders here */}
            <ConfigMenu>
              <Stack direction="column" gap={ 2 } sx={{ minWidth: '300px', p: 2, whiteSpace: 'nowrap' }}>
                <FormControl>
                  <FormLabel>Between concept trees</FormLabel>
                  <ToggleButtonGroup
                    aria-label="Operator between concept trees"
                    fullWidth
                    size="small"
                    color="primary"
                    value={ outerOperator }
                    exclusive
                    onChange={ handleChangeOperator('outer') }
                    >
                    <ToggleButton value="AND">AND</ToggleButton>
                    <ToggleButton value="OR">OR</ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Within concept trees</FormLabel>
                  <ToggleButtonGroup
                    aria-label="Operator within concept trees"
                    fullWidth
                    size="small"
                    color="primary"
                    value={ innerOperator }
                    exclusive
                    onChange={ handleChangeOperator('inner') }
                  >
                    <ToggleButton value="AND">AND</ToggleButton>
                    <ToggleButton value="OR">OR</ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>

              </Stack>
            </ConfigMenu>

            {/* reset button */}
            <Button
              disabled={ basket.ids.length === 0 }
              onClick={ handleClickStartOver }
              startIcon={ <ResetIcon /> }
            >Reset</Button>

            <Box sx={{ minWidth: '1rem' }} />

            {/* search button */}
            <Button
              variant="contained"
              disabled={ basket.ids.length === 0 }
              onClick={ () => fetchResults(query) }
              endIcon={ <SearchIcon /> }
            >search</Button>
          </Stack>
        </CardContent>
        
      </QueryBuilderContext.Provider>
    </Card>
  )
} 
