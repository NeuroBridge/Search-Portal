import PropTypes from 'prop-types'
import { Box, Divider, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(5),
  },
  titles: {
    flex: '1 !important',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: {
    display: 'block',
  },
  subtitle: {
    display: 'block',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
  },
}))

export const PageHeader = ({ title, subtitle, actions }) => {
  const classes = useStyles()

  return (
    <Box className={ classes.container }>
      <Box className={ classes.titles }>
        <Box className={ classes.title }>
          <Typography variant="h1">{ title }</Typography>
        </Box>
        <Box className={ classes.subtitle }>
          <Typography variant="h2">{ subtitle }</Typography>
        </Box>
      </Box>
      <Box className={ classes.actions }>
        { actions }
      </Box>
      <Divider />
    </Box>
  )
}
PageHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.node),
}
