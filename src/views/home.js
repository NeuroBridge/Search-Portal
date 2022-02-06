import { Fragment } from 'react'
import { Avatar,
  Card, CardHeader, CardContent,
  List, ListItem, ListItemAvatar, ListItemText,
  Typography,
} from '@mui/material'
import {
  LooksOne as StepOneIcon,
  LooksTwo as StepTwoIcon,
  Looks3 as StepThreeIcon,
  Looks4 as StepFourIcon,
} from '@mui/icons-material'
import makeStyles from '@mui/styles/makeStyles'
import { Container } from '../components/container'
import { PageHeader } from '../components/page-header'
import { Link } from '../components/link'

const useStyles = makeStyles(theme => ({
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

export const HomeView = () => {
  const classes = useStyles()

  return (
    <Fragment>
      <PageHeader title="Welcome to the Neurobridge Search Portal" />
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
                <ListItemText>
                  Search for terms in the ontology.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepTwoIcon /></Avatar></ListItemAvatar>
                <ListItemText>
                  Add root terms from the results to your workspace.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepThreeIcon /></Avatar></ListItemAvatar>
                <ListItemText>
                  Select descendants to build a query.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemAvatar><Avatar><StepFourIcon /></Avatar></ListItemAvatar>
                <ListItemText>
                  Query the service of your choice with your selection.
                  Currently, <Link to="https://neuroquery.org/">Neuroquery</Link> is the only service available.
                </ListItemText>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    </Fragment>
  )
}
