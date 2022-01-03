import { Fragment, useMemo } from 'react'
import { TreeView, TreeItem } from '@mui/lab'
import {
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
} from '@mui/icons-material'
import { useSearchContext } from '../components/search/context'

export const SelectView = () => {
  const { selectedTerms } = useSearchContext()
  const forest = useMemo(() => Object.keys(selectedTerms).map(term => selectedTerms[term].tree), [selectedTerms])

  const renderTree = node => {
    return (
      <TreeItem
        key={ node.data.id }
        nodeId={ node.data.id }
        label={ node.data.id }
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
      >
        { forest.map(tree => renderTree(tree)) }
      </TreeView>
    </Fragment>
  )
}