import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Card, CardActions, CardContent, CardHeader, Divider, Grow, List, ListItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: 'absolute',
    right: theme.spacing(1),
    backgroundColor: '#cce3e3aa',
  },
  alignTop: {
    top: theme.spacing(15),
  },
  alignBottom: {
    bottom: theme.spacing(10),
  },
  root: {
    transform: 'scale(0.99)',
    backgroundColor: '#f2f8f8aa',
    color: theme.palette.primary.main,
  },
  header: {
    backgroundColor: '#cce3e3aa',
    textTransform: 'uppercase',
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  cardContent: {
    padding: theme.spacing(1),
  },
  cardActions: {
    backgroundColor: '#cce3e3aa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

const GrowTransition = forwardRef(function Transition(props, ref) {
  return <Grow direction="left" ref={ ref } { ...props } />
})

export const Popup = ({ children, title, visibility, align, actions }) => {
  const classes = useStyles()
  const alignmentClass = align === 'top' ? classes.alignTop : align === 'bottom' ? classes.alignBottom : undefined

  return (
    <GrowTransition in={ visibility }>
      <div className={ `${ classes.wrapper } ${ alignmentClass }` }>
        <Card className={ classes.root } elevation={ 0 } square>
          <CardHeader disableTypography title={ title } className={ classes.header } />
          <CardContent className={ classes.cardContent }>
            { children }
          </CardContent>
          { actions && <CardActions className={ classes.cardActions }>{ actions }</CardActions> }
        </Card>
      </div>
    </GrowTransition>
  )
}

Popup.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  visibility: PropTypes.bool.isRequired,
  align: PropTypes.oneOf(['top', 'bottom']).isRequired,
}
