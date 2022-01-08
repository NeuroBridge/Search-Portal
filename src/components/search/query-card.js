import { Card, CardContent, CardHeader, IconButton, Tooltip } from '@mui/material'
import { makeStyles } from '@mui/styles'
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

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query())
  }

  return (
    <Card className={ classes.root }>
      <CardHeader
        title="Query"
        action={
          <Tooltip title="Copy query" placement="left">
            <IconButton size="small" onClick={ handleCopyQuery }>
              <CopyIcon sx={{ fill: '#fff' }} />
            </IconButton>
          </Tooltip>
        }
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
