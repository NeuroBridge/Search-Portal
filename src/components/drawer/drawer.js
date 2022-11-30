import { Fragment, useCallback, useState } from 'react'
import {
  Box, Breadcrumbs as MuiBreadcrumbs, Button, Divider, Drawer as MuiDrawer,
  IconButton, Fade, List, ListItem, ListItemText, Stack, Tooltip, Typography, useTheme,
} from '@mui/material'
import {
  NavigateNext as BreadcrumbSeparatorIcon,
  Home as HomeIcon,
  Close as CloseIcon,
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
  const theme = useTheme()
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
      <Stack direction="row" sx={{ borderBottom: `1px solid ${ theme.palette.grey[400] }` }}>
        <MuiBreadcrumbs
          separator={ <BreadcrumbSeparatorIcon fontSize="small" /> }
          sx={{
            flex: 1,
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
            onClick={ () => drawer.setTermId() }
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
        <Tooltip placement="left" title="Close Ontology Browser">
          <IconButton
            size="small"
            onClick={ drawer.close }
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              borderRadius: 0,
              borderLeft: `1px solid ${ theme.palette.grey[400] }`,
            }}
          >
          <CloseIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Stack>
    )
  }, [drawer.currentTerm])

  const LabelsList = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '50ms' }}>
        <Stack
          direction="column"
          sx={{
            mt: 1,
            '& .list-title': { textTransform: 'uppercase' },
            '& .labels-list': {
              flex: 1,
              '& .MuiListItem-root': {
                p: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }
            }
          }}
        >
          <Typography variant="caption" className="list-title">Labels</Typography>
          <List dense disablePadding className="labels-list">
            {
              drawer.currentTerm.labels.map(label => (
                <ListItem key={ `${ drawer.currentTerm.id }-label-${ label }` }>
                  <ListItemText sx={{ fontStyle: 'italic' }}>&bull;&nbsp;{ label }</ListItemText>
                </ListItem>
              ))
            }
          </List>
        </Stack>
      </Fade>
    )
  }, [drawer.currentTerm])

  const Parent = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '100ms' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          p: 1,
        }}>
          <Typography variant="h6">Parent:</Typography>
          <Button
            variant="text"
            onClick={ drawer.currentTerm.parentId
              ? () => drawer.setTermId(drawer.currentTerm.parentId)
              : () => drawer.setTermId(null)
            }
            startIcon={ !drawer.currentTerm.parentId && <HomeIcon /> }
          >{ drawer.currentTerm.parentId || 'ROOT' }</Button>
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
      </Fade>
    )
  }, [drawer.currentTerm])

  const DescendantsList = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '150ms' }}>
        <Box>
          <Typography variant="h6">Children:</Typography>

          <List dense disablePadding sx={{ '.MuiListItem-root': { p: 0 } }}>
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
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        '.MuiDrawer-paper': {
          '& > .MuiBox-root': { px: 3, py: 2 },
          '& .handle': {
            backgroundColor: '#789',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            minWidth: '5px',
            transition: 'min-width 100ms, filter 250ms',
            p: 0,
            cursor: 'ew-resize',
            '&:hover': {
              minWidth: '10px',
              filter: 'brightness(1.1)',
            },
            zIndex: 10,
          },
        }
      }}
    >
      <Box
        className="handle"
        onMouseDown={ handleMouseDown }
      />
      {
        drawer.currentTerm ? (
          <Fragment>
            <Breadcrumbs />

            <Parent />

            <Divider />

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
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ margin: 0 }}>
                  Current Term: { drawer.currentTerm.id }
                </Typography>
                <LabelsList />
              </Box>
              <Box sx={{ p: 1 }}>
                <TermActionButtons
                  termId={ drawer.currentTerm.id }
                  tooltipPlacement="left"
                  hideDrawerButton
                />
              </Box>
            </Box>

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
