import { createElement, Fragment, useState } from 'react'
import { Box, Card, CardContent, CardHeader, CircularProgress, Divider, Tab, Tabs } from '@mui/material'
import { services } from './services'

//

export const Workspace = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

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
      }}>
        <CardHeader title="Query Workspace" />
        <CardContent>
          Select a service
        </CardContent>

        <Divider />

        <CardContent>
          <Tabs value={ currentServiceIndex } onChange={ handleChangeService }>
            {
              services.map(service => (
                <Tab key={ service.name } label={ service.name } />
              ))
            }
          </Tabs>
        </CardContent>

        <CardContent>
          <Box>
            { createElement(services[currentServiceIndex].module, { setLoading, setResults }) }
          </Box>
        </CardContent>
      </Card>

      { loading && <CircularProgress /> }

      {
        !loading && results.map((result, i) => (
          <Card key={ `${ i }_${ result.pmid }` } >
            <CardContent>
              <pre>
                { JSON.stringify(result, null, 2) }
              </pre>
            </CardContent>
          </Card>
        ))
      }
    </Box>
  )
}

