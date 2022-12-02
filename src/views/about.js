import PropTypes from 'prop-types'
import { Container, Skeleton, Stack, Typography, useTheme } from '@mui/material'
import {
  AddCircle as TermSelectedIcon,
  RemoveCircle as TermUnselectedIcon,
  Circle as TermNeutralIcon,
} from '@mui/icons-material'
import { useOntology } from '../components/ontology'

const MediaPlaceholder = ({ width = 480, height = 360, sx }) => {
  return (
    <Skeleton
      variant="rectangular" height={ height } width={ width }
      sx={{ mx: 'auto', my: 5, ...sx }}
    />
  )
}

MediaPlaceholder.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  sx: PropTypes.object,
}

//

export const AboutView = () => {
  const theme = useTheme()
  const ontology = useOntology()

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" align="center">
        About NeuroBridge
      </Typography>

      <br />

      <Typography variant="h5" component="h2">Purpose</Typography>
      <Typography paragraph>
        to help user get data details to come.
        Est magna sit nisi labore aute nostrud anim irure consequat fugiat cupidatat do proident aliquip occaecat ex sint dolore.
        Excepteur excepteur sed minim labore eu tempor ad irure aliqua nostrud.
        Id irure reprehenderit est dolor officia minim minim amet sint minim laborum ea proident.
      </Typography>

      <Typography paragraph>
        Ut ea est sed nulla duis et reprehenderit nostrud enim excepteur adipisicing enim labore voluptate minim.
        Dolore excepteur minim cupidatat eiusmod dolor nostrud reprehenderit duis do ex exercitation dolor sint amet cillum.
        Esse in fugiat aliquip veniam eu sit dolore culpa excepteur nulla anim in adipisicing nostrud aute ut cillum in.
      </Typography>

      <br />

      <Typography variant="h5" component="h2">About the Data</Typography>
      <Typography paragraph>
        Currently, 356 PubMed Central publications are indexed and available
        to search with NeuroBridge.
        The available publications are those having imaging data dn dealing with
        to do with schizophrenia and substance abuse that have imaging data.
        They are all written in English and have been published within the last five years.
        This interface is currently using our ontology version <em>{ ontology.version }</em>.
      </Typography>

      <br />

      <Typography variant="h5" component="h2">Using the Search Portal</Typography>

      <Typography paragraph>
        Because the goal is to search for publications, this purpose of this interface
        revolves around building a query from concepts in the NeuroBridge ontology.
        Each concept defines an induced subtree rooted at that concept.
        Adding a concept to the query builder makes its descendant concepts available
        for use in the query construction.
      </Typography>

      <Typography paragraph sx={{
        '& .MuiSvgIcon-root': {
          transform: 'translateY(4px)',
          '&.selected-icon': { color: theme.palette.primary.light },
          '&.unselected-icon': { color: 'darkred' },
          '&.neutral-icon': { color: '#aaa' },
        },
      }}>
        Each concept in the query builder can have one of three states, and
        clicking a term toggles between the possible states and an icon
        indicates the concept&apos;s present state.
        The plus <TermSelectedIcon fontSize="small" className="selected-icon" /> icon
        indicates that a term is present in the query.
        The minus <TermUnselectedIcon fontSize="small" className="unselected-icon" /> icon
        indicates that a term is present, but negated, in the query.
        (<em>i.e.</em>, <code>NOT Schizophrenia</code>).
        A term is left out of the query completely when it shows
        the neutral <TermNeutralIcon fontSize="small" className="neutral-icon" /> icon.
      </Typography>

      <Typography paragraph>
        Holding Ctrl/⌘ while clicking a term will toggle that term&apos;s
        descendants&apos; states to match that of the clicked term.
      </Typography>
    

      <Typography paragraph>
        Configuration options and the raw query.
        Dolor in tempor sed magna nulla tempor aliquip fugiat excepteur cupidatat ullamco do.
        Occaecat ut dolore veniam commodo mollit dolore proident mollit dolore excepteur cillum tempor.
        Excepteur consequat nulla reprehenderit sunt in cillum sunt minim minim qui et non sit enim ullamco velit officia.
      </Typography>

      <MediaPlaceholder />

      <Typography paragraph>
        Elit nostrud in laborum deserunt id ullamco proident elit dolore quis.
        Lorem ipsum ut velit irure veniam elit adipisicing exercitation elit esse excepteur fugiat voluptate duis sunt proident.
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="center" alignItems="center" gap={ 5 } sx={{ my: 5 }}>
        <MediaPlaceholder sx={{ m: 0 }} />
        <MediaPlaceholder sx={{ m: 0 }} />
      </Stack>

      <Typography paragraph>
        Veniam est qui do tempor do laboris irure in sed laborum eiusmod dolor non reprehenderit reprehenderit aute aliqua in.
        Occaecat exercitation cillum nostrud magna non eu mollit anim cupidatat non ut sit non.
      </Typography>

      <Typography paragraph>
        Results Ut labore dolor deserunt dolor nulla et officia ullamco anim adipisicing pariatur do exercitation consequat officia qui.
        Excepteur enim aute tempor sit labore occaecat et culpa labore ex eu.
        Lorem ipsum nulla cillum voluptate enim in dolore ut id pariatur.
      </Typography>

      <MediaPlaceholder />

      <Typography paragraph>
        Laboris tempor pariatur dolore proident ut est nulla dolore id elit ut enim in duis ad ut anim ad.
        Culpa ut in dolore laborum nulla tempor consectetur in est incididunt.
        Laboris deserunt proident ullamco sint anim quis incididunt minim aliqua ea.
      </Typography>

    </Container>
  )
}
