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
  return (
    <Dialog onClose={ onClose } open={ open }>
      <DialogTitle>{ publication.title }</DialogTitle>
      <Divider />
      <Stack
        direction="row"
        divider={ <Divider orientation="vertical" flexItem /> }
        sx={{ px: 3 }}
      >
        {
          publication.pmid && publication.pubmed_url && (
            <Stack direction="row" alignItems="center" gap={ 1 } sx={{ p: 1 }}>
              <LittleNihLogo />
              <Link to={ publication.pubmed_url }>
                Abstract
              </Link>
            </Stack>
          )
        }
        {
          publication.pmcid && publication.pmc_url && (
            <Stack direction="row" alignItems="center" gap={ 1 } sx={{ p: 1 }}>
              <LittleNihLogo />
              <Link to={ publication.pmc_url }>
                Full Text
              </Link>
            </Stack>
          )
        }
      </Stack>
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
