import { Box, Button, CardContent, Divider, List, ListItem } from '@mui/material'
import { useBasket } from '../../basket'

export const NeuroBridgeServiceInterface = () => {
  const basket = useBasket()

  return (
    <Box>
      <CardContent>
        <List>
          {
            Object.keys(basket.contents).map(id => (
              <ListItem key={ id }>
                - { basket.contents[id] === 0 && 'NOT' } { id }
              </ListItem>
            ))
          }
        </List>
      </CardContent>

      <Divider />

      <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="contained">Send Query</Button>
      </CardContent>

    </Box>
  )
}
