import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { TreeCard, useSearchContext } from './'
import { TreeView } from '@mui/lab'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import {
  ExpandLess as CollapseIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  forestContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: theme.spacing(4),
  },
  treeCardHeader: {
    backgroundColor: theme.palette.grey[100],
  },
}))

const OperatorSelect = ({ tree }) => {
  const { toggleTermOperator } = useSearchContext()

  return (
    <FormControl>
      <InputLabel id="boolean-operator-select-label">Operator</InputLabel>
      <Select
        labelId="boolean-operator-select-label"
        id="boolean-operator-select"
        value={ tree.data.operator }
        label="Operator"
        onChange={ event => toggleTermOperator(tree.data.id, event.target.value) }
      >
        <MenuItem value="AND">AND</MenuItem>
        <MenuItem value="OR">OR</MenuItem>
      </Select>
    </FormControl>
  )
}

OperatorSelect.propTypes = {
  tree: PropTypes.object.isRequired,
}

export const SelectionForest = () => {
  const classes = useStyles()
  const { roots } = useSearchContext()

  return (
    <TreeView
      aria-label="term selection"
      defaultCollapseIcon={ <CollapseIcon /> }
      defaultExpandIcon={ <ExpandIcon /> }
      defaultEndIcon={ '·' }
      classes={{ root: classes.forestContainer }}
    >
        {
          Object.keys(roots).map((short_form, i) => {
            return (
              <Fragment key={ `${ short_form }-select-tree` }>
                {
                  // show operator here
                  // todo: select between operator options.
                  i > 0 && (
                    <div style={{ textAlign: 'center' }}>
                      -= [ { roots[short_form].operator } ] =-
                    </div>
                  )
                }
                <TreeCard root={ roots[short_form] } />
              </Fragment>
            )
          })
        }
    </TreeView>
  )
}

