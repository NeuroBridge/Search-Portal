import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Dialog, Divider, DialogContent, DialogTitle, Stack, Typography } from '@mui/material'
import { Link } from '../../link'
import nihLogoIcon from '../../../images/pubmed-icon.png'

const NihLogo  = () => <img src={ nihLogoIcon } height="12" />

export const PublicationDialog = ({ publication }) => {
  const { title, snippet, pmid, pubmed_url, pmcid, pmc_url } = publication
  const [open, setOpen] = useState(!!publication)

  useEffect(() => {
    if (publication) {
      setOpen(true)
    }
  }, [publication])

  const handleCloseDialog = () => {
    setOpen(false)
  }

  return (
    <Dialog onClose={ handleCloseDialog } open={ open }>
      <DialogTitle>{ title }</DialogTitle>
      <Divider />
      <Stack
        direction="row"
        divider={ <Divider orientation="vertical" flexItem /> }
        sx={{ px: 3 }}
      >
        <Box sx={{ p: 1 }}>
          <NihLogo /> Abstract: { pmid && <Link to={ pubmed_url }>{ pmid }</Link> }
        </Box>
        <Box sx={{ p: 1 }}>
          <NihLogo /> Full text: { pmcid && <Link to={ pmc_url }>{ pmcid }</Link> }
        </Box>
      </Stack>
      <Divider />
      <DialogContent>
        <Typography paragraph>
          <strong>Snippet:</strong> <em>{ snippet }</em>
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

PublicationDialog.propTypes = {
  publication: PropTypes.object,
}
