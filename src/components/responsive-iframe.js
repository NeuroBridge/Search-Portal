import PropTypes from 'prop-types'
import { Box, useTheme } from '@mui/material'

export const ResponsiveIframe = props => {
  const theme = useTheme()

  return (
    <Box sx={{
      border: `1px solid ${ theme.palette.primary.main }`,
      overflow: 'hidden',
      paddingBottom: '56.25%',
      marginBottom: '2rem',
      position: 'relative',
      height: 0,
      '& iframe': {
        left: 0,
        top: 0,
        height: '100%',
        width: '100%',
        position: 'absolute',
      }
    }}
    >
      <iframe title={ props.title } frameBorder="0" allowFullScreen={ true } { ...props }></iframe>
    </Box>
  )
}

ResponsiveIframe.propTypes = {
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
}