import { Fragment, useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Accordion, AccordionDetails, AccordionSummary,
  Typography, useTheme,
} from '@mui/material'
import { ExpandMore as ExpandIcon } from '@mui/icons-material'

export const Tutorial = ({ title, description, steps }) => {
  const theme = useTheme()

  /* this varianle holds id of currently-expanded accordion panel */
  const [expanded, setExpanded] = useState('adding-concepts')

  const accordionStyle = useMemo(() => ({
    '.MuiAccordionSummary-content': {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: theme.spacing(2),
      '.index': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.paper,
        width: theme.spacing(3),
        height: theme.spacing(3),
        borderRadius: '50%',
        filter: 'saturate(0.25) opacity(0.5)',
        transition: 'filter 250ms',
      },
      '.title': {
        color: theme.palette.text.primary,
        filter: 'opacity(0.75)',
        transition: 'filter 250ms',
      },
    },
    '&.expanded': {
      '.index': { filter: 'saturate(1.0) opacity(1.0)' },
      '.title': { filter: 'opacity(1.0)' },
    },
    '&:hover': {
      '.index': { filter: 'saturate(1.0) opacity(1.0)' },
      '.title': { filter: 'opacity(1.0)' },
    },
  }), [expanded])

  const handleChange = useCallback(id => (event, isExpanded) => {
    setExpanded(isExpanded ? id : false)
  }, [expanded])

  return (
    <Fragment>
      <br />
      <Typography variant="h5">{ title }</Typography>
      <Typography paragraph>{ description }</Typography>
      {
        steps.map((step, index) => (
          <Accordion
            key={ `${ step.id }` }
            expanded={ expanded === step.id }
            onChange={ handleChange(step.id) }
            sx={ accordionStyle }
            className={ expanded === step.id ? 'expanded' : 'collapsed' }
          >
            <AccordionSummary
              id={ `${ step.id }-header` }
              aria-controls={ `${ step.id }-content` }
              expandIcon={ <ExpandIcon /> }
            >
              <span className="index">{ index + 1 }</span>
              <Typography className="title">{ step.title }</Typography>
            </AccordionSummary>
            <AccordionDetails className="details">
              <Typography className="description">{ step.description }</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      }
    </Fragment>
  )
}

Tutorial.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  })).isRequired,
}
