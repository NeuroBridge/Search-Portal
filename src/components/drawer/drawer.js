import { Fragment, useCallback, useState } from 'react'
import {
  Box, Breadcrumbs as MuiBreadcrumbs, Button, Divider, Drawer as MuiDrawer,
  IconButton, Fade, List, ListItem, ListItemText, Stack, Typography,
} from '@mui/material'
import {
  NavigateNext as BreadcrumbSeparatorIcon,
  Home as HomeIcon,
} from '@mui/icons-material'
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

  const handleMouseDown = () => {
    document.addEventListener("mouseup", handleMouseUp, true)
    document.addEventListener("mousemove", handleMouseMove, true)
  }

  const handleMouseUp = () => {
    document.removeEventListener("mouseup", handleMouseUp, true)
    document.removeEventListener("mousemove", handleMouseMove, true)
  }

  const handleMouseMove = useCallback(event => {
    const newWidth = document.body.offsetLeft + document.body.offsetWidth - event.clientX
    if (DRAWER_CONFIG.minWidth < newWidth && newWidth < DRAWER_CONFIG.maxWidth) {
      setDrawerWidth(newWidth)
    }
  }, [])

  const Breadcrumbs = useCallback(() => {
    let path = drawer.currentTerm ? ontology.pathToRoot(drawer.currentTerm.id) : []
    // remove internal nodes if the nav list will be long,
    // marking placeholder/ellipsis element, which we'll look
    // for in the return statement that maps this array of
    // strings (`path`) to components.
    if (path.length > 3) {
      path = [
        path[0],
        'PLACEHOLDER',
        path[path.length - 2],
        path[path.length - 1],
      ]
    }
    return (
      <MuiBreadcrumbs
        separator={ <BreadcrumbSeparatorIcon fontSize="small" /> }
        sx={{
          px: 1,
          fontSize: '90%',
          backgroundColor: '#d6d9dc',
          '& .MuiBreadcrumbs-separator': { mx: 0 }
        }}
      >
        <IconButton
          sx={{ fontSize: '90%', borderRadius: 0 }}
          key={ `breadcrumb-root` }
          size="small"
          variant="text"
          onClick={ () => drawer.setTermId(null) }
          disabled={ !drawer.currentTerm }
          color="primary"
        ><HomeIcon fontSize="small" /></IconButton>
        {
          path.map((id, index) => id === 'PLACEHOLDER' ? (
            <Typography key={ `breadcrumb-${ index }-ellipsis }` }>...</Typography>
          ) : (
            <Button
              sx={{ fontSize: '90%', borderRadius: 0 }}
              key={ `breadcrumb-${ index }-${ id }` }
              size="small"
              variant="text"
              onClick={ () => drawer.setTermId(id) }
              disabled={ id === drawer.currentTerm.id }
            >{ id }</Button>
          ))
        }
      </MuiBreadcrumbs>
    )
  }, [drawer.currentTerm])

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
              onClick={ drawer.currentTerm.parentId ? () => drawer.setTermId(drawer.currentTerm.parentId) : () => drawer.setTermId(null) }
            >
              { drawer.currentTerm.parentId || 'ROOT' }
            </Button>
            {
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
          '& > .MuiBox-root': { px: 2, py: 1, },
          '& .handle': {
            padding: 0,
          }
        },
      }}
    >
      <Box
        className="handle"
        onMouseDown={ handleMouseDown }
        sx={{
          backgroundColor: '#789',
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
          zIndex: 10,
        }}
      />
      {
        drawer.currentTerm ? (
          <Fragment>
            <Breadcrumbs />

            <Divider />

            <Box sx={{
              width: '100%',
              backgroundColor: '#e6e9ec',
              display: 'flex',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              zIndex: 9,
            }}>
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
        ) : (
          <Fragment>
            <Breadcrumbs />

            <Divider />
            
            <Box sx={{
              width: '100%',
              backgroundColor: '#e6e9ec',
              display: 'flex',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              zIndex: 9,
            }}>
              <Typography variant="h5" sx={{ my: 1 }}>
                Ontology Browser
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Stack>
                {
                  ontology.trees
                    .sort((t, s) => t.data.id.toLowerCase() < s.data.id.toLowerCase() ? -1 : 1)
                    .map(root => <TreeList
                      key={ `root-${ root.data.id }` }
                      rootTerm={{
                        ...ontology.find(root.data.id),
                        children: ontology.childrenOf(root.data.id),
                        descendants: ontology.descendantsOf(root.data.id),
                      }}
                    />)
                }
              </Stack>
            </Box>

            <Divider />

          </Fragment>
        )
      }
    </MuiDrawer>
  )
}
