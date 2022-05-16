import PropTypes from 'prop-types'
import { Button, Card, CardContent, CardHeader } from '@mui/material'

export const Result = ({ result }) => {
  const { title, url } = result

  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      border: '2px dashed crimson',
    }}>
      <CardHeader disableTypography title={ title } sx={{ flex: 1, textAign: 'left' }} />
      <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" size="small" href={ url } target="_blank">View</Button>
      </CardContent>
    </Card>
  )
}

Result.propTypes = {
  result: PropTypes.shape({
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
}
