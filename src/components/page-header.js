import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: '80px',
    marginBottom: theme.spacing(5),
    position: 'sticky',
    top: '4rem',
    backgroundColor: 'white',
    zIndex: '999',
    borderBottom: `1px solid ${ theme.palette.primary.light }`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  container: {
    flex: 1,
    maxWidth: '1080px',
    margin: 'auto',
    padding: `${ theme.spacing(1) } ${ theme.spacing(4) }`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  title: {
    flex: '1 !important',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
  },
}))

export const PageHeader = ({ title, subtitle, actions }) => {
  const classes = useStyles()

  return (
    <Box className={ classes.wrapper }>
      <Box className={ classes.container }>
        <Box className={ classes.title }>
          <Typography variant="h1">{ title }</Typography>
        </Box>
        <Box className={ classes.actions }>
          { actions }
        </Box>
      </Box>
    </Box>
  )
}
PageHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.node),
}
