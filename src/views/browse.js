import { Box, Card, CardContent, Container, Typography } from '@mui/material'
import { TreeView, TreeItem } from '@mui/lab'
import {
  ChevronRight as CollapseIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material'
import { useOntology } from '../components/ontology'
import { TermActionButtons } from '../components/term-action-buttons'

export const BrowseView = () => {
  const ontology = useOntology()

  // this function cleans up and flattens the tree data a bit
  // to make browsing on this view a little simpler.
  const reduceTree = node => ({
    id: node.data.id,
    parentId: node.data.parentId,
    children: node.children.map(reduceTree),
  })

  const renderTree = node => (
    <TreeItem
      key={ node.id }
      nodeId={ node.id }
      label={
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.5rem',
          '.term-action-buttons': {
            filter: 'opacity(0.0)',
          },
          '&:hover .term-action-buttons': {
            filter: 'opacity(1.0)',
          },
        }}>
          <Typography>{ node.id }</Typography>
          <TermActionButtons termId={ node.id } stopEventPropagation />
        </Box>
      }
    >
      {
        Array.isArray(node.children)
          ? node.children.map(n => renderTree(n))
          : null
      }
    </TreeItem>
  )

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {
          ontology.trees
            .sort((t, s) => t.data.id.toLowerCase() < s.data.id.toLowerCase() ? -1 : 1)
            .map(root => (
            <Card key={ `tree-${ root.data.id }` }>
              <CardContent>
                <TreeView
                  sx={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}
                  defaultCollapseIcon={ <CollapseIcon />}
                  defaultExpandIcon={ <ExpandIcon />}
                >
                  { renderTree(reduceTree(root)) }
                </TreeView>
              </CardContent>
            </Card>
          ))
        }
      </Box>
    </Container>
  )
}