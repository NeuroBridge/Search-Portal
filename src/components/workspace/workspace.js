import React, { Suspense, useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Divider, Tabs, Tab } from '@mui/material'
import { useBasket } from '../basket'
import { useOntology } from '../ontology'
import { services } from './services'

//

export const Workspace = () => {
  const ontology = useOntology()
  const basket = useBasket()
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0)

  const handleChangeService = (event, newIndex) => {
    setCurrentServiceIndex(newIndex)
  }

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundSize: '1rem 1rem',
      overflow: 'hidden',
    }}>
      <CardHeader title="Workspace" />
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

        <Suspense fallback={ 'Loading...' }>
          { services[currentServiceIndex].module }
        </Suspense>
      </CardContent>
    </Card>
  )
}

