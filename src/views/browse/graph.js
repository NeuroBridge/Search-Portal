import { useMemo, useRef } from 'react'
import { Paper } from '@mui/material'
import loadable from '@loadable/component'
import { useOntology } from '../../components/ontology'

const ForceGraph2D = loadable(() => import('../../components/force-graph'))

// this function generates the graph data object for the ForceGraph2D component.
const GenerateOntologyGraph = terms => {
  const roots = terms.filter(term => !term.parentId)
  console.log(roots)
  const nodes = [...terms]
  const links = terms.reduce((collection, term) => {
    // if the term has a parent, create an edge...
    if (term.parentId) {
      return [
        ...collection,
        { source: term.id, target: term.parentId },
      ]
    }
    // ...otherwise, continue on with what we've collected thus far.
    return [...collection]
  }, [])
  return { nodes, links }
}

export const GraphView = () => {
  const ontology = useOntology()
  const graphRef = useRef()

  const graph = useMemo(() => GenerateOntologyGraph(ontology.terms), [])

  const handleClickNode = (node, event) => {
    // todo: add some actual functionality here
    console.log(node.id)
  }

  if (!graph.nodes || !graph.links) {
    return 'Loading...'
  }

  return (
    <Paper sx={{
      overflow: 'hidden',
    }}>
      <ForceGraph2D
        ref={ graphRef }
        graphData={ graph }
        linkDirectionalArrowLength={ 3 }
        linkDirectionalArrowRelPos={ 0.5 }
        linkCurvature={ 0 }
        linkWidth={ 1 }
        nodeLabel="id"
        onNodeClick={ handleClickNode }
      />
    </Paper>
  )
}