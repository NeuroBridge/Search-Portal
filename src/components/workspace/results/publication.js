import PropTypes from 'prop-types'
import { Button, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'

export const Publication = ({ result: publication }) => {
  const { title, pmid, snippet, url, authors, score } = publication

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
        <Typography title={ score }>
          Score: {
            score ? score.toFixed(2) : <span style={{ fontStyle: 'italic', color: '#999' }}>Unavailable</span>
          }
        </Typography>
        <Typography>
          Snippet: {
            snippet || <span style={{ fontStyle: 'italic', color: '#999' }}>Unavailable</span>
          }
          </Typography>
        <Typography>
          Authors: {
            authors || <span style={{ fontStyle: 'italic', color: '#999' }}>Unavailable</span>
          }
        </Typography>
      </CardContent>
      
      <Divider />
      
      <CardContent sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Typography align="right" variant="caption">PMID: { pmid }</Typography>
        <Button variant="outlined" size="small" href={ url } target="_blank">View Full Text</Button>
      </CardContent>
    </Card>
  )
}

Publication.propTypes = {
  result: PropTypes.shape({
    title: PropTypes.string,
    pmid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    snippet: PropTypes.string,
    url: PropTypes.string,
    authors: PropTypes.string,
    score: PropTypes.number,
  }).isRequired,
}
