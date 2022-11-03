import { Box, Divider, Stack } from '@mui/material'
import { SelectionTree } from './selection-tree'
import { useBasket } from '../../../basket'

export const Forest = () => {
  const basket = useBasket()

  return (
    <Box sx={{ minHeight: '150px', p: 3 }}>
      <Stack divider={ <Divider /> }>
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
