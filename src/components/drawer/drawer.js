import PropTypes from 'prop-types'
import { IconButton, Drawer as MuiDrawer } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  drawer: {
    position: 'relative',
  },
  drawerPaper: {
    height: '200px',
    borderTop: '4px solid #373f51',
    filter: 'drop-shadow(0 0 1rem #00000033)',
    backgroundColor: '#bbb',
    paddingRight: theme.spacing(8),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  contents: {
    overflow: 'auto',
  },
  actions: {
    position: 'absolute',
    padding: theme.spacing(1),
    right: 0,
    top: 0,
    bottom: 0,
    width: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#373f5133',
    borderLeft: '4px solid #373f51',
  },
}))

export const Drawer = ({ open, actions, children }) => {
  const classes = useStyles()
  console.log(actions)

  return (
    <MuiDrawer
      anchor="bottom"
      variant="persistent"
      open={ open }
      className={ classes.drawer }
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={ classes.actions }>
        {
          actions.map(action => (
            <IconButton
              key={ `drawer-action-${ action.ariaLabel}`}
              aria-label={ action.ariaLabel }
              onClick={ action.onClick }
              disabled={ action.disabled }
            >
              { action.icon }
            </IconButton>
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
    disabled: PropTypes.bool.isRequired,
  }).isRequired,
}