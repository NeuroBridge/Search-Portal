import { CardContent, Typography } from '@mui/material'

export const HelpText = () => {
  return (
    <CardContent>
      <Typography paragraph>
        This interface allows communication with the NeuroBridge API,
        which receives terms and returns PubMed publications.
      </Typography>
      <Typography paragraph>
        This interface is still under active development.
      </Typography>
    </CardContent>
  )
}
