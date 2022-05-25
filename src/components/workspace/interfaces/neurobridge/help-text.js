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
        The current iteration of this interface is limited to
        constructing a queries of the form
      </Typography>
      <Typography paragraph align="center">
        <code>termA AND termB AND ...</code>
      </Typography>
      
      <Typography paragraph>
        and
      </Typography>
      
      <Typography paragraph align="center">
        <code>termA OR termB OR ...</code>.
      </Typography>

      <Typography paragraph>
        Terms checked <CheckIcon sx={{ color: '#6c6' }} fontSize="small" /> in
        your workspace appear here for addition in your query.
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
