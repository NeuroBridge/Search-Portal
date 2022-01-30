import { Fragment, useEffect, useState } from 'react'
import { Avatar,
  Button,
  Card, CardHeader, CardContent,
  Divider,
  List, ListItem, ListItemAvatar, ListItemText,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  RestartAlt as StartOverIcon,
  DeleteSweep as ClearSelectionIcon,
  LooksOne as StepOneIcon,
  LooksTwo as StepTwoIcon,
  Looks3 as StepThreeIcon,
  Looks4 as StepFourIcon,
  Looks5 as StepFiveIcon,
} from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import { useSearchContext, SelectionForest, QueryCard } from '../components/search'
import { Container } from '../components/container'
import { PageHeader } from '../components/page-header'

const useStyles = makeStyles(theme => ({
  heading: {
    color: theme.palette.primary.dark,
  },
  summary: {
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  actions: {
    padding: theme.spacing(2),
    textAlign: 'center',
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
  const [sent, setSent] = useState(false)

  /* temporary faking term send request */
  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight)
    const resetSend = setTimeout(() => setSent(false), 5000)
    return () => clearTimeout(resetSend)
  }, [sent])

  // const PageHeader = useCallback(() => {
  //   return (
  //     <Fragment>
  //       <Card variant="outlined">
  //         <CardContent className={ classes.controls }>
  //           <Grid container>
  //             <Grid item xs={ 12 } sm={ 3 }>
  //               <Typography>
  //                 { rootsCount } root{ rootsCount === 1 ? '' : 's' }<br />
  //                 { selectedTermsCount } selected term{ selectedTermsCount === 1 ? '' : 's' }<br />
  //               </Typography>
  //             </Grid>
  //             <Grid item xs={ 12 } sm={ 9 }>
  //               <Tooltip title="Start Over">
  //                 <span>
  //                   <IconButton
  //                     onClick={ handleStartOver }
  //                     disabled={ rootsCount === 0 }
  //                     variant="contained"
  //                     color="primary"
  //                   >
  //                     <StartOverIcon />
  //                   </IconButton>
  //                 </span>
  //               </Tooltip>
  //               <Tooltip title="Clear all roots">
  //                 <span>
  //                   <IconButton
  //                     onClick={ clearRootSelection }
  //                     disabled={ selectedTermsCount === 0 }
  //                     variant="contained"
  //                     color="secondary"
  //                   >
  //                     <ClearSelectionIcon />
  //                   </IconButton>
  //                 </span>
  //               </Tooltip>
  //               <Tooltip title="Deselect all terms">
  //                 <span>
  //                   <IconButton
  //                     onClick={ clearTermSelection }
  //                     disabled={ selectedTermsCount === 0 }
  //                     variant="contained"
  //                     color="secondary"
  //                   >
  //                     <ClearSelectionIcon />
  //                   </IconButton>
  //                 </span>
  //               </Tooltip>
  //             </Grid>
  //           </Grid>
  //         </CardContent>
  //       </Card>
  //     </Fragment>
  //   )
  // }, [roots])

  if (!rootsCount) {
    return (
      <Container>
        <Card className={ classes.instructions } elevation={ 0 }>
          <CardHeader title="Instructions" />
          <CardContent>
            <Typography paragraph>
              Searching the NeuroBridge Ontology is simple!
            </Typography>
          </CardContent>
          <CardContent>
            <List>
              <ListItem>
                <ListItemAvatar><Avatar><StepOneIcon /></Avatar></ListItemAvatar>
                <ListItemText>Search for terms.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepTwoIcon /></Avatar></ListItemAvatar>
                <ListItemText>Select root terms from the search results.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepThreeIcon /></Avatar></ListItemAvatar>
                <ListItemText>Select descendants to build a query.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepFourIcon /></Avatar></ListItemAvatar>
                <ListItemText>Send your query.</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepFiveIcon /></Avatar></ListItemAvatar>
                <ListItemText>...</ListItemText>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Fragment>
      <PageHeader
        title="Query Builder"
        subtitle="subtitle"
        actions={[
          <Tooltip key="start-over-button" title="Start Over" placement="bottom">
            <Button onClick={ clearRootSelection }><StartOverIcon /></Button>
          </Tooltip>,
          <Tooltip key="clear-selection-button" title="Clear Term Selection" placement="bottom">
            <Button onClick={ clearTermSelection }><ClearSelectionIcon /></Button>
          </Tooltip>,
        ]}
      />
      <Container>
        <SelectionForest />

        <br /><br /><br /><br />
        <Divider>Query</Divider>
        <br /><br /><br /><br />

        <QueryCard />
      </Container>
    </Fragment>
  )
}
