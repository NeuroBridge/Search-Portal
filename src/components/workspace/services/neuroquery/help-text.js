import { CardContent, Typography } from '@mui/material'
import { Link } from '../../../link'
import { Check as CheckIcon } from '@mui/icons-material'

export const HelpText = () => {
  return (
    <CardContent>
      <Typography paragraph>
        This interface allows communication with <Link to="https://neuroquery.org/">NeuroQuery</Link>,
        which returns PubMed publications.
      </Typography>
      <Typography paragraph>
        Terms checked <CheckIcon sx={{ color: '#6c6' }} fontSize="small" /> in
        your workspace appear here as selection boxes. Many terms in the
        NeuroBridge Ontology have multiple string representations, or <em>labels</em>.
        Before sending your request to NeuroQuery, you may fine-tune your NeuroQuery
        search by selecting the most appropriate label to represent each term. Verify
        the constructed URL and query before sending your request to NeuroQuery.
      </Typography>
    </CardContent>
  )
}