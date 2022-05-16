import { Box, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material'
import { Check as CheckIcon } from '@mui/icons-material'
import {
  AddCircle as TermSelectedIcon,
  RemoveCircle as TermUnselectedIcon,
  Circle as TermNeutralIcon,
  Construction as UnderConstructionIcon,
} from '@mui/icons-material'

const SelectionOptionsList = () => {
  const theme = useTheme()

  return (
    <List>
      <ListItem>
        <ListItemIcon>
          <TermSelectedIcon sx={{ color: theme.palette.primary.light, }} />
        </ListItemIcon>
        <ListItemText>
          denotes a term is included in the query;
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <TermUnselectedIcon sx={{ color: 'darkred' }} />
        </ListItemIcon>
        <ListItemText>
          denotes a term is included in the query, but with the <code>NOT</code> directive;
        </ListItemText>
      </ListItem>
      <ListItem>
        <ListItemIcon>
          <TermNeutralIcon sx={{ color: '#ccc', }} />
        </ListItemIcon>
        <ListItemText>
          denotes a term will be inconsequential, and thus not present, in the query.
        </ListItemText>
      </ListItem>
    </List>
  )
}

export const HelpText = () => {
  return (
    <CardContent>
      <Typography paragraph>
        This interface allows the contruction of a query to send to the NeuroBridge API.
        Terms checked <CheckIcon sx={{ color: '#6c6' }} fontSize="small" /> in your
        workspace appear here as trees of their descendants in the NeuroBridge Ontology.
        The query will be constructed with <code>OR</code> operator between root terms, and
        <code>AND</code> operator between selected terms in each tree.
      </Typography>

      <Typography paragraph>
        Each term has a three-way selection.
      </Typography>

      <SelectionOptionsList />

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
        <UnderConstructionIcon color="warning" /> 
        <Typography>
          This interface is still under active development.
        </Typography>
        <UnderConstructionIcon color="warning" /> 
      </Box>
    </CardContent>
  )
}