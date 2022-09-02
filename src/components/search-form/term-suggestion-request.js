import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Button, CircularProgress, Fade, Stack, Typography,
} from '@mui/material'

export const TermSuggestionRequest = ({ suggestion, clickHandler }) => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const waitASecond = setTimeout(() => {
      setReady(true)
    }, 1000)
    return () => clearTimeout(waitASecond)
  }, [])

  if (!ready) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{ height: '250px' }}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Fade in={ ready }>
      <Box sx={{
        height: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        textAlign: 'left',
        '& .title': {},
        '& .note': {
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
        },
        '& .button': {
          margin: '0 auto',
        },
      }}>
        <Typography align="center" variant="h4" color="primary" className="title">
          No matching terms!
        </Typography>
        <Typography paragraph align="center" color="text.secondary" className="note">
          Oh no! It looks like &quot;{ suggestion }&quot; doesn&apos;t match any terms in our ontology.
          Please send us a note to suggest that we consider adding it!
        </Typography>
        <Button
          variant="contained"
          onClick={ clickHandler }
          className="button"
        >suggest &quot;{ suggestion }&quot;</Button>
      </Box>
    </Fade>
  )
}

TermSuggestionRequest.propTypes = {
  suggestion: PropTypes.string.isRequired,
  clickHandler: PropTypes.func.isRequired,
}

