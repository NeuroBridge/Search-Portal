import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Divider, IconButton, Tooltip, Menu,
} from '@mui/material'
import {
  Close as CloseIcon,
  MoreVert as MenuIcon,
} from '@mui/icons-material'

//

export const SelectionTreeMenu = ({ children, sx }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const id = open ? 'config-menu' : undefined;

  return (
    <Box sx={ sx }>
      <Tooltip placement="left" title="Term Actions">
        <IconButton
          aria-describedby={ id }
          variant="contained"
          onClick={ handleClick }
          size="small"
          sx={{ my: 1 }}
        ><MenuIcon fontSize="small" /></IconButton>
      </Tooltip>
      <Menu
        id={ id }
        open={ open }
        anchorEl={ anchorEl }
        onClose={ handleClose }
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ height: '22px' }} />
        <Divider />
        <IconButton
          size="small"
          sx={{ position: 'absolute', top: 0, right: 0 }}
          onClick={ handleClose }
        ><CloseIcon fontSize="small" /></IconButton>
        { children }
      </Menu>
    </Box>
  )
}

SelectionTreeMenu.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
}
