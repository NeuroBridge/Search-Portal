import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button, Dialog, DialogTitle, Divider, IconButton,
} from '@mui/material'
import {
  Close as CloseIcon,
  Tune as ConfigIcon,
} from '@mui/icons-material'

//

export const ConfigMenu = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const id = open ? 'config-menu' : undefined;

  return (
    <Fragment>
      <Button
        aria-describedby={ id }
        onClick={ handleClick }
        startIcon={ <ConfigIcon /> }
      >Options</Button>
      <Dialog
        id={ id }
        open={ open }
        onClose={ handleClose }
      >
        <DialogTitle color="primary.dark">Options</DialogTitle>
          <IconButton
            size="large"
            sx={{ position: 'absolute', top: 8, right: 8, }}
            onClick={ handleClose }
          ><CloseIcon /></IconButton>
        <Divider />
        { children }
      </Dialog>
    </Fragment>
  )
}

ConfigMenu.propTypes = {
  children: PropTypes.node.isRequired,
}
