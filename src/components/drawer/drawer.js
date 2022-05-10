import { Fragment, useCallback, useState } from 'react'
import {
  Box, Button, Divider, Drawer as MuiDrawer, Fade, List, ListItem, ListItemText, Typography
} from '@mui/material'
import { useDrawer } from './context'
import { useOntology } from '../ontology'
import { TermActionButtons } from '../term-action-buttons'
import { TreeList } from '../tree-list'

//

const DRAWER_CONFIG = {
  initialWidth: 600,
  minWidth: 400,
  maxWidth: 1200,
}

//

export const Drawer = () => {
  const drawer = useDrawer()
  const ontology = useOntology()
  const [drawerWidth, setDrawerWidth] = useState(DRAWER_CONFIG.initialWidth)

  const handleMouseDown = event => {
    document.addEventListener("mouseup", handleMouseUp, true)
    document.addEventListener("mousemove", handleMouseMove, true)
  }

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp, true)
    document.removeEventListener("mousemove", handleMouseMove, true)
  }

  const handleMouseMove = useCallback(event => {
    const newWidth = document.body.offsetLeft + document.body.offsetWidth - event.clientX
    console.log(newWidth)
    console.log(event)
    if (DRAWER_CONFIG.minWidth < newWidth && newWidth < DRAWER_CONFIG.maxWidth) {
      setDrawerWidth(newWidth)
    }
  }, [])

  const LabelsList = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '50ms' }}>
        <Box>
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
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '0.5rem',
            padding: '0.5rem 2.4rem',
          }}>
          <Button
            variant="text"
            onClick={ () => drawer.setTermId(drawer.currentTerm.parentId) }
            disabled={ drawer.currentTerm.parentId === null }
          >
            { drawer.currentTerm.parentId || 'No parent' }
          </Button>            {
              drawer.currentTerm.parentId && (
                <TermActionButtons
                  termId={ drawer.currentTerm.parentId }
                  tooltipPlacement="top"
                  hideDrawerButton
                />
              )
            }
          </Box>
        </Box>
      </Fade>
    )
  }, [drawer.currentTerm])

  const DescendantsList = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '150ms' }}>
        <Box>
          <Typography variant="h6">Descendants</Typography>

          <List dense disablePadding sx={{ '.MuiListItem-root': { padding: 0 } }}>
            {
              drawer.currentTerm.children.length > 0
                ? drawer.currentTerm.children.map(child => (
                  <TreeList
                    key={ `${ drawer.currentTerm.id }-child-${ child.id }` }
                    rootTerm={{
                      ...ontology.find(child.id),
                      children: ontology.childrenOf(child.id),
                      descendants: ontology.descendantsOf(child.id),
                    }}
                  />
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
      PaperProps={{ style: { width: drawerWidth } }}
      sx={{
        '.MuiDrawer-paper': {
          '& > .MuiBox-root': {
            padding: '1rem 2rem',
          },
          '& .handle': {
            padding: 0,
          }
        },
      }}
    >
      <Box
        className="handle"
        onMouseDown={ handleMouseDown }
        sx={{ backgroundColor: '#789',
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          minWidth: '5px',
          transition: 'min-width 100ms, filter 250ms',
          padding: 0,
          cursor: 'ew-resize',
          '&:hover': {
            minWidth: '10px',
            filter: 'brightness(1.1)',
          },
        }}
      />
      {
        drawer.currentTerm && (
          <Fragment>
            <Box sx={{ width: '100%', backgroundColor: '#e6e9ec', display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1, paddingTop: '1rem' }}>
                <Typography variant="h5" sx={{ margin: 0 }}>
                  { drawer.currentTerm.id }
                </Typography>
                <LabelsList />
              </Box>
              <Box sx={{ paddingTop: '1rem' }}>
                <TermActionButtons
                  termId={ drawer.currentTerm.id }
                  tooltipPlacement="left"
                  hideDrawerButton
                />
              </Box>
            </Box>

            <Divider />

            <Parent />

            <Divider />

            <DescendantsList />

            <Divider />

          </Fragment>
        )
      }
    </MuiDrawer>
  )
}
