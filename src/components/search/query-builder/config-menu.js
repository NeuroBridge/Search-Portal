import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, IconButton, Popover, Tooltip,
} from '@mui/material'
import {
  Close as CloseIcon,
  Settings as ConfigIcon,
} from '@mui/icons-material'

//

export const ConfigMenu = ({ children, sx }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const id = open ? 'config-menu' : undefined;

  return (
    <Box sx={ sx }>
      <Tooltip placement="left" title="Configuration">
        <IconButton
          aria-describedby={ id }
          variant="contained"
          onClick={ handleClick }
          size="small"
        ><ConfigIcon fontSize="small" /></IconButton>
      </Tooltip>
      <Popover
        id={ id }
        open={ open }
        anchorEl={ anchorEl }
        onClose={ handleClose }
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: 0, right: 0 }}
          onClick={ handleClose }
        ><CloseIcon fontSize="small" /></IconButton>
        { children }
      </Popover>
    </Box>
  )
}

ConfigMenu.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
}
