import { Box, Stack, Typography } from '@mui/material'
import { SelectionTree } from './selection-tree'
import { useBasket } from '../../basket'

export const Forest = () => {
  const basket = useBasket()

  return (
    <Box sx={{ minHeight: '75px', mt: 4, mb: 2 }}>
      <Stack
        gap={ 2 }
        justifyContent="center"
        alignItems="center"
      >
        {
          basket.ids.length === 0
            ? <Typography variant="h6">Add a concept to start building a query!</Typography>
            : basket.ids.map(id => (
              <SelectionTree
                key={ `${ id }-forest` }
                rootTermId={ id }
              />
            ))
        }
      </Stack>
    </Box>
  )
}
