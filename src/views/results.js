import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Card, CardContent, CardHeader,
  LinearProgress,
  Typography,
} from '@mui/material'
import {
  DataGrid, 
  // GridFooterContainer,
  // GridPagination,
} from '@mui/x-data-grid'
import { makeStyles } from '@mui/styles'
import { useSearchContext } from '../components/search'
import { PageHeader } from '../components/page-header'
import { Link } from '../components/link'
import { v4 as uuid } from 'uuid'

const useStyles = makeStyles(theme => ({
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1),
    minHeight: 'calc(100vh - 184px)',
    '& .MuiDataGrid-virtualScrollerRenderZone': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: theme.spacing(1),
      padding: theme.spacing(1),
      width: '100%',
    }
  },
  card: {
    width: '100%',
    border: `solid rgba(0, 0, 0, 0.12)`,
    borderWidth: `1px 1px 0 1px`
  },
  cardTitle: { },
  cardContent: {
    padding: theme.spacing(2),
  }
}))

const useGridStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[200],
  },
  virtualScroller: {
    backgroundColor: '#fff',
    scrollbarWidth: 'thin', // firefox only
    scrollbarColor: `${ theme.palette.primary.dark } ${ theme.palette.grey[100] }`, // firefox only
  },
  footerContainer: {
    borderTop: `2px solid ${ theme.palette.primary.main }`,
  },
}))

//

const SimilarityScoreMeter = props => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <Box sx={{ ml: 1, position: 'relative', height: '1rem', width: '100%' }}>
        <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', left: `${ props.value }%`, transform: 'translateX(-50%)' }}>
          { props.value.toFixed(2) }%
        </Typography>
      </Box>
      <Box sx={{ width: '100%' }}>
        <LinearProgress variant="determinate" { ...props } />
      </Box>
    </Box>
  )
}

SimilarityScoreMeter.propTypes = {
  value: PropTypes.number.isRequired,
}

//

const publicationResultColumns = [
  { headerName: 'ID',          field: 'id',          type: 'string', hide: true },
  { headerName: 'Title',       field: 'title',       type: 'string', hide: false },
  { headerName: 'PMID',        field: 'pmid',        type: 'string', hide: false },
  { headerName: 'Similarity',  field: 'similarity',  type: 'number', hide: false },
  { headerName: 'URL',         field: 'pubmed_url',  type: 'string', hide: false },
]

//

const PublicationRow = ({ row: publication }) => {
  const classes = useStyles()

  return (
    <Card className={ classes.card }>
      <CardHeader className={ classes.cardTitle } title={ publication.title } disableTypography />
      <CardContent className={ classes.cardContent }>
        <Typography variant="caption" color="textPrimary">
          <Link to={ publication.pubmed_url }>{ publication.pmid }</Link>
        </Typography>
      </CardContent>
      <SimilarityScoreMeter value={ publication.similarity * 100 } />
    </Card>
  )
}

PublicationRow.propTypes = {
  row: PropTypes.object,
}

//

export const ResultsView = ({ type }) => {
  const classes = useStyles()
  const dataGridClasses = useGridStyles()
  const { neuroquery } = useSearchContext()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    let publications = await neuroquery()
    // give results uinique ids
    publications = publications.map(publication => ({ ...publication, id: uuid() }))
    setResults(publications)
  }, [type])

  useEffect(() => {
    if (results) {
      setLoading(false)
    }
  }, [results])

  return (
    <Fragment>
      <PageHeader title={ `${ type } Results` } style={{ marginBottom: 0 }} />
      <Box className={ classes.resultsContainer }>
        <DataGrid
          loading={ loading }
          classes={ dataGridClasses }
          rows={ results }
          columns={ publicationResultColumns }
          pageSize={ 25 }
          rowsPerPageOptions={ [25] }
          headerHeight={ 0 }
          components={{
            Row: PublicationRow,
          }}
        />
      </Box>
    </Fragment>
  )
}

ResultsView.propTypes = {
  type: PropTypes.oneOf(['neuroquery'])
}
