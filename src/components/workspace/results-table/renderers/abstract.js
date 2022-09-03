import * as React from 'react'
import { Stack, Tooltip } from '@mui/material'
import { Link } from '../../../link'
import pubmedHeaderIcon from '../../../../images/pubmed-icon.png'

export function renderAbstractHeader() {
  return (
    <Tooltip placement="bottom" title="PubMed ID - link to astract">
      <Stack
        direction="row"
        gap={ 1 }
        justifyContent="center"
        alignItems="center"
      >
        Abstract
        <img
          src={ pubmedHeaderIcon }
          width="16"
          style={{ filter: 'opacity(0.5)' }}
        />
      </Stack>
    </Tooltip>
  )
}

export function renderAbstractCell(params) {
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
