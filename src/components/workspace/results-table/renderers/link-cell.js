import * as React from 'react'
import { Stack } from '@mui/material'
import { Link } from '../../../link'
import pubmedHeaderIcon from '../../../../images/pubmed-icon.png'

export function renderPubMedIdCell(params) {
  if (params.value == null) {
    return ''
  }
  if (!params.row.pubmed_url) {
    return ''
  }
  return (
    <Link to={ params.row.pubmed_url }>
      { params.row.pmid }
    </Link>
  )
}

// use on above Link if table has checkboxSelection={ true }:
// onClick={
//   /* this stopPropagation is necessary to prevent link clicks
//   from selecting the row. remove if rows are not selectable. */
//   e => e.stopPropagation()
// }


export function renderPubMedIdHeader() {
  return (
    <Stack
      direction="row"
      gap={ 1 }
      justifyContent="center"
      alignItems="center"
    >
      PMID <img src={ pubmedHeaderIcon } width="20" style={{ filter: 'opacity(0.5)' }}/>
    </Stack>
  )
}
