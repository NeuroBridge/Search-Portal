import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box, IconButton, Menu, Tooltip,
} from '@mui/material'
import {
  Close as CloseIcon,
  MoreVert as MenuIcon,
} from '@mui/icons-material'

//

export const SelectionTreeMenu = ({ items }) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClickMenuButton = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const open = Boolean(anchorEl)
  const id = open ? 'term-actions-menu' : undefined

  return (
    <Box sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>
      {/* toggle button */}
      <Tooltip placement="top" title="Term actions menu">
        <IconButton
          aria-describedby={ id }
          color="secondary"
          size="small"
          onClick={ handleClickMenuButton }
        ><MenuIcon
          fontSize="small"
          sx={{
            color: open ? 'transparent' : 'default',
            transition: open ? 'color 0' : 'color 500ms',
          }}
        /></IconButton>
      </Tooltip>

      {/* menu */}
      <Menu
        id={ id }
        open={ open }
        anchorEl={ anchorEl }
        onClose={ handleClose }
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'right' }}
        onClick={ handleClose }
        sx={{
          '& .MuiPaper-root': {
            boxShadow: 'none',
            backgroundColor: 'transparent',
          }
        }}
        MenuListProps={{
          sx: {
            display: 'flex', alignItems: 'center', p: 0,
            '& .MuiButtonBase-root': {
              filter: 'opacity(0.75)',
              transition: 'filter 250ms',
              '&:hover': {
                filter: 'opacity(1.0)',
              }
            },
          },
        }}
      >
        {
          items.map(({ key, action, icon, tooltip }) => (
            <Tooltip key={ `term-action-${ key }` } title={ tooltip } placement="top">
              <IconButton onClick={ action } size="small">{ icon }</IconButton>
            </Tooltip>
          ))
        }
        <Box sx={{ pl: 1 }} />
        <Tooltip key="term-action-menu-close" title="Close Menu" placement="top">
          <IconButton
            color="error"
            size="small"
            onClick={ handleClose }
          ><CloseIcon fontsize="small" /></IconButton>
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
}
