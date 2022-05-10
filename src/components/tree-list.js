import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { TreeView, TreeItem } from '@mui/lab'
import { Box, Button } from '@mui/material'
import {
  ChevronRight as CollapseIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material'
import { TermActionButtons } from './term-action-buttons'
import { arrayToTree } from 'performant-array-to-tree'
import { useDrawer } from './drawer'

const renderTree = node => {
  const drawer = useDrawer()

  return (
    <TreeItem
      key={ node.id }
      nodeId={ node.id }
      label={
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.5rem',
        }}>
          <Button onClick={ () => drawer.setTermId(node.id) }>{ node.id }</Button>
          <TermActionButtons termId={ node.id } stopEventPropagation hideDrawerButton />
        </Box>
      }
    >
      {
        Array.isArray(node.children)
          ? node.children.map(n => renderTree(n))
          : null
      }
    </TreeItem>
  )
}

export const TreeList = ({ rootTerm }) => {
  const descendants = [
    // to play nicey with `arrayToTree`, we'll set
    // our root term to have no parent so that it doesn't
    // expect to find and render the term's parent.
    {
      id: rootTerm.id,
      parentId: null,
      labels: rootTerm.labels,
    },
    ...rootTerm.descendants,
  ]

  // this function cleans up and flattens the tree data a bit
  // to make browsing on this view a little simpler.
  const reduceTree = node => {
    return {
      id: node.data.id,
      parentId: node.data.parentId,
      children: node.children.map(reduceTree),
    }
  }

  const tree = reduceTree(arrayToTree(descendants)[0])

  return (
    <Fragment>
      <TreeView
        sx={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}
        defaultCollapseIcon={ <ExpandIcon /> }
        defaultExpandIcon={ <CollapseIcon /> }
        disabledItemsFocusable
        disableSelection
      >
        { renderTree(tree) }
      </TreeView>
    </Fragment>
  )
}

TreeList.propTypes = {
  rootTerm: PropTypes.object.isRequired,
}
