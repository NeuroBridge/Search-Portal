import { CardContent, Divider, Stack } from '@mui/material'
import { SelectionTree } from './selection-tree'
import { useBasket } from '../../../basket'

export const Forest = () => {
  const basket = useBasket()

  return (
    <CardContent>
      <Stack divider={ <Divider sx={{ margin: '1rem 0' }}/> }>
        {
          Object.keys(basket.contents)
            .filter(id => basket.contents[id] === 1)
            .map(id => {
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
