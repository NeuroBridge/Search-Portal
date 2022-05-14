import { Fragment } from 'react'
import { Button, CardContent, Divider } from '@mui/material'
import { useForest } from './context'

export const QueryForm = () => {
  const { query, fetchResults } = useForest()

  return (
    <Fragment>
      <CardContent>
        <pre style={{
          backgroundColor: '#eee',
          color: '#789',
          fontSize: '75%',
          margin: 0,
          padding: '0.5rem',
          whiteSpace: 'pre-wrap',
        }}>
          { JSON.stringify(query, null, 2) }
        </pre>
      </CardContent>

      <Divider />

      <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={ fetchResults }>Send Query</Button>
      </CardContent>
    </Fragment>
  )
}
