import { useEffect, useState } from 'react'
import { Box, Button, Card, CardContent, CardHeader, Divider } from '@mui/material'
import { useBasket } from '../basket'
import { useOntology } from '../ontology'
import { NeuroQueryServiceInterface, NeuroBridgeServiceInterface } from './services'

//

export const Workspace = () => {
  const ontology = useOntology()
  const basket = useBasket()

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
        <Button>NeuroQuery</Button>
        <Button>NeuroBridge</Button>
      </CardContent>
    </Card>
  )
}

