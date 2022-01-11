import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Check as CopiedIcon } from '@mui/icons-material'
import { useSearchContext } from './'
import { ContentCopy as CopyIcon } from '@mui/icons-material'

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
  header: {
    padding: `${ theme.spacing(1) } ${ theme.spacing(2) }`,
    textTransform: 'uppercase',
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
  const { query } = useSearchContext()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const copyTimer = setTimeout(() => setCopied(false), 5000)
    return () => clearTimeout(copyTimer)
  }, [copied])

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query())
    setCopied(true)
  }

  return (
    <Card className={ classes.root }>
      <CardHeader
        disableTypography
        title="Query"
        action={
          <Tooltip title={ copied ? 'Query copied to clipboard!' : 'Copy query' } placement="left">
            <IconButton size="small" onClick={ handleCopyQuery }>
              { copied ? <CopiedIcon color="secondary" /> : <CopyIcon sx={{ fill: '#fff' }} /> }
            </IconButton>
          </Tooltip>
        }
        className={ classes.header }
      />
      <CardContent as="pre" className={ classes.preContent }>
        # This query will update as terms are selected.
      </CardContent>
      <CardContent as="pre" className={ classes.content }>
        { query() }
      </CardContent>
    </Card>
  )
}
