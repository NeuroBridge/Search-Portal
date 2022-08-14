import { useMemo, useState } from 'react'
import {
  Box, Button, Card, Chip, Collapse, Divider, IconButton, LinearProgress,
  Stack, Tab, Tabs, Tooltip, Typography, useTheme,
} from '@mui/material'
import interfaces from './interfaces'
import { Basket, useBasket } from '../basket'
import { Publication } from './results'
import {
  ClearAll as ClearResultsIcon,
  ExpandMore as HelpToggleIcon,
  Visibility as ResultsVisibleIcon,
  VisibilityOff as ResultsHiddenIcon,
} from '@mui/icons-material'

//

export const Workspace = () => {
  const theme = useTheme()
  const basket = useBasket()
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const doSearch = name => async fn => {
    setLoading(true)
    const data = await fn()
    const newResults = {
      ...results,
      [name]: {
        visibility: true,
        items: data,
      },
    }
    setResults(newResults)
    setLoading(false)
  }

  const resultsCount = useMemo(() => {
    return Object.keys(results)
      .reduce((countObj, key) => {
        const total = countObj.total + results[key].items.length
        const visible = results[key].visibility
          ? countObj.visible + results[key].items.length
          : countObj.visible
        return { total, visible }
      }, { total: 0, visible: 0 })
  }, [results])

  const handleChangeService = (event, newIndex) => {
    setCurrentServiceIndex(newIndex)
  }

  const toggleResultVisibility = key => () => {
    const newResults = { ...results }
    newResults[key].visibility = !newResults[key].visibility
    setResults(newResults)
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundSize: '1rem 1rem',
        overflow: 'hidden',
        border: 'solid rgb(167, 202, 237)',
        borderWidth: '1px',
        position: 'relative',
      }}>
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
              value={ currentServiceIndex }
              onChange={ handleChangeService }
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
                  sx={{ flex: 1, display: currentServiceIndex === i ? 'flex' : 'none', }}
                  role="tabpanel"
                  id={ `tabpanel-${ ui.id }` }
                  aria-labelledby={ `tab-${ ui.id }` }
                >
                  <Box sx={{
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
                  <Box sx={{ flex: 1, p: 2 }}>{ ui.Interface }</Box>
                  <Divider />
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    p: 2,
                  }}>
                    <Button variant="contained" onClick={ () => console.log(ui.id) }>Search</Button>
                  </Box>
                </Stack>
              ))
            }
          </Box>
        </Collapse>
      </Card>

      {
        results && Object.keys(results).length > 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Stack>
              <Typography>
                { resultsCount.total } results
              </Typography>
              <Typography variant="caption">
                Showing { resultsCount.total === resultsCount.visible ? 'all' : `${ resultsCount.visible } of` } { resultsCount.total } results
              </Typography>
            </Stack>
            <Stack direction="row" spacing={ 2 }>
              {
                Object.keys(results).map(key => (
                  <Chip
                    key={ `${ key }-results-toggle` }
                    icon={ results[key].visibility
                      ? <ResultsVisibleIcon /> : <ResultsHiddenIcon /> }
                    variant="outlined"
                    color={ results[key].visibility ? 'primary' : 'default' }
                    label={ `${ key } (${ results[key].items.length })` }
                    onClick={ toggleResultVisibility(key) }
                  />
                ))
              }
            </Stack>
            <Tooltip title="Clear results" placement="left">
              <IconButton onClick={ () => setResults({}) }>
                <ClearResultsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )
      }

      {
        results && Object.keys(results).length > 0 && (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1rem',
            filter: `opacity(${ loading ? '0.5' : '1.0' })`,
          }}>
            {
              Object.keys(results)
                .filter(interfaceName => results[interfaceName].visibility)
                .map(interfaceName => results[interfaceName].items.map(result => (
                  <Publication
                    key={ `result-${ interfaceName }-${ result.pmid }` }
                    result={ result }
                  />
                )))
            }
          </Box>
        )
      }
    </Box>
  )
}

