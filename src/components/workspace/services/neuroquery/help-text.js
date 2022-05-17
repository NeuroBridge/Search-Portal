import { CardContent, Typography } from '@mui/material'
import { Link } from '../../../link'
import { Check as CheckIcon } from '@mui/icons-material'

export const HelpText = () => {
  return (
    <CardContent>
      <Typography paragraph>
        This interface allows users to find PubMed publications by
        communicating with communication with
        the <Link to="https://neuroquery.org/">NeuroQuery</Link> API,
      </Typography>
      <Typography paragraph>
        Terms checked <CheckIcon sx={{ color: '#6c6' }} fontSize="small" /> in
        your workspace appear here. Many terms in the NeuroBridge Ontology have
        multiple string representations, or <em>labels</em>. Before sending your
        request to NeuroQuery, you may fine-tune your search by selecting the
        most appropriate label to represent each term with multiple labels.
        Terms without additional labels, Verify the constructed URL and query
        before sending your request to NeuroQuery.
      </Typography>
    </CardContent>
  )
}