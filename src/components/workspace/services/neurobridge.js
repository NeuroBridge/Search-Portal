import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, CardContent, Divider, List, ListItem } from '@mui/material'
import { useBasket } from '../../basket'

export const NeuroBridgeServiceInterface = ({ doSearch }) => {
  const basket = useBasket()

  const query = useMemo(() => {
    return 'query query query'
  }, [basket.ids])

  const handleClickQueryButton = () => {
    doSearch(async () => {
      return [
        { title: 'a', pubmed_url: 'https://google.com', pmid: '1234' },
        { title: 'few', pubmed_url: 'https://google.com', pmid: '1235' },
        { title: 'sample', pubmed_url: 'https://google.com', pmid: '1236' },
        { title: 'results', pubmed_url: 'https://google.com', pmid: '1237' },
      ]
    })
  }

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
        <pre style={{ backgroundColor: '#eee', color: '#789', fontSize: '75%', margin: 0, padding: '0.5rem', whiteSpace: 'pre-wrap' }}>
          { query }
        </pre>
      </CardContent>

      <Divider />

      <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={ handleClickQueryButton }>Send Query</Button>
      </CardContent>
    </Box>
  )
}

NeuroBridgeServiceInterface.propTypes = {
  doSearch: PropTypes.func.isRequired,
}
