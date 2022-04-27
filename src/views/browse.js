import { Box, Card, CardContent, Container } from '@mui/material'
import { useOntology } from '../components/ontology'
import { TreeList } from '../components/tree-list'

export const BrowseView = () => {
  const ontology = useOntology()

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {
          ontology.trees
            .sort((t, s) => t.data.id.toLowerCase() < s.data.id.toLowerCase() ? -1 : 1)
            .map(root => (
              <Card key={ `tree-${ root.data.id }` }>
                <CardContent>
                  <TreeList
                    key={ `tree-${ root.data.id }` }
                    rootTerm={{
                      ...ontology.find(root.data.id),
                      children: ontology.childrenOf(root.data.id),
                      descendants: ontology.descendantsOf(root.data.id),
                    }}
                  />
                </CardContent>
              </Card>
            ))
        }
      </Box>
    </Container>
  )
}