import PropTypes from 'prop-types'
import { Divider } from '@mui/material'
import { QueryForm } from './query-form'
import { HelpText } from './help-text'
import { InterfaceContextProvider } from './context'
import { TermSelects } from './term-selects'

export const Interface = ({ doSearch }) => {

  return (
    <InterfaceContextProvider searchWrapper={ doSearch }>
      <HelpText />

      <Divider />

      <TermSelects />

      <Divider />

      <QueryForm />

    </InterfaceContextProvider>
  )
}

Interface.propTypes = {
  doSearch: PropTypes.func.isRequired,
}
