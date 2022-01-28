import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Card, CardContent, CardHeader, IconButton, Tab, Tabs, Tooltip, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Check as CopiedIcon } from '@mui/icons-material'
import { useSearchContext } from './'
import { ContentCopy as CopyIcon } from '@mui/icons-material'

const useStyles = makeStyles(theme => ({
  root: {
    color: '#fff',
    border: `1px solid rgba(0, 0, 0, 0.12)`,
    width: '100%',
  },
  header: {
    padding: `${ theme.spacing(1) } ${ theme.spacing(2) }`,
    textTransform: 'uppercase',
  },
  tabs: {
    backgroundColor: theme.palette.grey[200],
    color: '#fff',
    margin: 0,
    fontSize: '125%',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
  tabPanel: {
    backgroundColor: '#333',
    position: 'relative',
  },
  copyButtonContainer: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  queryNote: {
    color: '#786',
    margin: 0,
    marginBottom: theme.spacing(2),
    fontSize: '125%',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
  },
  query: {
    color: '#478',
    margin: 0,
    fontSize: '125%',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
}))

const TabPanel = props => {
  const { children, value, index, ...rest } = props
  const classes = useStyles()

  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={ `query-tabpanel-${index}` }
      aria-labelledby={ `query-tab-${index}` }
      className={ classes.tabPanel }
      { ...rest }
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{ children }</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

const a11yProps = index => ({
  id: `query-tab-${index}`,
  'aria-controls': `query-tabpanel-${index}`,
})

export const QueryCard = () => {
  const classes = useStyles()
  const { query } = useSearchContext()
  const queryTypes = Object.keys(query)
  const [currentTab, setCurrentTab] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const copyTimer = setTimeout(() => setCopied(false), 5000)
    return () => clearTimeout(copyTimer)
  }, [copied])

  const handleChangeTab = (event, newValue) => setCurrentTab(newValue)

   const handleCopyQuery = (key = 'sqlLikeQuery') => {
    navigator.clipboard.writeText(query[queryTypes[currentTab]])
    setCopied(true)
  }

  return (
    <Box className={ classes.root }>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          aria-label="Tabbed queries"
          className={ classes.tabs }
         >
          {
            queryTypes.map((t, i) => <Tab key={ t } label={ t } { ...a11yProps(i) } />)
          }
        </Tabs>
      </Box>
      {
        queryTypes.map((t, i) => (
          <TabPanel key={ t } value={ currentTab } index={ i }>
            <span className={ classes.copyButtonContainer }>
              <Tooltip
                title={ copied ? `${ queryTypes[currentTab] } query copied to clipboard!` : `Copy ${ queryTypes[currentTab] } query` }
                placement="left"
              >
                <IconButton size="small" onClick={ handleCopyQuery }>
                  {
                    copied
                      ? <CopiedIcon sx={{ fill: '#fff' }} />
                      : <CopyIcon sx={{ fill: '#999' }} />
                  }
                </IconButton>
              </Tooltip>
            </span>
            <pre className={ classes.queryNote }>
              # This query will update as the term selection changes.
            </pre>
            <pre className={ classes.query }>
              { query[t] }
            </pre>
          </TabPanel>
        ))
      }
    </Box>
  )
}
