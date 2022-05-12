import { Fragment, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Button, CardContent, Divider } from '@mui/material'
import { TreeItem, TreeView } from '@mui/lab'
import {
  ChevronRight as CollapseIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material'
import { useBasket } from '../../basket'
import { useOntology } from '../../ontology'
import { arrayToTree } from 'performant-array-to-tree'

const renderSelectionTree = node => {
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
          { node.id }
        </Box>
      }
    >
      {
        Array.isArray(node.children)
          ? node.children.map(n => renderSelectionTree(n))
          : null
      }
    </TreeItem>
  )
}

export const SelectionTreeList = ({ rootTerm }) => {
  const descendants = [
    // to play nicely with `arrayToTree`, we'll set
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
        { renderSelectionTree(tree) }
      </TreeView>
    </Fragment>
  )
}

SelectionTreeList.propTypes = {
  rootTerm: PropTypes.shape({
    id: PropTypes.string.isRequired,
    labels: PropTypes.array.isRequired,
    descendants: PropTypes.array.isRequired,
  }).isRequired,
}

export const NeuroBridge2ServiceInterface = ({ doSearch }) => {
  const basket = useBasket()
  const ontology = useOntology()

  const query = useMemo(() => {
    return 'query query query'
  }, [basket.ids])

  const handleClickQueryButton = () => {
    doSearch(async () => {
      return [
        { title: 'a', pubmed_url: 'https://google.com', pmid: '1234' },
        { title: 'few', pubmed_url: 'https://google.com', pmid: '1235' },
        { title: 'sample', pubmed_url: 'https://google.com', pmid: '1236' },
        { title: 'results', pubmed_url: 'https://google.com', pmid: '1237' },
      ]
    })
  }

  return (
    <Box>
      <CardContent>
        <SelectionTreeList rootTerm={ ontology.find('Depression') } />
      </CardContent>

      <Divider />

      <CardContent sx={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={ handleClickQueryButton }>Send Query</Button>
      </CardContent>
    </Box>
  )
}

NeuroBridge2ServiceInterface.propTypes = {
  doSearch: PropTypes.func.isRequired,
}
