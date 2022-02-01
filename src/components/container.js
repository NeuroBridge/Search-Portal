import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: ({maxWidth}) => maxWidth,
    margin: 'auto',
    padding: theme.spacing(4),
    position: 'relative',
  },
}))

export const Container = ({ children, maxWidth }) => {
  const classes = useStyles({ maxWidth })
  return (
    <div className={ classes.container }>
      { children }
    </div>
  )
}

Container.propTypes = {
  maxWidth: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

Container.defaultProps = {
  maxWidth: '1080px',
}

