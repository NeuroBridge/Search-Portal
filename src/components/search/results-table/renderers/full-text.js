import * as React from 'react'
import { Stack, Tooltip, Typography } from '@mui/material'
import { Link } from '../../../link'
import pubmedHeaderIcon from '../../../../images/pubmed-icon.png'

export function renderFullTextHeader() {
  return (
    <Tooltip placement="bottom" title="PubMed Central ID - link to full text">
      <Stack
        direction="row"
        gap={ 1 }
        justifyContent="center"
        alignItems="center"
      >
        Full Text
        <img
          src={ pubmedHeaderIcon }
          width="16"
          style={{ filter: 'opacity(0.5)' }}
        />
      </Stack>
    </Tooltip>
  )
}

export function renderFullTextCell(params) {
  return (
    <Stack
      sx={{ width: '100%' }}
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      {
        (params.value == null || !params.row.pmc_url)
          ? <Typography sx={{ filter: 'opacity(0.25)' }}>-</Typography>
          : <Link to={ params.row.pmc_url }>{ params.row.pmcid }</Link>
      }
    </Stack>
  )
}
