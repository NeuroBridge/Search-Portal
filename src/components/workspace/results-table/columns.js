import {
  renderPubMedIdHeader,
  renderPubMedIdCell,
  renderScoreCell,
} from './renderers'
import { interfaceDisplayNames } from '../interfaces'

export const columns = [
  {
    field: 'title',
    headerName: 'Title',
    flex: 9,
  },
  {
    field: 'pmid',
    headerName: 'PubMed ID',
    flex: 1,
    sortable: false,
    filterable: false,
    renderHeader: renderPubMedIdHeader,
    renderCell: renderPubMedIdCell,
    width: 50,
  },
  {
    field: 'pmcid',
    headerName: 'PMCID',
    flex: 1,
  },
  // { field: 'snippet', headerName: 'Snippet' },
  {
    field: 'score',
    headerName: 'Score',
    renderCell: renderScoreCell,
  },
  {
    field: 'source',
    headerName: 'Source',
    valueGetter: ({ value }) => interfaceDisplayNames[value],
    flex: 1,
  },
]

