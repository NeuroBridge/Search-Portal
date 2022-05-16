import { CardContent, Typography } from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'

export const HelpText = () => {
  return (
    <CardContent>
      <Typography paragraph>
        This interface allows the contruction of a query to send to the NeuroBridge API.
        Terms checked <CheckIcon sx={{ color: '#6c6' }} fontSize="small" /> in your
        workspace appear here as trees of their descendants in the NeuroBridge Ontology.
        The query will be constructed with <code>OR</code> operator between root terms, and
        <code>AND</code> operator between selected terms in each tree.
      </Typography>
      <Typography>
        This interface is still under active development.
      </Typography>
    </CardContent>
  )
}