import { Fragment, useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material'
import { MoreVert as MenuIcon } from '@mui/icons-material'

export const PopupMenu = ({ items }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  if (!items) {
    return ''
  }

  return (
    <Fragment>
      <IconButton
        id="workspace-menu-button"
        aria-controls={open ? 'workspace-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="workspace-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'workspace-menu-button',
        }}
      >
        {
          items.map(item => (
            <MenuItem key={ item.key } onClick={ item.onClick }>
              <ListItemIcon>{ item.icon }</ListItemIcon>
              <ListItemText>{ item.text }</ListItemText>
            </MenuItem>
          ))
        }
      </Menu>
    </Fragment>
  )
}

PopupMenu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    key: PropTypes.string.isRequired,
  })).isRequired,
}
