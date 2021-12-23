import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button, Drawer as MuiDrawer } from '@mui/material'
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
    overflow: 'hidden',
    height: '200px',
    filter: 'drop-shadow(0 0 1rem #00000033)',
    backgroundColor: '#676f81',
    paddingRight: '5rem',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  contents: {
    overflow: 'auto',
  },
  actions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    backgroundColor: '#272f41',
    filter: 'opacity(0.5)',
    transition: 'filter 250ms',
    padding: '1px 0 3px 0',
    '&:hover': {
      filter: 'opacity(1.0)',
    },
    '& button': {
      borderRadius: 0,
      marginBottom: '1px',
      height: '3rem',
      backgroundColor: '#474f61',
      '& svg': {
        filter: 'saturate(0.5)',
        transition: 'filter 250ms',
      },
      '&:hover': {
        backgroundColor: '#171f31',
        '& svg': {
          filter: 'saturate(1.0)',
        },
      },
    },
  },
  drawerHeader: {
    position: 'fixed',
    bottom: '-1px',
    left: 0,
    right: 0,
    height: '3rem',
    backgroundColor: '#474f61',
    transition: 'transform 225ms, filter 250ms',
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
    color: '#eee',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerIconContainer: {
    width: '5rem',
    backgroundColor: 'var(--color-renci)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': {
      fill: '#eee',
    },
  },
}))

export const Drawer = ({ title, actions, children }) => {
  const classes = useStyles()
  const { open, toggleOpen, locked, toggleLocked } = useDrawer()

  return (
    <Fragment>
      <div
        className={ classes.drawerHeader }
        role="button"
        aria-label={ `${ open ? 'Close' : 'Open' } drawer` }
        style={{ transform: `translateY(${ open ? '-200px' : 0 })` }}
      >
        <Button onClick={ toggleLocked } color={ locked ? 'warning' : 'secondary' } className={ `${ classes.drawerButton }` }>
          { locked ? <LockedIcon /> : <UnlockedIcon /> }
        </Button>
        <Button className={ classes.drawerTitleArea } onClick={ toggleOpen }>
          <span className={ classes.drawerTitle }>{ title }</span>
          <span className={ `${ classes.drawerIconContainer }` }>{ open ? <CloseDrawerIcon /> : <OpenDrawerIcon /> }</span>
        </Button>
      </div>
      <MuiDrawer
        elevation={ 0 }
        anchor="bottom"
        variant="persistent"
        open={ open }
        className={ classes.drawer }
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={ classes.actions }>
          {
            actions.map(action => (
              <Button
                key={ `drawer-action-${ action.ariaLabel}`}
                aria-label={ action.ariaLabel }
                onClick={ action.onClick }
                disabled={ action.disabled }
              >
                { action.icon }
              </Button>
            ))
          }
        </div>
        <div className={ classes.contents }>
          { children }
        </div>
      </MuiDrawer>
    </Fragment>
  )
}

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.node,
  actions: PropTypes.arrayOf({
    action: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  }).isRequired,
}
