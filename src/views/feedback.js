import { Card, CardContent, CardHeader, Container, Divider, Typography } from '@mui/material'
import { FeedbackForm } from '../components/feedback-form'
import { useLocation } from 'react-router-dom'

export const FeedbackView = () => {
  const location = useLocation()

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center">
        Feedback
      </Typography>

      <Typography paragraph sx={{ my: 4 }}>
        Your opinion matters to us, and we&apos;d love to hear about your experience using NeuroBridge.
        Please take a moment to share your questions, suggestions, or report any bugs you&apos;ve encountered.
        Your feedback will help us improve and provide you with the best possible experience.
      </Typography>

      <Card>
        <CardHeader
          title="Get in Touch"
          titleTypographyProps={{ align: 'center' }}
        />

        <Divider />

        <CardContent>
          <FeedbackForm presets={{ ...location.state }} />
        </CardContent>
      </Card>

    </Container>
  )
}
