import { createElement, Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, Collapse, Divider, IconButton, LinearProgress, Tab, Tabs, Tooltip, Typography, useTheme } from '@mui/material'
import { services } from './services'
import { Basket, useBasket } from '../basket'
import { Publication } from './results'
import { ClearAll as ClearResultsIcon } from '@mui/icons-material'

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
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const basket = useBasket()

  const doSearch = async fn => {
    setLoading(true)
    const data = await fn()
    setResults(data)
    setLoading(false)
  }

  const handleChangeService = (event, newIndex) => {
    setCurrentServiceIndex(newIndex)
    setResults([])
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

            { createElement(services[currentServiceIndex].module, { doSearch }) }
          </Collapse>
        </Card>

        {
          !loading && results.length > 0 && (
            <Fragment>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Typography>
                  { results.length } results were found
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
                      url= { result.pubmed_url }
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

