import { useMemo, useState } from 'react'
import {
  Box, Card, Chip, Collapse, Divider, IconButton, LinearProgress,
  Stack, Tab, Tabs, Tooltip, Typography, useTheme,
} from '@mui/material'
import { interfaces } from './interfaces'
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

          <Tabs
            variant="scrollable"
            value={ currentServiceIndex }
            onChange={ handleChangeService }
          >
            {
              interfaces.map(service => (
                <Tab key={ service.id } label={ service.name } />
              ))
            }
          </Tabs>

          <Divider />

          {
            interfaces.map((service, i) => {
              const { Interface, HelpText } = interfaces[i]
              return (
                <Box
                  key={ `service-${ service.id }` }
                  sx={{ display: currentServiceIndex === i ? 'block' : 'none' }}
                >
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.25rem',
                    filter: 'opacity(0.5)',
                    transition: 'filter 250ms',
                    '&:hover': {
                      filter: 'opacity(1.0)',
                    }
                  }}>
                    <Typography sx={{ fontSize: '75%', filter: 'opacity(0.5)', }}>
                      { showHelp ? 'HIDE' : 'SHOW' } { service.name.toUpperCase() } HELP
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
                  <Collapse in={ showHelp }>
                    <HelpText />
                  </Collapse>
                  <Divider />
                  <Interface searchWrapper={ doSearch(service.name) } />
                </Box>
              )
            })
          }
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
                Showing { resultsCount.visible } / { resultsCount.total }
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
                    pmid={ result.pmid }
                    title={ result.title }
                    snippet={ result.snippet }
                    url={ result.url }
                  />
                )))
            }
          </Box>
        )
      }
    </Box>
  )
}

