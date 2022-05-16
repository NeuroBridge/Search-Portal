import { CardContent, Typography } from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'

export const HelpText = () => {
  return (
    <CardContent>
      <Typography paragraph>
        This interface allows communication with the NeuroBridge API,
        which returns PubMed publications.
        The current iteration of this interface restricts the user to
        constructing a query of the form <code>termA AND termB AND ...</code>
      </Typography>
      <Typography paragraph>
        Terms checked <CheckIcon sx={{ color: '#6c6' }} fontSize="small" /> in
        your workspace appear here as selection boxes. Many terms in the
        This interface is still under active development.
      </Typography>
    </CardContent>
  )
}
