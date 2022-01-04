import { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Button, Drawer as MuiDrawer, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  Lock as LockedIcon,
  LockOpen as UnlockedIcon,
  KeyboardArrowRight as CloseDrawerIcon,
  KeyboardArrowLeft as OpenDrawerIcon,
} from '@mui/icons-material'
import { useDrawer } from './context'

const useStyles = makeStyles(theme => {
  return ({
    drawer: {
      position: 'relative',
      '&:hover $actions': {
        filter: 'opacity(1.0)',
      },
    },
    drawerPaper: {
      width: ({ width }) => width,
      backgroundColor: '#eee',
      // transition: 'width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms',
      marginTop: '115px',
      overflow: 'auto'
    },
    contents: {
      overflow: 'auto',
    },
    actions: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      padding: '0 1px 0 0',
      '& button': {
        marginBottom: '1px',
        backgroundColor: `${ theme.palette.primary.dark } !important`,
        '&:disabled': {
          filter: 'saturate(0.5) opacity(0.5)',
        }
      },
    },
    drawerHeader: {
      position: 'fixed',
      right: '-1px',
      top: '115px',
      bottom: 0,
      width: '4rem',
      backgroundColor: theme.palette.primary.main,
      transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, filter 250ms',
      display: 'flex',
      flexDirection: 'column',
      filter: 'brightness(1.0)',
      zIndex: '999',
      '&:hover': {
        filter: 'brightness(0.9)',
      },
      cursor: 'pointer',
    },
    drawerTitleButton: {
      flex: 1,
      padding: 0,
      color: theme.palette.common.white,
      writingMode: 'vertical-lr',
    },
    drawerButton: {
      padding: 0,
      height: '3rem',
      borderRadius: 0,
    },
    drawerIconContainer: {
      width: '5rem',
      backgroundColor: theme.palette.secondary.main,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& svg': {
        fill: theme.palette.common.white,
      },
    },
  })
})

export const Drawer = ({ title, children }) => {
  const { DRAWER_WIDTH, drawerOpen, toggleOpen, drawerLocked, toggleLocked } = useDrawer()
  const drawerWidth = useMemo(() => {
    if (drawerOpen) {
      return DRAWER_WIDTH
    }
    return '100px'
  }, [drawerOpen])
  const classes = useStyles({ width: drawerWidth })

  return (
    <Fragment>
      <MuiDrawer
        elevation={ 0 }
        anchor="right"
        variant="persistent"
        open={ drawerOpen }
        classes={{ root: classes.drawer, paper: classes.drawerPaper }}
        sx={{
          width: drawerWidth,
        }}
      >
        { children }
      </MuiDrawer>
      <div
        className={ classes.drawerHeader }
        role="button"
        aria-label={ `${ drawerOpen ? 'Close' : 'Open' } drawer` }
        style={{ transform: `translateX(${ drawerOpen ? `-${ drawerWidth }` : 0 })` }}
      >
        <Tooltip title={ `${ drawerOpen ? 'Close' : 'Open' } drawer` } placement="left">
          <Button className={ classes.drawerButton } onClick={ toggleOpen } color="secondary">
            { drawerOpen && <CloseDrawerIcon /> }
            { !drawerOpen && <OpenDrawerIcon /> }
          </Button>
        </Tooltip>
        <Button className={ classes.drawerTitleButton } onClick={ toggleOpen }>
          { title }
        </Button>
        <div className={ classes.actions }>
          <Tooltip title={ `${ drawerLocked ? 'Unlock' : 'Lock' } drawer postiion` } placement="left">
            <Button onClick={ toggleLocked } color={ drawerLocked ? 'warning' : 'secondary' } className={ classes.drawerButton }>
              { drawerLocked ? <LockedIcon /> : <UnlockedIcon /> }
            </Button>
          </Tooltip>
        </div>
      </div>
    </Fragment>
  )
}

Drawer.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node.isRequired,
}
