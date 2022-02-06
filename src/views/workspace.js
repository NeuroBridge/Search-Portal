import { Fragment } from 'react'
import { navigate } from '@reach/router'
import {
  Button,
  Divider,
  Typography,
} from '@mui/material'
import {
  RestartAlt as StartOverIcon,
  DeleteSweep as ClearSelectionIcon,
  Send as SendIcon,
} from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import { useSearchContext, SelectionForest } from '../components/search'
import { Container } from '../components/container'
import { PageHeader } from '../components/page-header'
import neuroQueryLogo from '../images/neuroquery-logo.svg'

const useStyles = makeStyles(theme => ({
  queryActions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  instructions: {
    marginTop: '10vh',
    fontSize: '1.5rem',
    lineHeight: 3,
    backgroundColor: '#ffffffcc',
    border: `1px solid #afb9c099`,
    padding: theme.spacing(4),
    width: '90%',
    maxWidth: '900px',
    margin: 'auto',
    textAlign: 'center',
  },
}))

export const WorkspaceView = () => {
  const classes = useStyles()
  const { rootsCount, clearRootSelection, clearTermSelection } = useSearchContext()

  return (
    <Fragment>
      <PageHeader
        title="Query Workspace"
        menuActions={ rootsCount ? [
          {
            text: 'Clear Selection',
            key: 'clear-selection-button',
            onClick: clearTermSelection,
            icon: <ClearSelectionIcon />,
          },
          {
            text: 'Start Over',
            key: 'start-over-button',
            onClick: clearRootSelection,
            icon: <StartOverIcon />,
          },
        ] : []}
      />
      <Container>
        {
          rootsCount > 0 ? (
            <Fragment>
              <SelectionForest />

              <br /><br /><br /><br />
              <Divider>Services</Divider>
              <br /><br /><br /><br />

              <div className={ classes.queryActions }>
                <Button
                  size="large"
                  color="primary"
                  variant="outlined"
                  startIcon={ <img src={ neuroQueryLogo } width="25" /> }
                  endIcon={ <SendIcon /> }
                  style={{ boxShadow: 'none' }}
                  onClick={ () => navigate('/results/neuroquery') }
                >
                  Neuroquery
                </Button>
              </div>
            </Fragment>
          ) : (
            <Typography paragraph align="center">
              Your workspace is empty!
            </Typography>
          )
        }
      </Container>
    </Fragment>
  )
}
