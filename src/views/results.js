import { Fragment, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
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
import { Container } from '../components/container'
// import { Link } from '../components/link'
import { v4 as uuid } from 'uuid'

const useStyles = makeStyles(theme => ({
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(1),
    minHeight: '100%',
    width: '100%',
  },
  resultCard: {
    border: `1px solid rgba(0, 0, 0, 0.12)`,
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
        <LinearProgress variant="determinate" {...props} />
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

export const ResultsView = ({ type }) => {
  const classes = useStyles()
  const dataGridClasses = useGridStyles()
  const { neuroquery } = useSearchContext()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    let publications = await neuroquery()
    // give result publications uinique ids
    publications = publications.map(publication => ({ ...publication, id: uuid() }))
    console.log(publications)
    setResults(publications)
  }, [type])

  useEffect(() => {
    if (results) {
      setLoading(false)
    }
  }, [results])

  return (
    <Fragment>
      <PageHeader title={ `${ type } Results` } />
      <Container>
        <Box className={ classes.resultsContainer }>
          <DataGrid
            loading={ loading }
            classes={ dataGridClasses }
            rows={ results }
            columns={ publicationResultColumns }
            pageSize={ 25 }
            rowsPerPageOptions={ [25] }
            autoHeight
          />
        </Box>
      </Container>
    </Fragment>
  )
}

ResultsView.propTypes = {
  type: PropTypes.oneOf(['neuroquery'])
}
