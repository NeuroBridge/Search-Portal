import { useSearchContext } from '../components/search'
import { Container } from '../components/container'
import { Card } from '@mui/material'

export const QueryView = () => {
  const { query } = useSearchContext()


  return (
    <Container>
      
      Query View

      <Card title="NeuroQuery">
        <pre>
          { JSON.stringify(query, null, 2) }
        </pre>
      </Card>

    </Container>
  )
}