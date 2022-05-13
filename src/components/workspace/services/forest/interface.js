import PropTypes from 'prop-types'
import { Button, CardContent, Divider } from '@mui/material'
import { ForestProvider } from './context'
import { Forest } from './selection-forest'
import { Query } from './query'

//

export const ForestInterface = ({ doSearch }) => {
  
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
    <ForestProvider>
      <Forest />

      <Divider />
      
      <Query />

      <Divider />
      
      <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={ handleClickQueryButton }>Send Query</Button>
      </CardContent>
    </ForestProvider>
  )
}

ForestInterface.propTypes = {
  doSearch: PropTypes.func.isRequired,
}
