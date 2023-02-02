import { Card, CardContent, CardHeader, Container, Divider, Typography } from '@mui/material'
import { ContactForm } from '../components/contact-form'
import { useLocation } from 'react-router-dom'

export const FeedbackView = () => {
  const location = useLocation()

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center">
        Feedback
      </Typography>

      <Typography paragraph sx={{ my: 4 }}>
        Cillum aute exercitation sit nostrud ea fugiat irure sint ut dolore esse tempor ullamco culpa adipisicing elit.
        Esse quis aliquip ut adipisicing nulla magna eu excepteur do sunt reprehenderit deserunt ad sed minim.
        Velit nisi in occaecat in officia in culpa amet sit sint reprehenderit.
      </Typography>

      <Card>
        <CardHeader
          title="Get in Touch!"
          titleTypographyProps={{ align: 'center' }}
        />

        <Divider />

        <CardContent>
          <ContactForm presets={{ ...location.state }} />
        </CardContent>
      </Card>

    </Container>
  )
}
