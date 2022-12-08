import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, Divider, IconButton, Menu, Tooltip,
} from '@mui/material'
import {
  Close as CloseIcon,
  MoreVert as MenuIcon,
} from '@mui/icons-material'

//

export const SelectionTreeMenu = ({ items, sx }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClickMenuButton = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const id = open ? 'term-actions-menu' : undefined;

  return (
    <Box sx={ sx }>
      {/* button */}
      <Tooltip placement="top" title="Term Actions">
        <IconButton
          aria-describedby={ id }
          variant="contained"
          color="secondary"
          onClick={ handleClickMenuButton }
          size="small"
          sx={{ my: 1 }}
        ><MenuIcon fontSize="small" /></IconButton>
      </Tooltip>

      {/* menu */}
      <Menu
        id={ id }
        open={ open }
        anchorEl={ anchorEl }
        onClose={ handleClose }
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        onClick={ handleClose }
        MenuListProps={{
          '& .MuiMenu-paper': {
            backgroundColor: 'background.paper',
          },
          sx: {
            display: 'flex', alignItems: 'center', p: 0,
            '& .MuiButtonBase-root': { borderRadius: 0 },
          },
        }}
      >
        {
          items.map(({ key, action, icon, tooltip }) => (
            <Tooltip key={ `term-action-${ key }` } title={ tooltip } placement="top">
              <IconButton onClick={ action }>{ icon }</IconButton>
            </Tooltip>
          ))
        }
        <Divider orientation="vertical" flexItem />
        <Tooltip key="term-action-menu-close" title="Close Menu" placement="top">
          <IconButton
            color="secondary"
            onClick={ handleClose }
          ><CloseIcon /></IconButton>
        </Tooltip>
      </Menu>
    </Box>
  )
}

SelectionTreeMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      action: PropTypes.func.isRequired,
      icon: PropTypes.node.isRequired,
      tooltip: PropTypes.string.isRequired,
    })
  ).isRequired,
  sx: PropTypes.object,
}
