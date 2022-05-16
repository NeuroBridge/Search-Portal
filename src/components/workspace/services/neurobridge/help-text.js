import { Box, CardContent, Typography } from '@mui/material'
import {
  Check as CheckIcon,
  Construction as UnderConstructionIcon,
} from '@mui/icons-material'

export const HelpText = () => {
  return (
    <CardContent>
      <Typography paragraph>
        This interface allows users to find PubMed publications by
        communicating with the NeuroBridge API,
        The current iteration of this interface restricts the user to
        constructing a query of the form <code>termA AND termB AND ...</code>
      </Typography>
      <Typography paragraph>
        Terms checked <CheckIcon sx={{ color: '#6c6' }} fontSize="small" /> in
        your workspace appear here as selection boxes. Many terms in the
        This interface is still under active development.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <UnderConstructionIcon color="warning" /> 
        <Typography>
          This interface is still under active development.
        </Typography>
        <UnderConstructionIcon color="warning" /> 
      </Box>
    </CardContent>
  )
}
