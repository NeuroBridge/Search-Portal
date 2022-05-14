import { CardContent, Typography } from '@mui/material'
import { Link } from '../../../link'

export const HelpText = () => {
  return (
    <CardContent>
      <Typography paragraph>
        This interface allows communication with <Link to="https://neuroquery.org/">NeuroQuery</Link>,
        which receives terms and returns PubMed publications.
      </Typography>
      <Typography paragraph>
        Terms in your workspace will appear in this interface as selection boxes.
        Many terms in the NeuroBridge Ontology have multiple string representations, or <em>labels</em>.
        Before sending your request to NeuroQuery, you may fine-tune your NeuroQuery search by
        selecting the most appropriate label to represent each term.
        Verify the constructed URL and query before sending your request to NeuroQuery.
      </Typography>
    </CardContent>
  )
}