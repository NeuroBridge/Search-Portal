import PropTypes from 'prop-types'
import { Button, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'

export const Publication = ({ title, pmid, url }) => {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    }}>
      <CardHeader
        title={ title }
        titleTypographyProps={{ variant: "h6", align: 'center' }}
      />

      <Divider />
      
      <CardContent sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography align="right">PMID: { pmid }</Typography>
        <Button variant="outlined" size="small" href={ url } target="_blank">View</Button>
      </CardContent>
    </Card>
  )
}

Publication.propTypes = {
  title: PropTypes.string.isRequired,
  pmid: PropTypes.number,
  url: PropTypes.string,
}

Publication.defaultProps = {
  title: '',
}