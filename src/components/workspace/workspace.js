import { createContext, useContext, useRef, useState } from 'react'
import {
  Box, Button, Card, Divider,
  LinearProgress, Stack, Tab, Tabs, 
} from '@mui/material'
import { Basket, useBasket } from '../basket'
import { interfaces, interfaceDisplayNames } from './interfaces'
import { SearchResultsTable } from './results-table'
import { Interface } from './interface'

//

const WorkspaceContext = createContext({ })
export const useWorkspace = () => useContext(WorkspaceContext)

//

export const Workspace = () => {
  const basket = useBasket()
  const [currentInterfaceIndex, setCurrentInterfaceIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const requests = useRef({ })

  /*
    search results are held in Workspace's
    state as an object with this shape:
    {
      // [interfaceId]: [Result], Result: { title: 'The...', ... }
      neurobridge1: [{...}, {...}, ...],
      neurobridge2: [{...}, {...}, ...],
      ...
    }.
  */
  const [results, setResults] = useState({ })

  const clearResults = () => setResults({ })

  const handleChangeInterface = (event, newIndex) => {
    setCurrentInterfaceIndex(newIndex)
  }

  /*
    this function registers interface request functions
    for use when the search button is clicked.
  */
  const register = (id, func) => {
    requests.current = { ...requests.current, [id]: func }
  }

  /*
    using all registered interface request functions,
    this function makes fetches every interface's results
    and dumps them into the `results` object.
  */
  const requestAll = () => {
    if (basket.ids.length === 0) {
      return
    }
    let newResults = {}
    /*
      if we have any non-disabled requests,
      then we can start firing them off now,
      aggregating results into the results object.
    */
    if (Object.keys(requests.current).length) {
      setLoading(true)
      Promise.all(Object.keys(requests.current).map(id => requests.current[id]).map(f => f()))
        .then(responses => {
          responses.forEach((response, i) => {
            // let's grab the id associated with this, the ith, request
            const id = Object.keys(requests.current)[i]
            // and save that to our results object, with that id as its key.
            newResults = { ...newResults, [id]: response }
          })
        })
        .catch(error => {
          console.error(error.message)
        })
        .finally(() => {
          setResults(newResults)
          setLoading(false)
        })
    }
  }

  return (
    <WorkspaceContext.Provider value={{
      register,
      results,
      clearResults,
      interfaceDisplayNames,
    }}>
      <Stack dirction="column" gap={ 3 }>
        <Basket />
        <Card>
          <LinearProgress variant={ loading ? 'indeterminate' : 'determinate' } value={ 0 } />
          <Tabs
            value={ currentInterfaceIndex }
            onChange={ handleChangeInterface }
          >
            {
              interfaces.map(ui => (
                <Tab
                  key={ ui.id }
                  label={
                    <Stack
                      direction="row"
                      gap={ 1 }
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ width: '100%' }}
                    >
                      { ui.displayName }
                    </Stack>
                  }
                  id={ `tab-${ ui.id }` }
                  aria-controls={ `tabpanel-${ ui.id }` }
                />
              ))
            }
          </Tabs>

          <Divider />

          {
            interfaces.map((ui, i) => <Interface
                  key={ `ui-${ ui.id }` }
                  ui={ ui }
                  active={ currentInterfaceIndex === i }
                />)
          }
{/*          {
            basket.ids.length > 0
              ? interfaces.map((ui, i) => <Interface
                  key={ `ui-${ ui.id }` }
                  ui={ ui }
                  active={ currentInterfaceIndex === i }
                />)
              : <Box sx={{ minHeight: '300px' }}>select terms</Box>
          }
*/}
          <Divider />

          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            p: 2,
          }}>
            <Button
              variant="contained"
              onClick={ requestAll }
              disabled={ basket.ids.length === 0 }
            >Search</Button>
          </Box>
        </Card>

        <SearchResultsTable />
      </Stack>

    </WorkspaceContext.Provider>
  )
}
