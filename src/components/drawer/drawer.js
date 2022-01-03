import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Drawer as MuiDrawer, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import {
  Lock as LockedIcon,
  LockOpen as UnlockedIcon,
  KeyboardArrowDown as CloseDrawerIcon,
  KeyboardArrowUp as OpenDrawerIcon,
} from '@mui/icons-material'
import { useDrawer } from './context'

const useStyles = makeStyles(theme => ({
  drawer: {
    position: 'relative',
    '&:hover $actions': {
      filter: 'opacity(1.0)',
    },
  },
  drawerPaper: {
    height: '200px',
    filter: 'drop-shadow(0 0 1rem #00000033)',
    backgroundColor: theme.palette.primary.light,
    paddingRight: '5rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    transition: 'height 250ms',
  },
  contents: {
    overflow: 'auto',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: '0 1px 0 0',
    '& button': {
      borderRadius: 0,
      marginBottom: '1px',
      height: '3rem',
      backgroundColor: `${ theme.palette.primary.dark } !important`,
      '&:disabled': {
        filter: 'saturate(0.5) opacity(0.5)',
      }
    },
  },
  drawerHeader: {
    position: 'fixed',
    bottom: '-1px',
    left: 0,
    right: 0,
    height: '3rem',
    backgroundColor: theme.palette.primary.main,
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms, filter 250ms',
    display: 'flex',
    flexDirection: 'row',
    filter: 'brightness(1.0)',
    '&:hover': {
      filter: 'brightness(0.9)',
    },
    cursor: 'pointer',
  },
  drawerTitleArea: {
    flex: 1,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  drawerTitle: {
    color: theme.palette.common.white,
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerButton: {
    padding: 0,
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
}))

const SMALL = 'SMALL'

export const Drawer = ({ title, actions, children }) => {
  const classes = useStyles()
  const { drawerOpen, toggleOpen, drawerLocked, toggleLocked } = useDrawer()
  const [size, ] = useState(SMALL)

  return (
    <Fragment>
      <div
        className={ classes.drawerHeader }
        role="button"
        aria-label={ `${ drawerOpen ? 'Close' : 'Open' } drawer` }
        style={{ transform: `translateY(${ drawerOpen ? size === SMALL ? '-200px' : 'calc(-100vh + 10rem)' : 0 })` }}
      >
        <div className={ classes.actions }>
          <Tooltip title={ `${ drawerLocked ? 'Unlock' : 'Lock' } drawer postiion` } placement="top">
            <Button onClick={ toggleLocked } color={ drawerLocked ? 'warning' : 'secondary' } className={ `${ classes.drawerButton }` }>
              { drawerLocked ? <LockedIcon /> : <UnlockedIcon /> }
            </Button>
          </Tooltip>
          {
            actions.map(action => (
              <Tooltip key={ `drawer-action-${ action.ariaLabel }`} title={ action.ariaLabel } placement="top">
                <span>
                  <Button
                    aria-label={ action.ariaLabel }
                    onClick={ action.onClick }
                    disabled={ action.disabled }
                  >
                    { action.icon }
                  </Button>
                </span>
              </Tooltip>
            ))
          }
        </div>
        <Button className={ classes.drawerTitleArea } onClick={ toggleOpen }>
          <span className={ classes.drawerTitle }>{ title }</span>
        </Button>
        <Tooltip title={ `${ drawerOpen ? 'Close' : 'Open' } drawer` } placement="top">
          <Button className={ classes.drawerButton } onClick={ toggleOpen } color="secondary">
            { drawerOpen && <CloseDrawerIcon /> }
            { !drawerOpen && <OpenDrawerIcon /> }
          </Button>
        </Tooltip>
      </div>
      <MuiDrawer
        elevation={ 0 }
        anchor="bottom"
        variant="persistent"
        open={ drawerOpen }
        className={ classes.drawer }
        classes={{ paper: classes.drawerPaper }}
      >
          { children }
      </MuiDrawer>
    </Fragment>
  )
}

Drawer.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    ariaLabel: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  })).isRequired,
}
