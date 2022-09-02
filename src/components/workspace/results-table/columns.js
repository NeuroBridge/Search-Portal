import {
  renderScoreCell,
  renderLinkCell,
} from './cell-renderers'
import { interfaceDisplayNames } from '../interfaces'

export const columns = [
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'pmid', headerName: 'PMID', },
  {
    field: 'url',
    headerName: 'Link',
    renderCell: renderLinkCell,
    width: 50,
    sortable: false,
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
  },
]

