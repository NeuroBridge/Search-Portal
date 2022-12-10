import { Fragment, useCallback, useState } from 'react'
import {
  Box, Breadcrumbs as MuiBreadcrumbs, Button, Divider, Drawer as MuiDrawer,
  IconButton, Fade, List, Stack, Tooltip, Typography, useTheme,
} from '@mui/material'
import {
  NavigateNext as BreadcrumbSeparatorIcon,
  Home as HomeIcon,
  Close as CloseIcon,
  ArrowUpward as ParentNavIcon,
  ArrowDownward as ChildrenNavIcon,
  LocationOn as CurrentNavIcon,
} from '@mui/icons-material'
import { TermToggler } from '../basket'
import { useDrawer } from './context'
import { TreeList, useOntology } from '../ontology'

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
      <Stack
        direction="row"
        sx={{
          borderColor: `background.default`,
          backgroundColor: 'background.default',
          '& .MuiBreadcrumbs-separator': { mx: 0 }
        }}
      >
        <MuiBreadcrumbs
          separator={ <BreadcrumbSeparatorIcon /> }
          sx={{ flex: 1, px: 1, fontSize: '90%' }}
        >
          <IconButton
            sx={{ borderRadius: 0 }}
            key={ `breadcrumb-root` }
            size="small"
            variant="text"
            onClick={ () => drawer.setTermId() }
            disabled={ !drawer.currentTerm }
            color="primary"
          ><HomeIcon /></IconButton>
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
            sx={{ position: 'absolute', top: 0, right: 0, borderRadius: 0 }}
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
            mt: 1, ml: 3,
            fontSize: '90%',
            fontStyle: 'italic',
            color: 'primary.light',
          }}
        >
          <Typography>
            Labels: { drawer.currentTerm.labels.join('; ')}
          </Typography>
        </Stack>
      </Fade>
    )
  }, [drawer.currentTerm])

  const SeeAlsoText = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '50ms' }}>
        <Typography
          sx={{
            mt: 1, ml: 3,
            fontSize: '90%',
            fontStyle: 'italic',
            color: 'primary.light',
          }}
        >
          See also: { drawer.currentTerm.seeAlso || 'N/A' }
        </Typography>
      </Fade>
    )
  }, [drawer.currentTerm])

  const Parent = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '100ms' }}>
        <Stack component={ Box } direction="row" gap={ 1 } alignItems="center" sx={{ p: 1 }}>
          <ParentNavIcon fontSize="small" color="primary" sx={{ transform: 'translateY(-3px)' }}/>
          <Typography variant="h6" color="primary">Parent:</Typography>
          <Button
            variant="outlined"
            onClick={ drawer.currentTerm.parentId
              ? () => drawer.setTermId(drawer.currentTerm.parentId)
              : () => drawer.setTermId(null)
            }
            startIcon={ !drawer.currentTerm.parentId && <HomeIcon /> }
          >{ drawer.currentTerm.parentId || 'ROOT' }</Button>
          {
            drawer.currentTerm.parentId && (
              <TermToggler termId={ drawer.currentTerm.parentId } />
            )
          }
        </Stack>
      </Fade>
    )
  }, [drawer.currentTerm])

  const DescendantsList = useCallback(() => {
    return (
      <Fade in={ true } style={{ transitionDelay: '150ms' }}>
        <Box>
          <Stack direction="row" gap={ 1 }>
            <ChildrenNavIcon fontSize="small" color="primary" sx={{ transform: 'translateY(1px)' }}/>
            <Typography variant="h6" color="primary">Children:</Typography>
          </Stack>

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
      PaperProps={{ sx: { width: drawerWidth } }}
      ModalProps={{ keepMounted: true }}
      sx={{
        '.MuiDrawer-paper': {
          '& > .MuiBox-root': { px: 3, py: 2,
          backgroundColor: 'background.paper',
        },
          '& .handle': {
            backgroundColor: theme.palette.primary.dark,
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

            <Divider />

            <Parent />

            <Divider />

            <Box sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              position: 'sticky',
              top: 0,
              zIndex: 9,
            }}>
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" gap={ 1 }>
                  <CurrentNavIcon fontSize="small" color="primary" sx={{ transform: 'translateY(1px)' }}/>
                  <Typography variant="h5" color="primary" sx={{ margin: 0 }}>
                    Current Concept: { drawer.currentTerm.id }
                  </Typography>
                </Stack>
                <LabelsList />
                <SeeAlsoText />
              </Box>
              <Box sx={{ p: 1 }}>
                <TermToggler
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

            <Stack sx={{ backgroundColor: 'background.paper' }}>
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

            <Divider />

          </Fragment>
        )
      }
      <Box sx={{ flex: 1 }} />
    </MuiDrawer>
  )
}
