import { createContext, useCallback, useContext, useRef, useState } from 'react'
import {
  Box, Button, Card, Collapse, Divider, IconButton, LinearProgress,
  Stack, Tab, Tabs, Typography, useTheme,
} from '@mui/material'
import { Basket, useBasket } from '../basket'
import interfaces from './interfaces'
import {
  ExpandMore as HelpToggleIcon,
} from '@mui/icons-material'

//

const WorkspaceContext = createContext({ })
export const useWorkspace = () => useContext(WorkspaceContext)

//

export const Workspace = () => {
  const theme = useTheme()
  const basket = useBasket()
  const [currentInterfaceIndex, setCurrentInterfaceIndex] = useState(0)
  const [showHelp, setShowHelp] = useState(false)
  const [loading, ] = useState(false)
  const requests = useRef({ })  // change to state var

  const handleChangeInterface = (event, newIndex) => {
    setCurrentInterfaceIndex(newIndex)
  }

  const register = (id, func) => {
    requests.current = { ...requests.current, [id]: func } // use setRequests
  }

  const requestAll = () => {
    if (basket.ids.length === 0) {
      return
    }
    Promise.all([...Object.values(requests.current)].map(f => f()))
      .then(responses => {
        responses.forEach((response, i) => {
          const id = Object.keys(requests.current)[i]
          console.log({ [id]: response })
          // setResults({ ...results, [id]: response })
        })
      })
      .catch(error => {
        console.error(error.message)
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
    <WorkspaceContext.Provider value={{ register }}>
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
                <Stack
                  key={ `ui-${ ui.id }` }
                  sx={{ flex: 1, display: currentInterfaceIndex === i ? 'flex' : 'none', }}
                  role="tabpanel"
                  id={ `tabpanel-${ ui.id }` }
                  aria-labelledby={ `tab-${ ui.id }` }
                >
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1, pl: 2,
                  }}>
                    <Typography component="h2" variant="h6" color="primary">{ ui.displayName }</Typography>
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, }}>
                      <Typography sx={{ fontSize: '75%', filter: 'opacity(0.5)', textTransform: 'uppercase' }}>
                        { showHelp ? 'Hide' : 'Show' } Help
                      </Typography>
                      <IconButton onClick={ () => setShowHelp(!showHelp) } size="small">
                        <HelpToggleIcon
                          fontSize="small"
                          sx={{
                            color: theme.palette.primary.dark,
                            filter: 'saturate(0.1) opacity(0.5)',
                            transition: 'filter 250ms, transform 250ms',
                            transform: showHelp ? 'rotate(180deg)' : 'rotate(0)',
                            '&:hover': { filter: 'saturate(0.9) opacity(1)' },
                          }}
                        />
                      </IconButton>
                    </Box>
                  </Box>
                  <Collapse in={ showHelp } sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <Divider />
                    <Box sx={{ p: 2 }}>{ ui.helpText }</Box>
                  </Collapse>
                  <Divider />
                  <Box sx={{ flex: 1, p: 2 }}>
                    <ui.Form />
                  </Box>
                </Stack>
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
            <Button variant="contained" onClick={ requestAll }>Search All</Button>
          </Box>
        </Collapse>
      </Card>
    </WorkspaceContext.Provider>
  )
}
