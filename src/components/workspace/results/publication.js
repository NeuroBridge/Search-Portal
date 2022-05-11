import PropTypes from 'prop-types'
import { Button, Card, CardContent, CardHeader } from '@mui/material'

export const Publication = ({ title, url }) => {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    }}>
      <CardHeader disableTypography title={ title } sx={{ flex: 1, textAign: 'left' }} />
      <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" size="small" href={ url } target="_blank">View</Button>
      </CardContent>
    </Card>
  )
}

Publication.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
}

Publication.defaultProps = {
  title: '',
}