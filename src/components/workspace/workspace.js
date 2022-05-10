import { createElement, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent, CardHeader, CircularProgress, Divider, Fade, Tab, Tabs } from '@mui/material'
import { services } from './services'
import { useBasket } from '../basket'

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
    <Fade in={ basket.ids.length > 0 }>
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
          <CardHeader title="Services" />
          
          <Divider />

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
          loading
          ? <CircularProgress />
          : <ResultsGrid>
              {
                results.map((result, i) => (
                  <Card key={ `${ i }_${ result.pmid }` } >
                    <CardContent>
                      <pre>
                        { JSON.stringify(result, null, 2) }
                      </pre>
                    </CardContent>
                  </Card>
                ))
              }
            </ResultsGrid>
        }
      </Box>
    </Fade>
  )
}

