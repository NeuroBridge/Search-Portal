import { interfaceDisplayNames } from '../interfaces'
import {
  renderAbstractHeader,
  renderAbstractCell,
  renderFullTextHeader,
  renderFullTextCell,
  renderScoreCell,
} from './renderers'

export const columns = [
  {
    field: 'title',
    description: 'Publication Title',
    headerName: 'Title',
    flex: 1,
  },
  {
    field: 'pmid',
    headerName: 'Abstract',
    sortable: false,
    filterable: false,
    renderHeader: renderAbstractHeader,
    renderCell: renderAbstractCell,
    width: 125,
  },
  {
    field: 'pmcid',
    headerName: 'Full Text',
    sortable: false,
    filterable: false,
    renderHeader: renderFullTextHeader,
    renderCell: renderFullTextCell,
    width: 125,
  },
  // { field: 'snippet', headerName: 'Snippet' },
  {
    field: 'score',
    description: 'Score',
    headerName: 'Score',
    renderCell: renderScoreCell,
    width: 110,
  },
  {
    field: 'source',
    description: 'Source Query Interface',
    headerName: 'Source',
    valueGetter: ({ value }) => interfaceDisplayNames[value],
    width: 125,
  },
]

