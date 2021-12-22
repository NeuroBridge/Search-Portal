import PropTypes from 'prop-types'
import { Button, Drawer as MuiDrawer } from '@mui/material'
import { makeStyles } from '@mui/styles'

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
}))

export const Drawer = ({ open, actions, children }) => {
  const classes = useStyles()

  return (
    <MuiDrawer
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
  )
}

Drawer.propTypes = {
  open: PropTypes.bool.isRequired,
  children: PropTypes.node,
  actions: PropTypes.arrayOf({
    action: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  }).isRequired,
}