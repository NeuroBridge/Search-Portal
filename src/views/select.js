import { Fragment, useMemo, useState } from 'react'
import { Button, Checkbox, FormControlLabel } from '@mui/material'
import { TreeView, TreeItem } from '@mui/lab'
import { makeStyles } from '@mui/styles'
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material'
import { useSearchContext } from '../components/search/context'

const useStyles = makeStyles((theme) => ({
  checkbox: {
  },
}))

export const SelectView = () => {
  const classes = useStyles()
  const { selectedTerms } = useSearchContext()
  const [selection, setSelection] = useState([])
  const forest = useMemo(() => Object.keys(selectedTerms).map(term => selectedTerms[term].tree), [selectedTerms])

  const handleChangeSelection = id => event => {
    console.log(id)
    const index = selection.indexOf(id)
    let newSelection = [...selection]
    if (index > -1) {
      newSelection.splice(index, 1)
    } else {
      newSelection.push(id)
    }
    setSelection(newSelection)
  }

  const renderTree = node => {
    return (
      <TreeItem
        key={ node.data.id }
        nodeId={ node.data.id }
        label={
          <FormControlLabel
            label={ node.data.id }
            control={
              <Checkbox
                className={ classes.checkbox }
                checked={ selection.includes(node.data.id) }
                onClick={ event => event.stopPropagation() }
                onChange={ handleChangeSelection(node.data.id) }
              />
            }
          />
        }
      >
        {
          Array.isArray(node.children)
            ? node.children.map(child => renderTree(child))
            : null
        }
      </TreeItem>
    )
  }

  return (
    <Fragment>
      <TreeView
        aria-label="term selection"
        defaultCollapseIcon={ <CollapseIcon /> }
        defaultExpandIcon={ <ExpandIcon /> }
        defaultEndIcon={ '·' }
      >
        {
          forest.map(tree => {
            if (tree) {
              return renderTree(tree)
            } else {
              return '...'
            }
          })
        }
      </TreeView>
      
      <br /><br /><br />
      <br /><br /><br />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        { <Button variant="contained" color="secondary" disabled={ !selection.length }>Send { selection.length ? selection.length : '' } term{ selection.length === 1 ? '' : 's' }</Button> }
      </div>

      <br /><br /><br />
      
    </Fragment>
  )
}