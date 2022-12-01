import PropTypes from 'prop-types'
import { Box, Stack, Typography } from '@mui/material'
import { SelectionTree } from './selection-tree'

export const SelectionForest = ({ roots }) => {
  return (
    <Box sx={{ minHeight: '75px', mt: 4, mb: 2 }}>
      <Stack
        gap={ 2 }
        justifyContent="center"
        alignItems="center"
      >
        {
          roots.length === 0 ? (
            <Typography paragraph sx={{ filter: 'opacity(0.8)', fontSize: '150%' }}>
              Add concepts to start building a query!
            </Typography>
          ) : roots.map(id => (
            <SelectionTree key={ `${ id }-forest` } rootTermId={ id } />
          ))
        }
      </Stack>
    </Box>
  )
}

SelectionForest.propTypes = {
  roots: PropTypes.array.isRequired,
}
