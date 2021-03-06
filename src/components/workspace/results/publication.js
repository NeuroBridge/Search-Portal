import PropTypes from 'prop-types'
import { Button, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'

export const Publication = ({ title, pmid, snippet, url }) => {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      filter: 'brightness(0.97)',
      '&:hover': {
        filter: 'brightness(1.0)',
      }
    }}>
      <CardHeader
        title={ title }
        titleTypographyProps={{
          variant: 'h6',
          align: 'center',
          sx: { fontSize: '120%' },
        }}
      />

      <Divider />
      
      <CardContent sx={{ flex: 1 }}>
        <Typography paragraph>{ snippet || 'Snippet unavailable' }</Typography>
      </CardContent>

      <Divider />
      
      <CardContent sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography align="right" variant="caption">PMID: { pmid }</Typography>
        <Button variant="outlined" size="small" href={ url } target="_blank">View</Button>
      </CardContent>
    </Card>
  )
}

Publication.propTypes = {
  title: PropTypes.string.isRequired,
  pmid: PropTypes.number,
  snippet: PropTypes.string,
  url: PropTypes.string,
}

Publication.defaultProps = {
  title: '',
}