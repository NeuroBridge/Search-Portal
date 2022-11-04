import { Box, Stack } from '@mui/material'
import { SelectionTree } from './selection-tree'
import { useBasket } from '../../../basket'

export const Forest = () => {
  const basket = useBasket()

  return (
    <Box sx={{ minHeight: '75px', m: 3, mr: 5 }}>
      <Stack gap={ 2 }>
        {
          basket.ids.map(id => {
            return (
              <SelectionTree
                key={ `${ id }-forest` }
                rootTermId={ id }
              />
            )
          })
        }
      </Stack>
    </Box>
  )
}
