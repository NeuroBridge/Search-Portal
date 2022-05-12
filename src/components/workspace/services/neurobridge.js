import { Fragment, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, CardContent, Collapse, Divider, IconButton, List, ListItem, Typography } from '@mui/material'
import {
  Info as ExpandIcon,
} from '@mui/icons-material'
import { useBasket } from '../../basket'

const HelpText = () => {
  return (
    <Fragment>
      <Typography paragraph>
        This interface allows communication with the NeuroBridge API,
        which receives terms and returns PubMed publications.
      </Typography>
      <Typography paragraph>
        This interface is still under development.
      </Typography>
    </Fragment>
  )
}

export const NeuroBridgeServiceInterface = ({ doSearch }) => {
  const basket = useBasket()
  const [showHelp, setShowHelp] = useState(false)

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
      <CardContent sx={{ display: 'flex', gap: '1rem' }}>
        <Collapse in={ showHelp } sx={{ flex: 1 }}>
          <HelpText />
        </Collapse>
        <Box>
          <IconButton onClick={ () => setShowHelp(!showHelp) } size="small">
            <ExpandIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>

      <Divider />
      
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
