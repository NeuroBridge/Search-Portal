import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Card, CardContent, CardHeader } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useSearchContext } from './'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
  },
  preContent: {
    backgroundColor: theme.palette.primary.dark,
    color: '#367',
    margin: 0,
    fontSize: '125%',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
  content: {
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    margin: 0,
    fontSize: '125%',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
}))

export const QueryCard = () => {
  const classes = useStyles()
  const { selectedTerms } = useSearchContext()

  console.table(selectedTerms)

  const query = useMemo(() => {
    return `SELECT ... FROM ...`
  }, [selectedTerms])

  return (
    <Card className={ classes.root }>
      <CardHeader title="Query" />
      <CardContent as="pre" className={ classes.preContent }>
        # This query will update as terms are selected.
      </CardContent>
      <CardContent as="pre" className={ classes.content }>
        { query }
      </CardContent>
    </Card>
  )
}
