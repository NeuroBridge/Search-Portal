import { useMemo } from 'react'
import { CardContent } from '@mui/material'
import { useForest } from './context'

export const Query = () => {
  const { values } = useForest()

  const query = useMemo(() => {
    return JSON.stringify(values, null, 2)
  }, [values])

  return (
    <CardContent>
      <pre style={{ backgroundColor: '#eee', color: '#789', fontSize: '75%', margin: 0, padding: '0.5rem', whiteSpace: 'pre-wrap', flex: 1 }}>
        { query }
      </pre>
    </CardContent>
  )
}
