import { Box, Slide, Typography, useTheme } from '@mui/material'
import PropTypes from 'prop-types'

//

export const Thanks = ({ show = false }) => {
  const theme = useTheme()
  return (
    <Slide in={ show } direction="down" mountOnEnter unmountOnExit>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.palette.background.paper,
        filter: 'opacity(0.9)',
        zIndex: 9,
        gap: theme.spacing(4),
      }}>
        <Typography align="center" variant="h3" color="primary">Thanks!</Typography>
        <Typography align="center" paragraph>
          Your message has been sent.
          We&apos;ll be in touch soon.
        </Typography>
      </Box>
    </Slide>
  )
}

Thanks.propTypes = {
  show: PropTypes.bool.isRequired,
}

