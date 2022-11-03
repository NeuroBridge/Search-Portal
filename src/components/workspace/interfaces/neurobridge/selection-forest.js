import { CardContent, Divider, Stack } from '@mui/material'
import { SelectionTree } from './selection-tree'
import { useBasket } from '../../../basket'

export const Forest = () => {
  const basket = useBasket()

  return (
    <CardContent sx={{ minHeight: '150px' }}>
      <Stack divider={ <Divider sx={{ margin: '1rem 0' }}/> }>
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
    </CardContent>
  )
}
