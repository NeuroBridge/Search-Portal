import { Fragment, useCallback } from 'react'
import {
  Box, Button, Divider, Drawer as MuiDrawer, Fade, List, ListItem, ListItemText, Typography
} from '@mui/material'
import { useDrawer } from './context'
import { TermActionButtons } from '../term-action-buttons'
import { TermGraph } from '../term-graph'

//

const DRAWER_WIDTH = 500

//

export const Drawer = () => {
  const drawer = useDrawer()

  const LabelsList = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '50ms' }}>
        <Box>
          <Typography variant="h6">Labels</Typography>
          <List dense disablePadding sx={{
            '.MuiListItem-root': {
              padding: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }
          }}>
            {
              drawer.currentTerm.labels.map(label => (
                <ListItem key={ `${ drawer.currentTerm.id }-label-${ label }` }>
                  <ListItemText sx={{ fontStyle: 'italic' }}>&bull;&nbsp;{ label }</ListItemText>
                </ListItem>
              ))
            }
          </List>
        </Box>
      </Fade>
    )
  }, [drawer.currentTerm])

  const Parent = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '100ms' }}>
        <Box>
          <Typography variant="h6">Parent</Typography>
          <Button
            size="small"
            variant="text"
            onClick={ () => drawer.setTermId(drawer.currentTerm.parentId) }
            disabled={ drawer.currentTerm.parentId === null }
          >
            { drawer.currentTerm.parentId || 'No parent' }
          </Button>
        </Box>
      </Fade>
    )
  }, [drawer.currentTerm])

  const ChildrenList = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '150ms' }}>
        <Box>
          <Typography variant="h6">Children</Typography>

          <List dense disablePadding sx={{ '.MuiListItem-root': { padding: 0 } }}>
            {
              drawer.currentTerm.children.length > 0
                ? drawer.currentTerm.children.map(child => (
                  <ListItem
                    key={ `${ drawer.currentTerm.id }-child-${ child.id }` }
                  >
                    &bull;&nbsp;
                    <Button
                      size="small"
                      variant="text"
                      onClick={ () => drawer.setTermId(child.id) }
                      sx={{ textAlign: 'left' }}
                    >
                      { child.id }
                    </Button>
                  </ListItem>
                ))
                : <Button size="small" variant="text" disabled>No children</Button>
            }
          </List>
        </Box>
      </Fade>
    )
  }, [drawer.currentTerm])

  return (
    <MuiDrawer
      anchor="right"
      open={ drawer.isOpen }
      onClose={ drawer.close }
      sx={{
        '.MuiDrawer-paper': {
          width: DRAWER_WIDTH,
        },
        '.MuiBox-root': {
          padding: '1rem 1rem 1rem 2rem',
        },
      }}
    >
      {
        drawer.currentTerm && (
          <Fragment>
            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#e6e9ec' }}>
              <Typography variant="h5" sx={{ margin: '1rem 0', flex: 1, }}>
                { drawer.currentTerm.id }
              </Typography>
              <TermActionButtons
                termId={ drawer.currentTerm.id }
                tooltipPlacement="left"
                hideDrawerButton
              />
            </Box>
            
            <Divider />

            <LabelsList />

            <Divider />

            <Parent />

            <Divider />

            <ChildrenList />
            
            <Divider />

            <TermGraph
              width={ 500 }
              height={ 500 }
              rootTerm={ drawer.currentTerm }
              onNodeClick={ (node, ) => drawer.setTermId(node.id) }
            />
            
            <Divider />

          </Fragment>
        )
      }
    </MuiDrawer>
  )
}
