import PropTypes from 'prop-types'
import { Box, Fade, Stack, Typography } from '@mui/material'
import { SelectionTree } from './selection-tree'
import StartHereArrow from '../../../images/start-here.svg'

export const SelectionForest = ({ query }) => {
  return (
    <Stack
      justifyContent="flex-start"
      alignItems="stretch"
      gap={ 2 }
      sx={{
        flex: 1,
        m: 3,
        minHeight: '250px',
        position: 'relative',
      }}
    >
      {
        query.length === 0 ? (
          <Fade in={ true }>
            <Box sx={{ mt: 0 }}>
              <Typography
                paragraph
                color="primary"
                align="center"
                sx={{ filter: 'opacity(0.8)', fontSize: '200%', mt: 4 }}
              >
                Add a concept to start building a query!
              </Typography>
              <Box sx={{
                height: '150px',
                width: '150px',
                background: `url(${ StartHereArrow })`,
                filter: 'opacity(0.8)',
                backgroundSize: '100%',
                position: 'absolute',
                bottom: '-20px',
                left: '40px',
              }}
              />
            </Box>
          </Fade>
        ) : query.map(root => (
          <SelectionTree key={ `${ root.name }-forest` } term={ root } />
        ))
      }
    </Stack>
  )
}

SelectionForest.propTypes = {
  query: PropTypes.array.isRequired,
}
