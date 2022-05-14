import { Button, CardContent } from '@mui/material'
import { useInterfaceContext } from './context'

export const QueryForm = () => {
  const { fetchResults, url } = useInterfaceContext()

  return (
    <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-start' }}>
      <pre style={{ backgroundColor: '#eee', color: '#789', fontSize: '75%', margin: 0, padding: '0.5rem', whiteSpace: 'pre-wrap', flex: 1 }}>
        { url }
      </pre>
      <Button variant="contained" onClick={ fetchResults }>Send Query</Button>
    </CardContent>
  )
}
