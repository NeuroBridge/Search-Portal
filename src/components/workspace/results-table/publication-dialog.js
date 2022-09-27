import { useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Dialog, Divider, DialogContent, DialogTitle, Stack, Typography,
} from '@mui/material'
import { Link } from '../../link'
import nihLogoIcon from '../../../images/pubmed-icon.png'

//

const LittleNihLogo  = () => <img src={ nihLogoIcon } height="12" />

//

export const PublicationDialog = ({ onClose, open, publication }) => {

  const PubmedLink = useCallback(() => {
    return publication.pmid && publication.pubmed_url ? (
      <Stack direction="row" alignItems="center" gap={ 1 } sx={{ p: 1 }}>
        <LittleNihLogo />
        <Link to={ publication.pubmed_url }>Abstract</Link>
      </Stack>
    ) : null
  }, [publication])

  const PubmedCentralLink = useCallback(() => {
    return publication.pmcid && publication.pmc_url ? (
      <Stack direction="row" alignItems="center" gap={ 1 } sx={{ p: 1 }}>
        <LittleNihLogo />
        <Link to={ publication.pmc_url }>Full Text</Link>
      </Stack>
    ) : null
  }, [publication])

  return (
    <Dialog onClose={ onClose } open={ open }>
      <DialogTitle>{ publication.title }</DialogTitle>

      <Divider />
      
      <DialogContent sx={{ py: 0, backgroundColor: '#e6e9ec' }}>
        <Stack
          direction="row" alignItems="center"
          divider={ <Divider orientation="vertical" flexItem /> }
        >
          <Typography sx={{ paddingRight: 1 }}>Links:</Typography>
          <PubmedLink />
          <PubmedCentralLink />
        </Stack>
      </DialogContent>
      
      <Divider />
      
      <DialogContent sx={{ minHeight: '300px' }}>
        <Typography paragraph>
          <strong>Snippet:</strong> <em>{ publication.snippet }</em>
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

PublicationDialog.propTypes = {
  publication: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
