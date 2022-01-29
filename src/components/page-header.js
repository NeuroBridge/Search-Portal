import PropTypes from 'prop-types'
import { Box, Divider, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  container: {
    // border: '1px dashed crimson',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(5),
  },
  title: {
    // border: '1px dotted navy',
  },
  subtitle: {
    // border: '1px dotted rebeccapurple',
  },
  actions: {
    // border: '1px dotted lightgreen',
  },
}))

export const PageHeader = ({ title, subtitle, actions }) => {
  const classes = useStyles()

  return (
    <Box className={ classes.container }>
      <Box className={ classes.title }>
        {
          typeof title === 'string'
          ? <Typography variant="h1">{ title }</Typography>
          : title
        }
      </Box>
      <Box className={ classes.subtitle }>
        {
          typeof subtitle === 'string'
          ? <Typography variant="h2">{ subtitle }</Typography>
          : title
        }
      </Box>
      <Box className={ classes.actions }>
        { actions }
      </Box>
      <Divider />
    </Box>
  )
}
PageHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  actions: PropTypes.arrayOf(PropTypes.node),
}
