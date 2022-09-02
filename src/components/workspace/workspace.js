import { createContext, useCallback, useContext, useRef, useState } from 'react'
import {
  Box, Button, Card, Collapse, Divider, LinearProgress,
  Stack, Tab, Tabs,
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
      // [interfaceId]: [Result], Result: {Object}
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
    setLoading(true)
    let newResults = {}
    Promise.all([...Object.values(requests.current).map(f => f())])
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

  const WorkspaceHeader = useCallback(() => {
    return (
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '75%',
        maxWidth: '400px',
        transform: 'translate(-50%)',
        padding: '0.33rem 0.5rem',
        backgroundColor: '#336699cc',
        color: '#fff',
        fontSize: '75%',
        display: 'flex',
        justifyContent: 'center',
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px',
      }}>
        WORKSPACE {
          basket.ids.length > 0
            ? `  —  ${ basket.ids.length } TERM${ basket.ids.length === 1 ? '' : 'S' }`
            : ''
        }
      </Box>
    )
  }, [basket.ids.length])

  return (
    <WorkspaceContext.Provider value={{
      register,
      results,
      clearResults,
      interfaceDisplayNames,
    }}>
      <Stack dirction="column" gap={ 3 }>
        <Card sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundSize: '1rem 1rem',
          overflow: 'hidden',
          border: 'solid rgb(167, 202, 237)',
          borderWidth: '1px',
          position: 'relative',
        }}>
          <WorkspaceHeader />
          <Basket />
          <Collapse in={ basket.ids.length > 0 }>
            <LinearProgress variant={ loading ? 'indeterminate' : 'determinate' } value={ 0 } />
            <Box sx={{
              width: '100%',
              flexGrow: 1,
              bgcolor: 'background.paper',
              display: 'flex',
              minHeight: 200,
            }}>
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={ currentInterfaceIndex }
                onChange={ handleChangeInterface }
                sx={{ borderRight: `1px solid #ddd`, mt: '50px', flex: `0 0 200px`, }}
              >
                {
                  interfaces.map(ui => (
                    <Tab
                      key={ ui.id }
                      label={ ui.displayName }
                      id={ `tab-${ ui.id }` }
                      aria-controls={ `tabpanel-${ ui.id }` }
                    />
                  ))
                }
              </Tabs>

              <Divider />

              {
                interfaces.map((ui, i) => (
                  <Interface
                    key={ `ui-${ ui.id }` }
                    ui={ ui }
                    active={ currentInterfaceIndex === i }
                  />
                ))
              }
            </Box>
            <Divider />
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              p: 2,
            }}>
              <Button variant="contained" onClick={ requestAll }>Search</Button>
            </Box>
          </Collapse>
        </Card>

        <SearchResultsTable />
      </Stack>

    </WorkspaceContext.Provider>
  )
}
