import { Box, Button, Divider, List, ListItem } from '@mui/material'
import { useBasket } from '../../basket'

export const NeuroBridgeServiceInterface = () => {
  const basket = useBasket()

  return (
    <div>
      <List>
        {
          Object.keys(basket.contents).map(id => (
            <ListItem key={ id }>
              - { basket.contents[id] === 0 && 'NOT' } { id }
            </ListItem>
          ))
        }
      </List>

      <br />
      <Divider />
      <br />

      <Box sx={{ textAlign: 'right' }}>
        <Button variant="contained">Query</Button>
      </Box>

    </div>
  )
}
