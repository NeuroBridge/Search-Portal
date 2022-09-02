import * as React from 'react'
import { Box, IconButton } from '@mui/material'
import {
  Link as LinkIcon,
} from '@mui/icons-material'

export function renderLinkCell(params) {
  if (params.value == null) {
    return ''
  }
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <IconButton
        href={ params.value }
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkIcon fontSize="small" color="primary" />
      </IconButton>
    </Box>
  )
}

// use on above IconButton if table has checkboxSelection={ true }:
// onClick={
//   /* this stopPropagation is necessary to prevent link clicks
//   from selecting the row. remove if rows are not selectable. */
//   e => e.stopPropagation()
// }
