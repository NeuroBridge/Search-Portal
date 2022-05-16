import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Card, Collapse, Divider, IconButton, LinearProgress,
  Tab, Tabs, Tooltip, Typography, useTheme,
} from '@mui/material'
import { services } from './services'
import { Basket, useBasket } from '../basket'
import { Publication } from './results'
import { ClearAll as ClearResultsIcon } from '@mui/icons-material'
import { Help as HelpIcon } from '@mui/icons-material'

//

const ResultsGrid = ({ children }) => {
  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '1rem',
    }}>
      { children }
    </Box>
  )
}

ResultsGrid.propTypes = {
  children: PropTypes.node,
}

//

export const Workspace = () => {
  const theme = useTheme()
  const basket = useBasket()
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const doSearch = async fn => {
    setLoading(true)
    const data = await fn()
    setResults(data)
    setLoading(false)
  }

  const handleChangeService = (event, newIndex) => {
    setCurrentServiceIndex(newIndex)
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
            right: 0,
            padding: '0.5rem',
            backgroundColor: '#336699cc',
            color: '#fff',
            fontSize: '80%',
            borderBottomLeftRadius: '4px',
          }}>Workspace</Box>

          <Basket />

          <Collapse in={ basket.ids.length > 0 }>
            <LinearProgress variant={ loading ? 'indeterminate' : 'determinate' } value={ 0 } />

            <Tabs value={ currentServiceIndex } onChange={ handleChangeService }>
              {
                services.map(service => (
                  <Tab key={ service.name } label={ service.name } />
                ))
              }
            </Tabs>

            <Divider />

            {
              services.map((service, i) => {
                const { Interface, HelpText } = services[i]
                return (
                  <Box
                    key={ `service-${ service.id }` }
                    sx={{ display: currentServiceIndex === i ? 'block' : 'none' }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="View help" placement="left">
                        <IconButton onClick={ () => setShowHelp(!showHelp) } size="small">
                          <HelpIcon
                            fontSize="small"
                            sx={{
                              color: theme.palette.primary.dark,
                              filter: 'saturate(0.1) opacity(0.5)',
                              transition: 'filter 250ms',
                              '&:hover': { filter: 'saturate(0.9) opacity(1)' },
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Collapse in={ showHelp }>
                      <HelpText />
                    </Collapse>
                    <Divider />
                    <Interface searchWrapper={ doSearch } />
                  </Box>
                )
              })
            }
          </Collapse>
        </Card>

        {
          !loading && results && results.length > 0 && (
            <Fragment>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Typography>
                  { results.length } results were returned.
                </Typography>
                <Tooltip title="Clear results" placement="left">
                  <IconButton onClick={ () => setResults([]) }>
                    <ClearResultsIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              <ResultsGrid>
                {
                  results.map((result, i) => (
                    <Publication
                      key={ `${ i }_${ result.pmid }` }
                      title={ result.title }
                      url={ result.url }
                    />
                  ))
                }
              </ResultsGrid>
            </Fragment>
          )
        }
      </Box>
  )
}

