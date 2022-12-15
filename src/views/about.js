import PropTypes from 'prop-types'
import { Box, Container, Skeleton, Typography, useTheme } from '@mui/material'
import {
  AddCircle as TermSelectedIcon,
  RemoveCircle as TermUnselectedIcon,
  Circle as TermNeutralIcon,
} from '@mui/icons-material'
import { useAppContext } from '../context'
import { useOntology } from '../components/ontology'
import { Link } from '../components/link'

// screenshots
import addConceptImageLight from '../images/screenshots/add-concept-light.png'
import addConceptImageDark from '../images/screenshots/add-concept-dark.png'
import rawQueryImageLight from '../images/screenshots/raw-query-light.png'
import rawQueryImageDark from '../images/screenshots/raw-query-dark.png'
import resultsImageLight from '../images/screenshots/results-light.png'
import resultsImageDark from '../images/screenshots/results-dark.png'

const screenshots = {
  addConcept: {
    light: addConceptImageLight,
    dark: addConceptImageDark,
  },
  rawQuery: {
    light: rawQueryImageLight,
    dark: rawQueryImageDark,
  },
  results: {
    light: resultsImageLight,
    dark: resultsImageDark,
  },
}

const MediaPlaceholder = ({ width, height, sx }) => {
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

MediaPlaceholder.defaultProps = {
  height: 360,
  width: 480,
}

//

const Screenshot = ({ imageSrc, height }) => {
  const theme = useTheme()
  return (
    <Box sx={{
      height: height,
      my: 4,
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      img: {
        height: height,
        border: `2px solid ${ theme.palette.background.default }`,
      }
    }}><img src={ imageSrc } /></Box>
  )
}

Screenshot.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  height: PropTypes.string,
}

Screenshot.defaultProps = {
  height: '360px',
}

//

export const AboutView = () => {
  const ontology = useOntology()
  const { settings } = useAppContext()

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
        This interface is currently using our ontology version <em>{ ontology.meta.version }</em>.
      </Typography>

      <Typography paragraph>
        { ontology.meta.comment }
      </Typography>

      <Typography paragraph>
        { ontology.meta.editorialNote }
      </Typography>

      <br />

      <Typography variant="h5" component="h2">Using the Search Portal</Typography>

      <Typography paragraph>
        Because the goal is to search for publications, this purpose of this interface
        revolves around building a query from concepts in the NeuroBridge ontology.
        The first step to building a query is to add concepts to the query builder with
        the &ldquo;<span style={{ whiteSpace: 'nowrap' }}>+ Add Concept</span>&rdquo; button.
        Each concept defines an induced subtree rooted at that concept.
        Adding a concept to the query builder makes its descendant concepts available
        for use in the query construction.
      </Typography>

      <Screenshot imageSrc={ screenshots.addConcept[settings.color.mode] } />

      <Typography paragraph sx={{
        '& .MuiSvgIcon-root': {
          transform: 'translateY(4px)',
        },
      }}>
        Each concept in the query builder can have one of three states, and
        clicking a term toggles between the possible states and an icon
        indicates the concept&apos;s present state.
        The plus <TermSelectedIcon fontSize="small" sx={{ color: 'concept.positive' }} /> icon
        indicates that a term is present in the query.
        The minus <TermUnselectedIcon fontSize="small" sx={{ color: 'concept.negative' }} /> icon
        indicates that a term is present, but negated, in the query.
        (<em>i.e.</em>, <code>NOT Schizophrenia</code>).
        A term is left out of the query completely when it shows
        the neutral <TermNeutralIcon fontSize="small" sx={{ color: 'concept.neutral' }} /> icon.
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

      <Screenshot imageSrc={ screenshots.rawQuery[settings.color.mode] } />

      <Typography paragraph>
        Elit nostrud in laborum deserunt id ullamco proident elit dolore quis.
        Lorem ipsum ut velit irure veniam elit adipisicing exercitation elit esse excepteur fugiat voluptate duis sunt proident.
      </Typography>

      <Typography paragraph>
        Results are retrieved from two sources: the NeuroBridge API
        and <Link to="https://neuroquery.org/">NeuroQuery</Link>.
        Results are grouped by their source and contain links to the
        corresponding articles in PubMed or PubMed Central.
        Results can be selected for export.
      </Typography>

      <Screenshot imageSrc={ screenshots.results[settings.color.mode] } />

    </Container>
  )
}
