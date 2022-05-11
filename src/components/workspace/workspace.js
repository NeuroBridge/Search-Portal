import { createElement, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent, CardHeader, Divider, LinearProgress, Tab, Tabs } from '@mui/material'
import { services } from './services'
import { Basket, useBasket } from '../basket'
import { Publication } from './results'

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
  const basket = useBasket()
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

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
        }}>
          <Basket />

          <LinearProgress variant={ loading ? 'indeterminate' : 'determinate' } value={ 0 } />

          <Tabs value={ currentServiceIndex } onChange={ handleChangeService }>
            {
              services.map(service => (
                <Tab key={ service.name } label={ service.name } />
              ))
            }
          </Tabs>

          <Divider />

          <CardContent>
            <Box>
              { createElement(services[currentServiceIndex].module, { setLoading, setResults }) }
            </Box>
          </CardContent>
        </Card>

        {
          !loading && <ResultsGrid>
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
        }
      </Box>
  )
}

