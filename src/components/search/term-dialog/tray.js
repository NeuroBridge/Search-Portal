import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Card, CardActions, CardContent, CardHeader, Divider, List, ListItem, Slide, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useDialogContext } from './'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    right: 0,
    minWidth: '300px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    opacity: 0.9,
  },
  header: {
    backgroundColor: theme.palette.grey[400],
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  content: {
    padding: theme.spacing(1),
    backgroundColor: theme.palette.grey[300],
    flex: 1,
  },
  actions: {
    backgroundColor: theme.palette.grey[400],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))

const SlideTransition = forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ ref } { ...props } />
})

export const Tray = ({ children, title, visibility, align, actions }) => {
  const classes = useStyles()
  const alignmentClass = align === 'top' ? classes.alignTop : align === 'bottom' ? classes.alignBottom : undefined

  return (
    <SlideTransition in={ visibility } direction="left">
      <Card className={ classes.root } elevation={ 0 } square>
        <CardHeader disableTypography title={ title } className={ classes.header } />
        <CardContent className={ classes.content }>
          { children }
        </CardContent>
        { actions && <CardActions className={ classes.actions }>{ actions }</CardActions> }
      </Card>
    </SlideTransition>
  )
}

Tray.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  visibility: PropTypes.bool.isRequired,
}
