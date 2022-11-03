import PropTypes from 'prop-types'
import {
  Accordion, AccordionDetails, AccordionSummary,
  Box, Divider, Stack,
} from '@mui/material'
import {
  ExpandMore as AccordionIcon,
  Help as HelpIcon,
} from '@mui/icons-material'
import { Link } from '../link'
import ReactMarkdown from 'react-markdown'

//

const markdownComponentMap = {
  a: props => <Link to={ props.href }>{ props.children }</Link>,
}

//

export const Interface = ({ ui, active }) => {
  return (
    <Stack
      sx={{
        flex: 1,
        display: active ? 'flex' : 'none',
        position: 'relative',
      }}
      role="tabpanel"
      id={ `tabpanel-${ ui.id }` }
      aria-labelledby={ `tab-${ ui.id }` }
    >
      {/* Form */}
      <Box sx={{ flex: 1, minHeight: '150px' }}>
        <ui.Form />
      </Box>

      <Divider />

      {/* Help Text */}
      <Accordion
        square
        disableGutters
        elevation={ 0 }
        sx={{ '.MuiButtonBase-root': { minHeight: 0 } }}
      >
        <AccordionSummary expandIcon={ <AccordionIcon color="primary" /> }>
          <HelpIcon color="default" fontSize="small" sx={{ mr: 1 }} /> Help with this interface
        </AccordionSummary>

        <Divider />

        <AccordionDetails sx={{
          p: 2,
          backgroundColor: '#f3f3f3',
          fontSize: '85%',
        }}>
          <ReactMarkdown components={ markdownComponentMap }>
            { ui.helpText }
          </ReactMarkdown>
        </AccordionDetails>
      </Accordion>

    </Stack>
  )
}

Interface.propTypes = {
  ui: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
}
