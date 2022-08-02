import { Card, CardContent, CardHeader, Container, Divider, Typography } from '@mui/material'
import { ContactForm } from '../components/contact-form'
import { useLocation } from 'react-router-dom'

export const ContactView = () => {
  const location = useLocation()

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center">
        Contact
      </Typography>

      <br />
      
      <Typography paragraph>
        Cillum aute exercitation sit nostrud ea fugiat irure sint ut dolore esse tempor ullamco culpa adipisicing elit.
        Esse quis aliquip ut adipisicing nulla magna eu excepteur do sunt reprehenderit deserunt ad sed minim.
        Velit nisi in occaecat in officia in culpa amet sit sint reprehenderit.
      </Typography>

      <br />

      <Card>
        <CardHeader
          title="Send us a note"
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
