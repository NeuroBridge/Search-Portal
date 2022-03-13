import { useState } from 'react'
import { Button, Container, Typography } from '@mui/material'
import { GraphView } from './graph'
import { ListView } from './list'

const LIST = 'LIST'
const GRAPH = 'GRAPH'

export const BrowseView = () => {
  const [view, setView] = useState(LIST)

  const handleClickChangeView = () => {
    setView(view === LIST ? GRAPH : LIST)
  }

  return (
    <Container maxWidth="lg">

      <Typography variant="h4" component="h1" align="center">
        Browse
      </Typography>

      <br /><br />

      <Container maxWidth="lg">
        <Button
          onClick={ handleClickChangeView }
          variant="outlined"
        >
          VIEW AS { view === LIST ? GRAPH : LIST }
        </Button>

        <br /><br />

        { view === LIST && <ListView /> }
        { view === GRAPH && <GraphView /> }
      </Container>

    </Container>
  )
}