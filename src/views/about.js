import { Fragment } from 'react'
import { Container } from '../components/container'
import { PageHeader } from '../components/page-header'
import { Card, CardContent } from '@mui/material'

export const AboutView = () => {
  return (
    <Fragment>
      <PageHeader title="About NeuroBridge" />

      <Container>
        <Card sx={{ height: '300px' }}>
          <CardContent>
            the quick brown fox junmps over a lazy dog.
          </CardContent>
        </Card>
        <br /><br />
        <Card sx={{ height: '300px' }}>
          <CardContent>
            the quick brown fox junmps over a lazy dog.
          </CardContent>
        </Card>
        <br /><br />
        <Card sx={{ height: '300px' }}>
          <CardContent>
            the quick brown fox junmps over a lazy dog.
          </CardContent>
        </Card>
      </Container>
    </Fragment>
  )
}
