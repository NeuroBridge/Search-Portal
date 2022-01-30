import { Fragment } from 'react'
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
      marginTop: '64px',
      overflow: 'hidden',
    },
    actions: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      padding: '0',
      '& button': {
        marginBottom: '1px',
        backgroundColor: `${ theme.palette.primary.dark } !important`,
        '&:disabled': {
          filter: 'saturate(0.5) opacity(0.5)',
        }
      },
    },
    drawerHandle: {
      position: 'fixed',
      top: '64px',
      bottom: 0,
      left: 0,
      width: '2rem',
      backgroundColor: theme.palette.primary.main,
      transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, filter 250ms',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      filter: 'brightness(1.0)',
      zIndex: '9999',
      '&:hover': {
        filter: 'brightness(0.8)',
      },
      overflow: 'hidden',
    },
    drawerTitleButton: {
      flex: 1,
      padding: 0,
      color: theme.palette.common.white,
      writingMode: 'vertical-lr',
      transform: 'rotate(180deg)',
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(3),
    },
    drawerButton: {
      padding: 0,
      height: '54px',
      borderRadius: 0,
    },
  })
})

export const Drawer = ({ title, children }) => {
  const {
    drawerOpen, toggleOpen, drawerLocked, toggleLocked, drawerWidth, 
  } = useDrawer()
  
  const classes = useStyles({ width: drawerWidth })

  return (
    <Fragment>
      <MuiDrawer
        elevation={ 0 }
        anchor="left"
        variant="persistent"
        open={ drawerOpen }
        classes={{ root: classes.drawer, paper: classes.drawerPaper }}
        sx={{ width: drawerWidth }}
      >
        { children }
      </MuiDrawer>
      <div
        className={ classes.drawerHandle }
        aria-label={ `${ drawerOpen ? 'Close' : 'Open' } drawer` }
        style={{ transform: `translateX(${ drawerOpen ? `${ drawerWidth }px` : 0 })` }}
      >
        <Tooltip title={ `${ drawerOpen ? 'Close' : 'Open' } drawer` } placement="right">
          <Button className={ classes.drawerTitleButton } onClick={ toggleOpen }>
            { title }
            {
              drawerOpen
                ? <CloseDrawerIcon sx={{ color: '#fff' }} />
                : <OpenDrawerIcon sx={{ color: '#fff' }} />
            }
          </Button>
        </Tooltip>
        <div className={ classes.actions }>
          <Tooltip title={ `${ drawerLocked ? 'Unlock' : 'Lock' } drawer postiion` } placement="right">
            <Button onClick={ toggleLocked } className={ classes.drawerButton }>
              { drawerLocked ? <LockedIcon sx={{ 'color': '#c99' }} /> : <UnlockedIcon sx={{ 'color': '#9c9' }} /> }
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
