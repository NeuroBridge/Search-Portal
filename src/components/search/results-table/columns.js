import {
  renderAbstractHeader,
  renderAbstractCell,
  renderFullTextHeader,
  renderFullTextCell,
  renderFlywheelSummaryWithTooltip,
  // renderScoreCell,
} from './renderers'

export const columns = [
  {
    field: 'title',
    description: 'Publication Title',
    headerName: 'Title',
    flex: 1,
    sortable: false,
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
  // {
  //   field: 'score',
  //   description: 'Score',
  //   headerName: 'Score',
  //   renderCell: renderScoreCell,
  //   width: 110,
  // },
]

export const flywheelColumns = [
  {
    field: 'summary',
    description: 'Article summary',
    headerName: 'Summary',
    renderCell: renderFlywheelSummaryWithTooltip,
    flex: 1,
    sortable: false,
  }
]

