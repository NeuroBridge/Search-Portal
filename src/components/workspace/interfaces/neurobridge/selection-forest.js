import { Box, Divider, Stack } from '@mui/material'
import { SelectionTree } from './selection-tree'
import { useBasket } from '../../../basket'

export const Forest = () => {
  const basket = useBasket()

  return (
    <Box sx={{ minHeight: '75px', m: 3, mr: 5, border: 'solid #eee', borderWidth: '2px 2px 2px 0' }}>
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
