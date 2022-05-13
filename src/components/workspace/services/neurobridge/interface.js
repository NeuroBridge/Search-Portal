import PropTypes from 'prop-types'
import { Button, CardContent, Divider } from '@mui/material'
import { ForestProvider } from './context'
import { Forest } from './selection-forest'
import { QueryForm } from './query-form'

//

export const ForestInterface = ({ doSearch }) => {
  return (
    <ForestProvider searchWrapper={ doSearch }>
      <Forest />

      <Divider />
      
      <QueryForm />
    </ForestProvider>
  )
}

ForestInterface.propTypes = {
  doSearch: PropTypes.func.isRequired,
}
