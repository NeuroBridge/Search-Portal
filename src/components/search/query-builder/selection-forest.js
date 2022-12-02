import PropTypes from 'prop-types'
import { Box, Fade, Stack, Typography } from '@mui/material'
import { SelectionTree } from './selection-tree'
import ArrowImage from '../../../images/arrow.png'

export const SelectionForest = ({ roots }) => {
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
        roots.length === 0 ? (
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
                height: '200px',
                width: '200px',
                background: `url(${ ArrowImage })`,
                backgroundSize: '100%',
                position: 'absolute',
                bottom: '-20px',
                left: '60px',
              }}
              />
            </Box>
          </Fade>
        ) : roots.map(id => (
          <SelectionTree key={ `${ id }-forest` } rootTermId={ id } />
        ))
      }
    </Stack>
  )
}

SelectionForest.propTypes = {
  roots: PropTypes.array.isRequired,
}
